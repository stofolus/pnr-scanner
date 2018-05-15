const mockFs = {
  writeFileSync: jest.fn(),
  readFileSync: jest.fn()
};
jest.mock("fs", () => mockFs);

const mockFileMockDataReader = {
  fetch: jest.fn()
};
jest.mock("./fileMockDataReader", () => mockFileMockDataReader);

const mockSubstitutor = {
  getReplacement: jest.fn()
};
jest.mock("./substitutor", () => {
  return jest.fn().mockImplementation(() => mockSubstitutor);
});

const Fixer = require("./fixer");

describe("Fixer", () => {
  test("overwrites file after replacment", () => {
    mockFs.readFileSync = () => `file content`;
    const finderResult = [
      {
        file: "file.js",
        results: []
      }
    ];

    Fixer.fixPnrs(finderResult);
    expect(mockFs.writeFileSync).toBeCalledWith(
      `file.js`,
      expect.any(String),
      expect.any(String)
    );
  });

  test("replaces real prn with test data", () => {
    mockFs.readFileSync = () => `Bogus pnr: "199999999999".`;
    mockSubstitutor.getReplacement = () => "198888888888";
    const finderResult = [
      {
        file: "file.js",
        results: [
          {
            pnr: "199999999999"
          }
        ]
      }
    ];

    Fixer.fixPnrs(finderResult);
    expect(mockFs.writeFileSync).toBeCalledWith(
      expect.any(String),
      `Bogus pnr: "198888888888".`,
      expect.any(String)
    );
  });

  describe("matchFormat", () => {
    test("can format with spaces", () => {
      expect(Fixer.matchFormat("1 2 3", "789")).toBe("7 8 9");
    });
    test("can format with hyphen", () => {
      expect(Fixer.matchFormat("12-3", "789")).toBe("78-9");
    });
    test("can format with plus", () => {
      expect(Fixer.matchFormat("12+3", "789")).toBe("78+9");
    });
    test("can format with spaces and hypen", () => {
      expect(Fixer.matchFormat("12 - 3", "789")).toBe("78 - 9");
    });
    test("can format with spaces and plus", () => {
      expect(Fixer.matchFormat("12 + 3", "789")).toBe("78 + 9");
    });
    test("'0' is treated as a digit (issue #32)", () => {
      expect(Fixer.matchFormat("19999999-0999", "197503309176")).toBe("19750330-9176");
    });
  });
});
