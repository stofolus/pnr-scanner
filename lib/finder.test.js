const mockGlob = {
  sync: jest.fn(() => {
    return [`/path/to/file1`, `/path/to/file2`, `/path/to/file3`];
  })
};
const mockFsData = {
  "/path/to/file1": "A pnr in here 198504129886",
  "/path/to/file2": "No pnr here, empty result",
  "/path/to/file3": "195410062656 is also a valid pnr",
  "/path/to/file4": `195410062656 is also a valid pnr
  an empty row
  another hit 195410062656
  `,
  "/path/to/file5": "195309112489 is is a mocked pnr"
};

const mockFs = {
  existsSync: path => mockFsData.hasOwnProperty(path),
  readFileSync: jest.fn(data => mockFsData[data])
};
const mockIsTextOrBinary = {
  isTextSync: jest.fn(data => !data.includes(`binary`))
};
const mockMockValidator = {
  isMock: jest.fn(pnr => pnr === "195309112489")
};
jest.doMock("glob", () => mockGlob);
jest.mock("fs", () => mockFs);
jest.mock("istextorbinary", () => mockIsTextOrBinary);
jest.mock("./mockValidator", () => mockMockValidator);

const Finder = require("./finder");

describe(`findPnrs`, () => {
  test(`Should use a default fallback pattern`, () => {
    Finder.findPnrs("/home/root/secret_codebase");
    expect(mockGlob.sync).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object)
    );
  });
  test(`Should remove empty results`, () => {
    const result = Finder.findPnrs("/home/root/secret_codebase");
    expect(result.includes()).toBeFalsy();
    expect(result.length).toBe(2);
  });
  test(`Should return a correct structure`, () => {
    const result = Finder.findPnrs("/home/root/secret_codebase");
    expect(result).toEqual([
      { file: "/path/to/file1", results: [{ line: 1, pnr: "198504129886" }] },
      { file: "/path/to/file3", results: [{ line: 1, pnr: "195410062656" }] }
    ]);
  });
});

describe(`getPnrsInFile`, () => {
  test(`Should be able to find multiple results`, () => {
    const result = Finder.getPnrsInFile("/path/to/file4");
    expect(result.length).toBe(2);
  });
  test(`Should return an empty result for binary files`, () => {
    const result = Finder.getPnrsInFile("/path/to/binary");
    expect(result.length).toBe(0);
  });
  test(`Should not return mocked pnrs`, () => {
    const result = Finder.getPnrsInFile("/path/to/file5");
    expect(result.length).toBe(0);
  });
});

describe(`_getIgnoreGlobs`, () => {
  beforeEach(() => {
    delete mockFsData["/path/.gitignore"];
  });
  test(`prepend **/ on each glob in .gitignore`, () => {
    mockFsData["/path/.gitignore"] = "*.java";
    const result = Finder._getIgnoreGlobs("/path");
    expect(result).toEqual(expect.arrayContaining(["**/*.java"]));
  });
  test(`removes comments from .gitignore`, () => {
    mockFsData["/path/.gitignore"] = "#comment";
    const result = Finder._getIgnoreGlobs("/path");
    expect(result).toEqual(expect.arrayContaining([]));
  });
  test(`return empty list if .gitignore does not exists`, () => {
    const result = Finder._getIgnoreGlobs("/bogus");
    expect(result).toEqual(expect.arrayContaining([]));
  });
});
