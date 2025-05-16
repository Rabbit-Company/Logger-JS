import { createRequire } from "node:module";
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// src/constants/colors.ts
var Colors;
((Colors2) => {
  Colors2["RESET"] = "\x1B[0m";
  Colors2["BOLD"] = "\x1B[1m";
  Colors2["BLACK"] = "\x1B[30m";
  Colors2["RED"] = "\x1B[31m";
  Colors2["GREEN"] = "\x1B[32m";
  Colors2["YELLOW"] = "\x1B[33m";
  Colors2["BLUE"] = "\x1B[34m";
  Colors2["MAGENTA"] = "\x1B[35m";
  Colors2["CYAN"] = "\x1B[36m";
  Colors2["WHITE"] = "\x1B[37m";
  Colors2["BRIGHT_BLACK"] = "\x1B[90m";
  Colors2["BRIGHT_RED"] = "\x1B[91m";
  Colors2["BRIGHT_GREEN"] = "\x1B[92m";
  Colors2["BRIGHT_YELLOW"] = "\x1B[93m";
  Colors2["BRIGHT_BLUE"] = "\x1B[94m";
  Colors2["BRIGHT_MAGENTA"] = "\x1B[95m";
  Colors2["BRIGHT_CYAN"] = "\x1B[96m";
  Colors2["BRIGHT_WHITE"] = "\x1B[97m";
})(Colors ||= {});

// src/constants/levels.ts
var Levels;
((Levels2) => {
  Levels2[Levels2["ERROR"] = 0] = "ERROR";
  Levels2[Levels2["WARN"] = 1] = "WARN";
  Levels2[Levels2["AUDIT"] = 2] = "AUDIT";
  Levels2[Levels2["INFO"] = 3] = "INFO";
  Levels2[Levels2["HTTP"] = 4] = "HTTP";
  Levels2[Levels2["DEBUG"] = 5] = "DEBUG";
  Levels2[Levels2["VERBOSE"] = 6] = "VERBOSE";
  Levels2[Levels2["SILLY"] = 7] = "SILLY";
})(Levels ||= {});
var LevelColors = {
  [0 /* ERROR */]: "\x1B[31m" /* RED */,
  [1 /* WARN */]: "\x1B[93m" /* BRIGHT_YELLOW */,
  [2 /* AUDIT */]: "\x1B[35m" /* MAGENTA */,
  [3 /* INFO */]: "\x1B[36m" /* CYAN */,
  [4 /* HTTP */]: "\x1B[34m" /* BLUE */,
  [5 /* DEBUG */]: "\x1B[34m" /* BLUE */,
  [6 /* VERBOSE */]: "\x1B[90m" /* BRIGHT_BLACK */,
  [7 /* SILLY */]: "\x1B[90m" /* BRIGHT_BLACK */
};
// src/formatters/consoleFormatter.ts
function formatConsoleMessage(message, logLevel, metadata, format, colorsEnabled) {
  const now = new Date;
  const type = Levels[logLevel];
  const utcFormats = {
    "{iso}": now.toISOString(),
    "{datetime}": now.toISOString().split(".")[0].replace("T", " "),
    "{time}": now.toISOString().split("T")[1].split(".")[0],
    "{date}": now.toISOString().split("T")[0],
    "{utc}": now.toUTCString(),
    "{ms}": now.getTime().toString()
  };
  const localFormats = {
    "{datetime-local}": now.toLocaleString("sv-SE").replace(" ", "T").split(".")[0].replace("T", " "),
    "{time-local}": now.toLocaleTimeString("sv-SE"),
    "{date-local}": now.toLocaleDateString("sv-SE"),
    "{full-local}": now.toString()
  };
  const metadataFormats = {};
  if (metadata) {
    metadataFormats["{metadata}"] = JSON.stringify(metadata);
    metadataFormats["{metadata-ml}"] = JSON.stringify(metadata, null, 2);
    if (colorsEnabled) {
      const color = LevelColors[logLevel];
      const colorize = (text) => color + text + "\x1B[0m" /* RESET */;
      for (const key in metadataFormats) {
        metadataFormats[key] = colorize(metadataFormats[key]);
      }
    }
  } else {
    format = format.replace(/{metadata(-ml)?}/g, "");
  }
  let coloredType = type;
  let coloredMessage = message;
  if (colorsEnabled) {
    const color = LevelColors[logLevel];
    const colorize = (text) => "\x1B[90m" /* BRIGHT_BLACK */ + text + "\x1B[0m" /* RESET */;
    for (const key in utcFormats) {
      utcFormats[key] = colorize(utcFormats[key]);
    }
    for (const key in localFormats) {
      localFormats[key] = colorize(localFormats[key]);
    }
    coloredType = "\x1B[1m" /* BOLD */ + color + type + "\x1B[0m" /* RESET */;
    coloredMessage = color + message + "\x1B[0m" /* RESET */;
  }
  let output = format;
  const allFormats = { ...utcFormats, ...localFormats, ...metadataFormats };
  for (const [placeholder, value] of Object.entries(allFormats)) {
    output = output.replace(new RegExp(placeholder, "g"), value);
  }
  return output.replace(/{type}/g, coloredType).replace(/{message}/g, coloredMessage);
}

