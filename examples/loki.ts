import { ConsoleTransport, Levels, Logger, LokiTransport, type LokiConfig } from "../src/index.js";

// Create a Loki config
const lokiConfig: LokiConfig = {
	url: "http://localhost:3100",
	labels: { app: "my-app" },
	basicAuth: {
		username: "user",
		password: "pass",
	},
	batchSize: 5, // optional (default: 10)
	batchTimeout: 2000, // optional (default: 5000ms)
	tenantID: "node1", // optional (required for multi-tenant Loki setups)
	debug: true, // optional (default: false)
};

// Create transports
const consoleTransport = new ConsoleTransport();
const lokiTransport = new LokiTransport(lokiConfig);

// Create logger
const logger: Logger = new Logger({
	level: Levels.SILLY,
	transports: [consoleTransport, lokiTransport],
});

setInterval(() => {
	logger.debug("Latency: " + Math.floor(Math.random() * 100) + "ms");
}, 3000);

setInterval(() => {
	logger.silly("Random number: " + Math.floor(Math.random() * 10000));
}, 1000);

setInterval(() => {
	logger.info(`User logged in!`, { username: "test123" });
}, 5000);
