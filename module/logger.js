var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};

// node_modules/chalk/source/vendor/ansi-styles/index.js
var ANSI_BACKGROUND_OFFSET = 10;
var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
var styles = {
  modifier: {
    reset: [0, 0],
    // 21 isn't widely supported and 22 does the same thing
    bold: [1, 22],
    dim: [2, 22],
    italic: [3, 23],
    underline: [4, 24],
    overline: [53, 55],
    inverse: [7, 27],
    hidden: [8, 28],
    strikethrough: [9, 29]
  },
  color: {
    black: [30, 39],
    red: [31, 39],
    green: [32, 39],
    yellow: [33, 39],
    blue: [34, 39],
    magenta: [35, 39],
    cyan: [36, 39],
    white: [37, 39],
    // Bright color
    blackBright: [90, 39],
    gray: [90, 39],
    // Alias of `blackBright`
    grey: [90, 39],
    // Alias of `blackBright`
    redBright: [91, 39],
    greenBright: [92, 39],
    yellowBright: [93, 39],
    blueBright: [94, 39],
    magentaBright: [95, 39],
    cyanBright: [96, 39],
    whiteBright: [97, 39]
  },
  bgColor: {
    bgBlack: [40, 49],
    bgRed: [41, 49],
    bgGreen: [42, 49],
    bgYellow: [43, 49],
    bgBlue: [44, 49],
    bgMagenta: [45, 49],
    bgCyan: [46, 49],
    bgWhite: [47, 49],
    // Bright color
    bgBlackBright: [100, 49],
    bgGray: [100, 49],
    // Alias of `bgBlackBright`
    bgGrey: [100, 49],
    // Alias of `bgBlackBright`
    bgRedBright: [101, 49],
    bgGreenBright: [102, 49],
    bgYellowBright: [103, 49],
    bgBlueBright: [104, 49],
    bgMagentaBright: [105, 49],
    bgCyanBright: [106, 49],
    bgWhiteBright: [107, 49]
  }
};
var modifierNames = Object.keys(styles.modifier);
var foregroundColorNames = Object.keys(styles.color);
var backgroundColorNames = Object.keys(styles.bgColor);
var colorNames = [...foregroundColorNames, ...backgroundColorNames];
function assembleStyles() {
  const codes = /* @__PURE__ */ new Map();
  for (const [groupName, group] of Object.entries(styles)) {
    for (const [styleName, style] of Object.entries(group)) {
      styles[styleName] = {
        open: `\x1B[${style[0]}m`,
        close: `\x1B[${style[1]}m`
      };
      group[styleName] = styles[styleName];
      codes.set(style[0], style[1]);
    }
    Object.defineProperty(styles, groupName, {
      value: group,
      enumerable: false
    });
  }
  Object.defineProperty(styles, "codes", {
    value: codes,
    enumerable: false
  });
  styles.color.close = "\x1B[39m";
  styles.bgColor.close = "\x1B[49m";
  styles.color.ansi = wrapAnsi16();
  styles.color.ansi256 = wrapAnsi256();
  styles.color.ansi16m = wrapAnsi16m();
  styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
  styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
  Object.defineProperties(styles, {
    rgbToAnsi256: {
      value(red, green, blue) {
        if (red === green && green === blue) {
          if (red < 8) {
            return 16;
          }
          if (red > 248) {
            return 231;
          }
          return Math.round((red - 8) / 247 * 24) + 232;
        }
        return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
      },
      enumerable: false
    },
    hexToRgb: {
      value(hex) {
        const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
        if (!matches) {
          return [0, 0, 0];
        }
        let [colorString] = matches;
        if (colorString.length === 3) {
          colorString = [...colorString].map((character) => character + character).join("");
        }
        const integer = Number.parseInt(colorString, 16);
        return [
          /* eslint-disable no-bitwise */
          integer >> 16 & 255,
          integer >> 8 & 255,
          integer & 255
          /* eslint-enable no-bitwise */
        ];
      },
      enumerable: false
    },
    hexToAnsi256: {
      value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
      enumerable: false
    },
    ansi256ToAnsi: {
      value(code) {
        if (code < 8) {
          return 30 + code;
        }
        if (code < 16) {
          return 90 + (code - 8);
        }
        let red;
        let green;
        let blue;
        if (code >= 232) {
          red = ((code - 232) * 10 + 8) / 255;
          green = red;
          blue = red;
        } else {
          code -= 16;
          const remainder = code % 36;
          red = Math.floor(code / 36) / 5;
          green = Math.floor(remainder / 6) / 5;
          blue = remainder % 6 / 5;
        }
        const value = Math.max(red, green, blue) * 2;
        if (value === 0) {
          return 30;
        }
        let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
        if (value === 2) {
          result += 60;
        }
        return result;
      },
      enumerable: false
    },
    rgbToAnsi: {
      value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
      enumerable: false
    },
    hexToAnsi: {
      value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
      enumerable: false
    }
  });
  return styles;
}
var ansiStyles = assembleStyles();
var ansi_styles_default = ansiStyles;

