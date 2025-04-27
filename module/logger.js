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
function formatConsoleMessage(message, logLevel, format, colorsEnabled) {
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
  let coloredType = type;
  let coloredMessage = message;
  if (colorsEnabled) {
    const color = LevelColors[logLevel];
    const colorize = (text) => "\x1B[90m" /* BRIGHT_BLACK */ + text + "\x1B[0m" /* RESET */;
    Object.keys(utcFormats).forEach((key) => {
      utcFormats[key] = colorize(utcFormats[key]);
    });
    Object.keys(localFormats).forEach((key) => {
      localFormats[key] = colorize(localFormats[key]);
    });
    coloredType = "\x1B[1m" /* BOLD */ + color + type + "\x1B[0m" /* RESET */;
    coloredMessage = color + message + "\x1B[0m" /* RESET */;
  }
  let output = format;
  const allFormats = { ...utcFormats, ...localFormats };
  for (const [placeholder, value] of Object.entries(allFormats)) {
    output = output.replace(new RegExp(placeholder, "g"), value);
  }
  return output.replace(/{type}/g, coloredType).replace(/{message}/g, coloredMessage);
}

// src/transports/consoleTransport.ts
class ConsoleTransport {
  format;
  colors;
  constructor(format = "[{datetime-local}] {type} {message}", colors = true) {
    this.format = format;
    this.colors = colors;
  }
  log(entry) {
    console.info(formatConsoleMessage(entry.message, entry.level, this.format, this.colors));
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
  batch = [];
  batchSize;
  batchTimeout;
  timeoutHandle;
  maxLabelCount;
  debug;
  constructor(config) {
    this.config = config;
    this.batchSize = config.batchSize || 10;
    this.batchTimeout = config.batchTimeout || 5000;
    this.maxLabelCount = config.maxLabelCount || 50;
    this.debug = config.debug || false;
    if (!config.url) {
      throw new Error("Loki URL is required");
    }
  }
  log(entry) {
    const lokiMessage = formatLokiMessage(entry, this.maxLabelCount, { ...this.config.labels, ...entry.metadata });
    this.batch.push(lokiMessage);
    if (this.batch.length >= this.batchSize) {
      this.sendBatch();
    } else if (!this.timeoutHandle) {
      this.timeoutHandle = setTimeout(() => this.sendBatch(), this.batchTimeout);
    }
  }
  async sendBatch() {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
      this.timeoutHandle = undefined;
    }
    if (this.batch.length === 0)
      return;
    const batchToSend = this.batch;
    this.batch = [];
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
      if (!response.ok && this.debug) {
        console.error("Failed to send logs to Loki: ", await response.text());
      }
    } catch (error) {
      if (this.debug)
        console.error("Error sending logs to Loki: ", error);
    }
  }
}
export {
  NDJsonTransport,
  LokiTransport,
  Logger,
  Levels,
  ConsoleTransport,
  Colors
};
