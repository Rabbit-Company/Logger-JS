# @rabbit-company/logger 🐇📝

[![NPM Version](https://img.shields.io/npm/v/@rabbit-company/logger)](https://www.npmjs.com/package/@rabbit-company/logger)
[![JSR Version](https://jsr.io/badges/@rabbit-company/logger)](https://jsr.io/@rabbit-company/logger)
[![License](https://img.shields.io/npm/l/@rabbit-company/logger)](LICENSE)

A high-performance, multi-transport logging library for Node.js and browser environments with first-class TypeScript support.

## Features ✨

- **Multi-level logging**: 8 severity levels from ERROR to SILLY
- **Structured logging**: Attach rich metadata to log entries
- **Multiple transports**: Console, NDJSON, and Grafana Loki
- **Advanced formatting**: Customizable console output with extensive datetime options
- **Production-ready**: Batching, retries, and queue management for Loki
- **Cross-platform**: Works in Node.js, Deno, Bun and modern browsers
- **Type-safe**: Full TypeScript definitions included

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
const logger = new Logger({
	level: Levels.DEBUG, // Show DEBUG and above
});

// Simple log
logger.info("Application starting...");

// Structured logging
logger.error("Database connection failed", {
	error: "Connection timeout",
	attempt: 3,
	db: "primary",
});

// Audit logging
logger.audit("User login", {
	userId: "usr_123",
	ip: "192.168.1.100",
});
```

## Log Levels 📊

| Level   | Description                     | Typical Use Case                      |
| ------- | ------------------------------- | ------------------------------------- |
| ERROR   | Critical errors                 | System failures, unhandled exceptions |
| WARN    | Potential issues                | Deprecations, rate limiting           |
| AUDIT   | Security events                 | Logins, permission changes            |
| INFO    | Important runtime information   | Service starts, config changes        |
| HTTP    | HTTP traffic                    | Request/response logging              |
| DEBUG   | Debug information               | Flow tracing, variable dumps          |
| VERBOSE | Very detailed information       | Data transformations                  |
| SILLY   | Extremely low-level information | Inner loop logging                    |

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

### Loki Transport (Grafana)

```js
import { LokiTransport } from "@rabbit-company/logger";

const lokiTransport = new LokiTransport({
	url: "http://localhost:3100",
	labels: {
		app: "test",
		env: process.env.NODE_ENV,
	},
	basicAuth: {
		username: process.env.LOKI_USER,
		password: process.env.LOKI_PASS,
	},
	batchSize: 50, // Send batches of 50 logs
	batchTimeout: 5000, // Max 5s wait per batch
	maxQueueSize: 10000, // Keep max 10,000 logs in memory
	debug: true, // Log transport errors
});

const logger = new Logger({
	transports: [lokiTransport],
});
```

## API Reference 📚

Full API documentation is available in the [TypeScript definitions](https://github.com/Rabbit-Company/Logger-JS/blob/main/src/types.ts).

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
