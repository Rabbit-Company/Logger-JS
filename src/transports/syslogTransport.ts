import { formatSyslogMessage } from "../formatters/syslogFormatter";
import type { LogEntry, Transport, SyslogConfig } from "../types";
import { createSocket, Socket } from "dgram";
import { Socket as NetSocket } from "net";
import { connect as tlsConnect, TLSSocket } from "tls";

/**
 * Syslog transport implementation for the logger library
 * @class SyslogTransport
 * @implements {Transport}
 * @description A robust syslog client that supports UDP, TCP, and TLS-encrypted TCP connections
 * with automatic reconnection and message queuing capabilities.
 *
 * @example
 * // Basic UDP configuration
 * const transport = new SyslogTransport({
 *   host: 'logs.example.com',
 *   port: 514,
 *   protocol: 'udp'
 * });
 *
 * @example
 * // Secure TLS configuration
 * const secureTransport = new SyslogTransport({
 *   host: 'secure-logs.example.com',
 *   port: 6514,
 *   protocol: 'tcp-tls',
 *   tlsOptions: {
 *     ca: fs.readFileSync('ca.pem'),
 *     rejectUnauthorized: true
 *   },
 *   maxQueueSize: 5000
 * });
 */
export class SyslogTransport implements Transport {
	private socket: Socket | NetSocket | TLSSocket | null = null;
	private queue: string[] = [];
	private isConnecting = false;
	private retryCount = 0;
	private retryBaseDelay: number;
	private maxQueueSize: number;
	private debug: boolean;
	private reconnectTimer: Timer | null = null;
	private config: Required<Pick<SyslogConfig, "host" | "port" | "protocol" | "facility" | "appName" | "pid" | "protocolVersion" | "tlsOptions">>;

	/**
	 * Creates a new SyslogTransport instance
	 * @constructor
	 * @param {SyslogConfig} [config={}] - Configuration options for the transport
	 */
	constructor(config: SyslogConfig = {}) {
		this.maxQueueSize = config.maxQueueSize ?? 1000;
		this.retryBaseDelay = config.retryBaseDelay ?? 1000;
		this.debug = config.debug ?? false;

		this.config = {
			host: config.host ?? "localhost",
			port: config.port ?? 514,
			protocol: config.protocol ?? "udp",
			facility: config.facility ?? 1,
			appName: config.appName ?? "node",
			pid: config.pid ?? process.pid,
			protocolVersion: config.protocolVersion ?? 3164,
			tlsOptions: config.tlsOptions || {},
		};

		this.initializeSocket();
	}

	/**
	 * Initializes the appropriate socket based on configured protocol
	 * @private
	 * @returns {void}
	 */
	private initializeSocket(): void {
		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.socket) {
			this.socket.removeAllListeners();
			if (!("destroy" in this.socket)) {
				(this.socket as Socket).close();
			} else {
				this.socket.destroy();
			}
		}

