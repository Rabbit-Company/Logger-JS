import { LevelColors, Levels } from "../constants/levels";
import { Colors } from "../constants/colors";

/**
 * Formats a log message for console output with optional colorization and metadata injection.
 * Supports comprehensive datetime formatting in both UTC and local timezones.
 *
 * @param {string} message - The log message content to be formatted.
 * @param {Levels} logLevel - The severity level of the message (affects coloring).
 * @param {Record<string, any>=} metadata - Optional metadata object to embed in the output.
 *   If provided, these placeholders become available:
 *   - `{metadata}`: JSON-serialized metadata (single-line)
 *   - `{metadata-ml}`: Pretty-printed metadata (multi-line, 2-space indented)
 * @param {string} format - The format string supporting these placeholders:
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
 * ### Local Time Formats (append -local)
 * - `{datetime-local}`: Local date and time (YYYY-MM-DD HH:MM:SS)
 * - `{date-local}`: Local date only (YYYY-MM-DD)
 * - `{time-local}`: Local time only (HH:MM:SS)
 * - `{full-local}`: Complete local string with timezone
 *
 * ## Log Content Placeholders
 * - `{type}`: Log level name (e.g., "INFO", "ERROR")
 * - `{message}`: The actual log message content
 *
 * ## Metadata Placeholders
 * - `{metadata}`: JSON-stringified metadata (if provided)
 * - `{metadata-ml}`: Multi-line JSON-formatted metadata (if provided)
 *
 * @param {boolean} colorsEnabled - When true:
 *   - Applies level-appropriate colors to output
 *   - Dates/times are dimmed for better readability
 *   - Log level names are bolded
 *
 * @returns {string} The fully formatted message ready for console output
 *
 * @example <caption>Basic usage with UTC time</caption>
 * formatConsoleMessage("System started", Levels.INFO, undefined,
 *   "[{datetime}] {type}: {message} {metadata}", true);
 *
 * @example <caption>Using metadata</caption>
 * formatConsoleMessage("User login", Levels.INFO, { user: "alice" },
 *   "[{datetime}] {type}: {message} {metadata}", true);
 *
 * @example <caption>Pretty metadata</caption>
 * formatConsoleMessage("Request received", Levels.DEBUG, { id: 123, ip: "127.0.0.1" },
 *   "{metadata-ml}", true);
 *
 * @example <caption>Comparing timezones</caption>
 * formatConsoleMessage("Timezone check", Levels.DEBUG, undefined,
 *   "UTC: {time} | Local: {time-local} | Epoch: {ms}", false);
 */
export function formatConsoleMessage(
	message: string,
	logLevel: Levels,
	metadata: Record<string, any> | undefined,
	format: string,
	colorsEnabled: boolean
): string {
	const now = new Date();
	const type = Levels[logLevel];

	const utcFormats: Record<string, string> = {
		"{iso}": now.toISOString(),
		"{datetime}": now.toISOString().split(".")[0].replace("T", " "),
		"{time}": now.toISOString().split("T")[1].split(".")[0],
		"{date}": now.toISOString().split("T")[0],
		"{utc}": now.toUTCString(),
		"{ms}": now.getTime().toString(),
	};

	const localFormats: Record<string, string> = {
		"{datetime-local}": now.toLocaleString("sv-SE").replace(" ", "T").split(".")[0].replace("T", " "),
		"{time-local}": now.toLocaleTimeString("sv-SE"),
		"{date-local}": now.toLocaleDateString("sv-SE"),
		"{full-local}": now.toString(),
	};

	const metadataFormats: Record<string, string> = {};
	if (metadata) {
		metadataFormats["{metadata}"] = JSON.stringify(metadata);
		metadataFormats["{metadata-ml}"] = JSON.stringify(metadata, null, 2);

		if (colorsEnabled) {
			const color = LevelColors[logLevel];
			const colorize = (text: string) => color + text + Colors.RESET;
			for (const key in metadataFormats) {
				metadataFormats[key] = colorize(metadataFormats[key]);
			}
		}
	} else {
		format = format.replace(/{metadata(-ml)?}/g, "");
	}

	let coloredType = type;
	let coloredMessage = message;

	if (colorsEnabled) {
		const color = LevelColors[logLevel];
		const colorize = (text: string) => Colors.BRIGHT_BLACK + text + Colors.RESET;

		for (const key in utcFormats) {
			utcFormats[key] = colorize(utcFormats[key]);
		}

		for (const key in localFormats) {
			localFormats[key] = colorize(localFormats[key]);
		}

		coloredType = Colors.BOLD + color + type + Colors.RESET;
		coloredMessage = color + message + Colors.RESET;
	}

	let output = format;
	const allFormats = { ...utcFormats, ...localFormats, ...metadataFormats };

	for (const [placeholder, value] of Object.entries(allFormats)) {
		output = output.replace(new RegExp(placeholder, "g"), value);
	}

	return output.replace(/{type}/g, coloredType).replace(/{message}/g, coloredMessage);
}
