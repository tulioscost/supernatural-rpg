#!/usr/bin/env python3
"""Build icon files for each of the 47 starter items.
The 12 weapon drawings originate from an original 4x3 art atlas provided as a local input.
All other inventory symbols are original SVG illustrations created by this generator.
"""
from pathlib import Path
from PIL import Image
import json, re, unicodedata
from xml.sax.saxutils import escape

ROOT = Path(__file__).resolve().parent.parent
ICONS = ROOT / 'assets' / 'items'
ICONS.mkdir(parents=True, exist_ok=True)
source = Path('/mnt/data/a_detailed_cinematic_gritty_game_inventory_style.png')
items = json.loads((ROOT/'data'/'starter.json').read_text(encoding='utf-8'))['items']

def slug(text):
    text = ''.join(x for x in unicodedata.normalize('NFD', text) if not unicodedata.combining(x))
    return re.sub(r'[^a-z0-9]+', '-', text.casefold()).strip('-')

# 12 unique illustrated weapon tiles, laid out in reading order.
if source.exists():
    with Image.open(source) as atlas:
        w,h=atlas.size
        for n,item in enumerate(items[:12]):
            col, row = n%4,n//4
            im=atlas.crop((round(col*w/4)+5,round(row*h/3)+5,round((col+1)*w/4)-5,round((row+1)*h/3)-5))
            im.resize((256,256),Image.Resampling.LANCZOS).convert('RGB').save(ICONS/(slug(item['name'])+'.webp'),format='WEBP',quality=90,method=6)
else:
    print('Weapon atlas missing: keeping prebuilt WebP icons')

# Original, individualized hand-drawn pictograms in a field-journal icon frame.
# All path coordinates are inside a 160 x 160 symbolic canvas.
P = lambda path, stroke='#3b2619', width=7, fill='none':f'<path d="{path}" stroke="{stroke}" stroke-width="{width}" fill="{fill}" stroke-linecap="round" stroke-linejoin="round" />'
C = lambda cx,cy,r,fill='none',stroke='#3b2619',w=7:f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{w}" />'
R = lambda x,y,w,h,rx=5,fill='none',stroke='#3b2619',sw=7:f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" />'
T = lambda s,x=80,y=150,size=17:f'<text x="{x}" y="{y}" font-family="DejaVu Sans, sans-serif" text-anchor="middle" font-size="{size}" fill="#55251c" font-weight="700">{escape(s)}</text>'

