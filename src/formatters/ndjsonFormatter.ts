import type { LogEntry } from "../types";

/**
 * Formats a log entry as NDJSON (Newline Delimited JSON) string.
 *
 * @param {LogEntry} entry - The log entry to format
 * @returns {string} NDJSON formatted log line
 *
 * @example
 * // Basic usage
 * const ndjson = formatNDJson({
 *   message: "System started",
 *   level: Levels.INFO,
 *   timestamp: Date.now()
 * });
 *
 * @example
 * // With metadata
 * formatNDJson({
 *   message: "User login",
 *   level: Levels.INFO,
 *   timestamp: Date.now(),
 *   metadata: {userId: "123"}
 * });
 */
export function formatNDJson(entry: LogEntry): string {
	return JSON.stringify({
		time: new Date(entry.timestamp).toISOString(),
		level: entry.level,
		msg: entry.message,
		...(entry.metadata || {}),
	});
}
