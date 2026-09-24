// Tests for the template itself. `npm run new` deletes this file; your tool keeps test/tool.test.js.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');
const Stoit = require('../stoit-sdk.js');
const { check } = require('../scripts/check.js');
const { create } = require('../scripts/new.js');
const { render } = require('../scripts/readme.js');

const root = path.join(__dirname, '..');
// A scratch copy of the template to try things on.
function copy() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'stoit-tool-'));
  for (const f of ['stoit.json', 'README.md', 'index.html', 'app.js', 'styles.css', 'stoit-sdk.js', 'package.json']) fs.copyFileSync(path.join(root, f), path.join(dir, f));
  fs.mkdirSync(path.join(dir, 'test'));
  fs.copyFileSync(path.join(root, 'test', 'template.test.js'), path.join(dir, 'test', 'template.test.js'));
  return dir;
}

test('the template passes its own publish check (TODOs are only warnings here)', () => {
  const r = check(root);
  assert.deepEqual(r.errors, []);
  assert.ok(r.warnings.some((w) => w.includes('TODO')));
});

test('`npm run new` sets the id, name, icon and live URL everywhere', () => {
  const dir = copy();
  create(dir, { id: 'ai-stylist', name: 'AI Stylist', icon: '👗', user: 'someone' });
  const m = JSON.parse(fs.readFileSync(path.join(dir, 'stoit.json'), 'utf8'));
  assert.equal(m.url, 'https://someone.github.io/ai-stylist/');
  assert.equal(m.repo, 'https://github.com/someone/ai-stylist');
  const readme = fs.readFileSync(path.join(dir, 'README.md'), 'utf8');
  assert.ok(readme.startsWith('# 👗 AI Stylist'), 'template notice removed, title set');
  assert.match(readme, /someone\.github\.io\/ai-stylist/);
  assert.match(fs.readFileSync(path.join(dir, 'index.html'), 'utf8'), /<title>AI Stylist<\/title>/);
  assert.match(fs.readFileSync(path.join(dir, 'app.js'), 'utf8'), /'ai-stylist-v1'/);
  assert.equal(fs.existsSync(path.join(dir, 'test', 'template.test.js')), false, 'template-only tests removed');
  assert.throws(() => create(dir, { id: 'Bad Id', name: 'x' }), /lowercase/);
});

test('a new tool can’t publish until its pitch is written, then it can', () => {
  const dir = copy();
  create(dir, { id: 'ai-stylist', name: 'AI Stylist', icon: '👗' });
  assert.ok(check(dir).errors.some((e) => e.includes('TODO')), 'TODOs block publishing');
  const m = JSON.parse(fs.readFileSync(path.join(dir, 'stoit.json'), 'utf8'));
  m.tagline = 'Know what to wear in ten seconds.';
  m.pitch = {
    villain: { name: 'The Closet Standoff', emoji: '🧥', scene: 'Twenty minutes staring at a full closet.' },
    whys: ['One', 'Two', 'Three', 'Four', 'Five'].map((a, i) => ({ q: `Why ${i + 1}?`, a })),
    save: { hours: 5, money: 40, basis: '10 minutes a day' }, howTo: ['Snap outfits', 'Pick one'], bestFor: 'Busy mornings',
  };
  m.helpsWith = { types: ['timeblock'], keywords: ['dress', 'outfit'] };
  fs.writeFileSync(path.join(dir, 'stoit.json'), JSON.stringify(m));
  assert.ok(check(dir).errors.some((e) => e.includes('out of date')), 'a stale README pitch is caught');
  fs.writeFileSync(path.join(dir, 'README.md'), render(dir));
  assert.deepEqual(check(dir).errors, []);
  assert.match(fs.readFileSync(path.join(dir, 'README.md'), 'utf8'), /## The problem: 🧥 The Closet Standoff/);
});

test('the bundled SDK understands the template manifest', () => {
  const m = Stoit.validateManifest(JSON.parse(fs.readFileSync(path.join(root, 'stoit.json'), 'utf8')));
  assert.equal(m.ok, true, m.errors.join('; '));
});
