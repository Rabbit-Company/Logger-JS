import { ConsoleTransport, Levels, Logger } from "../src/index.js";

// Create transports
const consoleTransport = new ConsoleTransport("[{datetime-local}] {type} {message} {metadata}");

// Create logger
const logger: Logger = new Logger({
	level: Levels.SILLY,
	transports: [consoleTransport],
});

setInterval(() => {
	logger.debug("Latency", { duration: Math.floor(Math.random() * 100) });
}, 3000);

setInterval(() => {
	logger.info(`User logged in!`, { username: "test123", ip: "192.168.0.1" });
}, 5000);

setInterval(() => {
	logger.audit("Invalid password!", { username: "ziga.zajc007", ip: "192.168.0.1" });
}, 2000);
