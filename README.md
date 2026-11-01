# Supernatural — Caçadores da Estrada

**Sistema gratuito, independente e não oficial para Foundry VTT 14.** RPG de horror investigativo e caça a criaturas sobrenaturais, inspirado na série *Supernatural*, usando mecânicas adaptadas do manual CLANDESTINO fornecido pelo autor.

> **Versão:** 0.8.7 (protótipo / playtest). Não testado dentro de uma instalação real do Foundry VTT.

![Banner do sistema](assets/banner.png)

## Instalação diretamente pelo GitHub

No Foundry VTT, abra **Configuração → Sistemas de Jogo → Instalar Sistema** e informe o endereço abaixo no campo **URL do Manifesto**:

```text
https://github.com/tulioscost/supernatural-rpg/releases/latest/download/system.json
```

Selecione **Instalar**, crie um mundo e escolha **Supernatural — Caçadores da Estrada (não oficial)**. Este endereço permanece o mesmo nas próximas atualizações.

**Atenção:** o manifesto acima só funcionará após a publicação da **primeira Release** do repositório contendo os três anexos: `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.8.8.md`. Somente enviar os fontes à branch `main` não disponibiliza o sistema para instalação.

## Publicação automática pelo GitHub Actions

O arquivo `.github/workflows/release.yml` cria a Release automaticamente a cada nova versão enviada para `main`.

1. Envie **todo o conteúdo deste projeto** para a raiz do repositório `tulioscost/supernatural-rpg`, incluindo a pasta oculta `.github/workflows/`.
2. O GitHub inicia **Actions → Publicar automaticamente no Foundry** assim que ocorrer um `push` para `main`.
3. A Action valida o motor, as imagens, o manifesto e os três arquivos da Release. Se a versão do manifesto ainda não existir, publica a tag e a Release `v0.8.8` automaticamente.
4. Acesse **Releases** e encontre os três arquivos: `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.8.8.md`.
5. Se a Release estiver indisponível, baixe o pacote de testes na aba **Actions → último run → Artifacts**.

Para uma atualização futura, altere **`version` e `download` em `system.json`** para `0.8.7` (ou outra versão ainda não lançada), atualize os arquivos e envie outro `push` para `main`. Não é necessário criar tags manualmente.

**Execução manual:** abra `Actions → Publicar automaticamente no Foundry → Run workflow`, selecione `main` e execute. Publicações existentes não são regravadas por engano.

### Comandos Git

```bash
git add .
git commit -m "Release automática Supernatural v0.8.8"
git push origin main
```

## Recursos do protótipo

- Fichas de diário aberto com duas páginas, textura de papel envelhecido, retrato clicável de 256×256, rolagem vertical e layout responsivo de **caçadores** e **criaturas**; atributos, perícias, inventário, vida e BPM.
- Reservas de 0–10d6, com sucesso em 5/6, Ímpetos com 6 e dificuldades de 1 a 5.
- Sistema de dano, resistência e **fraquezas por tags**; itens, munição, componentes e rituais.
- Investigação, pistas fundamentais, condições e pressão psicológica.
- Biblioteca inicial importável com **15 atores, 47 itens e 4 dossiês**, incluindo aventura introdutória.

## Primeiro uso no mundo

Ao abrir o mundo como Narrador, aceite importar a biblioteca inicial. Alternativamente, use o console do navegador:

```js
game.supernatural.importStarter();
```

## Desenvolvimento e testes

```bash
node --test tests/*.test.mjs
python3 scripts/package.py --validate-only
python3 scripts/package.py
```

O ZIP gerado em `dist/supernatural-cacadores.zip` possui o `system.json` na **raiz do arquivo**, como necessário à instalação automática. A pasta `dist/` não deve ser versionada; o GitHub Actions produz os pacotes de release.

## Documentação

- [`docs/REGRAS.md`](docs/REGRAS.md): regras mecânicas e orientações para o Narrador.
- [`data/starter.json`](data/starter.json): atores, equipamentos e dossiês de introdução.
- [`docs/CHANGELOG.md`](docs/CHANGELOG.md): histórico de alterações.

## Avisos

Este é um **projeto de fã**, não comercial, sem afiliação ou endosso de titulares de *Supernatural*. Não inclui imagens, trilhas, marcas oficiais ou textos extraídos dos roteiros. **Compatibilidade v14 declarada e código validado estaticamente, mas ainda exige ensaios no próprio Foundry.**


