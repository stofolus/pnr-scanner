const FileMockDataReader = require("./fileMockDataReader");

describe("Validator", () => {
  const fileContent = ["Testpersonnummer", "201710022383", "201801202381"].join(
    "\r\n"
  );

  beforeEach(() => {
    const mockFs = {
      readdirSync: jest.fn(() => ["/some-path"]),
      readFileSync: jest.fn(data => fileContent)
    };
    jest.mock("fs", () => mockFs);
  });

  describe("fetch()", () => {
    test("returns a list of pnrs", () => {
      expect(FileMockDataReader.fetch()).toEqual(
        expect.arrayContaining(["201801202381", "201710022383"])
      );
    });
    test("can filter out non-pnr lines from mock data", () => {
      expect(FileMockDataReader.fetch()).not.toContain("Testpersonnummer");
    });
  });
});
