# pnr-scanner [![CircleCI](https://circleci.com/gh/stofolus/pnr-scanner/tree/master.svg?style=svg)](https://circleci.com/gh/stofolus/pnr-scanner/tree/master)

> Find Swedish personal identity numbers (personnummer) in your code

_Due to GDPR it's more important than ever to not have personal information outside of your production environment. This project aims to help people find and fix Swedish personal identity numbers (personnummer) in code (or any textfiles)_

---

## Usage

### Once

If your only need to do this once you could run it with `npx`. It takes a bit longer but doens't require an install command (it installs it before each run and removes it after)

```
$ npx pnr-scanner .
```

### Often

If you intend to run this package more than once I suggest you install it globally since this will be alot faster. The downside to this is that you will have to update it yourself

```
$ npm install --global pnr-scanner
$ pnr-scanner .
```

### Options

```
  Usage: pnr-scanner <directories or files> [options]

  Options:

    -V, --version            output the version number
    -v, --verbose            Enable verbose logging
    -p, --pattern <pattern>  Glob pattern default is !(node_modules){,/**}
    -f, --fix                Replace real pnrs with test pnrs
    -h, --help               output usage information
```

### Config file

You can create a `.pnr-scanner.json` file in your project root to keep custom configuration

#### pattern

Type: `string`
Default: `!(node_modules){,/**}`

Glob pattern to be used when searching for files. Can be used instead of the `--pattern` option. Using `--pattern` will override this config

#### ignorePattern

Type: `string | array`

One or more glob patterns to be ignored

#### ignorePnr

Type: `string | array`

One or more pnrs to ignore (replaces whitelist).

### Whitelist (Deprecated)

If your project has any false positives that you want to exclude from the search you can place a .pnr-whitelist file in your search root. This file should have one whitelisted pnr per line.
