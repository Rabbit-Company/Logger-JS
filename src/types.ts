import { Levels } from "./constants/levels";

/**
 * Represents a single log entry with message, severity level, timestamp, and optional metadata
 *
 * @interface LogEntry
 * @property {string} message - The primary log message content
 * @property {Levels} level - Severity level of the log entry
 * @property {number} timestamp - Unix timestamp in milliseconds since epoch
 * @property {Object.<string, any>} [metadata] - Optional structured metadata associated with the log
 *
 * @example
 * {
 *   message: "User login successful",
 *   level: Levels.INFO,
 *   timestamp: Date.now(),
 *   metadata: {
 *     userId: "12345",
 *     ipAddress: "192.168.1.100"
 *   }
 * }
 */
export interface LogEntry {
	/** The log message content */
	message: string;
	/** Severity level of the log entry */
	level: Levels;
	/** Timestamp in milliseconds since epoch */
	timestamp: number;
	/** Optional structured metadata associated with the log */
	metadata?: Record<string, any>;
}

/**
 * Interface that all log transport implementations must adhere to
 *
 * @interface Transport
 *
 * @example
 * class CustomTransport implements Transport {
 *   log(entry: LogEntry) {
 *     // Custom log handling implementation
 *   }
 * }
 */
export interface Transport {
	/**
	 * Processes and outputs a log entry
	 * @param {LogEntry} entry - The log entry to process
	 * @returns {void}
	 */
	log: (entry: LogEntry) => void;
}

/**
 * Configuration options for the Logger instance
 *
 * @interface LoggerConfig
 * @property {Levels} [level=Levels.INFO] - Minimum log level to output
 * @property {boolean} [colors=true] - Enable colored output in console
 * @property {string} [format="[{datetime-local}] {type} {message}"] - Format string supporting these placeholders:
 *
 * ## Time/Date Placeholders
 *
 * ### UTC Formats
 * - `{iso}`: Full ISO-8601 format with milliseconds (YYYY-MM-DDTHH:MM:SS.mmmZ)
 * - `{datetime}`: Simplified ISO without milliseconds (YYYY-MM-DD HH:MM:SS)
 * - `{date}`: Date component only (YYYY-MM-DD)
 * - `{time}`: Time component only (HH:MM:SS)
 * - `{utc}`: Complete UTC string (e.g., "Wed, 15 Nov 2023 14:30:45 GMT")
 * - `{ms}`: Milliseconds since Unix epoch
 *
 * ### Local Time Formats
 * - `{datetime-local}`: Local date and time (YYYY-MM-DD HH:MM:SS)
 * - `{date-local}`: Local date only (YYYY-MM-DD)
 * - `{time-local}`: Local time only (HH:MM:SS)
 * - `{full-local}`: Complete local string with timezone
 *
 * ## Log Content Placeholders
 * - `{type}`: Log level name (e.g., "INFO", "ERROR")
 * - `{message}`: The actual log message content
 *
 * ## Metadata Placeholders
 * - `{metadata}`: JSON-stringified metadata (if provided)
 * - `{metadata-ml}`: Multi-line JSON-formatted metadata (if provided)
 *
 * @property {Transport[]} [transports=[ConsoleTransport]] - Array of transports to use
 *
 * @example <caption>Default Format</caption>
 * {
 *   format: "[{datetime-local}] {type} {message} {metadata}"
 * }
 *
 * @example <caption>UTC Time Format</caption>
 * {
 *   format: "[{datetime} UTC] {type}: {message} {metadata}"
 * }
 *
 * @example <caption>Detailed Local Format</caption>
 * {
 *   format: "{date-local} {time-local} [{type}] {message} {metadata}"
 * }
 *
 * @example <caption>Epoch Timestamp</caption>
 * {
 *   format: "{ms} - {type} - {message} - {metadata}"
 * }
 */
