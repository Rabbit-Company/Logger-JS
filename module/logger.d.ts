/**
 * Represents a logger utility for logging messages with different log levels.
*/
export default class Logger {
	private static NDJsonData;
	/**
	 * Indicates whether NDJson is enabled.
	 * @type {boolean}
	*/
	static NDJson: boolean;
	/**
	 * The log level of the logger.
	 * @type {number}
	*/
	static level: number;
	/**
	 * Indicates whether colors are enabled for log messages.
	 * @type {boolean}
	*/
	static colors: boolean;
	/**
	 * Defines log levels and their associated numeric values.
	 * @type {Record<string, number>}
	*/
	static readonly levels: Record<string, number>;
	private static readonly levelsRev;
	/**
	 * Parses the log message to ensure it is a string.
	 * @param {*} message - The log message.
	 * @returns {string | null} - The parsed log message or null if the message is undefined.
	*/
	static parseMessage(message: any): string | null;
	/**
	 * Formats the log message with timestamp and log level.
	 * @param {string} message - The log message.
	 * @param {number} logLevel - The log level.
	 * @returns {string} - The formatted log message.
	*/
	static formatMessage(message: string, logLevel: number): string;
	/**
	 * Processes and logs a message with the specified log level.
	 * @param {*} message - The log message.
	 * @param {number} logLevel - The log level.
	*/
	private static processMessage;
	/**
	 * Logs an error message.
	 * @param {*} message - The error message.
	*/
	static error(message: any): void;
	/**
	 * Logs a warning message.
	 * @param {*} message - The warning message.
	*/
	static warn(message: any): void;
	/**
	 * Logs an informational message.
	 * @param {*} message - The informational message.
	*/
	static info(message: any): void;
	/**
	 * Logs an HTTP-related message.
	 * @param {*} message - The HTTP-related message.
	*/
	static http(message: any): void;
	/**
	 * Logs a verbose message.
	 * @param {*} message - The verbose message.
	*/
	static verbose(message: any): void;
	/**
	 * Logs a debug message.
	 * @param {*} message - The debug message.
	*/
	static debug(message: any): void;
	/**
	 * Logs a silly message.
	 * @param {*} message - The silly message.
	*/
	static silly(message: any): void;
	/**
	 * Appends a message to NDJson format.
	 * @param {string} message - The message to append.
	 * @param {number} logLevel - The log level associated with the message.
	*/
	static putNDJson(message: string, logLevel: number): void;
	/**
	 * Gets the NDJson log.
	 * @returns {string} - The NDJson log.
	*/
	static getNDJson(): string;
}

export {};
