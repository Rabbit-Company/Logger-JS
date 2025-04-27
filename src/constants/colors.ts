/**
 * Enum representing various text colors for terminal output using ANSI escape codes.
 * @readonly
 */
export const enum Colors {
	/** Reset all attributes (color, bold, etc.) to default. */
	RESET = "\x1b[0m",
	/** Apply bold text formatting. */
	BOLD = "\x1b[1m",

	/** Black text color. */
	BLACK = "\x1b[30m",
	/** Red text color. */
	RED = "\x1b[31m",
	/** Green text color. */
	GREEN = "\x1b[32m",
	/** Yellow text color. */
	YELLOW = "\x1b[33m",
	/** Blue text color. */
	BLUE = "\x1b[34m",
	/** Magenta text color. */
	MAGENTA = "\x1b[35m",
	/** Cyan text color. */
	CYAN = "\x1b[36m",
	/** White text color. */
	WHITE = "\x1b[37m",

	/** Bright black (gray) text color. */
	BRIGHT_BLACK = "\x1b[90m",
	/** Bright red text color. */
	BRIGHT_RED = "\x1b[91m",
	/** Bright green text color. */
	BRIGHT_GREEN = "\x1b[92m",
	/** Bright yellow text color. */
	BRIGHT_YELLOW = "\x1b[93m",
	/** Bright blue text color. */
	BRIGHT_BLUE = "\x1b[94m",
	/** Bright magenta text color. */
	BRIGHT_MAGENTA = "\x1b[95m",
	/** Bright cyan text color. */
	BRIGHT_CYAN = "\x1b[96m",
	/** Bright white text color. */
	BRIGHT_WHITE = "\x1b[97m",
}
