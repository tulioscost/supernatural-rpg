import {ATTRIBUTES,SKILLS} from "./constants.mjs";
import {poolSize,countRoll,getPulsePenalty,getConditionPenalty,damageResult} from "./rules.mjs";

const safe = x => String(x ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
export async function rollTest(actor, {attribute="rac", skill="investigacao", difficulty=1, item=null, other=0, label="Teste", attack=false, clue=false} = {}) {
  if (!actor) return;
  const sys=actor.system;
  if (!Object.hasOwn(ATTRIBUTES,attribute) || !Object.hasOwn(SKILLS,skill)) {
    ui.notifications.warn("Atributo ou perícia inválidos."); return;
  }
  const attrValue=Number(sys.attributes[attribute] ?? 0);
  const skillValue=Number(sys.skills[skill] ?? 0);
  const temp=Number(sys.modifiers?.temporary ?? 0);
  const mod=Number(item?.system?.bonus ?? 0);
  const cond=getConditionPenalty(sys.conditions,attribute);
  const bpm=getPulsePenalty(sys.pulse.value, Boolean(sys.modifiers?.underPressure));
  const pool=poolSize({attribute:attrValue,skill:skillValue,temporary:temp,item:mod,other,conditions:cond,pulse:bpm});
  const dc=Math.max(1,Math.min(5,Number(difficulty)||1));
  if (!pool) { ui.notifications.warn("Reserva 0d6. Reavalie os modificadores ou a abordagem."); return; }
  const roll=await new Roll(`${pool}d6`).evaluate();
  const faces=roll.dice.flatMap(d=>d.results.map(r=>r.result));
  const result=countRoll(faces,dc);
  const status=result.passed ? '<span class="spn-success">SUCESSO</span>' : '<span class="spn-fail">FALHA</span>';
  const attrs=`${safe(ATTRIBUTES[attribute])} ${attrValue} + ${safe(SKILLS[skill][0])} ${skillValue}`;
  let note="";
  if (clue) note=result.passed
    ? "Pista essencial encontrada; o Narrador acrescenta um detalhe útil, reduz tempo ou expõe uma contramedida."
    : "Pista essencial encontrada mesmo na falha; o Narrador aplica um custo, risco ou avanço do relógio de ameaça.";
  if (item?.type==="ritual") note += ` Ritual: ${safe(item.system.effect || item.system.description)}. Componentes gastos na tentativa: ${item.system.cost}.`;
  if (attack && item) {
    const targetToken=[...game.user.targets][0];
    const target=targetToken?.actor;
    const isCreature=target?.type==="creature";
    const r=damageResult({damage:item.system.damage,armor:target?.system?.protection||0,
      invulnerable:isCreature && target.system.creature.invulnerable,
      weaknessTags:isCreature?target.system.creature.weaknessTags:"",attackTags:item.system.tags});
    const text= target ? `Alvo: <b>${safe(target.name)}</b>. ${r.blocked ? "A arma NÃO aciona a fraqueza: dano ineficaz." : `Dano-base após RD: <b>${r.actual}</b> PV${r.vulnerable ? " (fraqueza acionada)" : ""}.`}` : `Dano-base: <b>${item.system.damage}</b> (selecione um alvo para verificar RD e fraqueza).`;
    note += result.passed ? `${text} Ímpetos podem converter até +2 de dano ou gerar manobra.` : "O ataque errou; não aplicar dano.";
  }
  const content=`<article class="spn-chat"><h3>✦ ${safe(label)}</h3><p>${attrs} | Reserva <b>${pool}d6</b> | D${dc}</p>
     <p>${status} — ${result.successes} sucesso(s), ${result.usableSurges} ímpeto(s) utilizável(is).</p>
     ${note ? `<p class="spn-chat-note">${note}</p>`:""}</article>`;
  await roll.toMessage({speaker:ChatMessage.getSpeaker({actor}),flavor:content});
  if (clue && !result.passed) await actor.update({"system.pulse.value":Math.min(300,Number(sys.pulse.value)+10)});
  return result;
}
export async function useItem(actor,item) {
  if (!actor?.isOwner || !item) return;
  if (item.system.quantity <= 0) {ui.notifications.warn("O item está esgotado.");return;}
  if (item.system.usesAmmo && item.system.ammo<=0) {ui.notifications.warn("Sem munição.");return;}
  const ritual=item.type==="ritual";
  if (ritual && actor.system.resources.supplies < item.system.cost) {ui.notifications.warn("Componentes insuficientes.");return;}
  const changes={};
  if (ritual && item.system.cost>0) changes["system.resources.supplies"]=actor.system.resources.supplies-item.system.cost;
  if (item.type==="weapon" && item.system.usesAmmo) await item.update({"system.ammo":item.system.ammo-1});
  if (Object.keys(changes).length) await actor.update(changes);
  if(item.type==="equipment" && item.system.consumable) await item.update({"system.quantity":Math.max(0,item.system.quantity-1)});
  if (item.type==="weapon" || ritual) {
    return rollTest(actor,{attribute:item.system.attribute,skill:item.system.skill,difficulty:item.system.difficulty,
      item,label:item.name,attack:item.type==="weapon"});
  }
  await ChatMessage.create({speaker:ChatMessage.getSpeaker({actor}),content:`<article class="spn-chat"><h3>${safe(item.name)}</h3><p>${safe(item.system.effect||item.system.description)}</p></article>`});
  if (item.type==="equipment" && item.system.equipped===false && item.system.armor>0) await item.update({"system.equipped":true});
}