// src/transports/consoleTransport.ts
class ConsoleTransport {
  format;
  colors;
  constructor(format = "[{datetime-local}] {type} {message} {metadata}", colors = true) {
    this.format = format;
    this.colors = colors;
  }
  log(entry) {
    console.info(formatConsoleMessage(entry.message, entry.level, entry.metadata, this.format, this.colors));
  }
}

// src/logger.ts
class Logger {
  level = 3 /* INFO */;
  transports = [new ConsoleTransport];
  constructor(config) {
    if (config?.level !== undefined) {
      this.level = config.level;
    }
    if (config?.transports) {
      this.transports = config.transports;
    }
  }
  shouldLog(level) {
    return this.level >= level;
  }
  createLogEntry(message, level, metadata) {
    return {
      message,
      level,
      timestamp: Date.now(),
      metadata
    };
  }
  processEntry(entry) {
    if (!this.shouldLog(entry.level))
      return;
    for (const transport of this.transports) {
      transport.log(entry);
    }
  }
  error(message, metadata) {
    this.processEntry(this.createLogEntry(message, 0 /* ERROR */, metadata));
  }
  warn(message, metadata) {
    this.processEntry(this.createLogEntry(message, 1 /* WARN */, metadata));
  }
  audit(message, metadata) {
    this.processEntry(this.createLogEntry(message, 2 /* AUDIT */, metadata));
  }
  info(message, metadata) {
    this.processEntry(this.createLogEntry(message, 3 /* INFO */, metadata));
  }
  http(message, metadata) {
    this.processEntry(this.createLogEntry(message, 4 /* HTTP */, metadata));
  }
  debug(message, metadata) {
    this.processEntry(this.createLogEntry(message, 5 /* DEBUG */, metadata));
  }
  verbose(message, metadata) {
    this.processEntry(this.createLogEntry(message, 6 /* VERBOSE */, metadata));
  }
  silly(message, metadata) {
    this.processEntry(this.createLogEntry(message, 7 /* SILLY */, metadata));
  }
  addTransport(transport) {
    this.transports.push(transport);
  }
  removeTransport(transport) {
    this.transports = this.transports.filter((t) => t !== transport);
  }
  setLevel(level) {
    this.level = level;
  }
}
// src/formatters/ndjsonFormatter.ts
function formatNDJson(entry) {
  return JSON.stringify({
    time: new Date(entry.timestamp).toISOString(),
    level: entry.level,
    msg: entry.message,
    ...entry.metadata || {}
  });
}

