let level = 2;

class Logger {
  constructor(name) {
    this.name = name;
  }

  print(...args) {
    console.log(...args);
  }

  error(...args) {
    if (level <= Logger.levels.ERROR) {
      console.error(`${this.name}:`, ...args);
    }
  }

  warning(...args) {
    if (level <= Logger.levels.WARNING) {
      console.log(`${this.name}:`, ...args);
    }
  }

  info(...args) {
    if (level <= Logger.levels.INFO) {
      console.log(`${this.name}:`, ...args);
    }
  }

  debug(...args) {
    if (level <= Logger.levels.DEBUG) {
      console.log(`${this.name}:`, ...args);
    }
  }

  static get levels() {
    return {
      ERROR: 4,
      WARNING: 3,
      INFO: 2,
      DEBUG: 1
    };
  }

  static setLevel(newLevel) {
    level = newLevel;
  }
}

module.exports = Logger;
