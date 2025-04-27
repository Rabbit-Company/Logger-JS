import { Levels } from "./constants/levels";

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
	values: [[string, string]];
}
