const fs = require(`fs`);
const path = require(`path`);
const Pnr = require(`./pnr`);

class WhitelistReader {
  static fetch(rootPath) {
    const whiteListPath = path.join(rootPath, `.pnr-whitelist`);
    if (fs.existsSync(whiteListPath)) {
      return fs.readFileSync(whiteListPath, `utf8`)
        .replace(/\r/g, ``)
        .split(`\n`)
        .filter(line => Pnr.isValidPnr(line));
    }
    return [];
  }
}

module.exports = WhitelistReader;