## Diário paginado e compêndio de itens (v0.5.0)

A ficha alterna entre as páginas **Perícias**, **Arsenal**, **Dossiê** e, em criaturas, **Bestiário**. Clique nas abas superiores ou nas setas para folhear. A mudança de página ocorre no DOM sem descarregar os campos em edição.

Na primeira entrada do Narrador após a atualização, o sistema cria um compêndio de mundo chamado **Supernatural — Itens & Ocultismo**, com 47 itens e 47 ícones específicos. Nas entradas seguintes, o catálogo é verificado sem duplicar registros existentes. A primeira execução precisa de permissão de Narrador e acesso de escrita ao mundo. O material fica no mundo (não é um banco de dados pré-compilado do sistema).

## Ocultismo e diários individuais (v0.5.0)

- Na primeira entrada do Narrador, três compêndios **do mundo** são criados: *Grimório de Rituais* (12), *Magias* (12) e *Conhecimento Oculto (Narrador)* (24). Somam-se aos **47 itens originais com ícones próprios**, preservados.
- Os 24 novos grimórios têm ícones vetoriais individuais. Os dados são originais para o RPG, e **não transcrevem rituais ou falas da série**.
- A criação de um PJ do tipo `hunter` cria, quando o Narrador está conectado, um journal pessoal com permissões herdadas do ator e páginas de conhecimento inicial. Se o Narrador estiver offline, os diários ausentes serão criados quando ele entrar no mundo.
- A graduação em **Ocultismo** e o arquétipo controlam o conhecimento inicial. Mudanças nessa perícia adicionam verbetes ao journal; páginas existentes **não são reescritas**. O Narrador deve compartilhar descoberta especial com os jogadores conforme a campanha.
- Os verbetes completos para o Narrador podem revelar fraquezas desconhecidas. **Revise as permissões do compêndio de Conhecimento Oculto antes da sessão**, evitando spoilers.
- O botão *Abrir meu diário de ocultismo* fica na página Ocultismo da ficha.
- A ficha aceita redimensionamento dentro do Foundry, incluindo layout vertical em janelas estreitas. Os campos podem ser alcançados por rolagem vertical no conteúdo da janela.
- Clique diretamente na fotografia da capa para escolher outra imagem com o seletor nativo de arquivos.

### Ferramentas de sincronização (console do Narrador)

```js
game.supernatural.syncAllHunterJournals();
game.supernatural.ensureOccultCompendiums();
```

**Tipografias:** as fontes enviadas pelo autor não são redistribuídas; a ficha usa as famílias instaladas localmente e fontes de reserva.


## v0.5.0 — Som, journals e dado personalizado

- Mudar de página na ficha reproduz localmente `assets/sounds/virar-pagina.mp3` (som fornecido pelo usuário; 0,984 segundo). Volume configurável em Configurações do sistema.
- Journals e páginas de conhecimento oculto recebem estética de caderno envelhecido, mantendo o editor nativo do Foundry.
- Dependências obrigatórias no `system.json`: Dice So Nice (`dice-so-nice`) e Dice Tray (`dice-calculator`).
- O Dice So Nice registra o conjunto **Supernatural — Diário do Caçador** com seis imagens 256×256 e um papel de dado próprio. Testes da ficha aplicam explicitamente essa aparência.
- Para usar o mesmo dado ao rolar pelo Dice Tray, selecione **Supernatural — Diário do Caçador** como conjunto de dados d6 nas preferências do Dice So Nice. O sistema não altera compulsoriamente as preferências de outros sistemas/usuários.
- Resultado mecânico do d6 permanece 1–6; 5–6 são sucessos, e 6 também gera Ímpeto.


## v0.6.0 — banner, contraste e Livro Base

- O banner gerado para o sistema agora faz parte dos assets em `assets/banner.png` e pode ser usado no GitHub, handouts e páginas de apresentação.
- Os journals receberam contraste reforçado: texto mais escuro, linhas mais nítidas, cabeçalhos mais visíveis e tabelas mais legíveis.
- Um novo compêndio de mundo é criado para o Narrador: **Supernatural — Livro Base**, contendo o texto-base do sistema em páginas de journal estilizadas.
- Ferramenta de console adicional: `game.supernatural.ensureBaseBookCompendium();`


## One-shot inclusa — 23h17: A Última Chamada (v0.7.0)

