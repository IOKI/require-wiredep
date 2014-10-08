#!/usr/bin/env node
'use strict';

var pkg = require('./package.json');
var require_wiredep = require('./require-wiredep');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');
var fs = require('fs');

var args = [
  { short: 'h', full: 'help' },
  { short: 'v', full: 'version' },
  { short: 'c', full: 'requireConfig' },
  { short: 'd', full: 'directory' },
  { short: 'e', full: 'exclude' },
  { short: 'i', full: 'ignorePath' },
  { short: 's', full: 'src' }
];

function help() {
  console.log(pkg.description);
  console.log('');
  console.log('Usage: ' + chalk.cyan('$') + chalk.bold(' require-wiredep ') + chalk.yellow('[options]'));
  console.log('');
  console.log('Options:');
  console.log('  -h, --help         # Print usage information');
  console.log('  -v, --version      # Print the version');
  console.log('  -c, --requireConfig    # Path to `require-config.js`');
  console.log('  -s, --src          # Path to your source file');
}

if (argv.v || argv.version) {
  console.log(pkg.version);
  return;
}

if (argv.h || argv.help || Object.keys(argv).length === 1) {
  help();
  return;
}

if (!argv.s && !argv.src) {
  console.log(chalk.bold.red('> Source file not specified.'));
  console.log('Please pass a `--src path/to/source.html` to `require-wiredep`.');
  return;
}

if (argv.c || argv.requireJson) {
  try {
    argv.c = JSON.parse(fs.readFileSync(argv.c || argv.requireConfig));
  } catch (e) {}
}

try {
  if (!argv.requireConfig) {
    fs.statSync('./require-config.js');
  }
} catch (e) {
  console.log(chalk.bold.red('> require.json not found.'));
  console.log('Please run `require-wiredep` from the directory where your `require.json` file is located.');
  console.log('Alternatively, pass a `--requireConfig path/to/require.json`.');
  return;
}

require_wiredep(Object.keys(argv).reduce(function (acc, arg) {
  args.filter(function (argObj) {
    if (argObj.short === arg) {
      acc[argObj.full] = argv[arg];
      delete acc[arg];
    }
  });
  return acc;
}, argv));
