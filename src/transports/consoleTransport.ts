import { formatConsoleMessage } from "../formatters/consoleFormatter";
import type { LogEntry, Transport } from "../types";

/**
 * Transport that outputs logs to the console with configurable formatting and colors.
 *
 * Features:
 * - Customizable output format with extensive placeholder support
 * - ANSI color support (enabled by default)
 * - Cross-platform compatibility (Node.js and browsers)
 * - Lightweight and performant
 *
 * @example
 * // Basic usage with default formatting
 * const transport = new ConsoleTransport();
 *
 * @example
 * // Custom format with local timestamps
 * const transport = new ConsoleTransport(
 *   "[{datetime-local}] {type} - {message}",
 *   true
 * );
 */
export class ConsoleTransport implements Transport {
	/**
	 * Creates a new ConsoleTransport instance
	 * @param format Format string supporting these placeholders:
	 *
	 * ### Time/Date Formats
	 * - `{iso}`: Full ISO-8601 UTC format (YYYY-MM-DDTHH:MM:SS.mmmZ)
	 * - `{datetime}`: Simplified UTC (YYYY-MM-DD HH:MM:SS)
	 * - `{date}`: UTC date only (YYYY-MM-DD)
	 * - `{time}`: UTC time only (HH:MM:SS)
	 * - `{datetime-local}`: Local datetime (YYYY-MM-DD HH:MM:SS)
	 * - `{date-local}`: Local date only (YYYY-MM-DD)
	 * - `{time-local}`: Local time only (HH:MM:SS)
	 * - `{ms}`: Milliseconds since epoch
	 *
	 * ### Log Content
	 * - `{type}`: Log level name (e.g., "INFO")
	 * - `{message}`: The log message content
	 *
	 * @default "[{datetime-local}] {type} {message}"
	 *
	 * @param colors Enable ANSI color output. When disabled:
	 *   - Improves performance in non-TTY environments
	 *   - Removes all color formatting
	 * @default true
	 *
	 * @example
	 * // UTC format example
	 * new ConsoleTransport("{date} {time} [{type}] {message}");
	 *
	 * @example
	 * // Local time with colors disabled
	 * new ConsoleTransport("{time-local} - {message}", false);
	 */
	constructor(private format: string = "[{datetime-local}] {type} {message}", private colors: boolean = true) {}

	/**
	 * Formats and outputs a log entry to the console.
	 *
	 * Applies the configured format with these features:
	 * - All specified placeholders are replaced
	 * - Colors are applied to level names and messages
	 * - Timestamps are dimmed for better readability
	 *
	 * @param entry The log entry containing:
	 *   - message: string - The primary log content
	 *   - level: Levels - The severity level
	 *   - timestamp: number - Creation time (ms since epoch)
	 *
	 * @example
	 * // With all placeholder types
	 * transport.log({
	 *   message: "User logged in",
	 *   level: Levels.INFO,
	 *   timestamp: Date.now()
	 * });
	 */
	log(entry: LogEntry): void {
		console.info(formatConsoleMessage(entry.message, entry.level, this.format, this.colors));
	}
}
