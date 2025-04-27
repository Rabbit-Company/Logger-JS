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
 */
export declare enum Levels {
	/**
	 * Error level. Indicates critical issues that require immediate attention.
	 * Use for unrecoverable errors that prevent normal operation.
	 */
	ERROR = 0,
	/**
	 * Warning level. Indicates potential issues or noteworthy conditions.
	 * Use for recoverable issues that don't prevent normal operation.
	 */
	WARN = 1,
	/**
	 * Informational level. Provides general information about the application's state.
	 * Use for normal operational messages that highlight progress.
	 */
	INFO = 2,
	/**
	 * HTTP-related level. Logs HTTP requests and responses.
	 * Use for tracking HTTP API calls and their status.
	 */
	HTTP = 3,
	/**
	 * Verbose level. Provides detailed information for in-depth analysis.
	 * Use for detailed operational logs that are typically only needed during debugging.
	 */
	VERBOSE = 4,
	/**
	 * Debug level. Provides detailed context for debugging purposes.
	 * Use for extended debugging information during development.
	 */
	DEBUG = 5,
	/**
	 * Silly level. Logs very low-level messages.
	 * Use for extremely verbose logging messages.
	 */
	SILLY = 6
}
/**
 * Represents a single log entry with message, severity level, timestamp, and optional metadata
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
 * Interface for log transport implementations
 */
export interface Transport {
	/**
	 * Processes and outputs a log entry
	 * @param entry The log entry to process
	 */
	log: (entry: LogEntry) => void;
}
/**
 * Configuration options for the Logger instance
 */
export interface LoggerConfig {
	/** Minimum log level to output (default: INFO) */
	level?: Levels;
	/** Enable colored output (default: true) */
	colors?: boolean;
	/** Format string using {date}, {type}, {message} placeholders (default: "[{date}] {type} {message}") */
	format?: string;
	/** Array of transports to use (default: [ConsoleTransport]) */
	transports?: Transport[];
}
/**
 * Configuration for Loki transport
 */
export interface LokiConfig {
	/** Loki server URL (e.g., "http://localhost:3100") */
	url: string;
	/** Base labels to attach to all logs */
	labels?: Record<string, string>;
	/** Basic authentication credentials */
	basicAuth?: {
		username: string;
		password: string;
	};
	/** Number of logs to batch before sending (default: 10) */
	batchSize?: number;
	/** Maximum time in ms to wait before sending a batch (default: 5000) */
	batchTimeout?: number;
	/** Tenant ID for multi-tenant Loki setups */
	tenantID?: string;
	/** Maximum number of labels allowed (default: 50) */
	maxLabelCount?: number;
	/** Enable debug logging for transport errors (default: false) */
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
	 * Logs an error message
	 * @param message The error message
	 * @param metadata Optional metadata object
	 */
	error(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs a warning message
	 * @param message The warning message
	 * @param metadata Optional metadata object
	 */
	warn(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs an informational message
	 * @param message The info message
	 * @param metadata Optional metadata object
	 */
	info(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs an HTTP-related message
	 * @param message The HTTP message
	 * @param metadata Optional metadata object
	 */
	http(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs a verbose message
	 * @param message The verbose message
	 * @param metadata Optional metadata object
	 */
	verbose(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs a debug message
	 * @param message The debug message
	 * @param metadata Optional metadata object
	 */
	debug(message: string, metadata?: Record<string, any>): void;
	/**
	 * Logs a silly message (lowest level)
	 * @param message The silly message
	 * @param metadata Optional metadata object
	 */
	silly(message: string, metadata?: Record<string, any>): void;
	/**
	 * Adds a new transport to the logger
	 * @param transport The transport to add
	 */
	addTransport(transport: Transport): void;
	/**
	 * Removes a transport from the logger
	 * @param transport The transport to remove
	 */
	removeTransport(transport: Transport): void;
	/**
	 * Sets the minimum log level
	 * @param level The new minimum log level
	 */
	setLevel(level: Levels): void;
}
/**
 * Transport that outputs logs to the console with configurable formatting
 */
export declare class ConsoleTransport implements Transport {
	private format;
	private colors;
	/**
	 * Create a ConsoleTransport instance
	 * @param format Format string using {date}, {type}, {message} placeholders
	 * @param colors Enable colored output
	 */
	constructor(format?: string, colors?: boolean);
	/**
	 * Output a log entry to the console
	 * @param entry The log entry to output
	 */
	log(entry: LogEntry): void;
}
/**
 * Transport that collects logs in NDJSON (Newline Delimited JSON) format
 */
export declare class NDJsonTransport implements Transport {
	private data;
	/**
	 * Append a log entry to the NDJSON buffer
	 * @param entry The log entry to append
	 */
	log(entry: LogEntry): void;
	/**
	 * Get the accumulated NDJSON data
	 * @returns The NDJSON formatted log data
	 */
	getData(): string;
	/**
	 * Clear the accumulated log data
	 */
	reset(): void;
}
/**
 * Transport that sends logs to a Grafana Loki server
 */
export declare class LokiTransport implements Transport {
	private config;
	private batch;
	private batchSize;
	private batchTimeout;
	private timeoutHandle?;
	private maxLabelCount;
	private debug;
	/**
	 * Create a LokiTransport instance
	 * @param config Configuration options for Loki
	 * @throws {Error} If URL is not provided
	 */
	constructor(config: LokiConfig);
	/**
	 * Add a log entry to the batch (may trigger send if batch size is reached)
	 * @param entry The log entry to send
	 */
	log(entry: LogEntry): void;
	/**
	 * Send the current batch of logs to Loki
	 * @private
	 */
	private sendBatch;
}

export {};
