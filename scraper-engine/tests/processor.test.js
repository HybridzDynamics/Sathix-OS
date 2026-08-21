const test = require('node:test');
const assert = require('node:assert/strict');
const { validate, isValidUrl } = require('../src/processor/validator');
const { normalizeWhitespace, removeBoilerplate, cleanRecord } = require('../src/processor/cleaner');
const { generateId, format } = require('../src/processor/formatter');

test('isValidUrl accepts http and https URLs', () => {
  assert.equal(isValidUrl('https://gov.in/schemes'), true);
  assert.equal(isValidUrl('not-a-url'), false);
});

test('validate rejects records missing title/summary or with short content', () => {
  const invalid = validate({ url: 'https://gov.in/a', content: 'short' });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.includes('missing_title_or_summary'));
  assert.ok(invalid.errors.includes('content_too_short'));
});

test('validate accepts a well-formed record', () => {
  const result = validate({
    title: 'Farmer Support Scheme',
    url: 'https://gov.in/farmer',
    content: 'A'.repeat(60)
  });
  assert.equal(result.valid, true);
  assert.deepEqual(result.errors, []);
});

test('normalizeWhitespace strips HTML and collapses spaces', () => {
  const input = '<p>Hello   &nbsp;  world</p>\n\n\nTest';
  assert.equal(normalizeWhitespace(input), 'Hello world Test');
});

test('cleanRecord normalizes title and content fields', () => {
  const cleaned = cleanRecord({
    title: '  Scheme   Name  ',
    content: '<b>Benefits</b> for farmers across India with support.'
  });
  assert.equal(cleaned.title, 'Scheme Name');
  assert.match(cleaned.content, /Benefits for farmers/);
});

test('generateId is stable for the same url and title', () => {
  const a = generateId('https://gov.in/a', 'Scheme A');
  const b = generateId('https://gov.in/a', 'Scheme A');
  const c = generateId('https://gov.in/b', 'Scheme A');
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test('format produces canonical scheme schema', () => {
  const record = format({
    title: 'PM-KISAN',
    summary: 'Income support for farmers',
    url: 'https://gov.in/pm-kisan',
    content: 'Monthly income support scheme for eligible farmer families.',
    meta: { state: 'All India', category: 'Agriculture' }
  });
  assert.equal(record.name, 'PM-KISAN');
  assert.equal(record.state, 'All India');
  assert.equal(record.sourceUrl, 'https://gov.in/pm-kisan');
  assert.ok(record.id);
});