- **Três novos compêndios de mundo**, criados automaticamente quando o Narrador entra:
  1. Supernatural — One-Shot: 23h17 (Narrador), com 16 páginas.
  2. Supernatural — One-Shot: Personagens e Ameaça, com cinco NPCs/fichas.
  3. Supernatural — One-Shot: Pistas e Ritual, com seis itens.
- Aventura planejada para **3–5 jogadores, 3–4 horas**, investigação não linear, ameaça sobrenatural e três desfechos.
- O livro é **reservado ao Narrador**, pois contém a solução. Não conceda permissão de leitura a jogadores.
- Para copiar NPCs, itens e cinco handouts para as pastas do mundo, execute como Narrador no console do navegador:

```js
game.supernatural.importOneShot();
```

- Após a importação, **revele os handouts individualmente** quando os jogadores descobrirem cada pista; todos começam sem acesso de jogador.
- O comando pode ser executado novamente sem criar duplicatas dos documentos identificados.
- O texto completo também está disponível em [`docs/ONE-SHOT-ULTIMA-CHAMADA.md`](docs/ONE-SHOT-ULTIMA-CHAMADA.md).
- **Sem mapas prontos nesta edição**: as localizações são descritas em zonas, para teatro da mente.


## Retratos dos três caçadores prontos (v0.7.1)

O pacote inclui retratos separados para **Alex Braga**, **Lia Furtado** e **Ravi Moreira**, em `assets/portraits/`. Os três são personagens prontos da biblioteca inicial. Na atualização de mundos anteriores, a imagem de cada um só é preenchida automaticamente quando o retrato ainda utiliza o símbolo genérico original; retratos personalizados são preservados.

Para reaplicar esse preenchimento manualmente como GM: `game.supernatural.updateStarterPortraits();`


## v0.8.2 — Cinco PJs completos para 23h17

Cinco novos protagonistas (Noah Brooks, Maya Torres, Mei Nakamura, Samira Haddad e Ethan Walker) foram adicionados ao JSON da one-shot com 9 atributos, 8 pontos de perícia, PV/BPM calculados, talentos iniciais, inventário embutido, histórico, objetivos, vínculos e retratos próprios em `assets/portraits/`. Os cinco NPCs anteriores permanecem inalterados.

Ao abrir o mundo como Narrador, o sistema cria automaticamente o compêndio **Supernatural — One-Shot: 5 PJs Prontos**. Para importá-los para a pasta do mundo, execute:

```js
game.supernatural.importOneShotPJs();
```

Depois de importar, abra cada ficha e atribua a permissão **Proprietário** ao respectivo jogador. Os diários individuais de ocultismo são gerados pela automação existente, sem compartilhar segredos da aventura.


## v0.8.2 — Tokens isométricos da one-shot

- Miniaturas isométricas individuais de 5 PJs e 6 personagens da aventura, em PNG 512×512 e 256×256, na pasta `assets/tokens/`.
- Personagens prontos e NPCs incluídos em `data/one-shot-ultima-chamada.json` agora possuem `prototypeToken.texture.src` apontando para seu token. O retrato da ficha (`img`) permanece inalterado.
- Para sincronizar tokens legados sem substituir arte personalizada, use `game.supernatural.syncOneShotTokens()` como Narrador. Para forçar alteração de tokens personalizados, use explicitamente `game.supernatural.syncOneShotTokens({force:true})`.
- Cal Mercer possui token próprio no pacote, embora não seja um ator jogável/importado automaticamente por ser personagem falecido.
- Miniaturas adaptadas de arte gerada para este projeto; os recortes transparentes podem requerer acabamento adicional para uso em mapas muito claros.


## v0.8.2 — correção de identidade visual

- Novos retratos e tokens para Mei Nakamura e Samira Haddad, com aparências claramente distintas.
- Miniaturas completas dentro do enquadramento transparente (256 e 512 px), sem deformação.
- A sincronização do Narrador migra apenas caminhos padrão antigos de retratos e tokens, preservando artes personalizadas.
- Atualizar personagens já importados: `game.supernatural.syncOneShotTokens()`.


## v0.8.8 — Download e publicação sem tags manuais

- O projeto inclui workflow que gera e publica automaticamente a Release no GitHub ao enviar nova versão à `main`.
- Os três assets também são disponibilizados em um artifact na aba Actions.
- O manifesto conserva o endereço estável para atualização no Foundry.
- Caso o workflow não rode, confirme que Actions está habilitado no repositório e que o token tem permissão efetiva para criar releases (`contents: write`).


