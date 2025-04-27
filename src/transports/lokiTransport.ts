import { formatLokiMessage } from "../formatters/lokiFormatter";
import type { LogEntry, LokiConfig, Transport } from "../types";

/**
 * Transport that sends logs to a Grafana Loki server
 */
export class LokiTransport implements Transport {
	private batch: any[] = [];
	private batchSize: number;
	private batchTimeout: number;
	private timeoutHandle?: Timer;
	private maxLabelCount: number;
	private debug: boolean;

	/**
	 * Create a LokiTransport instance
	 * @param config Configuration options for Loki
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
	 * Add a log entry to the batch (may trigger send if batch size is reached)
	 * @param entry The log entry to send
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
	 * Send the current batch of logs to Loki
	 * @private
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
