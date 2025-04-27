# @rabbit-company/logger 🐇📝

[![NPM Version](https://img.shields.io/npm/v/@rabbit-company/logger)](https://www.npmjs.com/package/@rabbit-company/logger)
[![JSR Version](https://jsr.io/badges/@rabbit-company/logger)](https://jsr.io/@rabbit-company/logger)
[![License](https://img.shields.io/npm/l/@rabbit-company/logger)](LICENSE)

A versatile, multi-transport logging library for Node.js and browser environments with support for:

- Console output (with colors and custom formatting)
- NDJSON (Newline Delimited JSON)
- Grafana Loki (with batching and label management)

## Features ✨

- **Multiple log levels**: ERROR, WARN, AUDIT, INFO, HTTP, DEBUG, VERBOSE, SILLY
- **Structured logging**: Attach metadata objects to log entries
- **Transport system**: Console, NDJSON, and Loki transports included
- **Loki optimized**: Automatic label management and batching
- **TypeScript ready**: Full type definitions included
- **Cross-platform**: Works in Node.js, Deno, Bun and browsers

## Installation 📦

```bash
# npm
npm install @rabbit-company/logger

# yarn
yarn add @rabbit-company/logger

# pnpm
pnpm add @rabbit-company/logger
```

## Basic Usage 🚀

```js
import { Logger, Levels } from "@rabbit-company/logger";

// Create logger with default console transport
const logger = new Logger({ level: Levels.DEBUG });

// Log messages with metadata
logger.info("Application started", { version: "1.0.0" });
logger.error("Database connection failed", {
	error: "Connection timeout",
	attempt: 3,
});
```

## Console Formatting 🖥️

The console transport supports extensive datetime formatting:

### Available Placeholders

#### UTC Formats:

- `{iso}`: Full ISO-8601 (2023-11-15T14:30:45.123Z)
- `{datetime}`: Simplified (2023-11-15 14:30:45)
- `{date}`: Date only (2023-11-15)
- `{time}`: Time only (14:30:45)
- `{utc}`: UTC string (Wed, 15 Nov 2023 14:30:45 GMT)
- `{ms}`: Milliseconds since epoch

#### Local Time Formats:

- `{datetime-local}`: Local datetime (2023-11-15 14:30:45)
- `{date-local}`: Local date only (2023-11-15)
- `{time-local}`: Local time only (14:30:45)
- `{full-local}`: Complete local string with timezone

#### Log Content:

- `{type}`: Log level (INFO, ERROR, etc.)
- `{message}`: The log message

```js
import { ConsoleTransport } from "@rabbit-company/logger";

// Custom format examples
new ConsoleTransport("[{datetime-local}] {type} {message}");
new ConsoleTransport("{time} | {type} | {message}", false);
new ConsoleTransport("EPOCH:{ms} {message}");
```

## Transports 🚚

### Console Transport (Default)

```js
import { ConsoleTransport } from "@rabbit-company/logger";

const logger = new Logger({
	transports: [
		new ConsoleTransport(
			"[{time-local}] {type} {message}", // Custom format
			true // Enable colors
		),
	],
});
```

### NDJSON Transport

```js
import { NDJsonTransport } from "@rabbit-company/logger";

const ndjsonTransport = new NDJsonTransport();
const logger = new Logger({
	transports: [ndjsonTransport],
});

// Get accumulated logs
console.log(ndjsonTransport.getData());
```

### Loki Transport

```js
import { LokiTransport } from "@rabbit-company/logger";

const logger = new Logger({
	transports: [
		new LokiTransport({
			url: "http://localhost:3100",
			labels: { app: "my-app", env: "production" },
			basicAuth: { username: "user", password: "pass" },
			maxLabelCount: 30,
		}),
	],
});
```

## API Reference 📚

### Log Levels

```js
enum Levels {
  ERROR,    // Critical errors
  WARN,     // Warnings
  AUDIT,    // Security audits
  INFO,     // Informational
  HTTP,     // HTTP traffic
  DEBUG,    // Debugging
  VERBOSE,  // Detailed tracing
  SILLY     // Very low-level
}
```

### Logging Methods

```js
logger.error(message: string, metadata?: object): void
logger.warn(message: string, metadata?: object): void
logger.audit(message: string, metadata?: object): void
logger.info(message: string, metadata?: object): void
logger.http(message: string, metadata?: object): void
logger.verbose(message: string, metadata?: object): void
logger.debug(message: string, metadata?: object): void
logger.silly(message: string, metadata?: object): void
```

### Types

```ts
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
```

## Advanced Usage 🛠️

### Custom Formatting

```js
new ConsoleTransport(
	"{type} - {date} - {message}", // Custom format
	false // Disable colors
);
```

### Managing Transports

```js
const lokiTransport = new LokiTransport({
	/* config */
});
const logger = new Logger();

// Add transport dynamically
logger.addTransport(lokiTransport);

// Remove transport
logger.removeTransport(lokiTransport);

// Change log level
logger.setLevel(Levels.VERBOSE);
```

## License 📄

This project is licensed under the MIT License - see the [LICENSE](https://github.com/Rabbit-Company/Logger-JS/blob/main/LICENSE) file for details.