// src/transports/ndjsonTransport.ts
class NDJsonTransport {
  data = "";
  log(entry) {
    let separator = this.data.length !== 0 ? `
` : "";
    this.data += separator + formatNDJson(entry);
  }
  getData() {
    return this.data ?? "";
  }
  reset() {
    this.data = "";
  }
}
// src/formatters/lokiFormatter.ts
function formatLokiMessage(entry, maxLabelCount, labels = {}) {
  const baseLabels = {
    level: Levels[entry.level],
    ...labels
  };
  const metadataLabels = entry.metadata || {};
  const allLabels = {
    ...baseLabels,
    ...metadataLabels
  };
  const totalLabels = Object.keys(allLabels).length;
  let finalLabels = allLabels;
  if (maxLabelCount > 0 && totalLabels > maxLabelCount) {
    const labelEntries = Object.entries(allLabels);
    finalLabels = Object.fromEntries([
      ["level", allLabels.level],
      ...Object.entries(labels),
      ...labelEntries.filter(([key]) => key !== "level" && !labels[key]).slice(0, maxLabelCount - 1 - Object.keys(labels).length)
    ]);
  }
  return {
    streams: [
      {
        stream: finalLabels,
        values: [[(new Date(entry.timestamp).getTime() * 1e6).toString(), entry.message]]
      }
    ]
  };
}

// src/transports/lokiTransport.ts
class LokiTransport {
  config;
  queue = [];
  batchSize;
  batchTimeout;
  timeoutHandle;
  maxLabelCount;
  debug;
  maxQueueSize;
  retryCount = 0;
  maxRetries;
  retryBaseDelay;
  retryTimer;
  isSending = false;
  constructor(config) {
    this.config = config;
    this.batchSize = config.batchSize || 10;
    this.batchTimeout = config.batchTimeout || 5000;
    this.maxLabelCount = config.maxLabelCount || 50;
    this.debug = config.debug || false;
    this.maxQueueSize = config.maxQueueSize || 1e4;
    this.maxRetries = config.maxRetries || 5;
    this.retryBaseDelay = config.retryBaseDelay || 1000;
  }
  log(entry) {
    const lokiMessage = formatLokiMessage(entry, this.maxLabelCount, {
      ...this.config.labels,
      ...entry.metadata
    });
    if (this.queue.length >= this.maxQueueSize) {
      if (this.debug)
        console.warn("Loki queue full - dropping oldest log entry");
      this.queue.shift();
    }
    this.queue.push(lokiMessage);
    this.scheduleSend();
  }
  scheduleSend(immediate = false) {
    if (this.isSending)
      return;
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }
    if (this.queue.length > 0 && (immediate || this.queue.length >= this.batchSize)) {
      this.sendBatch();
    } else if (this.queue.length > 0) {
      this.timeoutHandle = setTimeout(() => this.sendBatch(), this.batchTimeout);
    }
  }
  async sendBatch() {
    if (this.queue.length === 0 || this.isSending)
      return;
    this.isSending = true;
    const batchToSend = this.queue.slice(0, this.batchSize);
    try {
      const headers = {
        "Content-Type": "application/json"
      };
      if (this.config.tenantID) {
        headers["X-Scope-OrgID"] = this.config.tenantID;
      }
      if (this.config.basicAuth) {
        headers.Authorization = `Basic ${btoa(this.config.basicAuth.username + ":" + this.config.basicAuth.password)}`;
      }
      const response = await fetch(`${this.config.url}/loki/api/v1/push`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          streams: batchToSend.flatMap((entry) => entry.streams)
        })
      });
      if (response.ok) {
        this.queue = this.queue.slice(batchToSend.length);
        this.retryCount = 0;
        if (this.retryTimer) {
          clearTimeout(this.retryTimer);
          this.retryTimer = undefined;
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
    } catch (error) {
      if (this.debug)
        console.error("Loki transmission error: ", error);
      this.retryCount++;
      if (this.retryCount <= this.maxRetries) {
        const delay = Math.min(this.retryBaseDelay * Math.pow(2, this.retryCount - 1), 30000);
        if (this.debug)
          console.log(`Scheduling retry #${this.retryCount} in ${delay}ms`);
        this.retryTimer = setTimeout(() => {
          this.scheduleSend(true);
        }, delay);
      } else {
        if (this.debug)
          console.warn(`Max retries (${this.maxRetries}) reached. Dropping batch.`);
        this.queue = this.queue.slice(batchToSend.length);
        this.retryCount = 0;
      }
    } finally {
      this.isSending = false;
      if (this.queue.length > 0 && this.retryCount === 0) {
        this.scheduleSend();
      }
    }
  }
}
// src/formatters/syslogFormatter.ts
var SYSLOG_SEVERITY = {
  [0 /* ERROR */]: 3,
  [1 /* WARN */]: 4,
  [2 /* AUDIT */]: 5,
  [3 /* INFO */]: 6,
  [4 /* HTTP */]: 6,
  [5 /* DEBUG */]: 7,
  [6 /* VERBOSE */]: 7,
  [7 /* SILLY */]: 7
};
function formatRFC3164(entry, facility, appName, pid) {
  const severity = SYSLOG_SEVERITY[entry.level];
  const priority = facility << 3 | severity;
  const timestamp = new Date(entry.timestamp).toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
  }).replace(/,/, "").replace(" at ", " ");
  const hostname = __require("os").hostname();
  const msg = entry.metadata ? `${entry.message} ${JSON.stringify(entry.metadata)}` : entry.message;
  return `<${priority}>${timestamp} ${hostname} ${appName}[${pid}]: ${msg}`;
}
function formatRFC5424(entry, facility, appName, pid) {
  const severity = SYSLOG_SEVERITY[entry.level];
  const priority = facility << 3 | severity;
  const timestamp = new Date(entry.timestamp).toISOString();
  const hostname = __require("os").hostname();
  const msgId = "-";
  const structuredData = entry.metadata ? `[example@1 ${Object.entries(entry.metadata).map(([key, val]) => `${key}="${val}"`).join(" ")}]` : "-";
  return `<${priority}>1 ${timestamp} ${hostname} ${appName} ${pid} ${msgId} ${structuredData} ${entry.message}`;
}
function formatSyslogMessage(entry, config) {
  const facility = config.facility ?? 1;
  const appName = config.appName ?? "node";
  const pid = config.pid ?? process.pid;
  const protocolVersion = config.protocolVersion ?? 5424;
  return protocolVersion === 3164 ? formatRFC3164(entry, facility, appName, pid) : formatRFC5424(entry, facility, appName, pid);
}

