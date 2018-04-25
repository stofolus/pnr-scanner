# pnr-scanner [![CircleCI](https://circleci.com/gh/stofolus/pnr-scanner/tree/master.svg?style=svg)](https://circleci.com/gh/stofolus/pnr-scanner/tree/master)

> Find Swedish social security numbers (personnummer) in your code

_Due to GDPR it's more important than ever to not have personal information outside of your production environment. This project aims to help people find and fix Swedish SSNs (personnummer) in code (or any textfiles)_

---

## Usage

### Once

If your only need to do this once you could run it with `npx`. It takes a bit longer but doens't require an install command (it installs it before each run and removes it after)

```
$ npx pnr-scanner .
```

### Often

If you intend to run this package more than once I suggest you install it globally since this will be alot faster. The downside to this is that you have to update it yourself

```
$ npm install --global pnr-scanner
$ pnr-scanner .
```

### Options

```
  Usage: pnr-scanner <directory> [options]

  Options:

    -V, --version            output the version number
    -v, --verbose            Enable verbose logging
    -p, --pattern <pattern>  Glob pattern default is !(node_modules){,/**}
    -h, --help               output usage information
```

## Todo

* `--fix` - an option that helps the user to fix any real SSNs with test data
