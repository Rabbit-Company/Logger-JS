import { Levels } from "../constants/levels";
import type { LogEntry, SyslogConfig } from "../types";

/**
 * Mapping of logger levels to syslog severity levels as defined in RFC 5424
 * @constant
 * @type {Record<number, number>}
 * @property {number} ERROR - System is unusable (severity 3)
 * @property {number} WARN - Warning conditions (severity 4)
 * @property {number} AUDIT - Normal but significant condition (severity 5)
 * @property {number} INFO - Informational messages (severity 6)
 * @property {number} HTTP - Informational messages (severity 6)
 * @property {number} DEBUG - Debug-level messages (severity 7)
 * @property {number} VERBOSE - Debug-level messages (severity 7)
 * @property {number} SILLY - Debug-level messages (severity 7)
 */
const SYSLOG_SEVERITY = {
	[Levels.ERROR]: 3, // Error
	[Levels.WARN]: 4, // Warning
	[Levels.AUDIT]: 5, // Notice
	[Levels.INFO]: 6, // Informational
	[Levels.HTTP]: 6, // Informational
	[Levels.DEBUG]: 7, // Debug
	[Levels.VERBOSE]: 7, // Debug
	[Levels.SILLY]: 7, // Debug
};

/**
 * Formats a log entry according to RFC 3164 (BSD syslog protocol)
 * @private
 * @param {LogEntry} entry - The log entry to format
 * @param {number} facility - Syslog facility code (0-23)
 * @param {string} appName - Application name identifier
 * @param {number} pid - Process ID
 * @returns {string} Formatted RFC 3164 syslog message
 *
 * @example
 * // Returns: "<13>Jan 23 14:15:16 hostname myapp[1234]: Test message"
 * formatRFC3164(logEntry, 1, "myapp", 1234);
 */
function formatRFC3164(entry: LogEntry, facility: number, appName: string, pid: number): string {
	const severity = SYSLOG_SEVERITY[entry.level];
	const priority = (facility << 3) | severity;
	const timestamp = new Date(entry.timestamp)
		.toLocaleString("en-US", {
			month: "short",
			day: "2-digit",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
		})
		.replace(/,/, "")
		.replace(" at ", " ");

	const hostname = require("os").hostname();
	const msg = entry.metadata ? `${entry.message} ${JSON.stringify(entry.metadata)}` : entry.message;

	return `<${priority}>${timestamp} ${hostname} ${appName}[${pid}]: ${msg}`;
}

/**
 * Formats a log entry according to RFC 5424 (modern syslog protocol)
 * @private
 * @param {LogEntry} entry - The log entry to format
 * @param {number} facility - Syslog facility code (0-23)
 * @param {string} appName - Application name identifier
 * @param {number} pid - Process ID
 * @returns {string} Formatted RFC 5424 syslog message
 *
 * @example
 * // Returns: "<13>1 2023-01-23T14:15:16.000Z hostname myapp 1234 - [example@1 key="value"] Test message"
 * formatRFC5424(logEntry, 1, "myapp", 1234);
 */
function formatRFC5424(entry: LogEntry, facility: number, appName: string, pid: number): string {
	const severity = SYSLOG_SEVERITY[entry.level];
	const priority = (facility << 3) | severity;
	const timestamp = new Date(entry.timestamp).toISOString();
	const hostname = require("os").hostname();
	const msgId = "-";
	const structuredData = entry.metadata
		? `[example@1 ${Object.entries(entry.metadata)
				.map(([key, val]) => `${key}="${val}"`)
				.join(" ")}]`
		: "-";

	return `<${priority}>1 ${timestamp} ${hostname} ${appName} ${pid} ${msgId} ${structuredData} ${entry.message}`;
}

/**
 * Formats a log entry for syslog according to specified protocol version
 * @function
 * @param {LogEntry} entry - The log entry containing message, level, timestamp and metadata
 * @param {Object} config - Syslog configuration options
 * @param {number} [config.facility=1] - Syslog facility code (0-23), defaults to 1 (user-level)
 * @param {string} [config.appName="node"] - Application name identifier
 * @param {number} [config.pid=process.pid] - Process ID
 * @param {number} [config.protocolVersion=3164] - Syslog protocol version (3164 or 5424)
 * @returns {string} Formatted syslog message according to specified protocol
 *
 * @example
 * // RFC 3164 format
 * formatSyslogMessage(logEntry, { protocolVersion: 3164 });
 *
 * @example
 * // RFC 5424 format with custom facility
 * formatSyslogMessage(logEntry, {
 *   protocolVersion: 5424,
 *   facility: 16, // local0
 *   appName: "myapp"
 * });
 */
export function formatSyslogMessage(entry: LogEntry, config: Pick<SyslogConfig, "facility" | "appName" | "pid" | "protocolVersion">): string {
	const facility = config.facility ?? 1; // USER facility
	const appName = config.appName ?? "node";
	const pid = config.pid ?? process.pid;
	const protocolVersion = config.protocolVersion ?? 3164;

	return protocolVersion === 3164 ? formatRFC3164(entry, facility, appName, pid) : formatRFC5424(entry, facility, appName, pid);
}
