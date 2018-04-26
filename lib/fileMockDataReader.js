const fs = require(`fs`);
const path = require(`path`);
const Pnr = require(`./pnr`);

const basePath = path.join(__dirname, `../`, `mocks`);

let mockNumbers = [];

class FileMockDataReader {
  static fetch() {
    if (mockNumbers.length === 0) {
      const files = fs.readdirSync(basePath);
      files.forEach(file => {
        const mocks = fs
          .readFileSync(path.join(basePath, file), `utf8`)
          .split(`\r\n`)
          .filter(line => Pnr.isValidPnr(line));

        mockNumbers = [...mockNumbers, ...mocks];
      });
    }
    return mockNumbers;
  }
}

module.exports = FileMockDataReader;
