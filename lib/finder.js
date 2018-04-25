const fs = require(`fs`);
const path = require(`path`);
const glob = require(`glob`);
const isTextOrBinary = require(`istextorbinary`);
const Validator = require(`./mockValidator`);
const Pnr = require(`./pnr`);

const defaultPattern = `!(node_modules){,/**}`;

class Finder {
  static findPnrs(searchPath, pattern) {
    const files = glob.sync(pattern || defaultPattern, {
      cwd: searchPath,
      absolute: true,
      nodir: true
    });
    return files
      .map(file => {
        const results = Finder.getPnrsInFile(file);
        return { file, results };
      })
      .filter(item => {
        return item && item.results && item.results.length > 0;
      });
  }

  static getPnrsInFile(file) {
    const fileBuffer = fs.readFileSync(file);
    const results = [];
    if (isTextOrBinary.isTextSync(path.basename(file), fileBuffer)) {
      const matcher = Pnr.regex;
      let match;
      const text = fileBuffer.toString();
      while ((match = matcher.exec(text))) {
        if (!Validator.isMock(match[0])) {
          const line = text.substr(0, match.index).split(`\n`).length;
          results.push({ pnr: match[0], line });
        }
      }
    }
    return results;
  }
}

module.exports = Finder;
