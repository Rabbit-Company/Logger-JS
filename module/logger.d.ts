/**
 * Namespace for logging utility functions and configurations.
 */
declare namespace Logger {
	/**
	 * Enum representing various text colors for terminal output using ANSI escape codes.
	 * @readonly
	 */
	const enum Colors {
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
	 * This enumeration defines different levels of logging severity, which can be used to control the verbosity of log
	 * output. Each level represents a different degree of importance or detail, allowing for granular control over which
	 * messages are logged based on their severity.
	 *
	 * **Logging Levels**:
	 * - `ERROR`: Represents error messages that indicate significant issues that need immediate attention.
	 * - `WARN`: Represents warning messages that indicate potential issues or noteworthy conditions that are not critical.
	 * - `INFO`: Represents informational messages that provide general information about the application's operation.
	 * - `HTTP`: Represents log messages related to HTTP requests and responses, useful for monitoring web traffic.
	 * - `VERBOSE`: Represents detailed messages that include extensive information, typically used for in-depth debugging.
	 * - `DEBUG`: Represents debugging messages that provide detailed context for troubleshooting and debugging purposes.
	 * - `SILLY`: Represents very low-level messages used for detailed internal state logging or humorous messages.
	 *
	 * Each level corresponds to a specific degree of logging detail, allowing users to filter out less important messages
	 * based on their needs.
	 *
	 * @readonly
	 * @enum {number}
	 */
	enum Levels {
		/** Error level. Indicates critical issues that require immediate attention. */
		ERROR = 0,
		/** Warning level. Indicates potential issues or noteworthy conditions. */
		WARN = 1,
		/** Informational level. Provides general information about the application's state. */
		INFO = 2,
		/** HTTP-related level. Logs HTTP requests and responses. */
		HTTP = 3,
		/** Verbose level. Provides detailed information for in-depth analysis. */
		VERBOSE = 4,
		/** Debug level. Provides detailed context for debugging purposes. */
		DEBUG = 5,
		/** Silly level. Logs very low-level or whimsical messages. */
		SILLY = 6
	}
	/**
	 * Maps logging levels to their corresponding colors.
	 * Each level is associated with a specific color to visually distinguish log messages based on their severity.
	 * This mapping allows for customization of log message appearance in the terminal by changing the color for each log level.
	 *
	 * Example:
	 * To change the color of the `ERROR` log level to bright red and the `INFO` log level to bright green, you can modify the `LevelColors` object like this:
	 *
	 * ```typescript
	 * LevelColors[Levels.ERROR] = Colors.BRIGHT_RED; // Change ERROR level color to bright red
	 * LevelColors[Levels.INFO] = Colors.BRIGHT_GREEN; // Change INFO level color to bright green
	 * ```
	 *
	 * The above example will result in `ERROR` messages being displayed in bright red and `INFO` messages in bright green in the terminal.
	 *
	 * @type {Record<Levels, Colors>}
	 */
	let LevelColors: Record<Levels, Colors>;
	/**
	 * Indicates whether NDJson (Newline Delimited JSON) format is enabled for logging.
	 *
	 * When `NDJson` is set to `true`, log messages will be formatted as NDJson and stored internally. This enables you to retrieve
	 * the logs in NDJson format using the `getNDJson()` function. The console output will remain in the standard log format regardless
	 * of this setting. NDJson format is useful for structured logging and integration with log management systems that process JSON data.
	 *
	 * When `NDJson` is set to `false`, NDJson formatting is not applied, and no NDJson formatted logs will be stored.
	 * The console output will still follow the configured format.
	 *
	 * Example:
	 * To enable NDJson logging and store log messages in NDJson format:
	 *
	 * ```typescript
	 * Logger.NDJson = true;
	 * ```
	 *
	 * To retrieve NDJson formatted logs:
	 *
	 * ```typescript
	 * const ndjsonLogs = Logger.getNDJson();
	 * ```
	 *
	 * To disable NDJson logging:
	 *
	 * ```typescript
	 * Logger.NDJson = false;
	 * ```
	 *
	 * @type {boolean}
	 * @default false
	 */
	let NDJson: boolean;
	/**
	 * Represents the current logging level that filters which messages are logged.
	 *
	 * Log messages with a level equal to or lower than this value will be output. Messages with a level higher than this value will be ignored.
	 * This property allows you to control the verbosity of the logs, ensuring that only relevant log messages are captured based on the set threshold.
	 *
	 * Example:
	 * To set the logging level to `SILLY`, which will log messages at all levels including `SILLY`, `DEBUG`, `VERBOSE`, `HTTP`, `INFO`, `WARN`, and `ERROR`, use:
	 *
	 * ```typescript
	 * Logger.level = Levels.SILLY;
	 * ```
	 *
	 * Setting the level to `INFO` will exclude `SILLY`,`DEBUG`, `VERBOSE` and `HTTP` messages and only show `INFO`, `WARN`, and `ERROR` messages:
	 *
	 * ```typescript
	 * Logger.level = Levels.INFO;
	 * ```
	 *
	 * @type {Levels}
	 * @default Levels.INFO
	 */
	let level: Levels;
	/**
	 * Determines if colored output is enabled for log messages.
	 *
	 * When set to `true`, log messages will be displayed with color coding to enhance readability and visually distinguish
	 * different types of log entries. This is particularly useful in environments where color support is available, such as
	 * modern terminals or command-line interfaces.
	 *
	 * When set to `false`, log messages will be output in plain text without any color formatting. This setting might be
	 * preferred in environments that do not support color, or where color output is not desired.
	 *
	 * Example:
	 * To enable colored log messages:
	 *
	 * ```typescript
	 * Logger.colors = true;
	 * ```
	 *
	 * To disable colored log messages:
	 *
	 * ```typescript
	 * Logger.colors = false;
	 * ```
	 *
	 * @type {boolean}
	 * @default true
	 */
	let colors: boolean;
	/**
	 * The format string used to customize the output of log messages.
	 *
	 * This format string supports placeholders that are replaced with actual log message data:
	 * - `{date}`: Replaced with the current timestamp of the log message.
	 * - `{type}`: Replaced with the log level type (e.g., ERROR, INFO).
	 * - `{message}`: Replaced with the log message content.
	 *
	 * Example usage:
	 *
	 * ```js
	 * // Customizing the log message format
	 * Logger.format = "[{date}] - {type}: {message}";
	 *
	 * // Log a message using the custom format
	 * Logger.info("This is an informational message.");
	 * ```
	 *
	 * The default format is `"[{date}] {type} {message}"`.
	 *
	 * @type {string}
	 */
	let format: string;
	/**
	 * Converts a log message to a string format.
	 *
	 * This function ensures that the log message is always returned as a string. If the provided message is an object, it
	 * will be converted to a JSON string representation using `JSON.stringify`. If the message is `undefined`, the function
	 * will return `null` to indicate the absence of a message. For all other types of input (e.g., strings, numbers), the
	 * function will return the message as-is.
	 *
	 * This conversion is useful for ensuring that log messages are consistently formatted, especially when handling
	 * different types of data in logging scenarios.
	 *
	 * @param {any} message - The log message to convert. This can be of any type, including strings, numbers, or objects.
	 *
	 * @returns {string | null} - The converted log message as a string. Returns `null` if the message is `undefined`. If
	 *                             the message is an object, it will be returned as a JSON string.
	 *
	 * @example
	 * // Convert a string message
	 * const result1 = Logger.parseMessage("An error occurred.");
	 * // result1 is "An error occurred."
	 *
	 * // Convert a number message
	 * const result2 = Logger.parseMessage(404);
	 * // result2 is "404"
	 *
	 * // Convert an object message
	 * const result3 = Logger.parseMessage({ error: "Not Found", code: 404 });
	 * // result3 is '{"error":"Not Found","code":404}'
	 *
	 * // Handle an undefined message
	 * const result4 = Logger.parseMessage(undefined);
	 * // result4 is null
	 */
	function parseMessage(message: any): string | null;
	/**
	 * Formats a log message with a timestamp, log level, and optional color styling.
	 *
	 * This function creates a formatted string for logging purposes. It includes a timestamp representing when the log
	 * entry was created, the log level indicating the severity of the message, and the actual log message. Depending on
	 * whether colored output is enabled, it applies color codes to the timestamp, log level, and message to improve visibility
	 * and distinction.
	 *
	 * **Formatting Process**:
	 * 1. **Timestamp**: The current date and time is formatted to a readable string in `YYYY-MM-DD HH:MM:SS` format.
	 * 2. **Log Level**: The log level is converted to its string representation using the `Levels` enum and, if color
	 *    styling is enabled, is styled according to the `LevelColors` mapping.
	 * 3. **Message**: The actual log message is optionally colored based on the log level.
	 * 4. **Color Application**: If color output is enabled, ANSI escape codes are applied to the timestamp, log level, and
	 *    message.
	 *
	 * @param {string} message - The log message to format. This is the actual content of the log entry and will be included
	 *                           in the final formatted string. It should be a string type.
	 *
	 * @param {Levels} logLevel - The log level associated with the message. This determines how the log message is categorized
	 *                             (e.g., ERROR, INFO) and influences the formatting applied to the log level part of the output.
	 *
	 * @returns {string} - The formatted log message as a string. This includes the timestamp, log level, and message,
	 *                      with optional color styling based on the `colors` setting.
	 *
	 * @example
	 * // Format an error message with color styling
	 * const formattedError = Logger.formatMessage("An unexpected error occurred.", Levels.ERROR);
	 * // Output: [2024-08-11 12:34:56] <colored error level> An unexpected error occurred.
	 *
	 * // Format an informational message without color styling
	 * Logger.colors = false; // Disable color output
	 * const formattedInfo = Logger.formatMessage("System startup complete.", Levels.INFO);
	 * // Output: [2024-08-11 12:34:56] INFO System startup complete.
	 */
	function formatMessage(message: string, logLevel: Levels): string;
	/**
	 * Logs an error message at the `ERROR` log level.
	 *
	 * This function formats and logs a message with a severity level of `ERROR`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `ERROR`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log an error message
	 * Logger.error("An unexpected error occurred while processing the request.");
	 *
	 * // Log an error message with additional details
	 * Logger.error({ error: "Network failure", code: 500 });
	 */
	function error(message: any): void;
	/**
	 * Logs a warning message at the `WARN` log level.
	 *
	 * This function formats and logs a message with a severity level of `WARN`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `WARN`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log a warning message
	 * Logger.warn("Configuration might be missing some required settings.");
	 *
	 * // Log a warning message with additional details
	 * Logger.warn({ warning: "Disk space is running low", details: { freeSpace: "10MB" } });
	 */
	function warn(message: any): void;
	/**
	 * Logs an informational message at the `INFO` log level.
	 *
	 * This function formats and logs a message with a severity level of `INFO`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `INFO`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log an informational message
	 * Logger.info("System startup completed successfully.");
	 *
	 * // Log an informational message with additional details
	 * Logger.info({ event: "UserLogin", user: "john.doe@example.com", status: "success" });
	 */
	function info(message: any): void;
	/**
	 * Logs HTTP-related message at the `HTTP` log level.
	 *
	 * This function formats and logs a message with a severity level of `HTTP`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `HTTP`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log HTTP-related message
	 * Logger.http("Received GET request to /api/resource.");
	 *
	 * // Log HTTP-related message with additional details
	 * Logger.http({ method: "POST", endpoint: "/api/resource", status: 200, responseTime: "150ms" });
	 */
	function http(message: any): void;
	/**
	 * Logs a verbose message at the `VERBOSE` log level.
	 *
	 * This function formats and logs a message with a severity level of `VERBOSE`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `VERBOSE`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log a verbose message
	 * Logger.verbose("Detailed system status: All services are running optimally.");
	 *
	 * // Log a verbose message with additional details
	 * Logger.verbose({ module: "Database", action: "query", details: "Fetching records from users table" });
	 */
	function verbose(message: any): void;
	/**
	 * Logs a debug message at the `DEBUG` log level.
	 *
	 * This function formats and logs a message with a severity level of `DEBUG`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `DEBUG`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log a debug message
	 * Logger.debug("Debugging internal state: variable x = 42, variable y = 'test'");
	 *
	 * // Log a debug message with additional details
	 * Logger.debug({ context: "Initialization", details: "Loading configuration files" });
	 */
	function debug(message: any): void;
	/**
	 * Logs a silly message at the `SILLY` log level.
	 *
	 * This function formats and logs a message with a severity level of `SILLY`. It processes the provided message,
	 * ensuring it is in the correct format, and then outputs it to the console with appropriate styling if colors are enabled.
	 * Additionally, if NDJson logging is enabled, the message is appended to the NDJson formatted log data.
	 *
	 * If the current log level is set to a level lower than `SILLY`, the message will not be logged. This function also
	 * supports various message types, converting non-string messages to a string representation before logging.
	 *
	 * @param {any} message - The message to log. Can be a string or any other type. If the message is not a string, it will
	 *                        be converted to a string using `JSON.stringify` for structured logging.
	 *
	 * @returns {void} - This function does not return a value. It directly performs logging and modifies internal log data
	 *                    if NDJson logging is enabled.
	 *
	 * @example
	 * // Log a silly message
	 * Logger.silly("This is a silly log message, meant for fun and not serious debugging.");
	 *
	 * // Log a silly message with additional details
	 * Logger.silly({ reason: "Unexpected behavior", details: "Just a whimsical message" });
	 */
	function silly(message: any): void;
	/**
	 * Appends a log message to the NDJson (Newline Delimited JSON) formatted log.
	 *
	 * NDJson is a format where each log entry is a separate JSON object, and each object is separated by a newline character.
	 * This format is particularly useful for structured logging, log aggregation, and processing in systems that require
	 * newline-delimited JSON entries. This function adds a new log entry with the current timestamp, the specified log level,
	 * and the provided message to the NDJson formatted log data.
	 *
	 * If NDJson logging is not enabled, or if no log entries have been recorded yet, this function will still format the log
	 * entry correctly and append it to the internal storage.
	 *
	 * @param {string} message - The log message to append. This should be a string that represents the content of the log entry.
	 * @param {number} logLevel - The log level associated with the message. This should correspond to one of the predefined
	 *                             log levels, which indicate the severity or type of the log entry.
	 *
	 * @returns {void} - This function does not return a value. It modifies the internal NDJson data directly.
	 *
	 * @example
	 * // Append an error log message to the NDJson formatted log
	 * Logger.putNDJson("An error occurred while processing the request.", Levels.ERROR);
	 *
	 * // Append an informational log message
	 * Logger.putNDJson("User login successful.", Levels.INFO);
	 */
	function putNDJson(message: string, logLevel: number): void;
	/**
	 * Retrieves the log data in NDJson (Newline Delimited JSON) format.
	 *
	 * This function returns a string containing all log entries that have been stored in NDJson format. NDJson format is
	 * useful for structured logging and is commonly used for log aggregation and processing systems. Each log entry is
	 * represented as a separate JSON object, making it easy to parse and analyze logs.
	 *
	 * If NDJson logging is not enabled or no logs have been recorded, this function will return an empty string.
	 *
	 * Example:
	 * To get the NDJson formatted logs:
	 *
	 * ```typescript
	 * const ndjsonLogs = Logger.getNDJson();
	 * console.log(ndjsonLogs);
	 * ```
	 *
	 * @returns {string} - A string containing the NDJson formatted log data. If no logs are available, returns an empty string.
	 */
	function getNDJson(): string;
	/**
	 * Resets the NDJson log data.
	 *
	 * This function clears the internal storage of NDJson formatted logs by setting `NDJsonData` to an empty string.
	 * It effectively erases all previously logged NDJson entries, which might be useful for starting a new logging session
	 * or clearing out old logs before logging new data.
	 *
	 * Example usage:
	 * ```typescript
	 * Logger.resetNDJson(); // Clears the NDJson log data
	 * ```
	 *
	 * Note: This action is irreversible, and any log data previously accumulated in NDJson format will be lost.
	 */
	function resetNDJson(): void;
}

export {
	Logger as default,
};

export {};
