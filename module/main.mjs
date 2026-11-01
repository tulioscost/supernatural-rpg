import {SYS_ID,ATTRIBUTES,SKILLS} from "./constants.mjs";
import {HunterActorModel,HunterItemModel} from "./models.mjs";
import {HunterSheet,HunterItemSheet} from "./sheets.mjs";
import {rollTest,useItem} from "./rolls.mjs";

/**
 * Idempotently create/update a real world Item compendium.
 * Packaging a prebuilt LevelDB pack is deliberately avoided: this works on
 * existing worlds during the first GM login after upgrading to v0.3.0.
 */
export async function ensureItemCompendium() {
  if (!game.user?.isGM) return false;
  const packName="cacadores-itens";
  const packId=`world.${packName}`;
  const iconPlaceholder=`systems/${SYS_ID}/assets/insignia.svg`;
  let pack=game.packs.get(packId);
  let touched=false;
  let relock=false;
  try {
    const response=await fetch(`systems/${SYS_ID}/data/items-compendium.json`);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const items=await response.json();
    if (!Array.isArray(items) || items.length!==47) throw new Error("Catálogo de itens incompleto");
    if (!pack) {
      pack=await foundry.documents.collections.CompendiumCollection.createCompendium({
        name:packName,
        label:"Supernatural — Itens & Ocultismo",
        type:"Item",
        system:SYS_ID
      });
      touched=true;
    }
    if (pack.documentName!=="Item") throw new Error("O compêndio existente tem tipo incompatível");
    relock=Boolean(pack.locked);
    if (relock) await pack.configure({locked:false});
    const index=await pack.getIndex();
    const byName=new Map(Array.from(index).map(({name,_id,img})=>[name,{_id,img}]));
    const missing=items.filter(item=>!byName.has(item.name));
    if(missing.length) {
      await Item.createDocuments(missing,{pack:pack.collection});
      touched=true;
    }
    const corrections=items.flatMap(item=>{
      const existing=byName.get(item.name);
      if(!existing) return [];
      return (existing.img===iconPlaceholder || !existing.img)
        ?[{_id:existing._id,img:item.img}] : [];
    });
    if(corrections.length) {
      await Item.updateDocuments(corrections,{pack:pack.collection});
      touched=true;
    }
    // Upgrade generic placeholders in the already-imported world content, but
    // preserve any portrait/icon explicitly assigned by a player or GM.
    const images=new Map(items.map(item=>[item.name,item.img]));
    const worldUpdates=game.items.contents.filter(item=>images.has(item.name) && item.img===iconPlaceholder)
      .map(item=>({_id:item.id,img:images.get(item.name)}));
    if(worldUpdates.length) await Item.updateDocuments(worldUpdates);
    for(const actor of game.actors.contents) {
      const updates=actor.items.contents.filter(item=>images.has(item.name) && item.img===iconPlaceholder)
        .map(item=>({_id:item.id,img:images.get(item.name)}));
      if(updates.length && actor.isOwner) await actor.updateEmbeddedDocuments("Item",updates);
    }
    if(touched) ui.notifications.info("Compêndio Supernatural — Itens & Ocultismo atualizado: 47 itens com ícones próprios.");
    return true;
  }catch(error){
    console.error(`${SYS_ID}: erro ao criar compêndio`,error);
    ui.notifications.warn("Não foi possível atualizar o compêndio de itens. Consulte o console do Foundry.");
    return false;
  }finally{
    if(relock && pack) try{await pack.configure({locked:true});}catch(error){console.error(`${SYS_ID}: não foi possível bloquear novamente o compêndio`,error);}
  }
}

