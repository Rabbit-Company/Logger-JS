import type { LogEntry, Transport } from "../types";
import { formatNDJson } from "../formatters/ndjsonFormatter";

/**
 * Transport that collects logs in NDJSON (Newline Delimited JSON) format.
 *
 * This transport accumulates log entries in memory as NDJSON strings,
 * which can be retrieved or cleared as needed. Useful for:
 * - Log aggregation
 * - Bulk exporting logs
 * - Integration with log processing pipelines
 *
 * @example
 * // Basic usage
 * const transport = new NDJsonTransport();
 * const logger = new Logger({ transports: [transport] });
 *
 * // Get logs as NDJSON string
 * const logs = transport.getData();
 *
 * @example
 * // Periodic log flushing
 * setInterval(() => {
 *   const logs = transport.getData();
 *   if (logs) {
 *     sendToServer(logs);
 *     transport.reset();
 *   }
 * }, 60000);
 */
export class NDJsonTransport implements Transport {
	private data: string = "";

	/**
	 * Appends a log entry to the internal NDJSON buffer.
	 *
	 * Automatically adds newline separators between entries.
	 *
	 * @param entry The log entry to append. Must contain:
	 * - message: string
	 * - level: Levels
	 * - timestamp: number
	 * - metadata?: object
	 *
	 * @example
	 * transport.log({
	 *   message: "System started",
	 *   level: Levels.INFO,
	 *   timestamp: Date.now()
	 * });
	 */
	log(entry: LogEntry): void {
		let separator = this.data.length !== 0 ? "\n" : "";
		this.data += separator + formatNDJson(entry);
	}

	/**
	 * Retrieves all accumulated logs as an NDJSON string.
	 *
	 * The returned string will contain one log entry per line,
	 * with each line being a valid JSON string.
	 *
	 * @returns {string} NDJSON formatted log data. Returns empty string if no logs.
	 *
	 * @example
	 * // Get logs for API response
	 * app.get('/logs', (req, res) => {
	 *   res.type('application/x-ndjson');
	 *   res.send(transport.getData());
	 * });
	 */
	getData(): string {
		return this.data ?? "";
	}

	/**
	 * Clears all accumulated log data from memory.
	 *
	 * Typically called after successfully transmitting logs
	 * to prevent duplicate processing.
	 *
	 * @example
	 * // Clear after successful upload
	 * if (uploadLogs(transport.getData())) {
	 *   transport.reset();
	 * }
	 */
	reset(): void {
		this.data = "";
	}
}
