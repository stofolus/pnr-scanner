const Pnr = require("./pnr");

describe(`normalizePnr`, () => {
  test(`Should normalize pnrs from 1990`, () => {
    expect(Pnr.normalizePnr("9010162395")).toBe("199010162395");
    expect(Pnr.normalizePnr("901016-2395")).toBe("199010162395");
    expect(Pnr.normalizePnr("199010162395")).toBe("199010162395");
    expect(Pnr.normalizePnr("19901016-2395")).toBe("199010162395");
  });

  test(`Should normalize pnrs from 2000`, () => {
    expect(Pnr.normalizePnr("0009142399")).toBe("200009142399");
    expect(Pnr.normalizePnr("000914-2399")).toBe("200009142399");
    expect(Pnr.normalizePnr("200009142399")).toBe("200009142399");
    expect(Pnr.normalizePnr("20000914-2399")).toBe("200009142399");
  });

  test(`Should normalize pnrs older than 100`, () => {
    expect(Pnr.normalizePnr("0601019854")).toBe("200601019854"); //This is not enough info. We're gonna guess wrong
    expect(Pnr.normalizePnr("060101+9854")).toBe("190601019854");
    expect(Pnr.normalizePnr("190601019854")).toBe("190601019854");
    expect(Pnr.normalizePnr("19060101+9854")).toBe("190601019854");
  });
});

describe(`isValidPnr`, () => {
  test(`Should correctly handle valid pnrs`, () => {
    expect(Pnr.isValidPnr("199010162395")).toBeTruthy();
  });

  test(`Should correctly handle invalid pnrs`, () => {
    expect(Pnr.isValidPnr("199010162393")).toBeFalsy();
  });
});