glyph = {
'Casaco reforçado': R(38,25,84,112,12)+P('M38 48 L14 70 L29 95 L47 83 M122 48 L146 70 L131 95 L113 83 M80 25 L80 138 M56 29 L80 58 L101 29')+C(87,78,2,'#66251c'),
'Colete tático': P('M40 28 L65 16 L80 44 L95 16 L120 28 L133 121 L27 121 Z',fill='#8a7753')+R(50,64,60,34,3,fill='#b7a584')+P('M27 52 L133 52 M80 44 L80 121')+T('TACTICAL',80,152,11),
'Caderno do caçador': R(35,23,92,111,6,'#ad9170')+P('M48 21 L48 135 M61 54 L110 54 M61 71 L109 71 M61 88 L98 88 M61 105 L111 105')+C(43,35,3,'#eee2c2')+C(43,68,3,'#eee2c2')+C(43,101,3,'#eee2c2'),
'Kit de investigação': C(69,69,34,'#e5d9b8')+P('M91 93 L133 136')+P('M56 58 L80 58 M68 46 L68 75')+T('?',75,79,39),
'Kit médico': R(27,50,107,79,12,fill='#997653')+R(62,29,42,23,4)+P('M79 66 L79 111 M56 88 L102 88',stroke='#7f2e26',width=15)+P('M28 100 L134 100'),
'Sal grosso (saco)': P('M59 25 Q80 41 101 25 L112 55 Q132 78 128 114 Q117 138 79 137 Q40 137 32 111 Q30 82 48 54 Z',fill='#9d8261')+P('M48 54 Q80 67 112 55')+T('SAL',80,105,22),
'Água benta (frasco)': R(50,55,64,79,11,fill='#c7c7a9')+R(66,32,33,23,4,fill='#a28860')+P('M82 76 L82 116 M68 95 L97 95',stroke='#6f3325',width=9)+C(82,15,6),
'Gravador de voz': R(40,26,81,110,11,fill='#8b836e')+R(50,39,61,29,3,fill='#d8caaa')+C(80,99,22,'#c0b395')+C(80,99,7,'#66513c')+P('M59 134 L99 134'),
'Detector eletromagnético': R(51,21,63,116,8,fill='#767a60')+R(62,37,41,36,4,fill='#c6caa4')+P('M69 63 L78 48 L90 62 L99 45',stroke='#8c2e20',width=6)+C(71,102,5,'#ad462e')+C(92,102,5,'#58905b')+T('EMF',82,129,17),
'Chave de motel': C(50,56,25)+P('M69 72 L128 129 L137 113 L123 101 L135 90 L120 76 L103 90 L68 57')+R(16,18,44,22,3,'#d1b477')+T('MOTEL',40,34,12),
'Símbolo de proteção': C(80,77,57)+P('M80 24 L128 108 L30 108 Z M80 24 L80 130 M30 108 L128 48 M31 48 L128 108',stroke='#7e3329',width=5)+C(80,77,8,'#693c30'),
'Gasolina e fósforos': P('M39 41 L71 25 L103 45 L103 135 L34 135 L34 60 Z',fill='#8b5e46')+P('M46 66 L92 66 M75 25 L75 11 L100 11 L100 26')+P('M129 44 L129 130',stroke='#6f3e27',width=6)+P('M129 44 Q111 70 129 78 Q147 62 129 44',stroke='#d77428',width=7),
'Celular pré-pago': R(47,19,66,125,11,fill='#52453a')+R(57,35,46,63,4,fill='#c0c9b3')+P('M71 113 L90 113')+C(80,124,5,'#e8dfbf')+P('M65 48 L95 48 M64 59 L96 59',stroke='#6b5940',width=4),
'Exorcismo': P('M35 23 Q79 33 126 22 L128 131 Q78 118 35 132 Z',fill='#cfb78c')+P('M55 49 L113 45 M53 62 L107 62 M54 74 L110 77 M54 91 L103 90')+P('M80 98 L80 121 M68 108 L92 108',stroke='#873c28',width=6),
'Armadilha de contenção': C(80,77,60,stroke='#852b20')+C(80,77,47,stroke='#852b20')+P('M80 25 L118 108 L33 56 L129 56 L42 108 Z',stroke='#6c2b23',width=6)+C(80,77,13),
'Círculo de sal': C(80,80,59,stroke='#eae4d4',w=15)+C(80,80,43,stroke='#73503b',w=3)+T('NaCl',80,88,25)+C(34,50,3,'#f7f0df')+C(123,116,3,'#f7f0df'),
'Consagração de lâmina': P('M52 119 L111 35 L117 21 L100 27 L42 106 Z',fill='#c6b5a1')+P('M38 107 L62 125 M38 128 L62 108')+P('M122 60 L122 96 M105 78 L139 78',stroke='#8e3b27',width=5),
'Queima do vínculo': P('M76 20 Q105 57 80 68 Q110 76 114 107 Q113 137 81 142 Q40 140 43 106 Q47 84 68 65 Q51 92 77 100 Q78 74 76 20',fill='#d07937',stroke='#8c4027')+P('M81 82 Q95 120 81 133 Q64 123 81 82',fill='#e7ba64',stroke='#9d6b3d'),
'Selo de passagem': C(80,81,53,stroke='#7e2d2a')+P('M29 81 L131 81 M80 28 L80 134 M42 43 L120 119 M43 118 L121 42')+C(80,81,20,'#ba9e72'),
'Rastreio de assinatura': P('M79 21 L79 110 M48 32 Q80 11 111 32')+P('M79 110 L55 72 L79 60 L104 72 Z',fill='#8b6745')+C(80,128,8,'#bd824c'),
'Purificação de objeto': P('M44 115 L65 85 L90 119 L116 79')+P('M52 124 Q80 148 111 123')+P('M78 18 C40 56 51 75 80 83 C109 75 116 56 78 18 Z',fill='#a8bcc4')+C(80,56,12,'#e6ddc8'),
'Instinto de Caçador': C(80,76,50)+P('M80 22 L80 128 M26 76 L134 76')+C(80,76,19)+P('M80 50 L86 71 L107 76 L86 82 L80 105 L73 82 L52 76 L73 71 Z',fill='#a56e3d'),
'Olhos de Arquivista': P('M16 80 Q80 8 144 80 Q80 152 16 80 Z',fill='#d8bb8e')+C(80,80,27,'#70543b')+C(80,80,10,'#38251b')+P('M30 41 L47 34 M105 34 L122 42'),
'Sangue Frio': P('M80 13 L80 147 M27 80 L133 80 M42 42 L118 118 M118 42 L42 118')+P('M65 28 L80 41 L96 28 M65 132 L80 119 L96 132',stroke='#7395a1',width=5)+C(80,80,20,stroke='#7395a1'),
'Mãos Firmes': P('M50 120 L35 83 L41 51 L52 47 L61 78 L67 30 L80 30 L83 75 L91 25 L105 29 L99 83 L114 47 L125 54 L113 111 Q84 145 50 120 Z',fill='#d1b78b')+P('M61 112 L109 112',stroke='#936848',width=4),
'Fé Inabalável': P('M80 19 L80 135 M43 63 L117 63',stroke='#7a4132',width=19)+P('M80 18 L80 136 M43 63 L117 63',stroke='#dbbf92',width=7)+C(80,80,58,stroke='#ac8663',w=3),
'Motorista de Fuga': P('M22 101 L44 65 L114 65 L139 101 Z',fill='#a18561')+R(21,99,119,27,4,fill='#685643')+C(47,127,16,'#3a2d25')+C(113,127,16,'#3a2d25')+P('M50 65 L60 35 L100 35 L113 65'),
'Velhos Contatos': R(31,23,103,113,6,fill='#cdb78e')+C(64,55,17,'#866e4c')+P('M45 93 Q61 71 83 93 M97 54 L118 54 M97 70 L118 70 M51 111 L115 111'),
'Ritualista Metódico': C(80,80,58,stroke='#8f392b')+P('M80 18 L113 123 L29 58 L132 58 L47 124 Z',stroke='#5f3b29',width=5)+C(80,80,9,'#8e624d')+P('M130 24 L147 16',stroke='#7d2c20',width=5),
'Tecelão de Mentiras': P('M23 54 Q80 21 138 54 L128 112 Q100 135 80 125 Q55 137 32 112 Z',fill='#ddc69c')+P('M49 75 Q62 66 75 76 M90 75 Q104 66 116 76 M50 100 Q80 117 111 100')+C(59,76,5,'#6b3c26')+C(105,76,5,'#6b3c26'),
'Última Chance': C(80,80,55)+P('M80 80 L80 42 M80 80 L110 95',stroke='#8a3027',width=8)+P('M46 127 L111 127',stroke='#8e392b',width=5)+T('XII',80,35,12),
'Temperatura cai 11 graus': R(69,17,22,100,12,fill='#c9d7d9')+C(80,126,22,'#718d9c')+P('M80 52 L80 124',stroke='#7b2c26',width=9)+P('M109 43 L132 43 M110 60 L126 60 M109 77 L132 77',stroke='#6b584a',width=4),
'Relatório do necrotério': P('M41 17 L109 17 L128 37 L128 140 L41 140 Z',fill='#e5d7bb')+P('M109 17 L109 37 L128 37 M54 52 L111 52 M54 69 L110 69 M54 85 L109 85')+P('M84 93 L84 128 M67 111 L102 111',stroke='#7b2d27',width=8),
'Fita cassete sem gravação': R(19,49,121,73,5,fill='#917554')+C(56,84,18,'#d9caaa')+C(102,84,18,'#d9caaa')+C(56,84,7,'#382921')+C(102,84,7,'#382921')+R(50,104,60,14,2,fill='#e1cdaa'),
'Anel oxidado': C(80,84,43,stroke='#785337',w=22)+C(80,84,22,stroke='#d2ac6b',w=7)+P('M47 46 L80 21 L113 46 L80 56 Z',fill='#869080')+C(80,38,8,'#4b6965'),
}
for item in items[12:]:
    name=item['name']
    if name not in glyph: raise ValueError(f'Missing glyph {name}')
    category=item['type']
    tag={'equipment':'EQUIPAMENTO','ritual':'RITUAL','talent':'TALENTO','clue':'EVIDÊNCIA'}[category]
    # Deterministic texture specks; vary by name hash without external dependencies.
    seed=sum(map(ord,name))
    freckles=''.join(f'<circle cx="{(seed*13+j*41)%224+16}" cy="{(seed*7+j*23)%210+22}" r="{1+(j%3)}" fill="#8b5b3c" opacity=".18" />' for j in range(14))
    svg=f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="256" height="256">