// src/transports/syslogTransport.ts
import { createSocket, Socket } from "dgram";
import { Socket as NetSocket } from "net";
import { connect as tlsConnect } from "tls";

class SyslogTransport {
  socket = null;
  queue = [];
  isConnecting = false;
  retryCount = 0;
  retryBaseDelay;
  maxQueueSize;
  debug;
  reconnectTimer = null;
  config;
  constructor(config = {}) {
    this.maxQueueSize = config.maxQueueSize ?? 1000;
    this.retryBaseDelay = config.retryBaseDelay ?? 1000;
    this.debug = config.debug ?? false;
    this.config = {
      host: config.host ?? "localhost",
      port: config.port ?? 514,
      protocol: config.protocol ?? "udp",
      facility: config.facility ?? 1,
      appName: config.appName ?? "node",
      pid: config.pid ?? process.pid,
      protocolVersion: config.protocolVersion ?? 5424,
      tlsOptions: config.tlsOptions || {}
    };
    this.initializeSocket();
  }
  initializeSocket() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      this.socket.removeAllListeners();
      if (!("destroy" in this.socket)) {
        this.socket.close();
      } else {
        this.socket.destroy();
      }
    }
    if (this.config.protocol === "udp") {
      this.initializeUdpSocket();
    } else if (this.config.protocol === "tcp") {
      this.initializeTcpSocket();
    } else if (this.config.protocol === "tcp-tls") {
      this.initializeTlsSocket();
    }
  }
  initializeUdpSocket() {
    this.socket = createSocket("udp4");
    this.socket.on("error", (err) => {
      if (this.debug)
        console.error("Syslog UDP error:", err);
      this.handleSocketError();
    });
    this.socket.on("close", () => {
      if (this.debug)
        console.log("Syslog UDP socket closed");
    });
  }
  initializeTcpSocket() {
    this.socket = new NetSocket;
    this.setupTcpSocketEvents();
    this.connectTcpSocket();
  }
  initializeTlsSocket() {
    const tlsOptions = {
      host: this.config.host,
      port: this.config.port,
      ...this.config.tlsOptions
    };
    this.socket = tlsConnect(tlsOptions, () => {
      if (this.debug)
        console.log("Syslog TLS connection established");
      this.retryCount = 0;
      this.flushQueue();
    });
    this.setupTcpSocketEvents();
  }
  setupTcpSocketEvents() {
    if (!this.socket)
      return;
    this.socket.on("error", (err) => {
      if (this.debug)
        console.error("Syslog TCP/TLS error:", err);
      this.handleSocketError();
    });
    this.socket.on("close", () => {
      if (this.debug)
        console.log("Syslog TCP/TLS connection closed");
      this.handleSocketError();
    });
    this.socket.on("end", () => {
      if (this.debug)
        console.log("Syslog TCP/TLS connection ended");
    });
  }
  connectTcpSocket() {
    if (this.isConnecting || !(this.socket instanceof NetSocket))
      return;
    this.isConnecting = true;
    this.socket.connect(this.config.port, this.config.host, () => {
      if (this.debug)
        console.log("Syslog TCP connection established");
      this.isConnecting = false;
      this.retryCount = 0;
      this.flushQueue();
    });
  }
  handleSocketError() {
    if (this.reconnectTimer)
      return;
    this.socket = null;
    this.isConnecting = false;
    this.retryCount++;
    const delay = Math.min(this.retryBaseDelay * Math.pow(2, this.retryCount - 1), 30000);
    if (this.debug)
      console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.retryCount})`);
    this.reconnectTimer = setTimeout(() => {
      this.initializeSocket();
    }, delay);
  }
  flushQueue() {
    if (!this.socket || this.queue.length === 0)
      return;
    while (this.queue.length > 0) {
      const message = this.queue.shift();
      if (message) {
        this.sendMessage(message);
      }
    }
  }
  sendMessage(message) {
    if (!this.socket) {
      this.queue.unshift(message);
      return;
    }
    try {
      if (this.socket instanceof Socket) {
        this.socket.send(message, this.config.port, this.config.host, (err) => {
          if (err && this.debug)
            console.error("Syslog UDP send error:", err);
        });
      } else {
        this.socket.write(message + `
`, (err) => {
          if (err && this.debug)
            console.error("Syslog TCP/TLS send error:", err);
        });
      }
    } catch (err) {
      if (this.debug)
        console.error("Syslog send error:", err);
      this.queue.unshift(message);
    }
  }
  log(entry) {
    const message = formatSyslogMessage(entry, this.config);
    if (this.queue.length >= this.maxQueueSize) {
      if (this.debug)
        console.warn("Syslog queue full - dropping oldest message");
      this.queue.shift();
    }
    this.queue.push(message);
    if (this.socket && !this.isConnecting) {
      this.flushQueue();
    } else if (!this.socket && !this.isConnecting) {}
  }
  close() {
    return new Promise((resolve) => {
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (!this.socket) {
        resolve();
        return;
      }
      const handleClose = () => {
        resolve();
      };
      if ("destroy" in this.socket) {
        this.socket.destroy();
        process.nextTick(handleClose);
      } else {
        this.socket.close(handleClose);
      }
    });
  }
}
export {
  SyslogTransport,
  NDJsonTransport,
  LokiTransport,
  Logger,
  Levels,
  ConsoleTransport,
  Colors
};
