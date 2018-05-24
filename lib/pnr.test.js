const Pnr = require(`./pnr`);

describe(`normalizePnr`, () => {
  test(`Should normalize pnrs from 1990`, () => {
    expect(Pnr.normalizePnr(`9010162395`)).toBe(`199010162395`);
    expect(Pnr.normalizePnr(`901016-2395`)).toBe(`199010162395`);
    expect(Pnr.normalizePnr(`199010162395`)).toBe(`199010162395`);
    expect(Pnr.normalizePnr(`19901016-2395`)).toBe(`199010162395`);
  });
  test(`Should normalize pnrs from 2000`, () => {
    expect(Pnr.normalizePnr(`0009142399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`000914-2399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`200009142399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`20000914-2399`)).toBe(`200009142399`);
  });
  test(`Should normalize pnrs older than 100`, () => {
    expect(Pnr.normalizePnr(`0601019854`)).toBe(`200601019854`); //This is not enough info. We're gonna guess wrong
    expect(Pnr.normalizePnr(`060101+9854`)).toBe(`190601019854`);
    expect(Pnr.normalizePnr(`190601019854`)).toBe(`190601019854`);
    expect(Pnr.normalizePnr(`19060101+9854`)).toBe(`190601019854`);
  });
  test(`Should normalize pnrs with spaces and hyphens`, () => {
    expect(Pnr.normalizePnr(`20000914- 2399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`20000914 -2399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`20000914 - 2399`)).toBe(`200009142399`);
    expect(Pnr.normalizePnr(`20000914      -       2399`)).toBe(`200009142399`);
  });
});

describe(`isValidPnr`, () => {
  test(`Should correctly handle valid pnrs`, () => {
    expect(Pnr.isValidPnr(`199010162395`)).toBeTruthy();
  });
  test(`Should correctly handle invalid pnrs`, () => {
    expect(Pnr.isValidPnr(`199010162393`)).toBeFalsy();
  });
  test(`Should be able to handle pnr ending on 0`, () => {
    expect(Pnr.isValidPnr(`201701062380`)).toBeTruthy();
  });
  test(`Should not match invalid dates`, () => {
    expect(Pnr.isValidPnr(`000000000000`)).toBeFalsy();
  });
});

describe(`regex`, () => {
  test(`Should match 12 digit pnrs`, () => {
    expect(Pnr.regex.test(`198511179882`)).toBeTruthy();
  });
  test(`Should match 12 digit pnrs with hyphens`, () => {
    expect(Pnr.regex.test(`19851117-9882`)).toBeTruthy();
  });
  test(`Should match 10 digit pnrs`, () => {
    expect(Pnr.regex.test(`8511179882`)).toBeTruthy();
  });
  test(`Should match 10 digit pnrs with hyphens`, () => {
    expect(Pnr.regex.test(`851117-9882`)).toBeTruthy();
  });
  test(`Should match pnrs with spaces between date and last digits`, () => {
    expect(Pnr.regex.test(`19851117 9882`)).toBeTruthy();
    expect(Pnr.regex.test(`19851117       9882`)).toBeTruthy();
  });
  test(`Should match pnrs with spaces and hyphens between date and last digits`, () => {
    expect(Pnr.regex.test(`19851117 -9882`)).toBeTruthy();
    expect(Pnr.regex.test(`19851117   -    9882`)).toBeTruthy();
  });
  test(`Should match pnrs with + between date and last digits`, () => {
    expect(Pnr.regex.test(`19851117+9882`)).toBeTruthy();
  });
  test(`Should match pnrs with a trailing character`, () => {
    expect(Pnr.regex.test(`198511179882L`)).toBeTruthy();
  });
  test(`Should not match pnrs with a several hyphens or plus before last 4 characters`, () => {
    expect(Pnr.regex.test(`19851117---++9882`)).toBeFalsy();
  });
});
