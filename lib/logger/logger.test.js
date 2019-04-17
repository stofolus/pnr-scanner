const Logger = require(`./logger`);
const mockConsole = {
  log: jest.fn(),
  error: jest.fn()
};
global.console = mockConsole;

beforeEach(() => {
  jest.clearAllMocks();
});

describe(`Should only print for correct levels`, () => {
  test(`for debug`, () => {
    testLogging("DEBUG");
  });
  test(`for info`, () => {
    testLogging("INFO");
  });
  test(`for warning`, () => {
    testLogging("WARNING");
  });
  test(`for error`, () => {
    Logger.setLevel(Logger.levels.ERROR);
    const logger = new Logger("ERROR");
    logger.error(`test`);
    Logger.setLevel(Logger.levels.ERROR + 1);
    logger.error(`don't output`);
    expect(console.error).toHaveBeenCalledTimes(1);
    expect(console.error).toHaveBeenCalledWith(`ERROR:`, `test`);
  });
  test(`for print`, () => {
    Logger.setLevel(0);
    const logger = new Logger("PRINT");
    logger.print(`test`);
    Logger.setLevel(10);
    logger.print(`output`);
    expect(console.log).toHaveBeenCalledTimes(2);
  });
});

function testLogging(level) {
  Logger.setLevel(Logger.levels[level]);
  const logger = new Logger(level);
  logger[level.toLowerCase()](`test`);
  Logger.setLevel(Logger.levels[level] + 1);
  logger[level.toLowerCase()](`don't output`);
  expect(console.log).toHaveBeenCalledTimes(1);
  expect(console.log).toHaveBeenCalledWith(`${level}:`, `test`);
}
