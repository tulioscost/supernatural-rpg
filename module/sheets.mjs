import {SYS_ID,ATTRIBUTES,SKILLS,TYPES,ARCHETYPES} from "./constants.mjs";
import {rollTest,useItem} from "./rolls.mjs";

const H = foundry.applications.api.HandlebarsApplicationMixin;
const {ActorSheetV2,ItemSheetV2} = foundry.applications.sheets;

export class HunterSheet extends H(ActorSheetV2) {
  static DEFAULT_OPTIONS = {
    classes: ["spn-sheet"], position: {width: 1180,height: 900},
    form: {submitOnChange: true, closeOnSubmit: false},
    actions: {
      roll: HunterSheet._roll, customRoll: HunterSheet._customRoll,
      clueRoll: HunterSheet._clueRoll, useItem: HunterSheet._useItem,
      editItem: HunterSheet._editItem, deleteItem: HunterSheet._deleteItem,
      addItem: HunterSheet._addItem, adjustPulse: HunterSheet._adjustPulse,
      adjustHealth: HunterSheet._adjustHealth, toggleEquip: HunterSheet._toggleEquip,
      crisis: HunterSheet._crisis, creatureAttack: HunterSheet._creatureAttack
    }
  };
  static PARTS = {body: {template: `systems/${SYS_ID}/templates/actor-sheet.hbs`}};
  _activeTab="skills";
  async _prepareContext(options) {
    const ctx=await super._prepareContext(options);
    const actor=this.document; const a=actor.system;
    const attr=Object.entries(ATTRIBUTES).map(([key,label])=>({key,label,value:a.attributes[key]}));
    const skills=Object.entries(SKILLS).map(([key,[label,attribute]])=>({key,label,attribute,attributeLabel:ATTRIBUTES[attribute],level:a.skills[key]}));
    const itemGroups=Object.fromEntries(Object.keys(TYPES).map(key=>[key,[]]));
    for(const item of actor.items) itemGroups[item.type]?.push({id:item.id,name:item.name,img:item.img,
      detail:item.type==="weapon" ? `${item.system.damage} dano · ${item.system.tags||"comum"}` :
      item.type==="ritual" ? `D${item.system.difficulty} · ${item.system.cost} componente(s)` :
      item.type==="equipment" ? `RD ${item.system.armor} · ${item.system.quantity} un.` : item.system.effect||"",
      equipped:item.system.equipped, quantity:item.system.quantity,type:item.type});
    return {...ctx,actor,a,attr,skills,itemGroups,archetypes:ARCHETYPES.map(name=>({name,selected:a.identity.archetype===name})),
      difficultyChoices:[1,2,3,4,5].map(n=>({n,selected:a.modifiers.difficulty===n})),
      tabs:[{id:"skills",label:"Perícias"},{id:"inventory",label:"Arsenal"},{id:"lore",label:"Dossiê"},{id:"creature",label:"Bestiário"}]
        .filter(t=>t.id!=="creature" || actor.type==="creature").map((t,i)=>({...t,page:String(i+1).padStart(2,"0"),active:t.id===this._activeTab})),
      isSkills:this._activeTab==="skills",isInventory:this._activeTab==="inventory",isLore:this._activeTab==="lore",
      isCreature:this._activeTab==="creature",isMonster:actor.type==="creature",isHunter:actor.type==="hunter",
      totalLoad:actor.items.reduce((sum,i)=>sum + (Number(i.system.load||0)*Number(i.system.quantity||0)),0)};
  }
  /** Swap diary pages in the existing DOM without triggering form submit or losing edits. */
  _onRender(context, options) {
    super._onRender(context, options);
    const root=this.element;
    const pages=Array.from(root.querySelectorAll("[data-spn-page]"));
    const keys=pages.map(page=>page.dataset.spnPage);
    if(!keys.includes(this._activeTab)) this._activeTab=keys[0] || "skills";
    const show=(target)=>{
      if(!keys.includes(target))return;
      this._activeTab=target;
      for(const page of pages){
        const active=page.dataset.spnPage===target;
        page.hidden=!active;
        page.classList.toggle("active", active);
        page.setAttribute("aria-hidden", String(!active));
      }
      for(const button of root.querySelectorAll("[data-diary-page]")){
        const active=button.dataset.diaryPage===target;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
      }
      const index=keys.indexOf(target);
      const counter=root.querySelector("[data-spn-page-counter]");
      if(counter)counter.textContent=`Página ${index+1} de ${keys.length}`;
      const prev=root.querySelector("[data-spn-prev]");
      const next=root.querySelector("[data-spn-next]");
      if(prev)prev.disabled=index===0;
      if(next)next.disabled=index===keys.length-1;
    };
    const turn=(event)=>{
      const button=event.target.closest("[data-diary-page], [data-spn-prev], [data-spn-next]");
      if(!button || button.disabled)return;
      event.preventDefault();event.stopPropagation();
      if(button.dataset.diaryPage)show(button.dataset.diaryPage);
      else {
        const idx=keys.indexOf(this._activeTab)+(button.hasAttribute("data-spn-next")?1:-1);
        if(keys[idx])show(keys[idx]);
      }
    };
    for(const nav of root.querySelectorAll("[data-spn-navigation]"))nav.addEventListener("click",turn);
    show(this._activeTab);
  }
  static async _roll(event,el) {
    return rollTest(this.document,{attribute:el.dataset.attr,skill:el.dataset.skill,
      difficulty:this.document.system.modifiers.difficulty,label:`Teste de ${el.dataset.label||"perícia"}`});
  }
  static async _customRoll(event,el) {
    const s=this.element;
    return rollTest(this.document,{attribute:s.querySelector("[data-roll-attr]")?.value || "rac",
      skill:s.querySelector("[data-roll-skill]")?.value || "investigacao",
      difficulty:Number(s.querySelector("[data-roll-difficulty]")?.value||1),label:"Teste livre"});
  }
  static async _clueRoll() {return rollTest(this.document,{attribute:"rac",skill:"investigacao",
    difficulty:this.document.system.modifiers.difficulty,label:"Investigação de caso",clue:true});}
  static async _useItem(event,el) {return useItem(this.document,this.document.items.get(el.closest("[data-item-id]")?.dataset.itemId));}
  static async _editItem(event,el) {const i=this.document.items.get(el.closest("[data-item-id]")?.dataset.itemId);if(i) i.sheet.render({force:true});}
  static async _deleteItem(event,el) {
    const i=this.document.items.get(el.closest("[data-item-id]")?.dataset.itemId);if(!i)return;
    const yes=await foundry.applications.api.DialogV2.confirm({window:{title:"Excluir item"},content:`Excluir ${String(i.name).replace(/[&<>"\']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]))}?`});
    if(yes)await i.delete();
  }
  static async _addItem(event,el) {
    const type=el.dataset.type; if(!TYPES[type])return;
    const i=await this.document.createEmbeddedDocuments("Item",[{name:`Novo(a) ${TYPES[type]}`,type}]);
    i[0]?.sheet.render({force:true});
  }
  static async _adjustPulse(event,el) {const delta=Number(el.dataset.delta||0);
    const before=this.document.system.pulse.value;
    const next=Math.max(0,Math.min(300,before+delta));
    await this.document.update({"system.pulse.value":next});
    if(before<180 && next>=180)ui.notifications.warn("Crise: use o botão TESTAR CRISE e aplique as consequências.");
  }
  static async _crisis() {
    if(this.document.system.pulse.value < 180){ui.notifications.info("Crise só é exigida em 180 BPM ou mais.");return;}
    const result=await rollTest(this.document,{attribute:"fib",skill:"autocontrole",difficulty:1,label:"Crise de tensão"});
    if(!result)return;
    const current=this.document.system.resources.trauma;
    await this.document.update({"system.pulse.value":140,...(!result.passed?{"system.resources.trauma":current+1}:{})});
    ui.notifications.info(result.passed?"Crise contida: ação limitada e complicação narrativa.":"Falha na crise: 1 Marca de Trauma e turno de recuperação ou retirada.");
  }
  static async _creatureAttack() {
    if(this.document.type!=="creature")return;
    const a=this.document;
    const pseudo={type:"weapon",name:"Ataque sobrenatural",system:{damage:a.system.creature.damage,bonus:0,tags:""}};
    return rollTest(a,{attribute:"for",skill:"combate",difficulty:a.system.modifiers.difficulty,
      item:pseudo,label:"Ataque de criatura",attack:true});
  }
  static async _adjustHealth(event,el) {const delta=Number(el.dataset.delta||0);
    await this.document.update({"system.health.value":Math.max(0,Math.min(this.document.system.health.max,this.document.system.health.value+delta))});}
  static async _toggleEquip(event,el) {const i=this.document.items.get(el.closest("[data-item-id]")?.dataset.itemId);if(i)await i.update({"system.equipped":!i.system.equipped});}
}

export class HunterItemSheet extends H(ItemSheetV2) {
  static DEFAULT_OPTIONS={classes:["spn-sheet","spn-item-sheet"],position:{width:760,height:820},form:{submitOnChange:true,closeOnSubmit:false}};
  static PARTS={body:{template:`systems/${SYS_ID}/templates/item-sheet.hbs`}};
  async _prepareContext(options) {
    const ctx=await super._prepareContext(options);
    const it=this.document;
    return {...ctx,item:it,s:it.system,
      attributes:Object.entries(ATTRIBUTES).map(([key,label])=>({key,label,selected:it.system.attribute===key})),
      skills:Object.entries(SKILLS).map(([key,[label]])=>({key,label,selected:it.system.skill===key})),
      isWeapon:it.type==="weapon",isEquipment:it.type==="equipment",isRitual:it.type==="ritual"};
  }
}