// node_modules/chalk/source/vendor/supports-color/browser.js
var level = (() => {
  if (navigator.userAgentData) {
    const brand = navigator.userAgentData.brands.find(({ brand: brand2 }) => brand2 === "Chromium");
    if (brand && brand.version > 93) {
      return 3;
    }
  }
  if (/\b(Chrome|Chromium)\//.test(navigator.userAgent)) {
    return 1;
  }
  return 0;
})();
var colorSupport = level !== 0 && {
  level,
  hasBasic: true,
  has256: level >= 2,
  has16m: level >= 3
};
var supportsColor = {
  stdout: colorSupport,
  stderr: colorSupport
};
var browser_default = supportsColor;

// node_modules/chalk/source/utilities.js
function stringReplaceAll(string, substring, replacer) {
  let index = string.indexOf(substring);
  if (index === -1) {
    return string;
  }
  const substringLength = substring.length;
  let endIndex = 0;
  let returnValue = "";
  do {
    returnValue += string.slice(endIndex, index) + substring + replacer;
    endIndex = index + substringLength;
    index = string.indexOf(substring, endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}
function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
  let endIndex = 0;
  let returnValue = "";
  do {
    const gotCR = string[index - 1] === "\r";
    returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
    endIndex = index + 1;
    index = string.indexOf("\n", endIndex);
  } while (index !== -1);
  returnValue += string.slice(endIndex);
  return returnValue;
}

// node_modules/chalk/source/index.js
var { stdout: stdoutColor, stderr: stderrColor } = browser_default;
var GENERATOR = Symbol("GENERATOR");
var STYLER = Symbol("STYLER");
var IS_EMPTY = Symbol("IS_EMPTY");
var levelMapping = [
  "ansi",
  "ansi",
  "ansi256",
  "ansi16m"
];
var styles2 = /* @__PURE__ */ Object.create(null);
var applyOptions = (object, options = {}) => {
  if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
    throw new Error("The `level` option should be an integer from 0 to 3");
  }
  const colorLevel = stdoutColor ? stdoutColor.level : 0;
  object.level = options.level === void 0 ? colorLevel : options.level;
};
var chalkFactory = (options) => {
  const chalk2 = (...strings) => strings.join(" ");
  applyOptions(chalk2, options);
  Object.setPrototypeOf(chalk2, createChalk.prototype);
  return chalk2;
};
function createChalk(options) {
  return chalkFactory(options);
}
Object.setPrototypeOf(createChalk.prototype, Function.prototype);
for (const [styleName, style] of Object.entries(ansi_styles_default)) {
  styles2[styleName] = {
    get() {
      const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
      Object.defineProperty(this, styleName, { value: builder });
      return builder;
    }
  };
}
styles2.visible = {
  get() {
    const builder = createBuilder(this, this[STYLER], true);
    Object.defineProperty(this, "visible", { value: builder });
    return builder;
  }
};
var getModelAnsi = (model, level2, type, ...arguments_) => {
  if (model === "rgb") {
    if (level2 === "ansi16m") {
      return ansi_styles_default[type].ansi16m(...arguments_);
    }
    if (level2 === "ansi256") {
      return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
    }
    return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
  }
  if (model === "hex") {
    return getModelAnsi("rgb", level2, type, ...ansi_styles_default.hexToRgb(...arguments_));
  }
  return ansi_styles_default[type][model](...arguments_);
};
var usedModels = ["rgb", "hex", "ansi256"];
for (const model of usedModels) {
  styles2[model] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
  const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
  styles2[bgModel] = {
    get() {
      const { level: level2 } = this;
      return function(...arguments_) {
        const styler = createStyler(getModelAnsi(model, levelMapping[level2], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
        return createBuilder(this, styler, this[IS_EMPTY]);
      };
    }
  };
}
var proto = Object.defineProperties(() => {
}, {
  ...styles2,
  level: {
    enumerable: true,
    get() {
      return this[GENERATOR].level;
    },
    set(level2) {
      this[GENERATOR].level = level2;
    }
  }
});
var createStyler = (open, close, parent) => {
  let openAll;
  let closeAll;
  if (parent === void 0) {
    openAll = open;
    closeAll = close;
  } else {
    openAll = parent.openAll + open;
    closeAll = close + parent.closeAll;
  }
  return {
    open,
    close,
    openAll,
    closeAll,
    parent
  };
};
var createBuilder = (self, _styler, _isEmpty) => {
  const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
  Object.setPrototypeOf(builder, proto);
  builder[GENERATOR] = self;
  builder[STYLER] = _styler;
  builder[IS_EMPTY] = _isEmpty;
  return builder;
};
var applyStyle = (self, string) => {
  if (self.level <= 0 || !string) {
    return self[IS_EMPTY] ? "" : string;
  }
  let styler = self[STYLER];
  if (styler === void 0) {
    return string;
  }
  const { openAll, closeAll } = styler;
  if (string.includes("\x1B")) {
    while (styler !== void 0) {
      string = stringReplaceAll(string, styler.close, styler.open);
      styler = styler.parent;
    }
  }
  const lfIndex = string.indexOf("\n");
  if (lfIndex !== -1) {
    string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
  }
  return openAll + string + closeAll;
};
Object.defineProperties(createChalk.prototype, styles2);
var chalk = createChalk();
var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
var source_default = chalk;

// module/logger.js
var _NDJson, _levels, _processMessage, processMessage_fn;
var Logger = class {
  /**
   * Parses the log message to ensure it is a string.
   * @param {*} message - The log message.
   * @returns {string | null} - The parsed log message or null if the message is undefined.
   */
  static parseMessage(message) {
    if (typeof message === "undefined")
      return null;
    if (typeof message === "object")
      message = JSON.stringify(message);
    return message;
  }
  /**
   * Formats the log message with timestamp and log level.
   * @param {string} message - The log message.
   * @param {number} logLevel - The log level.
   * @returns {string} - The formatted log message.
   */
  static formatMessage(message, logLevel) {
    let type = __privateGet(this, _levels)[logLevel];
    let date = (/* @__PURE__ */ new Date()).toISOString().split(".")[0].replace("T", " ");
    if (this.colors) {
      date = source_default.gray(date);
      switch (logLevel) {
        case 0:
          type = source_default.bold(source_default.red(type));
          message = source_default.red(message);
          break;
        case 1:
          type = source_default.bold(source_default.yellow(type));
          message = source_default.yellow(message);
          break;
        case 2:
          type = source_default.bold(source_default.cyan(type));
          message = source_default.cyan(message);
          break;
        case 3:
          type = source_default.bold(source_default.blue(type));
          message = source_default.blue(message);
          break;
        case 4:
          type = source_default.bold(source_default.blue(type));
          message = source_default.blue(message);
          break;
        case 5:
          type = source_default.bold(source_default.gray(type));
          message = source_default.gray(message);
          break;
        case 6:
          type = source_default.bold(source_default.gray(type));
          message = source_default.gray(message);
          break;
      }
    }
    return `[${date}] ${type} ${message}`;
  }
  /**
   * Logs an error message.
   * @param {*} message - The error message.
   */
  static error(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 0);
  }
  /**
   * Logs a warning message.
   * @param {*} message - The warning message.
   */
  static warn(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 1);
  }
  /**
   * Logs an informational message.
   * @param {*} message - The informational message.
   */
  static info(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 2);
  }
  /**
   * Logs an HTTP-related message.
   * @param {*} message - The HTTP-related message.
   */
  static http(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 3);
  }
  /**
   * Logs a verbose message.
   * @param {*} message - The verbose message.
   */
  static verbose(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 4);
  }
  /**
   * Logs a debug message.
   * @param {*} message - The debug message.
   */
  static debug(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 5);
  }
  /**
   * Logs a silly message.
   * @param {*} message - The silly message.
   */
  static silly(message) {
    __privateMethod(this, _processMessage, processMessage_fn).call(this, message, 6);
  }
  /**
   * Appends a message to NDJson format.
   * @param {string} message - The message to append.
   * @param {number} logLevel - The log level associated with the message.
   */
  static putNDJson(message, logLevel) {
    let separator = __privateGet(this, _NDJson).length !== 0 ? "\n" : "";
    __privateSet(this, _NDJson, __privateGet(this, _NDJson) + (separator + JSON.stringify({ "time": (/* @__PURE__ */ new Date()).toISOString(), "level": logLevel, "msg": message })));
  }
  /**
   * Gets the NDJson log.
   * @returns {string} - The NDJson log.
   */
  static getNDJson() {
    return __privateGet(this, _NDJson);
  }
};
_NDJson = new WeakMap();
_levels = new WeakMap();
_processMessage = new WeakSet();
processMessage_fn = function(message, level2) {
  if (this.level < level2)
    return;
  message = this.parseMessage(message);
  if (message === null)
    return;
  if (this.NDJson)
    this.putNDJson(message, level2);
  switch (level2) {
    case 0:
      console.error(this.formatMessage(message, level2));
      break;
    case 1:
      console.warn(this.formatMessage(message, level2));
      break;
    default:
      console.info(this.formatMessage(message, level2));
      break;
  }
};
/**
 * Processes and logs a message with the specified log level.
 * @param {*} message - The log message.
 * @param {number} level - The log level.
 */
__privateAdd(Logger, _processMessage);
__privateAdd(Logger, _NDJson, "");
/**
 * Indicates whether NDJson is enabled.
 * @type {boolean}
 */
__publicField(Logger, "NDJson", false);
/**
 * The log level of the logger.
 * @type {number}
 */
__publicField(Logger, "level", 2);
/**
 * Indicates whether colors are enabled for log messages.
 * @type {boolean}
 */
__publicField(Logger, "colors", true);
/**
 * Defines log levels and their associated numeric values.
 * @type {Object}
 */
__publicField(Logger, "levels", {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  verbose: 4,
  debug: 5,
  silly: 6
});
__privateAdd(Logger, _levels, {
  0: "ERROR",
  1: "WARN",
  2: "INFO",
  3: "HTTP",
  4: "VERBOSE",
  5: "DEBUG",
  6: "SILLY"
});
export {
  Logger as default
};