<defs><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#e7d6b4"/><stop offset="1" stop-color="#bb9b6f"/></linearGradient><linearGradient id="ink"><stop stop-color="#6c3529"/><stop offset="1" stop-color="#3d251a"/></linearGradient></defs>
<rect x="3" y="3" width="250" height="250" rx="12" fill="#422c21" stroke="#2b211a" stroke-width="5"/>
<path d="M13 16 L241 10 L245 238 L14 245 Z" fill="url(#paper)" stroke="#7a563b" stroke-width="3"/>
<path d="M26 34 L229 31 M26 217 L229 213" stroke="#6d4631" stroke-width="2" opacity=".4"/>
{freckles}
<g transform="translate(48,45)">{glyph[name]}</g>
<path d="M20 215 L237 215" stroke="#7d352b" stroke-width="3" opacity=".75"/>
<text x="128" y="231" text-anchor="middle" font-size="14" font-weight="bold" font-family="DejaVu Sans,Arial,sans-serif" fill="#562d25" letter-spacing="1.4">{tag}</text>
</svg>'''
    (ICONS/(slug(name)+'.svg')).write_text(svg,encoding='utf-8')

for item in items:
    n=slug(item['name'])
    ext='webp' if item['type']=='weapon' else 'svg'
    path=ICONS/(n+'.'+ext)
    if not path.exists():raise FileNotFoundError(path)
    item['img']=f'systems/supernatural-cacadores/assets/items/{n}.{ext}'

all_data=json.loads((ROOT/'data'/'starter.json').read_text(encoding='utf-8'))
all_data['items']=items
(ROOT/'data'/'starter.json').write_text(json.dumps(all_data,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'data'/'items-compendium.json').write_text(json.dumps(items,ensure_ascii=False,indent=2),encoding='utf-8')
print('Generated icons:',len(list(ICONS.glob('*'))),'items linked:',len(items))
