const path = require("path");

mockFinder = {
  findPnrs: jest.fn(() => [])
};
mockProgram = {
  version: jest.fn(() => mockProgram),
  usage: jest.fn(() => mockProgram),
  option: jest.fn(() => mockProgram),
  outputHelp: jest.fn(),
  parse: jest.fn(a => {
    mockProgram.args = a.slice(2);
  }),
  args: ["dir1", "dir2"]
};
mockConsole = {
  log: jest.fn(),
  time: jest.fn(),
  timeEnd: jest.fn()
};
mockFs = {
  existsSync: jest.fn(() => true)
};

jest.mock(`../lib/finder`, () => mockFinder);
jest.mock(`../lib/fixer`, () => {});
jest.mock(`commander`, () => mockProgram);
jest.mock(`fs`, () => mockFs);
global.console = mockConsole;

describe(`bin.js`, () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });
  test("should call finder once for one dir", () => {
    process.argv = [
      "/usr/local/bin/node",
      "/Users/stoffe/Development/pnr-scanner/bin/bin.js",
      "dir1"
    ];
    require("./bin");
    expect(mockFinder.findPnrs).toHaveBeenCalledTimes(1);
    expect(mockFinder.findPnrs).toHaveBeenCalledWith(
      path.join(process.cwd(), "dir1"),
      undefined
    );
  });

  test("should print output if there aren't enough arguments", () => {
    process.argv = [
      "/usr/local/bin/node",
      "/Users/stoffe/Development/pnr-scanner/bin/bin.js"
    ];
    require("./bin");
    expect(mockProgram.outputHelp).toHaveBeenCalled();
    expect(mockFinder.findPnrs).not.toHaveBeenCalled();
  });
});
