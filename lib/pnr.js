const { DateTime } = require("luxon");

class Pnr {
  static get regex() {
    return /\b(19|20)?[0-9]{2}((0[0-9])|(10|11|12))(([0-2][0-9])|(3[0-1])|(([7-8][0-9])|(6[1-9])|(9[0-1])))[ ]*[-\+]?[ ]*[0-9]{4}/g;
  }

  static isValidPnr(pnr) {
    return this._isValidDate(pnr) && this._isValidLuhn(pnr);
  }

  static normalizePnr(pnr) {
    let normalizedPnr = pnr.replace(/-/g, ``).replace(/ /g, ``);
    if (normalizedPnr.includes(`+`) && normalizedPnr.length < 12) {
      // People over 100
      normalizedPnr = `19${normalizedPnr}`.replace(`+`, ``);
    } else if (normalizedPnr.includes(`+`)) {
      normalizedPnr = normalizedPnr.replace(`+`, ``);
    } else if (normalizedPnr.length === 10) {
      const shortYear = new Date()
        .getFullYear()
        .toString()
        .substr(2);
      if (parseInt(normalizedPnr.substr(0, 2), 10) <= parseInt(shortYear, 10)) {
        normalizedPnr = `20${normalizedPnr}`;
      } else {
        normalizedPnr = `19${normalizedPnr}`;
      }
    }
    return normalizedPnr;
  }

  static _isValidLuhn(pnr) {
    let num = [];
    for (let i = 2; i < pnr.length - 1; i++) {
      let val = parseInt(pnr[i], 10);
      if (i % 2 === 0) {
        val = val * 2;
      }
      num = [...num, ...val.toString().split(``)];
    }
    const controlNumber =
      (10 - num.reduce((acc, curr) => acc + parseInt(curr, 10), 0) % 10) % 10;
    return parseInt(pnr[pnr.length - 1], 10) === controlNumber;
  }

  static _isValidDate(pnr) {
    const date = DateTime.fromFormat(pnr.substring(0, 8), `yyyyMMdd`);
    return date.isValid;
  }
}

module.exports = Pnr;
