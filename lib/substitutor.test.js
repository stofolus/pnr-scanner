const Substitutor = require("./substitutor");

describe("Substitutor", () => {
  test("can pick a replacement test pnr", () => {
    const substitutor = new Substitutor(["2"]);
    expect(substitutor.getReplacement("1")).toBe("2");
  });

  test("shall return the same replacement over and over for a pnr", () => {
    const substitutor = new Substitutor(["2"]);
    const firstReplacement = substitutor.getReplacement("1");
    expect(firstReplacement).toBe("2");

    substitutor.testPnrs = [];
    expect(substitutor.getReplacement("1")).toEqual(firstReplacement);
  });

  test("shall pick pnr with same date", () => {
    const substitutor = new Substitutor([
      "20180610xxxx",
      "20180611xxxx",
      "20180612xxxx"
    ]);
    expect(substitutor.getReplacement("20180611yyyy")).toBe("20180611xxxx");
  });

  test("shall pick the earliest pnr if multiple dates are equally close", () => {
    const substitutor = new Substitutor(["20180612xxxx", "20180610xxxx"]);
    expect(substitutor.getReplacement("20180611yyyy")).toBe("20180610xxxx");
  });

  test("should not return the same substitution for multiple pnrs", () => {
    const substitutor = new Substitutor([
      "20180610xxxx",
      "20180615xxxx",
      "20180620xxxx"
    ]);
    expect(substitutor.getReplacement("20180614xxxx")).toBe("20180615xxxx");
    expect(substitutor.getReplacement("20180616xxxx")).toBe("20180620xxxx");
  });

  describe("shall pick pnr with closest date", () => {
    test("crossing new year", () => {
      const substitutor = new Substitutor(["20180131xxxx", "20171231xxxx"]);
      expect(substitutor.getReplacement("20180101yyyy")).toBe("20171231xxxx");
    });

    test("crossing new month", () => {
      const substitutor = new Substitutor(["20180610xxxx", "20180531xxxx"]);
      expect(substitutor.getReplacement("20180601yyyy")).toBe("20180531xxxx");
    });
  });

  describe("checking samordningsnummer", () => {
    test("should not compare with pnr", () => {
      const substitutor = new Substitutor(["20180610xxxx", "20181271xxxx"]);
      expect(substitutor.getReplacement("20180669xxxx")).toBe("20181271xxxx");
    });
  });
});
