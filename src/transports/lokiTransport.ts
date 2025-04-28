import { formatLokiMessage } from "../formatters/lokiFormatter";
import type { LogEntry, LokiConfig, Transport } from "../types";

/**
 * High-reliability transport for sending logs to Grafana Loki with persistent queuing.
 *
 * Features:
 * - Persistent in-memory queue with configurable size limits
 * - Exponential backoff retry mechanism with configurable limits
 * - Automatic batching for efficient network utilization
 * - Label management with cardinality control
 * - Multi-tenancy support via X-Scope-OrgID
 * - Comprehensive error handling and recovery
 *
 * @implements {Transport}
 *
 * @example <caption>Basic Configuration</caption>
 * const lokiTransport = new LokiTransport({
 *   url: "http://localhost:3100",
 *   labels: { app: "my-app", env: "production" }
 * });
 *
 * @example <caption>Advanced Configuration</caption>
 * const transport = new LokiTransport({
 *   url: "http://loki.example.com",
 *   batchSize: 50,
 *   batchTimeout: 2000,
 *   maxQueueSize: 50000,
 *   maxRetries: 10,
 *   retryBaseDelay: 2000,
 *   tenantID: "team-a",
 *   basicAuth: { username: "user", password: "pass" },
 *   debug: true
 * });
 */
export class LokiTransport implements Transport {
	/** @private Internal log queue */
	private queue: any[] = [];

	/** @private Current batch size setting */
	private batchSize: number;

	/** @private Current batch timeout setting (ms) */
	private batchTimeout: number;

	/** @private Handle for batch timeout */
	private timeoutHandle?: Timer;

	/** @private Maximum allowed labels per entry */
	private maxLabelCount: number;

	/** @private Debug mode flag */
	private debug: boolean;

	/** @private Maximum queue size before dropping logs */
	private maxQueueSize: number;

	/** @private Current retry attempt count */
	private retryCount: number = 0;

	/** @private Maximum allowed retry attempts */
	private maxRetries: number;

	/** @private Base delay for exponential backoff (ms) */
	private retryBaseDelay: number;

	/** @private Handle for retry timeout */
	private retryTimer?: Timer;

	/** @private Flag indicating active send operation */
	private isSending: boolean = false;

	/**
	 * Creates a new LokiTransport instance
	 * @param {LokiConfig} config - Configuration options
	 * @param {string} config.url - Required Loki server endpoint (e.g., "http://localhost:3100")
	 * @param {Object.<string, string>} [config.labels] - Base labels attached to all log entries
	 * @param {Object} [config.basicAuth] - Basic authentication credentials
	 * @param {string} config.basicAuth.username - Username for basic auth
	 * @param {string} config.basicAuth.password - Password for basic auth
	 * @param {string} [config.tenantID] - Tenant ID for multi-tenant Loki installations
	 * @param {number} [config.batchSize=10] - Number of logs to accumulate before automatic sending
	 * @param {number} [config.batchTimeout=5000] - Maximum time (ms) to wait before sending incomplete batch
	 * @param {number} [config.maxLabelCount=50] - Maximum number of labels allowed per log entry
	 * @param {number} [config.maxQueueSize=10000] - Maximum number of logs to buffer in memory during outages
	 * @param {number} [config.maxRetries=5] - Maximum number of attempts to send a failed batch
	 * @param {number} [config.retryBaseDelay=1000] - Initial retry delay in ms (exponential backoff base)
	 * @param {boolean} [config.debug=false] - Enable debug logging for transport internals
	 */
	constructor(private config: LokiConfig) {
		this.batchSize = config.batchSize || 10;
		this.batchTimeout = config.batchTimeout || 5000;
		this.maxLabelCount = config.maxLabelCount || 50;
		this.debug = config.debug || false;
		this.maxQueueSize = config.maxQueueSize || 10000;
		this.maxRetries = config.maxRetries || 5;
		this.retryBaseDelay = config.retryBaseDelay || 1000;
	}

