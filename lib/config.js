const path = require(`path`);
const fs = require(`fs`);
const Pnr = require(`./pnr`);

const DEFAULT_CONFIG = {
  pattern: `!(node_modules){,/**}`,
  ignorePath: [],
  ignorePnr: []
};

function getConfig(directory) {
  let configFile = {
    pattern: undefined,
    ignorePath: undefined,
    ignorePnr: undefined
  };

  if (fs.existsSync(directory)) {
    const configFilePath = path.join(directory, `.pnr-scanner.json`);
    if (fs.existsSync(configFilePath)) {
      configFile = JSON.parse(fs.readFileSync(configFilePath, "utf-8"));
    }
  }

  return {
    pattern: configFile.pattern || DEFAULT_CONFIG.pattern,
    ignorePath: getConfigAsArray(
      configFile.ignorePath,
      DEFAULT_CONFIG.ignorePath
    ),
    ignorePnr: getConfigAsArray(
      configFile.ignorePnr,
      DEFAULT_CONFIG.ignorePnr
    ).map(pnr => Pnr.normalizePnr(pnr))
  };
}

function getConfigAsArray(value, defaultValue) {
  if (Array.isArray(value)) {
    return value;
  } else if (typeof value === `string`) {
    return [value];
  } else {
    return defaultValue;
  }
}

module.exports = { getConfig };
