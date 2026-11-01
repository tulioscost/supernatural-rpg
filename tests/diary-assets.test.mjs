import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read=path=>readFileSync(resolve(root,path),'utf8');
const template=read('templates/actor-sheet.hbs');
const script=read('module/sheets.mjs');
const data=JSON.parse(read('data/items-compendium.json'));
const starter=JSON.parse(read('data/starter.json'));

test('diary navigation defines three player pages plus a creature page',()=>{
  for(const name of ['skills','inventory','lore','creature']) {
    assert.match(template,new RegExp(`data-spn-page="${name}"`));
  }
  assert.match(template,/data-spn-prev/);
  assert.match(template,/data-spn-next/);
  assert.match(template,/data-spn-page-counter/);
  assert.match(script,/page.hidden=!active/);
  assert.match(script,/nav.addEventListener\("click",turn\)/);
  assert.doesNotMatch(template,/\{\{#if isSkills\}\}/);
  assert.doesNotMatch(template,/\{\{#if isInventory\}\}/);
  assert.doesNotMatch(template,/\{\{#if isLore\}\}/);
});

test('47 catalog entries each link a distinct existing themed icon',()=>{
  assert.equal(data.length,47);
  assert.equal(new Set(data.map(i=>i.name)).size,47);
  assert.equal(new Set(data.map(i=>i.img)).size,47);
  for(const i of data){
    assert.match(i.img,/^systems\/supernatural-cacadores\/assets\/items\/.*\.(svg|webp)$/);
    assert.ok(existsSync(resolve(root,i.img.replace('systems/supernatural-cacadores/',''))),i.name);
  }
  assert.deepEqual(new Set(starter.items.map(i=>i.img)),new Set(data.map(i=>i.img)));
});

test('manifest release points to v0.3.0 and compendium creation is idempotent',()=>{
  const manifest=JSON.parse(read('system.json'));
  assert.equal(manifest.version,'0.3.0');
  assert.match(manifest.download,/\/v0\.3\.0\/supernatural-cacadores\.zip$/);
  const code=read('module/main.mjs');
  assert.match(code,/createCompendium/);
  assert.match(code,/const missing=items\.filter/);
  assert.match(code,/await Item\.createDocuments\(missing/);
});
