const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

let elapsedTime;
let result;

beforeAll(() => {
  const start = process.hrtime();
  const output = execSync(
    `${path.join(
      __dirname,
      "../bin/bin.js"
    )} mockdata/test1 mockdata/test2 mockdata/test3 mockdata/test5 mockdata/afile.js`,
    { cwd: __dirname }
  ).toString();
  elapsedTime = process.hrtime(start);
  result = parseResult(output);
});

describe("pnr-scanner", () => {
  test("Should find pnrs in deeply nested files", () => {
    expect(result).toContainEqual({
      file: path.join(
        __dirname,
        "./mockdata/test1/deep/deeper/blackhole/main.java"
      ),
      results: ["121212-1212 on line 3"]
    });
  });

  test("Should find pnrs in large files", () => {
    expect(result).toContainEqual({
      file: path.join(__dirname, "./mockdata/test3/hugefile.txt"),
      results: ["201212121212 on line 1647"]
    });
  });

  test("Should find in files supplied as arguments", () => {
    expect(result).toContainEqual({
      file: path.join(__dirname, "./mockdata/afile.js"),
      results: ["20121212-1212 on line 3", "19121212-1212 on line 4"]
    });
  });

  test("Should respect .gitignore files", () => {
    expect(result).not.toContainEqual({
      file: path.join(__dirname, "./mockdata/test2/ignore/pnr.txt"),
      results: expect.any(Array)
    });
    expect(result).toContainEqual({
      file: path.join(__dirname, "./mockdata/test2/data/data.txt"),
      results: expect.any(Array)
    });
    expect(result).not.toContainEqual({
      file: path.join(__dirname, "./mockdata/test2/data/ignore.txt"),
      results: expect.any(Array)
    });
  });

  test("Should ignore binary files", () => {
    expect(result).not.toContainEqual({
      file: path.join(__dirname, "./mockdata/test4/maxresdefault.jpg"),
      results: expect.any(Array)
    });
  });

  test("Should not find any extra results", () => {
    expect(result.length).toBe(5);
  });

  test("Should have acceptable performance", () => {
    expect(elapsedTime[0] / 1000 + elapsedTime[1] / 1000000).toBeLessThan(1000);
  });

  test("Should use .pnr-config.json config", () => {
    expect(result).not.toContainEqual({
      file: path.join(__dirname, "./mockdata/test5/ignore/pnr.txt"),
      results: expect.any(Array)
    });
    expect(result).toContainEqual({
      file: path.join(__dirname, "./mockdata/test5/data/data.txt"),
      results: ["19121212-1212 on line 1"]
    });
    expect(result).not.toContainEqual({
      file: path.join(__dirname, "./mockdata/test5/data/ignore.txt"),
      results: expect.any(Array)
    });
  });
});

function parseResult(output) {
  return output
    .split("\n")
    .filter(item => item.startsWith(__dirname) || item.startsWith("    "))
    .reduce((acc, curr) => {
      if (curr.startsWith(__dirname)) {
        acc.push({ file: curr, results: [] });
      } else {
        acc[acc.length - 1].results.push(curr.replace("    ", ""));
      }
      return acc;
    }, []);
}
