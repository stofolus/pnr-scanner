const fileContent = ["Testpersonnummer", "201710022383", "201801202381"].join(
  "\r\n"
);
const mockFs = {
  existsSync: jest.fn(file => true),
  readFileSync: jest.fn(data => fileContent)
};
jest.mock("fs", () => mockFs);

const WhitelistReader = require("./whitelistReader");

describe("WhitelistReader", () => {
  describe("fetch()", () => {
    test("returns a list of pnrs", () => {
      expect(WhitelistReader.fetch("nicePath")).toEqual(
        expect.arrayContaining(["201801202381", "201710022383"])
      );
    });
    test("can filter out non-pnr lines from mock data", () => {
      expect(WhitelistReader.fetch("nicePath")).not.toContain(
        "Testpersonnummer"
      );
    });
  });
});
