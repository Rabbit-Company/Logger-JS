import Logger from "./logger.js";

const messageInput = document.getElementById("text") as HTMLInputElement;
const NDJsonOutput = document.getElementById("NDJson");

// Enable all log levels
Logger.level = Logger.Levels.SILLY;

// Enable NDJson
Logger.NDJson = true;

document.getElementById("btn-error")?.addEventListener("click", () => {
	Logger.error(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-warn")?.addEventListener("click", () => {
	Logger.warn(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-info")?.addEventListener("click", () => {
	Logger.info(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-http")?.addEventListener("click", () => {
	Logger.http(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-verbose")?.addEventListener("click", () => {
	Logger.verbose(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-debug")?.addEventListener("click", () => {
	Logger.debug(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("btn-silly")?.addEventListener("click", () => {
	Logger.silly(messageInput?.value);
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});

document.getElementById("reset-NDJson")?.addEventListener("click", () => {
	Logger.resetNDJson();
	if (NDJsonOutput) NDJsonOutput.innerText = Logger.getNDJson();
});
