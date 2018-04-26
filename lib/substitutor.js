const Pnr = require("./pnr");

class Substitutor {
  constructor(testPnrs) {
    this.testPnrs = testPnrs;
    this.prevSubstitutions = {};
  }

  /**
   * Returns a random replacemennt PNR from the test data given to the constructor.
   * This method will return the same replacement for the given `realPnr` over and over again.
   * @param {String} realPnr
   */
  getReplacement(realPnr) {
    const normalizedRealPnr = Pnr.normalizePnr(realPnr);
    if (normalizedRealPnr in this.prevSubstitutions) {
      return this.prevSubstitutions[normalizedRealPnr];
    }

    const i = Math.floor(Math.random() * (this.testPnrs.length - 1));
    const testPnr = this.testPnrs[i];
    this.prevSubstitutions[normalizedRealPnr] = testPnr;
    return testPnr;
  }
}

module.exports = Substitutor;
