const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

test("Integration test", () => {
  const start = process.hrtime();
  const output = execSync(
    `${path.join(
      __dirname,
      "../bin/bin.js"
    )} mockdata/test1 mockdata/test2 mockdata/test3 mockdata/afile.js`,
    { cwd: __dirname }
  ).toString();
  const elapsedTime = process.hrtime(start);
  const result = parseResult(output);

  // Find deep
  expect(result).toContainEqual({
    file: path.join(
      __dirname,
      "./mockdata/test1/deep/deeper/blackhole/main.java"
    ),
    results: ["121212-1212 on line 3"]
  });

  // Find in a large fil
  expect(result).toContainEqual({
    file: path.join(__dirname, "./mockdata/test3/hugefile.txt"),
    results: ["201212121212 on line 1647"]
  });

  // Find in a direct filex
  expect(result).toContainEqual({
    file: path.join(__dirname, "./mockdata/afile.js"),
    results: ["20121212-1212 on line 3", "19121212-1212 on line 4"]
  });

  // Respect .gitignore
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

  // Ignore binary files
  expect(result).not.toContainEqual({
    file: path.join(__dirname, "./mockdata/test4/maxresdefault.jpg"),
    results: expect.any(Array)
  });

  // Make sure there are no unexpected hits
  expect(result.length).toBe(4);

  // Make sure performance hasn't worsened and execution is faster than 1 sec
  expect(elapsedTime[0] / 1000 + elapsedTime[1] / 1000000).toBeLessThan(1000);
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
