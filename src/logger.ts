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
	 * Logs an error message
	 * @param message The error message
	 * @param metadata Optional metadata object
	 */
	error(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.ERROR, metadata));
	}

	/**
	 * Logs a warning message
	 * @param message The warning message
	 * @param metadata Optional metadata object
	 */
	warn(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.WARN, metadata));
	}

	/**
	 * Logs an informational message
	 * @param message The info message
	 * @param metadata Optional metadata object
	 */
	info(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.INFO, metadata));
	}

	/**
	 * Logs an HTTP-related message
	 * @param message The HTTP message
	 * @param metadata Optional metadata object
	 */
	http(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.HTTP, metadata));
	}

	/**
	 * Logs a verbose message
	 * @param message The verbose message
	 * @param metadata Optional metadata object
	 */
	verbose(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.VERBOSE, metadata));
	}

	/**
	 * Logs a debug message
	 * @param message The debug message
	 * @param metadata Optional metadata object
	 */
	debug(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.DEBUG, metadata));
	}

	/**
	 * Logs a silly message (lowest level)
	 * @param message The silly message
	 * @param metadata Optional metadata object
	 */
	silly(message: string, metadata?: Record<string, any>): void {
		this.processEntry(this.createLogEntry(message, Levels.SILLY, metadata));
	}

	/**
	 * Adds a new transport to the logger
	 * @param transport The transport to add
	 */
	addTransport(transport: Transport): void {
		this.transports.push(transport);
	}

	/**
	 * Removes a transport from the logger
	 * @param transport The transport to remove
	 */
	removeTransport(transport: Transport): void {
		this.transports = this.transports.filter((t) => t !== transport);
	}

	/**
	 * Sets the minimum log level
	 * @param level The new minimum log level
	 */
	setLevel(level: Levels): void {
		this.level = level;
	}
}
