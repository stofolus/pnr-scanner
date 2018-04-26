#!/usr/bin/env node

const pkg = require(`../package.json`);
const program = require(`commander`);
const path = require(`path`);
const Finder = require(`../lib/finder`);
const Fixer = require(`../lib/fixer`);

program
  .version(pkg.version)
  .usage(`<directory> [options]`)
  .option(`-v, --verbose`, `Enable verbose logging`)
  .option(
    `-p, --pattern <pattern>`,
    `Glob pattern default is !(node_modules){,/**}`
  )
  .option(`-f, --fix`, `Replace real pnrs with test pnrs`)
  .parse(process.argv);

if (program.args.length !== 1) {
  console.log(`Wrong number of arguments`);
  program.outputHelp();
}

console.time("pnr-scan");
const directory = path.join(process.cwd(), program.args[0]);
const result = Finder.findPnrs(directory, program.pattern);
console.timeEnd("pnr-scan");

if (program.fix && result.length > 0) {
  console.time("pnr-fix");
  Fixer.fixPnrs(result);
  console.timeEnd("pnr-fix");
}

result.forEach(item => {
  console.log(item.file);
  item.results.forEach(hit => {
    if (hit.replacement) {
      console.log(`    ${hit.pnr} => ${hit.replacement} on line ${hit.line}`);
    } else {
      console.log(`    ${hit.pnr} on line ${hit.line}`);
    }
  });
});
