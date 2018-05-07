#!/usr/bin/env node

const pkg = require(`../package.json`);
const program = require(`commander`);
const path = require(`path`);
const Finder = require(`../lib/finder`);
const Fixer = require(`../lib/fixer`);
const Logger = require(`../lib/logger/logger`);
const logger = new Logger(`bin.js`);

program
  .version(pkg.version)
  .usage(`<paths ...> [options]`)
  .option(`-v, --verbose`, `Enable verbose logging`)
  .option(
    `-p, --pattern <pattern>`,
    `Glob pattern default is !(node_modules){,/**}`
  )
  .option(`-f, --fix`, `Replace real pnrs with test pnrs`)
  .parse(process.argv);

if (program.verbose) {
  Logger.setLevel(Logger.levels.DEBUG);
  logger.debug(`Verbose mode on`);
}

if (program.args.length < 1) {
  logger.warning(`Wrong number of arguments`);
  program.outputHelp();
}

console.time("pnr-scan");
let result = [];
for (const arg of program.args) {
  const directory = path.join(process.cwd(), arg);
  result = result.concat(Finder.findPnrs(directory, program.pattern));
}
console.timeEnd("pnr-scan");

if (program.fix && result.length > 0) {
  console.time("pnr-fix");
  Fixer.fixPnrs(result);
  console.timeEnd("pnr-fix");
}

result.forEach(item => {
  logger.print(item.file);
  item.results.forEach(hit => {
    if (hit.replacement) {
      logger.print(`    ${hit.pnr} => ${hit.replacement} on line ${hit.line}`);
    } else {
      logger.print(`    ${hit.pnr} on line ${hit.line}`);
    }
  });
});
