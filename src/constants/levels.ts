import { Colors } from "./colors";

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
export enum Levels {
	/**
	 * Error level. Indicates critical issues that require immediate attention.
	 * Use for unrecoverable errors that prevent normal operation.
	 * @example
	 * logger.error("Database connection failed");
	 */
	ERROR,
	/**
	 * Warning level. Indicates potential issues or noteworthy conditions.
	 * Use for recoverable issues that don't prevent normal operation.
	 * @example
	 * logger.warn("High memory usage detected");
	 */
	WARN,
	/**
	 * Audit level. For security-sensitive operations and compliance logging.
	 * Use for tracking authentication, authorization, and sensitive data access.
	 * @example
	 * logger.audit("User permissions changed", { user: "admin", changes: [...] });
	 */
	AUDIT,
	/**
	 * Informational level. Provides general information about the application's state.
	 * Use for normal operational messages that highlight progress.
	 * @example
	 * logger.info("Application started on port 3000");
	 */
	INFO,
	/**
	 * HTTP-related level. Logs HTTP requests and responses.
	 * Use for tracking HTTP API calls and their status.
	 * @example
	 * logger.http("GET /api/users 200 45ms");
	 */
	HTTP,
	/**
	 * Debug level. Provides detailed context for debugging purposes.
	 * Use for extended debugging information during development.
	 * @example
	 * logger.debug("Database query", { query: "...", duration: "120ms" });
	 */
	DEBUG,
	/**
	 * Verbose level. Provides detailed information for in-depth analysis.
	 * Use for detailed operational logs that are typically only needed during debugging.
	 * @example
	 * logger.verbose("Cache update cycle completed", { entries: 1423 });
	 */
	VERBOSE,
	/**
	 * Silly level. Logs very low-level messages.
	 * Use for extremely verbose logging messages.
	 * @example
	 * logger.silly("Iteration 14563 completed");
	 */
	SILLY,
}

/**
 * Mapping of log levels to their corresponding terminal colors.
 *
 * This mapping determines how each log level will be colored when output to the console.
 * The colors are defined using ANSI escape codes from the Colors enum.
 *
 * @default
 * {
 *   [Levels.ERROR]: Colors.RED,
 *   [Levels.WARN]: Colors.BRIGHT_YELLOW,
 *   [Levels.AUDIT]: Colors.MAGENTA,
 *   [Levels.INFO]: Colors.CYAN,
 *   [Levels.HTTP]: Colors.BLUE,
 *   [Levels.DEBUG]: Colors.BLUE,
 *   [Levels.VERBOSE]: Colors.BRIGHT_BLACK,
 *   [Levels.SILLY]: Colors.BRIGHT_BLACK
 * }
 *
 * @example
 * // Change the INFO level color to green
 * LevelColors[Levels.INFO] = Colors.GREEN;
 *
 * @example
 * // Disable colors for DEBUG logs
 * LevelColors[Levels.DEBUG] = Colors.RESET;
 */
export const LevelColors: Record<Levels, Colors> = {
	[Levels.ERROR]: Colors.RED,
	[Levels.WARN]: Colors.BRIGHT_YELLOW,
	[Levels.AUDIT]: Colors.MAGENTA,
	[Levels.INFO]: Colors.CYAN,
	[Levels.HTTP]: Colors.BLUE,
	[Levels.DEBUG]: Colors.BLUE,
	[Levels.VERBOSE]: Colors.BRIGHT_BLACK,
	[Levels.SILLY]: Colors.BRIGHT_BLACK,
};
