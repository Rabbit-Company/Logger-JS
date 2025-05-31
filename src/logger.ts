import { Levels } from "./constants/levels";
import type { LogEntry, Transport } from "./types";
import { ConsoleTransport } from "./transports/consoleTransport";

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
export class Logger {
	private level: Levels = Levels.INFO;
	private transports: Transport[] = [new ConsoleTransport()];

	/**
	 * Creates a new Logger instance
	 * @param config Optional configuration for the logger
	 * @param config.level Minimum log level to output (default: INFO)
	 * @param config.transports Array of transports to use (default: [ConsoleTransport])
	 */
	constructor(config?: { level?: Levels; transports?: Transport[] }) {
		if (config?.level !== undefined) {
			this.level = config.level;
		}
		if (config?.transports) {
			this.transports = config.transports;
		}
	}

	/**
	 * Determines if a message should be logged based on its level
	 * @private
	 * @param level The log level to check
	 * @returns True if the message should be logged
	 */
	private shouldLog(level: Levels): boolean {
		return this.level >= level;
	}

	/**
	 * Creates a structured log entry
	 * @private
	 * @param message The log message
	 * @param level The log level
	 * @param metadata Optional metadata object
	 * @returns Complete LogEntry object
	 */
	private createLogEntry(message: string, level: Levels, metadata?: Record<string, any>): LogEntry {
		return {
			message,
			level,
			timestamp: Date.now(),
			metadata,
		};
	}

	/**
	 * Processes a log entry through all configured transports
	 * @private
	 * @param entry The log entry to process
	 */
	private processEntry(entry: LogEntry): void {
		if (!this.shouldLog(entry.level)) return;

		for (const transport of this.transports) {
			transport.log(entry);
		}
	}

	/**
	 * Logs a message at the specified level with optional metadata.
	 *
	 * This is the primary logging method that all other level-specific methods
	 * (error, warn, info, etc.) delegate to. It provides fine-grained control
	 * over the log level and is useful for dynamic logging scenarios.
	 *
	 * @param level - The severity level for this log entry (use Levels enum)
	 * @param message - The log message to record
	 * @param metadata - Optional structured data to attach to the log entry
	 *
	 * @example
	 * logger.log(Levels.ERROR, "Database connection failed", { error: error.stack });
	 */
	log(level: Levels, message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, level, metadata));
	}

	/**
	 * Logs an error message (highest severity)
	 * @param message The error message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.error("Database connection failed", { error: error.stack });
	 */
	error(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.ERROR, message, metadata);
	}

	/**
	 * Logs a warning message
	 * @param message The warning message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.warn("High memory usage detected", { usage: "85%" });
	 */
	warn(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.WARN, message, metadata);
	}

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
	audit(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.AUDIT, message, metadata);
	}

	/**
	 * Logs an informational message
	 * @param message The info message
	 * @param metadata Optional metadata object
	 * @example
	 * logger.info("Server started", { port: 3000, env: "production" });
	 */
	info(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.INFO, message, metadata);
	}

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
	http(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.HTTP, message, metadata);
	}

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
	debug(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.DEBUG, message, metadata);
	}

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
	verbose(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.VERBOSE, message, metadata);
	}

	/**
	 * Logs extremely low-level details (lowest severity)
	 * @param message The silly message
	 * @param metadata Optional metadata data
	 * @example
	 * logger.silly("Iteration complete", { iteration: 14563 });
	 */
	silly(message: string, metadata?: Record<string, any>): void {
		this.log(Levels.SILLY, message, metadata);
	}

	/**
	 * Adds a new transport to the logger
	 * @param transport The transport to add
	 * @example
	 * logger.addTransport(new LokiTransport({ url: "http://loki:3100" }));
	 */
	addTransport(transport: Transport): void {
		this.transports.push(transport);
	}

	/**
	 * Removes a transport from the logger
	 * @param transport The transport to remove
	 * @example
	 * logger.removeTransport(consoleTransport);
	 */
	removeTransport(transport: Transport): void {
		this.transports = this.transports.filter((t) => t !== transport);
	}

	/**
	 * Sets the minimum log level
	 * @param level The new minimum log level
	 * @example
	 * // Only show errors and warnings
	 * logger.setLevel(Levels.WARN);
	 */
	setLevel(level: Levels): void {
		this.level = level;
	}
}
