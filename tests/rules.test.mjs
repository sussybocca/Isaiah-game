import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const code=fs.readFileSync(new URL('../src/game/rules.ts',import.meta.url),'utf8');
test('core rules contain complete chapter mechanics',()=>{
 for(const id of ['canOpenDreamExit','detectionRadius','getCatchOutcome','legalPosition','spawnAfterCatch'])assert.match(code,new RegExp(id));
});
test('all six key items and three exit routes exist',()=>{
 const data=fs.readFileSync(new URL('../src/game/data.ts',import.meta.url),'utf8');
 for(let i=1;i<=6;i++)assert.match(data,new RegExp(`id: 'key${i}'`));
 for(const route of ['exit_hall','exit_mirror','exit_garden']) assert.ok(data.includes(route));
});
test('Netlify is configured for Vite dist output',()=>{
 const cfg=fs.readFileSync(new URL('../netlify.toml',import.meta.url),'utf8');
 assert.match(cfg,/publish = "dist"/);assert.match(cfg,/npm run build/);
});
