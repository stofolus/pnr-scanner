const Validator = require("./validator");

describe("Validator", () => {
  let validator;

  beforeEach(() => {
    validator = new Validator(["1", "2"]);
  });

  describe("isMock()", () => {
    test("returns true if pnr is in mock data", () => {
      expect(validator.isMock("1")).toBeTruthy();
      expect(validator.isMock("2")).toBeTruthy();
    });

    test("returns false if pnr is not in mock data", () => {
      expect(validator.isMock("3")).toBeFalsy();
    });
  });
});
