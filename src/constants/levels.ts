import { Colors } from "./colors";

/**
 * Enum representing the various logging levels for filtering log messages.
 *
 * The levels are ordered from most important (ERROR) to least important (SILLY).
 * When setting a log level, only messages of that level or higher will be emitted.
 */
export enum Levels {
	/**
	 * Error level. Indicates critical issues that require immediate attention.
	 * Use for unrecoverable errors that prevent normal operation.
	 */
	ERROR,
	/**
	 * Warning level. Indicates potential issues or noteworthy conditions.
	 * Use for recoverable issues that don't prevent normal operation.
	 */
	WARN,
	/**
	 * Informational level. Provides general information about the application's state.
	 * Use for normal operational messages that highlight progress.
	 */
	INFO,
	/**
	 * HTTP-related level. Logs HTTP requests and responses.
	 * Use for tracking HTTP API calls and their status.
	 */
	HTTP,
	/**
	 * Verbose level. Provides detailed information for in-depth analysis.
	 * Use for detailed operational logs that are typically only needed during debugging.
	 */
	VERBOSE,
	/**
	 * Debug level. Provides detailed context for debugging purposes.
	 * Use for extended debugging information during development.
	 */
	DEBUG,
	/**
	 * Silly level. Logs very low-level messages.
	 * Use for extremely verbose logging messages.
	 */
	SILLY,
}

/**
 * Mapping of log levels to their corresponding terminal colors.
 *
 * This mapping determines how each log level will be colored when output to the console.
 * The colors are defined using ANSI escape codes from the Colors enum.
 *
 * @example
 * // Change the INFO level color to green
 * LevelColors[Levels.INFO] = Colors.GREEN;
 */
export const LevelColors: Record<Levels, Colors> = {
	[Levels.ERROR]: Colors.RED,
	[Levels.WARN]: Colors.BRIGHT_YELLOW,
	[Levels.INFO]: Colors.CYAN,
	[Levels.HTTP]: Colors.BLUE,
	[Levels.VERBOSE]: Colors.BLUE,
	[Levels.DEBUG]: Colors.BRIGHT_BLACK,
	[Levels.SILLY]: Colors.BRIGHT_BLACK,
};
