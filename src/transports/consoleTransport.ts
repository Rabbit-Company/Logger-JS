import { formatConsoleMessage } from "../formatters/consoleFormatter";
import type { LogEntry, Transport } from "../types";

/**
 * Transport that outputs logs to the console with configurable formatting
 */
export class ConsoleTransport implements Transport {
	/**
	 * Create a ConsoleTransport instance
	 * @param format Format string using {date}, {type}, {message} placeholders
	 * @param colors Enable colored output
	 */
	constructor(private format: string = "[{date}] {type} {message}", private colors: boolean = true) {}

	/**
	 * Output a log entry to the console
	 * @param entry The log entry to output
	 */
	log(entry: LogEntry): void {
		console.info(formatConsoleMessage(entry.message, entry.level, this.format, this.colors));
	}
}
