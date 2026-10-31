/** Pure rules: intentionally testable without Foundry. */
export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
export function poolSize({attribute=0, skill=0, temporary=0, item=0, other=0, conditions=0, pulse=0}) {
  return clamp([attribute,skill,temporary,item,other,conditions,pulse].reduce((a,b) => a+Number(b||0),0),0,10);
}
export function countRoll(dice, difficulty=1) {
  const successes=dice.filter(n=>n>=5).length;
  const surges=dice.filter(n=>n===6).length;
  return {successes,surges,usableSurges: successes >= difficulty ? surges : 0, passed: successes >= difficulty};
}
export function getPulsePenalty(bpm, underPressure) {
  if (!underPressure) return 0;
  if (bpm>=150) return -2;
  if (bpm>=100) return -1;
  return 0;
}
export function getConditionPenalty(conditions, attr) {
  const flags=String(conditions||"").toLowerCase().split(/[,;\s]+/).filter(Boolean);
  let n=0;
  if (flags.includes("exausto")) n--;
  if (flags.includes("atordoado")) n-=2;
  if (flags.includes("ferido") && ["for","agi","rob"].includes(attr)) n--;
  if (flags.includes("desorientado") && ["int","rac"].includes(attr)) n--;
  // 'panico' is represented by BPM and is not duplicated.
  return n;
}
export const tagsMatch = (itemTags, weaknessTags) => {
  const a=new Set(String(itemTags||"").toLowerCase().split(/[,;]+/).map(s=>s.trim()).filter(Boolean));
  return String(weaknessTags||"").toLowerCase().split(/[,;]+/).map(s=>s.trim()).some(x=>x && a.has(x));
};
export function damageResult({damage=0, armor=0, invulnerable=false, weaknessTags="", attackTags=""}) {
  const vulnerable=tagsMatch(attackTags,weaknessTags);
  const blocked=Boolean(invulnerable && !vulnerable);
  return {vulnerable,blocked,actual:blocked?0:Math.max(0,Number(damage)-Number(armor))};
}
