import type { LogEntry, Transport } from "../types";
import { formatNDJson } from "../formatters/ndjsonFormatter";

/**
 * Transport that collects logs in NDJSON (Newline Delimited JSON) format
 */
export class NDJsonTransport implements Transport {
	private data: string = "";

	/**
	 * Append a log entry to the NDJSON buffer
	 * @param entry The log entry to append
	 */
	log(entry: LogEntry): void {
		let separator = this.data.length !== 0 ? "\n" : "";
		this.data += separator + formatNDJson(entry);
	}

	/**
	 * Get the accumulated NDJSON data
	 * @returns The NDJSON formatted log data
	 */
	getData(): string {
		return this.data ?? "";
	}

	/**
	 * Clear the accumulated log data
	 */
	reset(): void {
		this.data = "";
	}
}
