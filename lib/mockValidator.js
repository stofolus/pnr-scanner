const fs = require(`fs`);
const path = require(`path`);
const Pnr = require(`./pnr`);

const basePath = path.join(__dirname, `../`, `mocks`);

let _mockNumbers = [];

class Validator {
  static isMock(pnr) {
    this._populateMockData();
    return _mockNumbers.includes(Pnr.normalizePnr(pnr));
  }

  static _populateMockData() {
    if (_mockNumbers.length === 0) {
      const files = fs.readdirSync(basePath);
      files.forEach(file => {
        const mocks = fs
          .readFileSync(path.join(basePath, file), `utf8`)
          .split(`\r\n`)
          .filter(line => Pnr.isValidPnr(line));

        _mockNumbers = [..._mockNumbers, ...mocks];
      });
    }
  }

  static set mockNumbers(mockNumbers) {
    _mockNumbers = mockNumbers;
  }
}

module.exports = Validator;
