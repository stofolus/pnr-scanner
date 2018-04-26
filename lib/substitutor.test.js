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
});