/** World-local starter kit. Never creates duplicates without explicit force. */
async function importStarter({force=false}={}) {
  if(!game.user?.isGM) {ui.notifications.error("Somente o Narrador pode importar os registros iniciais.");return false;}
  if(game.settings.get(SYS_ID,"starterImported") && !force) {ui.notifications.info("Biblioteca inicial já importada neste mundo.");return false;}
  const path=`systems/${SYS_ID}/data/starter.json`;
  let data;
  try {
    const response=await fetch(path);
    if(!response.ok) throw new Error(`HTTP ${response.status}`);
    data=await response.json();
  } catch(error){console.error(SYS_ID,error);ui.notifications.error("Não foi possível ler a biblioteca inicial.");return false;}
  const folderSpecs=[
    ["Actor","Caçadores — Arquivo da Estrada"],
    ["Actor","Criaturas — Arquivo da Estrada"],
    ["Item","Arsenal e ocultismo — Arquivo da Estrada"],
    ["JournalEntry","Dossiês — Arquivo da Estrada"]
  ];
  const folders={};
  try {
    for(const [type,name] of folderSpecs){
      let folder=game.folders.contents.find(f=>f.name===name && f.type===type);
      folder ??= await Folder.create({name,type});
      folders[name]=folder.id;
    }
    for(const info of data.items) {
      if(!force && game.items.contents.some(x=>x.name===info.name && x.folder?.id===folders["Arsenal e ocultismo — Arquivo da Estrada"]))continue;
      await Item.create({...info,folder:folders["Arsenal e ocultismo — Arquivo da Estrada"]});
    }
    for(const info of data.actors) {
      const dest=info.type==="creature" ? "Criaturas — Arquivo da Estrada" : "Caçadores — Arquivo da Estrada";
      if(!force && game.actors.contents.some(x=>x.name===info.name && x.folder?.id===folders[dest]))continue;
      await Actor.create({...info,folder:folders[dest]});
    }
    for(const info of data.journals){
      if(!force && game.journal.contents.some(x=>x.name===info.name && x.folder?.id===folders["Dossiês — Arquivo da Estrada"]))continue;
      await JournalEntry.create({name:info.name,folder:folders["Dossiês — Arquivo da Estrada"],
        pages:info.pages.map(p=>({name:p.name,type:"text",text:{format:1,content:p.html}}))});
    }
    await game.settings.set(SYS_ID,"starterImported",true);
    ui.notifications.info("Arquivos importados: 15 personagens/criaturas, 47 itens e 4 dossiês.");
    return true;
  } catch(error){
    console.error(`${SYS_ID}: falha parcial ao importar`,error);
    ui.notifications.error("Importação interrompida. Confira o console; os registros já criados foram preservados.");
    return false;
  }
}

Hooks.once("init",()=>{
  CONFIG.Actor.dataModels.hunter=HunterActorModel;
  CONFIG.Actor.dataModels.creature=HunterActorModel;
  for(const type of ["weapon","equipment","ritual","talent","clue"])CONFIG.Item.dataModels[type]=HunterItemModel;
  const sheets=foundry.applications.apps.DocumentSheetConfig;
  sheets.registerSheet(foundry.documents.Actor,SYS_ID,HunterSheet,{makeDefault:true,types:["hunter","creature"]});
  sheets.registerSheet(foundry.documents.Item,SYS_ID,HunterItemSheet,{makeDefault:true,types:["weapon","equipment","ritual","talent","clue"]});
  game.settings.register(SYS_ID,"starterImported",{name:"Biblioteca inicial importada",scope:"world",config:false,type:Boolean,default:false});
  game.supernatural={attributes:ATTRIBUTES,skills:SKILLS,rollTest,useItem,importStarter,ensureItemCompendium};
  console.info("Supernatural — Caçadores da Estrada 0.3.0: motor inicializado.");
});

Hooks.once("ready",async()=>{
  if(!game.user?.isGM)return;
  await ensureItemCompendium();
  if(game.settings.get(SYS_ID,"starterImported"))return;
  const yes=await foundry.applications.api.DialogV2.confirm({
    window:{title:"Arquivo de Caçada • Primeira instalação"},
    content:`<div style="padding:10px"><p>Importar para este mundo <strong>15 caçadores e criaturas, 47 itens e 4 dossiês</strong>?</p>
      <p>Os itens já estão disponíveis no compêndio <strong>Supernatural — Itens & Ocultismo</strong>. A importação para as listas do mundo é facultativa.</p></div>`,
    yes:{label:"Importar biblioteca"},no:{label:"Agora não"}
  });
  if(yes)await importStarter();
});