## v0.8.8 — Macro para forçar imagens e tokens

O sistema agora cria automaticamente no mundo do Narrador uma Macro do tipo Script:
**Supernatural — Forçar retratos e tokens**. Ela também está disponível como
`macros/forcar-atualizacao-imagens.js` para execução manual.

Ao executar, confirme a substituição das imagens. A macro:

- força o retrato (`img`) de personagens conhecidos no diretório de Atores;
- força o token padrão (`prototypeToken.texture.src`) e normaliza a escala visual;
- atualiza os tokens já colocados **em todas as cenas** (inclusive não ativas);
- atualiza os dois compêndios de atores da one-shot, relacrando-os ao terminar;
- verifica arquivos de imagem para não gravar referências ausentes;
- registra no console (F12) o resultado e as eventuais falhas.

**Importante:** a macro substitui imagens personalizadas. Faça backup do mundo
antes de executá-la. Ela não muda atributos, equipamentos, PV, posição ou dimensão
tática dos tokens. A seleção cobre os personagens nomeados da aventura e os três
caçadores iniciais; outros personagens permanecem intocados. O sistema deve estar
atualizado antes de executar a macro.

Para simular sem alterar os documentos, modifique `dryRun: false` para `dryRun: true`
na macro e execute novamente. A macro não precisa ser executada após cada carregamento.


## v0.8.8 — Cenas automáticas com Level nativo no Foundry V14

- Quatro mapas da one-shot incluídos em `assets/maps/` (WebP de alta qualidade e miniaturas).
- Ao entrar como Narrador, o sistema cria automaticamente quatro cenas em ordem, com um documento `Level` cada e `Level.background.src` apontando para a imagem.
- `Scene.tokenVision=true`; `Scene.fog.mode=1` (exploração individual). Sem dados no campo legado `scene.background`.
- Roteiros privados do Narrador vinculados a cada cena, contendo as pistas relevantes sem alterar os journals dos personagens.
- A macro **Supernatural — Criar cenas e ativar FOG (V14)** é criada automaticamente; ela pode restaurar backgrounds das cenas gerenciadas sem apagar tokens, paredes ou exploração.
- Console: `await game.supernatural.ensureAdventureScenes({force:true})`.
- **Atenção:** as imagens são ilustrativas sem grade; por isso, as cenas foram configuradas como `gridless`. Para os jogadores enxergarem, é necessário colocar tokens com visão habilitada. Não foram criadas paredes automáticas porque estes mapas não permitem delimitação confiável de obstáculos.


## v0.8.8 — Dois tokens isométricos corrigidos

- Novas miniaturas isométricas completas para Ethan Walker e Noah Brooks, base circular e fundo transparente.
- Novos caminhos `assets/tokens/*-isometrico-v086-512.png` evitam uso de imagens antigas no cache.
- Execute a macro **Supernatural — Forçar retratos e tokens** para corrigir os tokens já colocados nas cenas; ela também atualiza as imagens padrão das fichas.


## v0.8.8 — Tela de pausa de investigação

O indicador nativo de pausa do Foundry VTT 14 exibe a armadilha do diabo em lugar do relógio e o texto **INVESTIGAÇÃO PARADA**. A rotação original e a sincronização de pausa entre jogadores permanecem sob controle do Foundry. A imagem está em `assets/pause/armadilha-do-diabo.webp` e o código em `module/pause.mjs`.


## Correção de retratos e tokens dos PJs (v0.8.8)

- Cinco retratos individuais novos de 1024 px.
- Tokens distintos para Mei Nakamura e Samira Haddad, sem reaproveitamento entre personagens.
- **Atualização no próprio compêndio** `world.cacadores-ultima-chamada-pjs`: na primeira entrada como Narrador, o sistema atualiza o campo `img` e `prototypeToken.texture.src` de todas as cinco fichas já cadastradas.
- Fichas importadas ao mundo e tokens de cenas são atualizados se ainda usarem imagens distribuídas pelo sistema. Não sobrescreve imagens personalizadas automaticamente.
- Para sobrescrever tudo (inclusive personalizações), execute a macro **Supernatural — Corrigir artes dos 5 PJs no compêndio** ou `await game.supernatural.repairOneShotArtwork({forceWorld:true,updateScenes:true})`.
- Depois da execução, feche e abra novamente o compêndio para atualizar as miniaturas do painel.


## v0.9.0 — Paredes nativas e edição manual (Foundry V14)

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
