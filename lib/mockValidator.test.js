const mockData = ["Testpersonnummer", "201710022383", "201801202381"].join(
  "\r\n"
);
const mockFs = {
  readdirSync: jest.fn(() => ["/some-path"]),
  readFileSync: jest.fn(data => mockData)
};
jest.mock("fs", () => mockFs);

const Validator = require(`./mockValidator`);

describe(`Validator`, () => {
  describe(`isMock()`, () => {
    test(`returns true if pnr is in mock data`, () => {
      expect(Validator.isMock("201710022383")).toBeTruthy();
      expect(Validator.isMock("201801202381")).toBeTruthy();
    });

    test(`returns false if pnr is not in mock data`, () => {
      expect(Validator.isMock("201801012392")).toBeFalsy();
    });
  });

  describe(`can filter out non-pnr lines from mock data`, () => {
    test(`returns false if pnr is not in mock data`, () => {
      expect(Validator.isMock("Testpersonnummer")).toBeFalsy();
    });
  });
});
