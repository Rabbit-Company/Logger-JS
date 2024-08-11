// src/logger.ts
var Logger;
((Logger) => {
  let Colors;
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
  })(Colors = Logger.Colors ||= {});
  let Levels;
  ((Levels2) => {
    Levels2[Levels2["ERROR"] = 0] = "ERROR";
    Levels2[Levels2["WARN"] = 1] = "WARN";
    Levels2[Levels2["INFO"] = 2] = "INFO";
    Levels2[Levels2["HTTP"] = 3] = "HTTP";
    Levels2[Levels2["VERBOSE"] = 4] = "VERBOSE";
    Levels2[Levels2["DEBUG"] = 5] = "DEBUG";
    Levels2[Levels2["SILLY"] = 6] = "SILLY";
  })(Levels = Logger.Levels ||= {});
  Logger.LevelColors = {
    [0 /* ERROR */]: "\x1B[31m" /* RED */,
    [1 /* WARN */]: "\x1B[93m" /* BRIGHT_YELLOW */,
    [2 /* INFO */]: "\x1B[36m" /* CYAN */,
    [3 /* HTTP */]: "\x1B[34m" /* BLUE */,
    [4 /* VERBOSE */]: "\x1B[34m" /* BLUE */,
    [5 /* DEBUG */]: "\x1B[90m" /* BRIGHT_BLACK */,
    [6 /* SILLY */]: "\x1B[90m" /* BRIGHT_BLACK */
  };
  let NDJsonData = "";
  Logger.NDJson = false;
  Logger.level = 2 /* INFO */;
  Logger.colors = true;
  Logger.format = "[{date}] {type} {message}";
  function parseMessage(message) {
    if (typeof message === "undefined")
      return null;
    if (typeof message === "object")
      message = JSON.stringify(message);
    return message;
  }
  Logger.parseMessage = parseMessage;
  function formatMessage(message, logLevel) {
    let type = Levels[logLevel];
    let date = new Date().toISOString().split(".")[0].replace("T", " ");
    if (Logger.colors) {
      date = "\x1B[90m" /* BRIGHT_BLACK */ + date + "\x1B[0m" /* RESET */;
      type = "\x1B[1m" /* BOLD */ + Logger.LevelColors[logLevel] + type + "\x1B[0m" /* RESET */;
      message = Logger.LevelColors[logLevel] + message + "\x1B[0m" /* RESET */;
    }
    return Logger.format.replace("{date}", date).replace("{type}", type).replace("{message}", message);
  }
  Logger.formatMessage = formatMessage;
  function processMessage(message, logLevel) {
    if (Logger.level < logLevel)
      return;
    message = parseMessage(message);
    if (message === null)
      return;
    if (Logger.NDJson)
      putNDJson(message, logLevel);
    console.info(formatMessage(message, logLevel));
  }
  function error(message) {
    processMessage(message, 0 /* ERROR */);
  }
  Logger.error = error;
  function warn(message) {
    processMessage(message, 1 /* WARN */);
  }
  Logger.warn = warn;
  function info(message) {
    processMessage(message, 2 /* INFO */);
  }
  Logger.info = info;
  function http(message) {
    processMessage(message, 3 /* HTTP */);
  }
  Logger.http = http;
  function verbose(message) {
    processMessage(message, 4 /* VERBOSE */);
  }
  Logger.verbose = verbose;
  function debug(message) {
    processMessage(message, 5 /* DEBUG */);
  }
  Logger.debug = debug;
  function silly(message) {
    processMessage(message, 6 /* SILLY */);
  }
  Logger.silly = silly;
  function putNDJson(message, logLevel) {
    let separator = NDJsonData.length !== 0 ? "\n" : "";
    NDJsonData += separator + JSON.stringify({
      time: new Date().toISOString(),
      level: logLevel,
      msg: message
    });
  }
  Logger.putNDJson = putNDJson;
  function getNDJson() {
    return NDJsonData ?? "";
  }
  Logger.getNDJson = getNDJson;
  function resetNDJson() {
    NDJsonData = "";
  }
  Logger.resetNDJson = resetNDJson;
})(Logger ||= {});
var logger_default = Logger;
export {
  logger_default as default
};
