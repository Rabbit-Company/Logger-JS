import chalk from 'chalk';

export default class Logger{

	static #NDJson = '';
	static NDJson = false;

	static level = 2;
	static colors = true;

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

	static parseMessage(message){
		if(typeof(message) === 'undefined') return null;
		if(typeof(message) === 'object') message = JSON.stringify(message);
		return message;
	}

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

	static error(message){
		this.#processMessage(message, 0);
	}

	static warn(message){
		this.#processMessage(message, 1);
	}

	static info(message){
		this.#processMessage(message, 2);
	}

	static http(message){
		this.#processMessage(message, 3);
	}

	static verbose(message){
		this.#processMessage(message, 4);
	}

	static debug(message){
		this.#processMessage(message, 5);
	}

	static silly(message){
		this.#processMessage(message, 6);
	}

	static putNDJson(message, logLevel){
		let separator = (this.#NDJson.length !== 0) ? '\n' : '';
		this.#NDJson += separator + JSON.stringify({ 'time': new Date().toISOString(), 'level': logLevel, 'msg': message });
	}

	static getNDJson(){
		return this.#NDJson;
	}

}