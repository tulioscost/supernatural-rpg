import test from "node:test";
import assert from "node:assert/strict";
import {poolSize,countRoll,damageResult,getPulsePenalty,getConditionPenalty,tagsMatch} from "../module/rules.mjs";

test("reserva tem piso 0 e teto 10",()=>{
  assert.equal(poolSize({attribute:4,skill:4,item:5}),10);
  assert.equal(poolSize({attribute:1,skill:0,temporary:-5}),0);
});
test("ímpeto é utilizável somente em sucesso",()=>{
  assert.deepEqual(countRoll([1,5,6,6],3),{successes:3,surges:2,usableSurges:2,passed:true});
  assert.equal(countRoll([6,1],2).usableSurges,0);
});
test("inimigo imune bloqueia arma errada",()=>{
  assert.equal(damageResult({damage:3,armor:1,invulnerable:true,weaknessTags:"prata, ferro",attackTags:"sal"}).actual,0);
  assert.equal(damageResult({damage:3,armor:1,invulnerable:true,weaknessTags:"prata, ferro",attackTags:"prata"}).actual,2);
});
test("tags são separadas por vírgulas e não por subpalavras",()=>{
  assert.equal(tagsMatch("ferro doce", "ferro"),false);
  assert.equal(tagsMatch("SAL, FOGO", "prata, fogo"),true);
});
test("pânico e condições não acumulam penalidade nominal",()=>{
  assert.equal(getPulsePenalty(90,true),0);
  assert.equal(getPulsePenalty(100,true),-1);
  assert.equal(getPulsePenalty(151,true),-2);
  assert.equal(getPulsePenalty(151,false),0);
  assert.equal(getConditionPenalty("exausto, panico, ferido","for"),-2);
});
