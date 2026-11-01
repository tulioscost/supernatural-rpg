import json
from pathlib import Path
base=Path('/mnt/data/spn-walls-work')
# Fractions of 1448x1086 canvas (structural approximation, not traced architectural plan)
W={
'motel-farol':[
 ('fachada-norte','normal',.17,.29,.84,.29),
 ('parede-oeste','normal',.17,.29,.17,.79),
 ('parede-leste','normal',.84,.29,.84,.79),
 ('fachada-sul-oeste','normal',.17,.79,.47,.79),
 ('fachada-sul-leste','normal',.55,.79,.84,.79),
 ('entrada-recepcao','door',.47,.79,.55,.79),
 ('divisoria-oeste','normal',.38,.29,.38,.62),
 ('divisoria-centro','normal',.59,.29,.59,.62),
 ('corredor-oeste','normal',.17,.62,.36,.62),
 ('porta-quarto-oeste','door',.36,.62,.43,.62),
 ('corredor-leste','normal',.43,.62,.70,.62),
 ('porta-quarto-leste','door',.70,.62,.77,.62),
 ('corredor-fim','normal',.77,.62,.84,.62),
 ('saguão-interno','normal',.59,.47,.84,.47),
 ],
'arquivo-municipal':[
 ('fachada-norte','normal',.17,.14,.87,.14),
 ('lateral-oeste','normal',.17,.14,.17,.87),
 ('lateral-leste','normal',.87,.14,.87,.87),
 ('fachada-sul-esquerda','normal',.17,.87,.49,.87),
 ('entrada-arquivo','door',.49,.87,.56,.87),
 ('fachada-sul-direita','normal',.56,.87,.87,.87),
 ('separador-acervo','normal',.42,.14,.42,.45),
 ('corredor-norte','normal',.42,.45,.70,.45),
 ('porta-acervo','door',.70,.45,.76,.45),
 ('corredor-fim','normal',.76,.45,.87,.45),
 ('parede-deposito','normal',.67,.45,.67,.87),
 ('estantes-norte','terrain',.24,.30,.37,.30),
 ('estantes-centro','terrain',.24,.55,.37,.55),
 ('estantes-sul','terrain',.24,.74,.37,.74),
 ],
'clareira-acesso':[
 ('arvores-noroeste','terrain',.08,.19,.26,.28),
 ('arvores-norte','terrain',.33,.12,.48,.17),
 ('arvores-nordeste','terrain',.74,.18,.94,.32),
 ('tronco-oeste','terrain',.15,.42,.23,.62),
 ('rocha-oeste','normal',.29,.54,.40,.58),
 ('rocha-sul','normal',.46,.70,.59,.72),
 ('bloco-leste','normal',.67,.54,.77,.59),
 ('arvores-sudeste','terrain',.76,.76,.93,.84),
 ('arvores-sudoeste','terrain',.12,.79,.30,.86),
 ('trecho-mureta','normal',.40,.35,.57,.35),
 ],
'central-9':[
 ('fachada-norte','normal',.18,.20,.83,.20),
 ('fachada-oeste','normal',.18,.20,.18,.85),
 ('fachada-leste','normal',.83,.20,.83,.85),
 ('fachada-sul-oeste','normal',.18,.85,.48,.85),
 ('porta-entrada','door',.48,.85,.56,.85),
 ('fachada-sul-leste','normal',.56,.85,.83,.85),
 ('sala-operadores-oeste','normal',.41,.20,.41,.46),
 ('acesso-sala-operadores','door',.41,.46,.41,.54),
 ('sala-operadores-sul','normal',.41,.54,.41,.85),
 ('divisoria-norte','normal',.41,.38,.77,.38),
 ('porta-console-17','door',.57,.38,.64,.38),
 ('corredor-norte','normal',.18,.55,.34,.55),
 ('porta-corredor','door',.34,.55,.41,.55),
 ('corredor-sul','normal',.41,.55,.63,.55),
 ('porta-arquivo-tecnico','door',.63,.55,.70,.55),
 ('arquivo-tecnico-leste','normal',.70,.55,.83,.55),
 ('divisoria-subsolo','normal',.63,.55,.63,.85),
 ]
}
assert all(len({w[0] for w in walls})==len(walls) for walls in W.values())
assert all(all(0<=v<=1 for v in w[2:]) for walls in W.values() for w in walls)
assert all(all(w[2]!=w[4] or w[3]!=w[5] for w in walls) for walls in W.values())
obj={'id':'ultima-chamada','schema':'foundry-v14-scene-wall-layout-1','units':'percent-of-scene-rectangle','review':'Geometria aproximada; editar manualmente portas e divisórias no Foundry conforme o mapa visual.','scenes':{key:[{'id':name,'type':typ,'points':coords} for name,typ,*coords in walls] for key,walls in W.items()}}
(base/'data/walls-ultima-chamada.json').write_text(json.dumps(obj,ensure_ascii=False,indent=2),encoding='utf8')
print({k:len(v) for k,v in W.items()},'total',sum(len(v) for v in W.values()))
