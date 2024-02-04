import Logger from "./logger.js";

const messageInput = document.getElementById('text') as HTMLInputElement;

// Enable all log levels
Logger.level = 6;

document.getElementById('btn-error')?.addEventListener('click', () => {
	Logger.error(messageInput?.value);
});

document.getElementById('btn-warn')?.addEventListener('click', () => {
	Logger.warn(messageInput?.value);
});

document.getElementById('btn-info')?.addEventListener('click', () => {
	Logger.info(messageInput?.value);
});

document.getElementById('btn-http')?.addEventListener('click', () => {
	Logger.http(messageInput?.value);
});

document.getElementById('btn-verbose')?.addEventListener('click', () => {
	Logger.verbose(messageInput?.value);
});

document.getElementById('btn-debug')?.addEventListener('click', () => {
	Logger.debug(messageInput?.value);
});

document.getElementById('btn-silly')?.addEventListener('click', () => {
	Logger.silly(messageInput?.value);
});