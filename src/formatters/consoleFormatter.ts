import { LevelColors, Levels } from "../constants/levels";
import { Colors } from "../constants/colors";

/**
 * Formats a log message for console output with optional colorization.
 *
 * @param {string} message - The log message to format
 * @param {Levels} logLevel - The severity level of the message
 * @param {string} format - The format string containing placeholders: {date}, {type}, {message}
 * @param {boolean} colorsEnabled - Whether to apply ANSI color codes to the output
 * @returns {string} The formatted console message
 *
 * @example
 * // Basic usage
 * formatConsoleMessage("Error occurred", Levels.ERROR, "[{date}] {type}: {message}", true);
 *
 * @example
 * // Custom format
 * formatConsoleMessage("User logged in", Levels.INFO, "{type} - {message}", false);
 */
export function formatConsoleMessage(message: string, logLevel: Levels, format: string, colorsEnabled: boolean): string {
	let type: string = Levels[logLevel];
	let date = new Date().toISOString().split(".")[0].replace("T", " ");

	if (colorsEnabled) {
		date = Colors.BRIGHT_BLACK + date + Colors.RESET;
		type = Colors.BOLD + LevelColors[logLevel] + type + Colors.RESET;
		message = LevelColors[logLevel] + message + Colors.RESET;
	}

	return format.replace("{date}", date).replace("{type}", type).replace("{message}", message);
}
