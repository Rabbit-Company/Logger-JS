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
 * @property {Transport[]} [transports=[ConsoleTransport]] - Array of transports to use
 *
 * @example <caption>Default Format</caption>
 * {
 *   format: "[{datetime-local}] {type} {message}"
 * }
 *
 * @example <caption>UTC Time Format</caption>
 * {
 *   format: "[{datetime} UTC] {type}: {message}"
 * }
 *
 * @example <caption>Detailed Local Format</caption>
 * {
 *   format: "{date-local} {time-local} [{type}] {message}"
 * }
 *
 * @example <caption>Epoch Timestamp</caption>
 * {
 *   format: "{ms} - {type} - {message}"
 * }
 */
export interface LoggerConfig {
	/** Minimum log level to output (default: INFO) */
	level?: Levels;
	/** Enable colored output (default: true) */
	colors?: boolean;
	/** Format string using placeholders (default: "[{datetime-local}] {type} {message}") */
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
