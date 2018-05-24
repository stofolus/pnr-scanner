const Pnr = require(`./pnr`);

class Validator {
  constructor(testPnrs) {
    this.testPnrs = testPnrs;
  }

  isMock(pnr) {
    return this.testPnrs.includes(pnr);
  }
}

module.exports = Validator;
