/**
 * Enum representing various text colors for terminal output using ANSI escape codes.
 * @readonly
 */
export declare const enum Colors {
	/** Reset all attributes (color, bold, etc.) to default. */
	RESET = "\u001B[0m",
	/** Apply bold text formatting. */
	BOLD = "\u001B[1m",
	/** Black text color. */
	BLACK = "\u001B[30m",
	/** Red text color. */
	RED = "\u001B[31m",
	/** Green text color. */
	GREEN = "\u001B[32m",
	/** Yellow text color. */
	YELLOW = "\u001B[33m",
	/** Blue text color. */
	BLUE = "\u001B[34m",
	/** Magenta text color. */
	MAGENTA = "\u001B[35m",
	/** Cyan text color. */
	CYAN = "\u001B[36m",
	/** White text color. */
	WHITE = "\u001B[37m",
	/** Bright black (gray) text color. */
	BRIGHT_BLACK = "\u001B[90m",
	/** Bright red text color. */
	BRIGHT_RED = "\u001B[91m",
	/** Bright green text color. */
	BRIGHT_GREEN = "\u001B[92m",
	/** Bright yellow text color. */
	BRIGHT_YELLOW = "\u001B[93m",
	/** Bright blue text color. */
	BRIGHT_BLUE = "\u001B[94m",
	/** Bright magenta text color. */
	BRIGHT_MAGENTA = "\u001B[95m",
	/** Bright cyan text color. */
	BRIGHT_CYAN = "\u001B[96m",
	/** Bright white text color. */
	BRIGHT_WHITE = "\u001B[97m"
}
/**
 * Enum representing the various logging levels for filtering log messages.
 *
 * The levels are ordered from most important (ERROR) to least important (SILLY).
 * When setting a log level, only messages of that level or higher will be emitted.
 *
 * @example
 * // Set logger to display DEBUG level and above
 * logger.setLevel(Levels.DEBUG);
 */
export declare enum Levels {
	/**
	 * Error level. Indicates critical issues that require immediate attention.
	 * Use for unrecoverable errors that prevent normal operation.
	 * @example
	 * logger.error("Database connection failed");
	 */
	ERROR = 0,
	/**
	 * Warning level. Indicates potential issues or noteworthy conditions.
	 * Use for recoverable issues that don't prevent normal operation.
	 * @example
	 * logger.warn("High memory usage detected");
	 */
	WARN = 1,
	/**
	 * Audit level. For security-sensitive operations and compliance logging.
	 * Use for tracking authentication, authorization, and sensitive data access.
	 * @example
	 * logger.audit("User permissions changed", { user: "admin", changes: [...] });
	 */
	AUDIT = 2,
	/**
	 * Informational level. Provides general information about the application's state.
	 * Use for normal operational messages that highlight progress.
	 * @example
	 * logger.info("Application started on port 3000");
	 */
	INFO = 3,
	/**
	 * HTTP-related level. Logs HTTP requests and responses.
	 * Use for tracking HTTP API calls and their status.
	 * @example
	 * logger.http("GET /api/users 200 45ms");
	 */
	HTTP = 4,
	/**
	 * Debug level. Provides detailed context for debugging purposes.
	 * Use for extended debugging information during development.
	 * @example
	 * logger.debug("Database query", { query: "...", duration: "120ms" });
	 */
	DEBUG = 5,
	/**
	 * Verbose level. Provides detailed information for in-depth analysis.
	 * Use for detailed operational logs that are typically only needed during debugging.
	 * @example
	 * logger.verbose("Cache update cycle completed", { entries: 1423 });
	 */
	VERBOSE = 6,
	/**
	 * Silly level. Logs very low-level messages.
	 * Use for extremely verbose logging messages.
	 * @example
	 * logger.silly("Iteration 14563 completed");
	 */
	SILLY = 7
}
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
	values: [
		[
			string,
			string
		]
	];
}
/**
 * Main Logger class that handles all logging functionality.
 *
 * Provides a structured logging interface with multiple severity levels and
 * support for various transports (console, Loki, NDJSON, etc.).
 *
 * @example
 * // Basic usage
 * const logger = new Logger();
 * logger.info("Application started");
 *
 * @example
 * // With custom configuration
 * const logger = new Logger({
 *   level: Levels.DEBUG,
 *   transports: [new ConsoleTransport(), new LokiTransport({ url: "http://loki:3100" })]
 * });
 */
