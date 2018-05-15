const Substitutor = require("./substitutor");
const FileMockDataReader = require("./fileMockDataReader");
const fs = require(`fs`);

const substitutor = new Substitutor(FileMockDataReader.fetch());

class Fixer {
  static fixPnrs(finderResult) {
    finderResult.forEach(item => {
      let fileContent = fs.readFileSync(item.file, "utf8");
      item.results.forEach(result => {
        const realPnr = result.pnr;
        let testPnr = substitutor.getReplacement(realPnr);
        testPnr = Fixer.matchFormat(realPnr, testPnr);
        fileContent = fileContent.replace(realPnr, testPnr);
        result.replacement = testPnr;
      });
      fs.writeFileSync(item.file, fileContent, "utf8");
    });
  }

  static matchFormat(pnrToMatch, testPnr) {
    let realPnrBackwards = pnrToMatch
      .slice()
      .split("")
      .reverse();
    let testPnrBackwards = testPnr
      .slice()
      .split("")
      .reverse();
    let lastReplacedIndex = -1;
    testPnrBackwards.forEach(char => {
      let charHasBeenReplaced = false;
      while (
        !charHasBeenReplaced &&
        lastReplacedIndex < realPnrBackwards.length
      ) {
        const nextIndexToReplace = lastReplacedIndex + 1;
        if (Fixer.isCharDigit(realPnrBackwards[nextIndexToReplace])) {
          realPnrBackwards[nextIndexToReplace] = char;
          charHasBeenReplaced = true;
        }
        lastReplacedIndex = nextIndexToReplace;
      }
    });

    return realPnrBackwards.reverse().join("");
  }

  static isCharDigit(char) {
    return Number.isInteger(parseInt(char));
  }
}

module.exports = Fixer;
