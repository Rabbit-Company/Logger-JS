# Logger-JS

`Logger-JS` is a lightweight logging utility for JavaScript (ES6) that provides various logging levels and supports NDJson formatting for structured logging.

## Table of Contents

1. [Installation](#installation)
2. [Importing the Library](#importing-the-library)
3. [Configuration](#configuration)
4. [Logging Messages](#logging-messages)
5. [NDJson Logging](#ndjson-logging)
6. [Customization](#customization)

## Installation

To install `Logger-JS`, use npm to add it to your project:

```bash
npm i --save @rabbit-company/logger
```

## Importing the Library

After installation, you can import the `Logger` into your JavaScript file:

```js
import Logger from "@rabbit-company/logger";
```

## Configuration

Configure the logger to suit your needs. You can set the log level to control which types of messages are logged:

```js
// Set the log level to SILLY to enable all levels of logging
Logger.level = Logger.Levels.SILLY;

// Enable or disable colored output
Logger.colors = true; // Set to false to disable colors

// Enable or disable NDJson logging
Logger.NDJson = false; // Set to true to enable NDJson logging
```

## Logging Messages

Use the provided methods to log messages at different levels of severity:

```js
// Log an error message
Logger.error("This is an error message.");

// Log a warning message
Logger.warn("This is a warning message.");

// Log an informational message
Logger.info("This is an informational message.");

// Log an HTTP-related message
Logger.http("This is an HTTP-related message.");

// Log a verbose message
Logger.verbose("This is a verbose message.");

// Log a debug message
Logger.debug("This is a debug message.");

// Log a silly message
Logger.silly("This is a silly message.");
```

## NDJson Logging

When NDJson logging is enabled, log messages are formatted as newline-delimited JSON. You can retrieve the NDJson formatted log using:

```js
// Enable NDJson logging
Logger.NDJson = true;

// Retrieve NDJson log data
const ndjsonLog = Logger.getNDJson();
console.log(ndjsonLog);

// Clear NDJson log data
Logger.resetNDJson();
```

## Customization

### 1. Customizing Log Colors

You can customize the colors associated with different logging levels by modifying the `LevelColors` mapping:

```js
// Change colors for different log levels
Logger.LevelColors[Logger.Levels.ERROR] = Logger.Colors.BRIGHT_RED;
Logger.LevelColors[Logger.Levels.INFO] = Logger.Colors.GREEN;
```

### 2. Customizing Log Message Format

You can also customize the format of the log messages by setting the `Logger.format` string. This format string can include the following placeholders:

- `{date}`: Inserts the current timestamp.
- `{type}`: Inserts the log level type (e.g., ERROR, INFO).
- `{message}`: Inserts the actual log message.

Example of customizing the log format:

```js
// Set a custom log message format
Logger.format = "[{date}] - {type}: {message}";
```
