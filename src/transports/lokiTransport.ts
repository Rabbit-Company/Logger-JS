import { formatLokiMessage } from "../formatters/lokiFormatter";
import type { LogEntry, LokiConfig, Transport } from "../types";

/**
 * Transport that sends logs to a Grafana Loki server with batching and retry support.
 *
 * Features:
 * - Automatic batching of logs for efficient transmission
 * - Configurable batch size and timeout
 * - Label management with cardinality control
 * - Multi-tenancy support via X-Scope-OrgID
 * - Basic authentication support
 *
 * @example
 * // Basic configuration
 * const lokiTransport = new LokiTransport({
 *   url: "http://localhost:3100",
 *   labels: { app: "my-app", env: "production" }
 * });
 *
 * @example
 * // With authentication and custom batching
 * const securedTransport = new LokiTransport({
 *   url: "http://loki.example.com",
 *   basicAuth: { username: "user", password: "pass" },
 *   batchSize: 20,
 *   batchTimeout: 10000 // 10 seconds
 * });
 */
export class LokiTransport implements Transport {
	private batch: any[] = [];
	private batchSize: number;
	private batchTimeout: number;
	private timeoutHandle?: Timer;
	private maxLabelCount: number;
	private debug: boolean;

	/**
	 * Creates a new LokiTransport instance
	 * @param config Configuration options for Loki
	 * @param config.url Required Loki server URL (e.g., "http://localhost:3100")
	 * @param config.labels Base labels to attach to all log entries
	 * @param config.basicAuth Basic authentication credentials
	 * @param config.batchSize Maximum number of logs to batch before sending (default: 10)
	 * @param config.batchTimeout Maximum time (ms) to wait before sending a batch (default: 5000)
	 * @param config.tenantID Tenant ID for multi-tenant Loki setups
	 * @param config.maxLabelCount Maximum number of labels allowed (default: 50)
	 * @param config.debug Enable debug logging for transport errors (default: false)
	 * @throws {Error} If URL is not provided
	 */
	constructor(private config: LokiConfig) {
		this.batchSize = config.batchSize || 10;
		this.batchTimeout = config.batchTimeout || 5000;
		this.maxLabelCount = config.maxLabelCount || 50;
		this.debug = config.debug || false;

		if (!config.url) {
			throw new Error("Loki URL is required");
		}
	}

	/**
	 * Adds a log entry to the current batch. Automatically sends the batch when:
	 * - The batch reaches the configured size, OR
	 * - The batch timeout is reached
	 *
	 * @param entry The log entry to send. Metadata will be converted to Loki labels
	 *              following the configured maxLabelCount rules.
	 *
	 * @example
	 * transport.log({
	 *   message: "User logged in",
	 *   level: Levels.INFO,
	 *   timestamp: Date.now(),
	 *   metadata: { userId: "123", device: "mobile" }
	 * });
	 */
	log(entry: LogEntry): void {
		const lokiMessage = formatLokiMessage(entry, this.maxLabelCount, { ...this.config.labels, ...entry.metadata });
		this.batch.push(lokiMessage);

		if (this.batch.length >= this.batchSize) {
			this.sendBatch();
		} else if (!this.timeoutHandle) {
			this.timeoutHandle = setTimeout(() => this.sendBatch(), this.batchTimeout);
		}
	}

	/**
	 * Immediately sends the current batch of logs to Loki.
	 * @private
	 *
	 * Handles:
	 * - HTTP headers including auth and tenant ID
	 * - Batch timeout clearing
	 * - Error logging (when debug enabled)
	 * - Batch management
	 *
	 * Note: This method is called automatically by the transport
	 * and typically doesn't need to be called directly.
	 */
	private async sendBatch(): Promise<void> {
		if (this.timeoutHandle) {
			clearTimeout(this.timeoutHandle);
			this.timeoutHandle = undefined;
		}

		if (this.batch.length === 0) return;

		const batchToSend = this.batch;
		this.batch = [];

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

			if (!response.ok && this.debug) {
				console.error("Failed to send logs to Loki: ", await response.text());
			}
		} catch (error) {
			if (this.debug) console.error("Error sending logs to Loki: ", error);
		}
	}
}
