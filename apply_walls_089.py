from pathlib import Path
import json
root=Path('/mnt/data/spn-walls-work')
main=root/'module/main.mjs'
s=main.read_text()
s=s.replace('import {ensureAdventureScenes,ensureSceneMacro} from "./scenes.mjs";', 'import {ensureAdventureScenes,ensureSceneMacro} from "./scenes.mjs";\nimport {ensureAdventureWalls,enableManualWalls,ensureWallMacro} from "./walls.mjs";')
s=s.replace('ensureAdventureScenes,ensureSceneMacro,repairOneShotArtwork', 'ensureAdventureScenes,ensureSceneMacro,ensureAdventureWalls,enableManualWalls,ensureWallMacro,repairOneShotArtwork')
s=s.replace('0.8.8: motor inicializado.', '0.8.9: motor inicializado.')
anchor='  try{await ensureAdventureScenes();}catch(error){console.error(`${SYS_ID}: cenas da aventura`,error);}'
assert anchor in s
s=s.replace(anchor,anchor+'\n  try{await ensureWallMacro();}catch(error){console.error(`${SYS_ID}: macro de paredes`,error);}\n  try{await ensureAdventureWalls({notify:false});}catch(error){console.error(`${SYS_ID}: paredes automáticas`,error);}')
main.write_text(s)
manifest=root/'system.json'; d=json.loads(manifest.read_text()); d['version']='0.8.9';d['download']='https://github.com/tulioscost/supernatural-rpg/releases/download/v0.8.9/supernatural-cacadores.zip';manifest.write_text(json.dumps(d,ensure_ascii=False,indent=2))
validator=root/'scripts/package.py';s=validator.read_text()
anchor='    assert (ROOT/"macros/gerar-cenas-fog-v14.js").is_file(), "Macro de cenas ausente"'
assert anchor in s
s=s.replace(anchor,anchor+'''
    wall_data=json.loads((ROOT/"data/walls-ultima-chamada.json").read_text(encoding="utf-8"))
    assert wall_data["id"]=="ultima-chamada"
    assert set(wall_data["scenes"]) == {scene["id"] for scene in scenes["scenes"]}
    for scene_id, wall_specs in wall_data["scenes"].items():
        assert len(wall_specs)>=8, f"Paredes insuficientes em {scene_id}"
        assert len({wall["id"] for wall in wall_specs})==len(wall_specs), "Identificadores de paredes duplicados"
        for wall in wall_specs:
            assert len(wall["points"])==4 and all(0<=v<=1 for v in wall["points"]), "Coordenadas inválidas"
    assert (ROOT/"module/walls.mjs").exists(), "Rotina de paredes ausente"
    assert (ROOT/"macros/corrigir-paredes-v14.js").is_file(), "Macro de paredes ausente"
''')
s=s.replace("'- Tela de pausa: armadilha do diabo animada e texto INVESTIGAÇÃO PARADA.\\n\\n'", "'- Tela de pausa: armadilha do diabo animada e texto INVESTIGAÇÃO PARADA.\\n'\n        '- 55 paredes automáticas vinculadas a Levels V14, portas e obstáculos naturais.\\n'\n        '- Macro para abrir a ferramenta de desenho manual no nível correto.\\n\\n'")
validator.write_text(s)
readme=root/'README.md';s=readme.read_text();s+='''

## v0.8.9 — Paredes nativas e edição manual (Foundry V14)

- A primeira entrada do Narrador configura **55 segmentos aproximados** nas quatro cenas da one-shot: paredes normais, portas e obstáculos de terreno. As paredes são documentos **Scene.Wall**, associados ao nível correto pelo campo `Wall.levels: [idDoLevel]` — não são criadas em `Level.walls`.
- A geometria é uma **proposta tática aproximada** para mapas ilustrativos, não uma transcrição perfeita da arquitetura. Revise as posições das portas, estantes e rochas antes da sessão.
- O sistema usa `Scene.createEmbeddedDocuments('Wall', ...)` só **depois** de a cena e o nível existirem, para evitar a inconsistência conhecida em importações iniciais de paredes no V14.
- A atualização preserva paredes manuais, tokens, áreas exploradas de FOG e alterações anteriores de posição feitas pelo Narrador. Paredes antigas do próprio sistema, sem vínculo correto com o Level, recebem somente o reparo desse vínculo.
- Foi acrescentada a macro **Supernatural — Criar paredes e habilitar edição (V14)**, que abre a cena no Level correto e ativa a camada de paredes sem alterar os controles nativos.
- Para criar paredes: abra a cena como Narrador, execute a macro e escolha *Abrir ferramenta de paredes*; na paleta de Paredes clique em **Desenhar Parede**, segure o botão esquerdo e arraste entre os dois pontos. Verifique se o piso correto está selecionado no navegador de níveis do V14.

**Funções disponíveis (console do Narrador):**

```js
await game.supernatural.ensureAdventureWalls();
await game.supernatural.enableManualWalls();
// Validação sem criar paredes:
await game.supernatural.ensureAdventureWalls({dryRun:true});
```

**Limitações importantes:** o sistema não pode conceder permissões de Narrador, corrigir conflitos externos de módulos ou garantir o estado do Canvas de uma instalação que não tenha sido testada. A macro restaura o nível selecionado e abre a camada oficial, mas se a criação manual continuar bloqueada, verifique o console F12, permissões, versão do Foundry e módulos ativos.
''';readme.write_text(s)
ch=root/'docs/CHANGELOG.md';s=ch.read_text();ch.write_text('## v0.8.9\n\n- Paredes automáticas em quatro cenas da one-shot: 55 segmentos (normais, portas e terreno).\n- Associação de paredes a Levels via `Wall.levels`.\n- Macro para selecionar o nível correto e abrir a camada oficial de edição manual.\n- Importação segura e idempotente; preserva paredes manuais, tokens e FOG existente.\n\n'+s)
# update tests for release pin
for path in (root/'tests').glob('*.test.mjs'):
 s=path.read_text()
 if path.name=='diary-assets.test.mjs':
  s=s.replace('manifest release points to v0.8.8','manifest release points to v0.8.9').replace("manifest.version,'0.8.8'", "manifest.version,'0.8.9'").replace(r'\/v0\.8\.8\/supernatural-cacadores',r'\/v0\.8\.9\/supernatural-cacadores')
  path.write_text(s)