		if (this.config.protocol === "udp") {
			this.initializeUdpSocket();
		} else if (this.config.protocol === "tcp") {
			this.initializeTcpSocket();
		} else if (this.config.protocol === "tcp-tls") {
			this.initializeTlsSocket();
		}
	}

	/**
	 * Initializes a UDP socket for syslog transmission
	 * @private
	 * @returns {void}
	 */
	private initializeUdpSocket(): void {
		this.socket = createSocket("udp4");

		this.socket.on("error", (err) => {
			if (this.debug) console.error("Syslog UDP error:", err);
			this.handleSocketError();
		});

		this.socket.on("close", () => {
			if (this.debug) console.log("Syslog UDP socket closed");
		});
	}

	/**
	 * Initializes a TCP socket for syslog transmission
	 * @private
	 * @returns {void}
	 */
	private initializeTcpSocket(): void {
		this.socket = new NetSocket();
		this.setupTcpSocketEvents();
		this.connectTcpSocket();
	}

	/**
	 * Initializes a TLS-secured TCP socket for syslog transmission
	 * @private
	 * @returns {void}
	 */
	private initializeTlsSocket(): void {
		const tlsOptions = {
			host: this.config.host,
			port: this.config.port,
			...this.config.tlsOptions,
		};

		this.socket = tlsConnect(tlsOptions, () => {
			if (this.debug) console.log("Syslog TLS connection established");
			this.retryCount = 0;
			this.flushQueue();
		});

		this.setupTcpSocketEvents();
	}

	/**
	 * Sets up common event handlers for TCP/TLS sockets
	 * @private
	 * @returns {void}
	 */
	private setupTcpSocketEvents(): void {
		if (!this.socket) return;

		this.socket.on("error", (err) => {
			if (this.debug) console.error("Syslog TCP/TLS error:", err);
			this.handleSocketError();
		});

		this.socket.on("close", () => {
			if (this.debug) console.log("Syslog TCP/TLS connection closed");
			this.handleSocketError();
		});

		this.socket.on("end", () => {
			if (this.debug) console.log("Syslog TCP/TLS connection ended");
		});
	}

	/**
	 * Establishes a TCP connection to the syslog server
	 * @private
	 * @returns {void}
	 */
	private connectTcpSocket(): void {
		if (this.isConnecting || !(this.socket instanceof NetSocket)) return;

		this.isConnecting = true;

		this.socket.connect(this.config.port, this.config.host, () => {
			if (this.debug) console.log("Syslog TCP connection established");
			this.isConnecting = false;
			this.retryCount = 0;
			this.flushQueue();
		});
	}

	/**
	 * Handles socket errors and initiates reconnection if needed
	 * @private
	 * @returns {void}
	 */
	private handleSocketError(): void {
		if (this.reconnectTimer) return;
		this.socket = null;
		this.isConnecting = false;

		this.retryCount++;
		const delay = Math.min(this.retryBaseDelay * Math.pow(2, this.retryCount - 1), 30000);

		if (this.debug) console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.retryCount})`);

		this.reconnectTimer = setTimeout(() => {
			this.initializeSocket();
		}, delay);
	}

	/**
	 * Sends all queued messages to the syslog server
	 * @private
	 * @returns {void}
	 */
	private flushQueue(): void {
		if (!this.socket || this.queue.length === 0) return;

		while (this.queue.length > 0) {
			const message = this.queue.shift();
			if (message) {
				this.sendMessage(message);
			}
		}
	}

	/**
	 * Sends a single message to the syslog server
	 * @private
	 * @param {string} message - The formatted syslog message to send
	 * @returns {void}
	 */
	private sendMessage(message: string): void {
		if (!this.socket) {
			this.queue.unshift(message); // Put back if we can't send
			return;
		}

		try {
			if (this.socket instanceof Socket) {
				// UDP socket
				this.socket.send(message, this.config.port, this.config.host, (err) => {
					if (err && this.debug) console.error("Syslog UDP send error:", err);
				});
			} else {
				// TCP/TLS socket
				this.socket.write(message + "\n", (err) => {
					if (err && this.debug) console.error("Syslog TCP/TLS send error:", err);
				});
			}
		} catch (err) {
			if (this.debug) console.error("Syslog send error:", err);
			this.queue.unshift(message); // Put back if send failed
			//this.handleSocketError();
		}
	}

	/**
	 * Processes a log entry by formatting and queueing it for transmission
	 * @public
	 * @param {LogEntry} entry - The log entry to process
	 * @returns {void}
	 */
	log(entry: LogEntry): void {
		const message = formatSyslogMessage(entry, this.config);

		if (this.queue.length >= this.maxQueueSize) {
			if (this.debug) console.warn("Syslog queue full - dropping oldest message");
			this.queue.shift();
		}

		this.queue.push(message);

		if (this.socket && !this.isConnecting) {
			this.flushQueue();
		} else if (!this.socket && !this.isConnecting) {
			//this.initializeSocket();
		}
	}

	/**
	 * Gracefully closes the transport connection
	 * @public
	 * @returns {Promise<void>} A promise that resolves when the connection is closed
	 */
	close(): Promise<void> {
		return new Promise((resolve) => {
			if (this.reconnectTimer) {
				clearTimeout(this.reconnectTimer);
				this.reconnectTimer = null;
			}

			if (!this.socket) {
				resolve();
				return;
			}

			const handleClose = () => {
				resolve();
			};

			if ("destroy" in this.socket) {
				this.socket.destroy();
				process.nextTick(handleClose);
			} else {
				(this.socket as Socket).close(handleClose);
			}
		});
	}
}