export interface LoggerConfig {
	/** Minimum log level to output (default: INFO) */
	level?: Levels;
	/** Enable colored output (default: true) */
	colors?: boolean;
	/** Format string using placeholders (default: "[{datetime-local}] {type} {message} {metadata}") */
	format?: string;
	/** Array of transports to use (default: [ConsoleTransport]) */
	transports?: Transport[];
}

/**
 * Configuration options for the Loki transport
 *
 * @interface LokiConfig
 *
 * @example <caption>Basic Configuration</caption>
 * {
 *   url: "http://localhost:3100/loki/api/v1/push",
 *   labels: { app: "frontend", env: "production" }
 * }
 *
 * @example <caption>Advanced Configuration</caption>
 * {
 *   url: "http://loki.example.com",
 *   basicAuth: { username: "user", password: "pass" },
 *   tenantID: "team-a",
 *   batchSize: 50,
 *   batchTimeout: 2000,
 *   maxQueueSize: 50000,
 *   maxRetries: 10,
 *   retryBaseDelay: 2000,
 *   debug: true
 * }
 */
export interface LokiConfig {
	/**
	 * Required Loki server endpoint URL
	 * @example "http://loki.example.com"
	 */
	url: string;

	/**
	 * Base labels attached to all log entries
	 * @example { app: "frontend", env: "production" }
	 */
	labels?: Record<string, string>;

	/** Basic authentication credentials */
	basicAuth?: {
		/** Basic auth username */
		username: string;
		/** Basic auth password */
		password: string;
	};

	/**
	 * Tenant ID for multi-tenant Loki installations
	 * @description Sets the X-Scope-OrgID header
	 */
	tenantID?: string;

	/**
	 * Maximum number of labels allowed per log entry
	 * @default 50
	 */
	maxLabelCount?: number;

	/**
	 * Number of logs to accumulate before automatic sending
	 * @default 10
	 */
	batchSize?: number;

	/**
	 * Maximum time in milliseconds to wait before sending an incomplete batch
	 * @default 5000
	 */
	batchTimeout?: number;

	/**
	 * Maximum number of logs to buffer in memory during outages
	 * @description When reached, oldest logs are dropped
	 * @default 10000
	 */
	maxQueueSize?: number;

	/**
	 * Maximum number of attempts to send a failed batch
	 * @default 5
	 */
	maxRetries?: number;

	/**
	 * Initial retry delay in milliseconds (exponential backoff base)
	 * @description Delay doubles with each retry up to maximum 30s
	 * @default 1000
	 */
	retryBaseDelay?: number;

	/**
	 * Enable debug logging for transport internals
	 * @default false
	 */
	debug?: boolean;
}

/**
 * Represents a Loki log stream with labels and log values
 */
export interface LokiStream {
	/** Key-value pairs of log labels */
	stream: {
		/** Log level label (required) */
		level: string;
		/** Additional custom labels */
		[key: string]: string;
	};
	/** Array of log entries with [timestamp, message] pairs */
	values: [[string, string]];
}

/**
 * Configuration options for Syslog transport
 * @interface SyslogConfig
 * @description Defines the configuration parameters for establishing a connection
 * to a syslog server and customizing log message formatting.
 *
 * @example
 * // Basic UDP configuration
 * const config: SyslogConfig = {
 *   host: 'logs.example.com',
 *   port: 514,
 *   protocol: 'udp'
 * };
 *
 * @example
 * // Secure TCP with TLS configuration
 * const secureConfig: SyslogConfig = {
 *   host: 'secure-logs.example.com',
 *   port: 6514,
 *   protocol: 'tcp-tls',
 *   tlsOptions: {
 *     ca: fs.readFileSync('ca.pem'),
 *     cert: fs.readFileSync('client-cert.pem'),
 *     key: fs.readFileSync('client-key.pem'),
 *     rejectUnauthorized: true
 *   },
 *   appName: 'my-service',
 *   facility: 16 // local0
 * };
 */
