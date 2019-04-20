const Pnr = require("./pnr");

class Substitutor {
  constructor(testPnrs) {
    this.testPnrsWithTimestamp = testPnrs.sort().map(pnr => {
      return {
        pnr: pnr,
        timestamp: this._parseDateFromPnr(pnr),
        type: this._parseTypeFromPnr(pnr)
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
    const type = this._parseTypeFromPnr(pnr);
    const targetTimestamp = this._parseDateFromPnr(pnr).getTime();
    return this.testPnrsWithTimestamp
      .filter(curr => curr.type === type)
      .reduce(function(prev, curr) {
        const currDistance = Math.abs(curr.timestamp - targetTimestamp);
        const prevDistance = Math.abs(prev.timestamp - targetTimestamp);
        return currDistance < prevDistance ? curr : prev;
      }).pnr;
  }

  _parseTypeFromPnr(pnr) {
    let day = pnr.substring(6, 8);
    return day > 60 ? "SAM" : "PNR"
  }

  _parseDateFromPnr(pnr) {
    let day = pnr.substring(6, 8);
    if (day > 60) {
      day = day - 60;
    }
    return new Date(
      pnr.substring(0, 4),
      parseInt(pnr.substring(4, 6)) - 1,
      day
    );
  }
}

module.exports = Substitutor;
