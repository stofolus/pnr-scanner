const Pnr = require("./pnr");

class Substitutor {
  constructor(testPnrs) {
    this.testPnrsWithTimestamp = testPnrs.sort().map(pnr => {
      const date = this._parseDateFromPnr(pnr);
      return {
        pnr: pnr,
        timestamp: date.getTime()
      };
    });
    this.prevSubstitutions = {};
  }

  /**
   * Returns a replacemennt PNR from the test data given to the constructor. The date closest to the given PNR is returned.
   * This method will return the same replacement for the given `pnr` over and over again.
   * @param {String} pnr
   */
  getReplacement(pnr) {
    const normalizedPnr = Pnr.normalizePnr(pnr);
    if (normalizedPnr in this.prevSubstitutions) {
      return this.prevSubstitutions[normalizedPnr];
    }

    const testPnr = this._findReplacement(normalizedPnr);
    this.prevSubstitutions[normalizedPnr] = testPnr;
    return testPnr;
  }

  _findReplacement(pnr) {
    const targetTimestamp = this._parseDateFromPnr(pnr).getTime();
    return this.testPnrsWithTimestamp.reduce(function(prev, curr) {
      const currDistance = Math.abs(curr.timestamp - targetTimestamp);
      const prevDistance = Math.abs(prev.timestamp - targetTimestamp);
      return currDistance < prevDistance ? curr : prev;
    }).pnr;
  }

  _parseDateFromPnr(pnr) {
    return new Date(
      pnr.substring(0, 4),
      parseInt(pnr.substring(4, 6)) - 1,
      pnr.substring(6, 8)
    );
  }
}

module.exports = Substitutor;