export declare class Logger {
	private level;
	private transports;
	/**
	 * Creates a new Logger instance
	 * @param config Optional configuration for the logger
	 * @param config.level Minimum log level to output (default: INFO)
	 * @param config.transports Array of transports to use (default: [ConsoleTransport])
	 */
	constructor(config?: {
		level?: Levels;
		transports?: Transport[];
	});
	/**
	 * Determines if a message should be logged based on its level
	 * @private
	 * @param level The log level to check
	 * @returns True if the message should be logged
	 */
	private shouldLog;
	/**
	 * Creates a structured log entry
	 * @private
	 * @param message The log message
	 * @param level The log level
	 * @param metadata Optional metadata object
	 * @returns Complete LogEntry object
	 */
	private createLogEntry;
	/**
	 * Processes a log entry through all configured transports
	 * @private
	 * @param entry The log entry to process
	 */
	private processEntry;
	/**
	 * Logs an error message (highest severity)
	 * @param message The error message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.error("Database connection failed", { error: error.stack });
	 */
	error(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs a warning message
	 * @param message The warning message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.warn("High memory usage detected", { usage: "85%" });
	 */
	warn(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs security-sensitive audit events
	 * @param message The audit message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.audit("User permissions modified", {
	 *   actor: "admin@example.com",
	 *   action: "role_change",
	 *   target: "user:1234"
	 * });
	 */
	audit(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs an informational message
	 * @param message The info message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.info("Server started", { port: 3000, env: "production" });
	 */
	info(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs HTTP-related messages
	 * @param message The HTTP message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.http("Request completed", {
	 *   method: "GET",
	 *   path: "/api/users",
	 *   status: 200,
	 *   duration: "45ms"
	 * });
	 */
	http(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs debug information (for development environments)
	 * @param message The debug message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.debug("Database query", {
	 *   query: "SELECT * FROM users",
	 *   parameters: { limit: 50 }
	 * });
	 */
	debug(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs verbose tracing information (very detailed)
	 * @param message The verbose message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.verbose("Cache update cycle", {
	 *   entriesProcessed: 1423,
	 *   memoryUsage: "1.2MB"
	 * });
	 */
	verbose(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs extremely low-level details (lowest severity)
	 * @param message The silly message
	 * @param metadata Optional metadata data
	 * @example
	 * logger.silly("Iteration complete", { iteration: 14563 });
	 */
	silly(message: string, metadata?: Record<string, any>): void;
	/**
	 * Adds a new transport to the logger
	 * @param transport The transport to add
	 * @example
	 * logger.addTransport(new LokiTransport({ url: "http://loki:3100" }));
	 */
	addTransport(transport: Transport): void;
	/**
	 * Removes a transport from the logger
	 * @param transport The transport to remove
	 * @example
	 * logger.removeTransport(consoleTransport);
	 */
	removeTransport(transport: Transport): void;
	/**
	 * Sets the minimum log level
	 * @param level The new minimum log level
	 * @example
	 * // Only show errors and warnings
	 * logger.setLevel(Levels.WARN);
	 */
	setLevel(level: Levels): void;
}
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
export declare class ConsoleTransport implements Transport {
	private format;
	private colors;
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
	constructor(format?: string, colors?: boolean);
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
	log(entry: LogEntry): void;
}
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
export declare class NDJsonTransport implements Transport {
	private data;
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
	log(entry: LogEntry): void;
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
	getData(): string;
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
	reset(): void;
}
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
export declare class LokiTransport implements Transport {
	private config;
	/** @private Internal log queue */
	private queue;
	/** @private Current batch size setting */
	private batchSize;
	/** @private Current batch timeout setting (ms) */
	private batchTimeout;
	/** @private Handle for batch timeout */
	private timeoutHandle?;
	/** @private Maximum allowed labels per entry */
	private maxLabelCount;
	/** @private Debug mode flag */
	private debug;
	/** @private Maximum queue size before dropping logs */
	private maxQueueSize;
	/** @private Current retry attempt count */
	private retryCount;
	/** @private Maximum allowed retry attempts */
	private maxRetries;
	/** @private Base delay for exponential backoff (ms) */
	private retryBaseDelay;
	/** @private Handle for retry timeout */
	private retryTimer?;
	/** @private Flag indicating active send operation */
	private isSending;
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
	constructor(config: LokiConfig);
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
	log(entry: LogEntry): void;
	/**
	 * Schedules the next batch send operation
	 * @private
	 * @param {boolean} [immediate=false] - Whether to send immediately without waiting for timeout
	 */
	private scheduleSend;
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
	private sendBatch;
}

export {};
