#!/usr/bin/env node

const pkg = require("../package.json");
const program = require("commander");
const path = require("path");
const finder = require("../lib/finder");

program
  .version(pkg.version)
  .usage("<directory> [options]")
  .option("-v, --verbose", "Enable verbose logging")
  .option(
    "-p, --pattern <pattern>",
    "Glob pattern default is !(node_modules){,/**}"
  )
  .parse(process.argv);

if (program.args.length !== 1) {
  console.log(`Wrong number of arguments`);
  program.outputHelp();
}

const directory = path.join(process.cwd(), program.args[0]);
finder(directory, program.pattern).then(data => {
  data.forEach(item => {
    console.log(item.file);
    item.results.forEach(hit => {
      console.log(`    ${hit.pnr} on line ${hit.line}`);
    });
  });
});
