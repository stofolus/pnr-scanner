const mockFsData = {
  "/path/to/folder1/.pnr-whitelist": [
    "Testpersonnummer",
    "201710022383",
    "201801202381"
  ].join("\r\n"),
  "/path/to/folder2/.pnr-whitelist": ["171002-2383", "19121212-1212"].join(
    "\r\n"
  )
};
const mockFs = {
  existsSync: path => mockFsData.hasOwnProperty(path),
  readFileSync: jest.fn(data => mockFsData[data])
};
jest.mock("fs", () => mockFs);

const WhitelistReader = require("./whitelistReader");

describe("WhitelistReader", () => {
  describe("fetch()", () => {
    test("returns a list of pnrs", () => {
      expect(WhitelistReader.fetch("/path/to/folder1")).toEqual(
        expect.arrayContaining(["201801202381", "201710022383"])
      );
    });
    test("can filter out non-pnr lines from mock data", () => {
      expect(WhitelistReader.fetch("/path/to/folder1")).not.toContain(
        "Testpersonnummer"
      );
    });
    test("normalizes pnrs", () => {
      expect(WhitelistReader.fetch("/path/to/folder2")).toEqual([
        "201710022383",
        "191212121212"
      ]);
    });
  });
});
