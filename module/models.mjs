import {ATTRIBUTES, SKILLS} from "./constants.mjs";

const F = foundry.data.fields;
const number = (initial=0, min=0, max=999) => new F.NumberField({integer: true, min, max, initial});
const string = (initial="") => new F.StringField({initial, blank: true});
const flag = (initial=false) => new F.BooleanField({initial});

export class HunterActorModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const attributes = Object.fromEntries(Object.keys(ATTRIBUTES).map(k => [k, number(1, 0, 10)]));
    const skills = Object.fromEntries(Object.keys(SKILLS).map(k => [k, number(0, 0, 10)]));
    return {
      attributes: new F.SchemaField(attributes),
      skills: new F.SchemaField(skills),
      health: new F.SchemaField({value: number(5,0,999), max: number(5,0,999,)}),
      pulse: new F.SchemaField({value: number(65,0,300), max: number(180,1,300)}),
      resources: new F.SchemaField({supplies: number(4), trauma: number(0), marks: number(0), faith: number(0,0,10)}),
      modifiers: new F.SchemaField({temporary: number(0,-10,10), difficulty: number(1,1,5), underPressure: flag(false)}),
      identity: new F.SchemaField({archetype: string("Caçador de Campo"), background: string(), bonds: string(), notes: string(), currentCase: string()}),
      conditions: string(),
      creature: new F.SchemaField({family: string(), threat: number(1,1,5), armor: number(0,0,20), damage: number(2,0,30),
        weakness: string(), weaknessTags: string(), defenses: string(), abilities: string(),
        invulnerable: flag(false), countermeasure: string(), secret: string()}),
      protection: number(0,0,20)
    };
  }
  prepareDerivedData() {
    super.prepareDerivedData();
    this.health.max = Math.max(1, Number(this.attributes.rob ?? 1)*5);
    let armor = Number(this.parent?.type === "creature" ? this.creature.armor : 0);
    for (const item of this.parent?.items ?? []) {
      if (item.type === "equipment" && item.system?.equipped && Number(item.system?.durability ?? 1) > 0) {
        const base = Number(item.system?.armor || 0);
        const dur = Number(item.system?.durability ?? 100);
        armor = Math.max(armor, Math.max(0, base - (dur <= 25 ? 2 : dur <= 50 ? 1 : 0)));
      }
    }
    this.protection = armor;
  }
}

export class HunterItemModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: string(),
      attribute: string("agi"),
      skill: string("pontaria"),
      difficulty: number(1,1,5),
      bonus: number(0,-10,10),
      damage: number(0,0,40),
      armor: number(0,0,20),
      tags: string(),
      target: string(),
      cost: number(0,0,50),
      quantity: number(1,0,999),
      ammo: number(0,0,999),
      usesAmmo: flag(false),
      equipped: flag(false),
      consumable: flag(false),
      durability: number(100,0,100),
      load: number(0,0,20),
      effect: string(),
      identified: flag(true)
    };
  }
}
