import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';

// Execute the pure game rules without a browser, npm download, or mocked three.js.
const dataSource = stripTypeScriptTypes(fs.readFileSync(new URL('../src/game/data.ts', import.meta.url), 'utf8'));
const dataUrl = `data:text/javascript;base64,${Buffer.from(dataSource).toString('base64')}`;
const ruleSource = fs.readFileSync(new URL('../src/game/rules.ts', import.meta.url), 'utf8')
  .replace("from './data'", `from '${dataUrl}'`);
const { ITEMS, KEY_COUNT, LIMITS, START } = await import(dataUrl);
const { canOpenDreamExit, detectionRadius, getCatchOutcome, legalPosition, spawnAfterCatch } =
  await import(`data:text/javascript;base64,${Buffer.from(stripTypeScriptTypes(ruleSource)).toString('base64')}`);

test('six unique keys exist and all three original ending routes are present', () => {
  const ids = ITEMS.filter(x => x.kind === 'key').map(x => x.id);
  assert.equal(KEY_COUNT, 6);
  assert.equal(new Set(ids).size, 6);
  assert.equal(ITEMS.filter(x => x.kind === 'exit').length, 3);
});
test('dream exits require six distinct valid keys', () => {
  const five = ['key1', 'key2', 'key3', 'key4', 'key5'];
  assert.equal(canOpenDreamExit(five), false);
  assert.equal(canOpenDreamExit([...five, 'key5', 'key7']), false);
  assert.equal(canOpenDreamExit([...five, 'key6']), true);
});
test('movement stays within fictional world bounds', () => {
  assert.deepEqual(legalPosition({ x: 999, z: -999 }), { x: LIMITS.x, z: -LIMITS.z });
  assert.deepEqual(legalPosition(START), START);
});
test('crouching reduces detection compared with sprinting', () => {
  assert.ok(detectionRadius(false, true, false, 0) < detectionRadius(false, false, false, 0));
  assert.ok(detectionRadius(true, false, false, 0) > detectionRadius(false, false, false, 0));
  assert.ok(detectionRadius(false, false, true, 1) > detectionRadius(false, false, false, 0));
});
test('two dream rewinds and a third loop outcome', () => {
  assert.equal(getCatchOutcome(0), 'caught');
  assert.equal(getCatchOutcome(1), 'caught');
  assert.equal(getCatchOutcome(2), 'loop');
  assert.deepEqual(spawnAfterCatch(), START);
});
