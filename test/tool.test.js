// Tests for your tool. Add tests for your core logic here as the tool grows.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const Stoit = require('../stoit-sdk.js');

const manifest = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'stoit.json'), 'utf8'));

test('stoit.json is a valid STOIT manifest', () => {
  const r = Stoit.validateManifest(manifest);
  assert.equal(r.ok, true, r.errors.join('; '));
});

test('STOIT would open this tool, and the tool reads the task back', () => {
  const m = Stoit.validateManifest(manifest).manifest;
  const url = Stoit.launchUrl(m, { id: 't1', title: 'Example task', type: m.helpsWith.types[0] || 'action' }, { returnTo: 'https://stoit.app/' });
  assert.equal(Stoit.context({ hash: new URL(url).hash }).task.title, 'Example task');
});
