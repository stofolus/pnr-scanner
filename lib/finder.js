const fs = require(`fs`);
const path = require(`path`);
const glob = require(`glob`);
const isTextOrBinary = require(`istextorbinary`);
const Validator = require(`./validator`);
const Pnr = require(`./pnr`);
const FileMockDataReader = require("./fileMockDataReader");
const WhitelistReader = require("./whitelistReader");
const Logger = require(`../lib/logger/logger`);
const Config = require(`./config`);
const logger = new Logger(`finder.js`);
class Finder {
  static findPnrs(searchPath, pattern) {
    const config = Config.getConfig(searchPath);
    let files = [];
    if (fs.lstatSync(searchPath).isDirectory()) {
      files = glob.sync(pattern || config.pattern, {
        cwd: searchPath,
        absolute: true,
        nodir: true,
        ignore: [...this._getIgnoreGlobs(searchPath), ...config.ignorePath]
      });
    } else {
      files.push(searchPath);
    }

    const validator = new Validator([
      ...FileMockDataReader.fetch(),
      ...WhitelistReader.fetch(searchPath),
      ...config.ignorePnr
    ]);

    return files
      .map(file => {
        const results = Finder.getPnrsInFile(file, validator);
        return { file, results };
      })
      .filter(item => {
        return item && item.results && item.results.length > 0;
      });
  }

  static getPnrsInFile(file, validator) {
    const fileBuffer = fs.readFileSync(file);
    const results = [];
    if (isTextOrBinary.isTextSync(path.basename(file), fileBuffer)) {
      const matcher = Pnr.regex;
      let match;
      const text = fileBuffer.toString();
      while ((match = matcher.exec(text))) {
        const normalizedPnr = Pnr.normalizePnr(match[0]);
        if (Pnr.isValidPnr(normalizedPnr) && !validator.isMock(normalizedPnr)) {
          const line = text.substr(0, match.index).split(`\n`).length;
          results.push({ pnr: match[0], line });
        }
      }
    }
    return results;
  }

  static _getIgnoreGlobs(searchPath) {
    let ignores = [];
    const pathToGitIgnore = `${searchPath}/.gitignore`;
    if (fs.existsSync(pathToGitIgnore)) {
      ignores = fs
        .readFileSync(pathToGitIgnore)
        .toString()
        .split("\n")
        .filter(line => line.length > 0 && !line.startsWith("#"))
        .reduce((acc, value) => {
          acc.push(`${searchPath}/${value}`);
          acc.push(`${searchPath}/**/${value}/**`);
          return acc;
        }, []);
    }
    logger.debug("Ignoring paths:", ignores);
    return ignores;
  }
}

module.exports = Finder;
