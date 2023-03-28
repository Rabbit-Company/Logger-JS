import Logger from "./logger.js";

// Enable all log levels
Logger.level = 6;

document.getElementById('btn-error').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.error(message);
});

document.getElementById('btn-warn').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.warn(message);
});

document.getElementById('btn-info').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.info(message);
});

document.getElementById('btn-http').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.http(message);
});

document.getElementById('btn-verbose').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.verbose(message);
});

document.getElementById('btn-debug').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.debug(message);
});

document.getElementById('btn-silly').addEventListener('click', () => {
	let message = document.getElementById('text').value;
	Logger.silly(message);
});