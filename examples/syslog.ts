import { Logger, SyslogTransport } from "../src";

// Create a logger with Syslog transport
const logger = new Logger({
	transports: [
		new SyslogTransport({
			host: "localhost",
			port: 514,
			protocol: "udp", // or 'tcp' or 'tcp-tls'
			facility: 16, // Local0 facility
			appName: "my-app",
			protocolVersion: 5424, // Use modern syslog format
			maxQueueSize: 500,
			debug: true,
		}),
	],
});

// Log some messages
logger.info("Application started");

setInterval(() => {
	logger.error("Database connection failed", {
		error: "Connection timeout",
		attempt: 3,
	});
}, 1000);
