const Pnr = require("./pnr");

class Substitutor {
  constructor(testPnrs) {
    this.testPnrsWithTimestamp = testPnrs.sort().map(pnr => {
      const dateAndType = this._getDateAndTypeFromPnr(pnr);
      return {
        pnr: pnr,
        timestamp: dateAndType.date.getTime(),
        type: dateAndType.type,
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
    const dateAndType = this._getDateAndTypeFromPnr(pnr);
    const targetTimestamp = dateAndType.date.getTime();
    return this.testPnrsWithTimestamp
      .filter(curr => curr.type === dateAndType.type)
      .reduce(function (prev, curr) {
        const currDistance = Math.abs(curr.timestamp - targetTimestamp);
        const prevDistance = Math.abs(prev.timestamp - targetTimestamp);
        return currDistance < prevDistance ? curr : prev;
      }).pnr;
  }

  _getDateAndTypeFromPnr(pnr) {
    let day = pnr.substring(6,8);
    let type = "PNR";
    if (day > 60) {
      day = day - 60;
      type = "SAM";

    }
    const date = new Date(pnr.substring(0, 4), parseInt(pnr.substring(4, 6)) - 1, day);
    return {
      date: date,
      type: type,
    }
  }

}

module.exports = Substitutor;
