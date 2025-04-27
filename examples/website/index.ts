import { ConsoleTransport, Levels, Logger, NDJsonTransport } from "../../src/index.js";

// Create transports
const consoleTransport = new ConsoleTransport();
const ndjsonTransport = new NDJsonTransport();

// Create logger
const logger: Logger = new Logger({
	level: Levels.SILLY,
	transports: [consoleTransport, ndjsonTransport],
});

const messageInput = document.getElementById("text") as HTMLInputElement;
const NDJsonOutput = document.getElementById("NDJson");

document.getElementById("btn-error")?.addEventListener("click", () => {
	logger.error(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-warn")?.addEventListener("click", () => {
	logger.warn(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-info")?.addEventListener("click", () => {
	logger.info(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-http")?.addEventListener("click", () => {
	logger.http(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-verbose")?.addEventListener("click", () => {
	logger.verbose(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-debug")?.addEventListener("click", () => {
	logger.debug(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("btn-silly")?.addEventListener("click", () => {
	logger.silly(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});

document.getElementById("reset-NDJson")?.addEventListener("click", () => {
	ndjsonTransport.reset();
	if (NDJsonOutput) NDJsonOutput.innerText = ndjsonTransport.getData();
});
