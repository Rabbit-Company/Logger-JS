# Logger-JS

Simple Logger implementation in JavaScript (ES6).

## Usage

### 1. Download library
```bash
npm i --save @rabbit-company/logger
```

### 2. Import library
```js
import Logger from "@rabbit-company/logger";
```

### 3. Change Settings
```js
// Enable all log levels
Logger.level = 6;
```

### 4. Start logging
```js
Logger.error(message);
Logger.warn(message);
Logger.info(message);
Logger.http(message);
Logger.verbose(message);
Logger.debug(message);
```