export interface SyslogConfig {
	/**
	 * Syslog server hostname or IP address
	 * @type {string}
	 * @default 'localhost'
	 * @example 'logs.example.com'
	 * @example '192.168.1.100'
	 */
	host?: string;

	/**
	 * Syslog server port number
	 * @type {number}
	 * @default 514
	 * @example 514 // Standard syslog port
	 * @example 6514 // Common port for syslog over TLS
	 */
	port?: number;

	/**
	 * Network protocol to use for syslog transmission
	 * @type {'udp' | 'tcp' | 'tcp-tls'}
	 * @default 'udp'
	 * @description
	 * - 'udp': Unreliable but fast (RFC 3164 compatible)
	 * - 'tcp': Reliable connection (RFC 6587)
	 * - 'tcp-tls': Encrypted connection (RFC 5425)
	 */
	protocol?: "udp" | "tcp" | "tcp-tls";

	/**
	 * Syslog facility code
	 * @type {number}
	 * @range 0-23
	 * @default 1 // USER
	 * @description
	 * Standard syslog facilities:
	 * - 0: kern     - Kernel messages
	 * - 1: user     - User-level messages
	 * - 2: mail     - Mail system
	 * - 3: daemon   - System daemons
	 * - 4: auth     - Security/authentication
	 * - 5: syslog   - Internal syslog messages
	 * - 6: lpr      - Line printer subsystem
	 * - 7: news     - Network news subsystem
	 * - 8: uucp     - UUCP subsystem
	 * - 9: cron     - Clock daemon
	 * - 10: authpriv - Security/authentication
	 * - 11: ftp      - FTP daemon
	 * - 16-23: local0-local7 - Locally used facilities
	 */
	facility?: number;

	/**
	 * Application name identifier included in syslog messages
	 * @type {string}
	 * @default 'node'
	 * @description
	 * Should be a short string (typically <= 32 chars) identifying the application.
	 * @example 'auth-service'
	 * @example 'payment-processor'
	 */
	appName?: string;

	/**
	 * Process ID included in syslog messages
	 * @type {number}
	 * @default process.pid
	 * @description
	 * Used to identify the specific process generating the log message.
	 */
	pid?: number;

	/**
	 * Syslog protocol version specification
	 * @type {3164 | 5424}
	 * @default 5424
	 * @description
	 * - 3164: Traditional BSD syslog format (RFC 3164)
	 * - 5424: Modern structured syslog format (RFC 5424)
	 */
	protocolVersion?: 3164 | 5424;

	/**
	 * TLS configuration options for secure connections
	 * @type {Object}
	 * @description Required when protocol is 'tcp-tls'
	 * @property {string} [ca] - PEM encoded CA certificate
	 * @property {string} [cert] - PEM encoded client certificate
	 * @property {string} [key] - PEM encoded client private key
	 * @property {boolean} [rejectUnauthorized=true] - Verify server certificate
	 */
	tlsOptions?: {
		/** CA certificate */
		ca?: string;
		/** Client certificate */
		cert?: string;
		/** Client private key */
		key?: string;
		/** Whether to reject unauthorized certificates (default: true) */
		rejectUnauthorized?: boolean;
	};

	/**
	 * Maximum number of log messages to buffer in memory
	 * @type {number}
	 * @default 1000
	 * @description
	 * When the queue reaches this size, oldest messages will be dropped.
	 * Set to 0 for unlimited (not recommended in production).
	 */
	maxQueueSize?: number;

	/**
	 * Initial retry delay in milliseconds (exponential backoff base)
	 * @description Delay doubles with each retry up to maximum 30s
	 * @default 1000
	 */
	retryBaseDelay?: number;

	/**
	 * Enable debug output for transport operations
	 * @type {boolean}
	 * @default false
	 * @description
	 * When true, outputs connection status and error details to console.
	 */
	debug?: boolean;
}
