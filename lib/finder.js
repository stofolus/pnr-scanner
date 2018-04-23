const fs = require("fs");
const path = require("path");
const glob = require("glob");
const isTextOrBinary = require("istextorbinary");
const Validator = require("./mockValidator");
const Pnr = require("./pnr");

const defaultPattern = "!(node_modules){,/**}";

function finder(searchPath, pattern) {
  return new Promise((resolve, reject) => {
    glob(
      pattern || defaultPattern,
      { cwd: searchPath, absolute: true, nodir: true },
      (err, files) => {
        resolve(
          files
            .map(file => {
              const fileBuffer = fs.readFileSync(file);
              if (isTextOrBinary.isTextSync(path.basename(file), fileBuffer)) {
                const matcher = Pnr.regex;
                let match;
                const results = [];
                const text = fileBuffer.toString();
                while ((match = matcher.exec(text))) {
                  if (!Validator.isMock(match[0])) {
                    const line = text.substr(0, match.index).split("\n").length;
                    results.push({ pnr: match[0], line });
                  }
                }
                return { file, results };
              }
            })
            .filter(item => {
              return item && item.results && item.results.length > 0;
            })
        );
      }
    );
  });
}

module.exports = finder;