	/**
	 * Queues a log entry for delivery to Loki
	 *
	 * @param {LogEntry} entry - The log entry to process
	 * @param {string} entry.message - Primary log message content
	 * @param {string} entry.level - Log severity level (e.g., "INFO", "ERROR")
	 * @param {number} entry.timestamp - Unix timestamp in milliseconds
	 * @param {Object} [entry.metadata] - Additional log metadata (will be converted to Loki labels)
	 *
	 * @example
	 * transport.log({
	 *   message: "User login successful",
	 *   level: "INFO",
	 *   timestamp: Date.now(),
	 *   metadata: {
	 *     userId: "12345",
	 *     sourceIP: "192.168.1.100",
	 *     device: "mobile"
	 *   }
	 * });
	 */
	log(entry: LogEntry): void {
		const lokiMessage = formatLokiMessage(entry, this.maxLabelCount, {
			...this.config.labels,
			...entry.metadata,
		});

		if (this.queue.length >= this.maxQueueSize) {
			if (this.debug) console.warn("Loki queue full - dropping oldest log entry");
			this.queue.shift();
		}

		this.queue.push(lokiMessage);
		this.scheduleSend();
	}

	/**
	 * Schedules the next batch send operation
	 * @private
	 * @param {boolean} [immediate=false] - Whether to send immediately without waiting for timeout
	 */
	private scheduleSend(immediate = false): void {
		if (this.isSending) return;

		if (this.timeoutHandle) {
			clearTimeout(this.timeoutHandle);
			this.timeoutHandle = undefined;
		}

		if (this.queue.length > 0 && (immediate || this.queue.length >= this.batchSize)) {
			this.sendBatch();
		} else if (this.queue.length > 0) {
			this.timeoutHandle = setTimeout(() => this.sendBatch(), this.batchTimeout);
		}
	}

	/**
	 * Sends the current batch to Loki with retry logic
	 * @private
	 * @async
	 * @returns {Promise<void>}
	 *
	 * @description
	 * Handles the complete send operation including:
	 * - Preparing HTTP request with proper headers
	 * - Executing the fetch request
	 * - Managing retries with exponential backoff
	 * - Queue cleanup on success/failure
	 * - Automatic scheduling of next batch
	 */
	private async sendBatch(): Promise<void> {
		if (this.queue.length === 0 || this.isSending) return;

		this.isSending = true;
		const batchToSend = this.queue.slice(0, this.batchSize);

		try {
			const headers: Record<string, string> = {
				"Content-Type": "application/json",
			};

			if (this.config.tenantID) {
				headers["X-Scope-OrgID"] = this.config.tenantID;
			}

			if (this.config.basicAuth) {
				headers.Authorization = `Basic ${btoa(this.config.basicAuth.username + ":" + this.config.basicAuth.password)}`;
			}

			const response = await fetch(`${this.config.url}/loki/api/v1/push`, {
				method: "POST",
				headers,
				body: JSON.stringify({
					streams: batchToSend.flatMap((entry) => entry.streams),
				}),
			});

			if (response.ok) {
				this.queue = this.queue.slice(batchToSend.length);
				this.retryCount = 0;
				if (this.retryTimer) {
					clearTimeout(this.retryTimer);
					this.retryTimer = undefined;
				}
			} else {
				throw new Error(`HTTP ${response.status}: ${await response.text()}`);
			}
		} catch (error) {
			if (this.debug) console.error("Loki transmission error: ", error);

			this.retryCount++;
			if (this.retryCount <= this.maxRetries) {
				const delay = Math.min(this.retryBaseDelay * Math.pow(2, this.retryCount - 1), 30000);
				if (this.debug) console.log(`Scheduling retry #${this.retryCount} in ${delay}ms`);

				this.retryTimer = setTimeout(() => {
					this.scheduleSend(true);
				}, delay);
			} else {
				if (this.debug) console.warn(`Max retries (${this.maxRetries}) reached. Dropping batch.`);
				this.queue = this.queue.slice(batchToSend.length);
				this.retryCount = 0;
			}
		} finally {
			this.isSending = false;

			if (this.queue.length > 0 && this.retryCount === 0) {
				this.scheduleSend();
			}
		}
	}
}
