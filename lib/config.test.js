const mockFsData = {
  "/path/to/folder1": `exists`,
  "/path/to/folder1/.pnr-scanner.json": JSON.stringify({
    pattern: `!(node_modules|custom_build){,/**}`,
    ignorePath: [`./skip/this`],
    ignorePnr: [`191212121212`]
  }),
  "/path/to/folder2": `exists`,
  "/path/to/folder2/.pnr-scanner.json": JSON.stringify({
    pattern: `!(node_modules|custom_build){,/**}`,
    ignorePath: `./skip/that`,
    ignorePnr: `191212121212`
  }),
  "/path/to/folder3": `exists`,
  "/path/to/folder3/.pnr-scanner.json": JSON.stringify({
    ignorePnr: [`20121212-1212`, `000914-2399`]
  })
};

const mockFs = {
  existsSync: path => mockFsData.hasOwnProperty(path),
  readFileSync: jest.fn(data => mockFsData[data])
};

jest.mock("fs", () => mockFs);
const Config = require("./config");
describe(`config`, () => {
  it(`should give default values if file doesn't exist`, () => {
    expect(Config.getConfig(`/path/is/empty`)).toEqual({
      pattern: `!(node_modules){,/**}`,
      ignorePath: [],
      ignorePnr: []
    });
  });

  it(`should read config if file exists`, () => {
    expect(Config.getConfig(`/path/to/folder1`)).toEqual({
      pattern: `!(node_modules|custom_build){,/**}`,
      ignorePath: ["./skip/this"],
      ignorePnr: ["191212121212"]
    });
  });

  it(`should convert strings into arrays`, () => {
    expect(Config.getConfig(`/path/to/folder2`)).toEqual({
      pattern: `!(node_modules|custom_build){,/**}`,
      ignorePath: ["./skip/that"],
      ignorePnr: ["191212121212"]
    });
  });

  it(`should normalize pnrs`, () => {
    expect(Config.getConfig(`/path/to/folder3`)).toEqual({
      pattern: `!(node_modules){,/**}`,
      ignorePath: [],
      ignorePnr: ["201212121212", "200009142399"]
    });
  });
});
