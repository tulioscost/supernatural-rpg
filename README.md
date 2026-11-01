# Supernatural — Caçadores da Estrada

**Sistema gratuito, independente e não oficial para Foundry VTT 14.** RPG de horror investigativo e caça a criaturas sobrenaturais, inspirado na série *Supernatural*, usando mecânicas adaptadas do manual CLANDESTINO fornecido pelo autor.

> **Versão:** 0.4.0 (protótipo / playtest). Não testado dentro de uma instalação real do Foundry VTT.

## Instalação diretamente pelo GitHub

No Foundry VTT, abra **Configuração → Sistemas de Jogo → Instalar Sistema** e informe o endereço abaixo no campo **URL do Manifesto**:

```text
https://github.com/tulioscost/supernatural-rpg/releases/latest/download/system.json
```

Selecione **Instalar**, crie um mundo e escolha **Supernatural — Caçadores da Estrada (não oficial)**. Este endereço permanece o mesmo nas próximas atualizações.

**Atenção:** o manifesto acima só funcionará após a publicação da **primeira Release** do repositório contendo os três anexos: `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.4.0.md`. Somente enviar os fontes à branch `main` não disponibiliza o sistema para instalação.

## Como publicar a primeira versão no GitHub

1. Envie **todos os arquivos e pastas desta distribuição de código-fonte** para a raiz do repositório `https://github.com/tulioscost/supernatural-rpg` (não envie apenas o arquivo ZIP como conteúdo do repositório).
2. Certifique-se de que `https://github.com/tulioscost/supernatural-rpg/blob/main/system.json` exista e que **Actions** esteja habilitado.
3. Crie e envie a tag `v0.4.0`. A ação `.github/workflows/release.yml` valida os arquivos, gera o ZIP e anexa os três arquivos da GitHub Release: manifesto, ZIP e notas da versão.
4. Verifique em **Releases** se a publicação da versão `v0.4.0` contém `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.4.0.md`.
5. Cole a URL de manifesto acima no Foundry VTT. Para versões futuras, atualize a versão/URL de download em `system.json` e crie a tag correspondente.

### Comandos Git (após colocar os arquivos na raiz do repositório local)

```bash
git add .
git commit -m "feat: publica Supernatural Caçadores da Estrada v0.4.0"
git push origin main
git tag v0.4.0
git push origin v0.4.0
```

O workflow também executa validação a cada `push` para a branch `main` e cria um artefato de teste. Apenas uma tag `v*` gera release instalável.

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


## Diário paginado e compêndio de itens (v0.4.0)

A ficha alterna entre as páginas **Perícias**, **Arsenal**, **Dossiê** e, em criaturas, **Bestiário**. Clique nas abas superiores ou nas setas para folhear. A mudança de página ocorre no DOM sem descarregar os campos em edição.

Na primeira entrada do Narrador após a atualização, o sistema cria um compêndio de mundo chamado **Supernatural — Itens & Ocultismo**, com 47 itens e 47 ícones específicos. Nas entradas seguintes, o catálogo é verificado sem duplicar registros existentes. A primeira execução precisa de permissão de Narrador e acesso de escrita ao mundo. O material fica no mundo (não é um banco de dados pré-compilado do sistema).

## Ocultismo e diários individuais (v0.4.0)

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
