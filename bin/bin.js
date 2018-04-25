#!/usr/bin/env node

const pkg = require(`../package.json`);
const program = require(`commander`);
const path = require(`path`);
const Finder = require(`../lib/finder`);

program
  .version(pkg.version)
  .usage(`<directory> [options]`)
  .option(`-v, --verbose`, `Enable verbose logging`)
  .option(
    `-p, --pattern <pattern>`,
    `Glob pattern default is !(node_modules){,/**}`
  )
  .parse(process.argv);

if (program.args.length !== 1) {
  console.log(`Wrong number of arguments`);
  program.outputHelp();
}

console.time("pnr-scan");
const directory = path.join(process.cwd(), program.args[0]);
Finder.findPnrs(directory, program.pattern).forEach(item => {
  console.log(item.file);
  item.results.forEach(hit => {
    console.log(`    ${hit.pnr} on line ${hit.line}`);
  });
});
console.timeEnd("pnr-scan");
