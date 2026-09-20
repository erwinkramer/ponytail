#!/usr/bin/env node
// Smoke test for the Copilot plugin adapter: keep command wiring minimal and
// ensure the debt command is part of the shared command surface.

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const REQUIRED_COMMAND_FILES = [
  'ponytail.toml',
  'ponytail-review.toml',
  'ponytail-audit.toml',
  'ponytail-debt.toml',
  'ponytail-gain.toml',
  'ponytail-help.toml',
];

function readJSON(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), 'utf8'));
}

test('copilot plugin command directory includes ponytail-debt', () => {
  const manifest = readJSON('plugin.json');
  const copilot = manifest.extensions['com.github.copilot'];
  assert.equal(manifest.name, 'ponytail');
  assert.equal(copilot.commands, './commands/');
  assert.equal(copilot.hooks, './hooks/copilot-hooks.json');
  assert.equal(fs.existsSync(path.join(root, '.github', 'plugin', 'plugin.json')), false);

  for (const file of REQUIRED_COMMAND_FILES) {
    assert.ok(
      fs.existsSync(path.join(root, copilot.commands, file)),
      `missing command file: ${copilot.commands}${file}`,
    );
  }
});
