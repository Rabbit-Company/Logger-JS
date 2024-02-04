import chalk from 'chalk';

/**
 * Represents a logger utility for logging messages with different log levels.
*/
export default class Logger{

	private static NDJsonData: string = '';

  /**
   * Indicates whether NDJson is enabled.
   * @type {boolean}
  */
	static NDJson: boolean = false;

  /**
   * The log level of the logger.
   * @type {number}
  */
	static level: number = 2;

  /**
   * Indicates whether colors are enabled for log messages.
   * @type {boolean}
  */
	static colors: boolean = true;

  /**
   * Defines log levels and their associated numeric values.
   * @type {Record<string, number>}
  */
	static readonly levels: Record<string, number> = {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		verbose: 4,
		debug: 5,
		silly: 6
	}

	private static readonly levelsRev: Record<number, string> = {
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
	static parseMessage(message: any): string | null{
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
	static formatMessage(message: string, logLevel: number): string{
		let type = this.levelsRev[logLevel];
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
   * @param {number} logLevel - The log level.
  */
	private static processMessage(message: any, logLevel: number): void{
		if(this.level < logLevel) return;
		message = this.parseMessage(message);
		if(message === null) return;
		if(this.NDJson) this.putNDJson(message, logLevel);

		switch(logLevel){
			case 0:
				console.error(this.formatMessage(message, logLevel));
			break;
			case 1:
				console.warn(this.formatMessage(message, logLevel));
			break;
			default:
				console.info(this.formatMessage(message, logLevel));
			break;
		}
	}


  /**
   * Logs an error message.
   * @param {*} message - The error message.
  */
	static error(message: any): void{
		this.processMessage(message, 0);
	}

  /**
   * Logs a warning message.
   * @param {*} message - The warning message.
  */
	static warn(message: any): void{
		this.processMessage(message, 1);
	}

  /**
   * Logs an informational message.
   * @param {*} message - The informational message.
  */
	static info(message: any): void{
		this.processMessage(message, 2);
	}

  /**
   * Logs an HTTP-related message.
   * @param {*} message - The HTTP-related message.
  */
	static http(message: any): void{
		this.processMessage(message, 3);
	}

  /**
   * Logs a verbose message.
   * @param {*} message - The verbose message.
  */
	static verbose(message: any): void{
		this.processMessage(message, 4);
	}

  /**
   * Logs a debug message.
   * @param {*} message - The debug message.
  */
	static debug(message: any): void{
		this.processMessage(message, 5);
	}

  /**
   * Logs a silly message.
   * @param {*} message - The silly message.
  */
	static silly(message: any): void{
		this.processMessage(message, 6);
	}

  /**
   * Appends a message to NDJson format.
   * @param {string} message - The message to append.
   * @param {number} logLevel - The log level associated with the message.
  */
	static putNDJson(message: string, logLevel: number): void{
		let separator = (this.NDJsonData.length !== 0) ? '\n' : '';
		this.NDJsonData += separator + JSON.stringify({ 'time': new Date().toISOString(), 'level': logLevel, 'msg': message });
	}

  /**
   * Gets the NDJson log.
   * @returns {string} - The NDJson log.
  */
	static getNDJson(): string{
		return this.NDJsonData ?? '';
	}

}