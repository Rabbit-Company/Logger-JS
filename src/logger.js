import chalk from 'chalk';

/**
 * Represents a logger utility for logging messages with different log levels.
 */
export default class Logger{

	static #NDJson = '';

  /**
   * Indicates whether NDJson is enabled.
   * @type {boolean}
   */
	static NDJson = false;

  /**
   * The log level of the logger.
   * @type {number}
   */
	static level = 2;

  /**
   * Indicates whether colors are enabled for log messages.
   * @type {boolean}
   */
	static colors = true;

  /**
   * Defines log levels and their associated numeric values.
   * @type {Object}
   */
	static levels = {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		verbose: 4,
		debug: 5,
		silly: 6
	}

	static #levels = {
		0: 'ERROR',
		1: 'WARN',
		2: 'INFO',
		3: 'HTTP',
		4: 'VERBOSE',
		5: 'DEBUG',
		6: 'SILLY'
	}

  /**
   * Parses the log message to ensure it is a string.
   * @param {*} message - The log message.
   * @returns {string | null} - The parsed log message or null if the message is undefined.
   */
	static parseMessage(message){
		if(typeof(message) === 'undefined') return null;
		if(typeof(message) === 'object') message = JSON.stringify(message);
		return message;
	}

  /**
   * Formats the log message with timestamp and log level.
   * @param {string} message - The log message.
   * @param {number} logLevel - The log level.
   * @returns {string} - The formatted log message.
   */
	static formatMessage(message, logLevel){
		let type = this.#levels[logLevel];
		let date = new Date().toISOString().split('.')[0].replace('T', ' ');

		if(this.colors){
			date = chalk.gray(date);

			switch(logLevel){
				case 0:
					type = chalk.bold(chalk.red(type));
					message = chalk.red(message);
				break;
				case 1:
					type = chalk.bold(chalk.yellow(type));
					message = chalk.yellow(message);
				break;
				case 2:
					type = chalk.bold(chalk.cyan(type));
					message = chalk.cyan(message);
				break;
				case 3:
					type = chalk.bold(chalk.blue(type));
					message = chalk.blue(message);
				break;
				case 4:
					type = chalk.bold(chalk.blue(type));
					message = chalk.blue(message);
				break;
				case 5:
					type = chalk.bold(chalk.gray(type));
					message = chalk.gray(message);
				break;
				case 6:
					type = chalk.bold(chalk.gray(type));
					message = chalk.gray(message);
				break;
			}
		}

		return `[${date}] ${type} ${message}`;
	}

  /**
   * Processes and logs a message with the specified log level.
   * @param {*} message - The log message.
   * @param {number} level - The log level.
   */
	static #processMessage(message, level){
		if(this.level < level) return;
		message = this.parseMessage(message);
		if(message === null) return;
		if(this.NDJson) this.putNDJson(message, level);

		switch(level){
			case 0:
				console.error(this.formatMessage(message, level));
			break;
			case 1:
				console.warn(this.formatMessage(message, level));
			break;
			default:
				console.info(this.formatMessage(message, level));
			break;
		}
	}


  /**
   * Logs an error message.
   * @param {*} message - The error message.
   */
	static error(message){
		this.#processMessage(message, 0);
	}

  /**
   * Logs a warning message.
   * @param {*} message - The warning message.
   */
	static warn(message){
		this.#processMessage(message, 1);
	}

  /**
   * Logs an informational message.
   * @param {*} message - The informational message.
   */
	static info(message){
		this.#processMessage(message, 2);
	}

  /**
   * Logs an HTTP-related message.
   * @param {*} message - The HTTP-related message.
   */
	static http(message){
		this.#processMessage(message, 3);
	}

  /**
   * Logs a verbose message.
   * @param {*} message - The verbose message.
   */
	static verbose(message){
		this.#processMessage(message, 4);
	}

  /**
   * Logs a debug message.
   * @param {*} message - The debug message.
   */
	static debug(message){
		this.#processMessage(message, 5);
	}

  /**
   * Logs a silly message.
   * @param {*} message - The silly message.
   */
	static silly(message){
		this.#processMessage(message, 6);
	}

  /**
   * Appends a message to NDJson format.
   * @param {string} message - The message to append.
   * @param {number} logLevel - The log level associated with the message.
   */
	static putNDJson(message, logLevel){
		let separator = (this.#NDJson.length !== 0) ? '\n' : '';
		this.#NDJson += separator + JSON.stringify({ 'time': new Date().toISOString(), 'level': logLevel, 'msg': message });
	}

  /**
   * Gets the NDJson log.
   * @returns {string} - The NDJson log.
   */
	static getNDJson(){
		return this.#NDJson;
	}

}