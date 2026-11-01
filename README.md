# Supernatural — Caçadores da Estrada

**Sistema gratuito, independente e não oficial para Foundry VTT 14.** RPG de horror investigativo e caça a criaturas sobrenaturais, inspirado na série *Supernatural*, usando mecânicas adaptadas do manual CLANDESTINO fornecido pelo autor.

> **Versão:** 0.1.0 (protótipo / playtest). Não testado dentro de uma instalação real do Foundry VTT.

## Instalação diretamente pelo GitHub

No Foundry VTT, abra **Configuração → Sistemas de Jogo → Instalar Sistema** e informe o endereço abaixo no campo **URL do Manifesto**:

```text
https://github.com/tulioscost/supernatural-rpg/releases/latest/download/system.json
```

Selecione **Instalar**, crie um mundo e escolha **Supernatural — Caçadores da Estrada (não oficial)**. Este endereço permanece o mesmo nas próximas atualizações.

**Atenção:** o manifesto acima só funcionará após a publicação da **primeira Release** do repositório contendo os três anexos: `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.3.0.md`. Somente enviar os fontes à branch `main` não disponibiliza o sistema para instalação.

## Como publicar a primeira versão no GitHub

1. Envie **todos os arquivos e pastas desta distribuição de código-fonte** para a raiz do repositório `https://github.com/tulioscost/supernatural-rpg` (não envie apenas o arquivo ZIP como conteúdo do repositório).
2. Certifique-se de que `https://github.com/tulioscost/supernatural-rpg/blob/main/system.json` exista e que **Actions** esteja habilitado.
3. Crie e envie a tag `v0.3.0`. A ação `.github/workflows/release.yml` valida os arquivos, gera o ZIP e anexa os três arquivos da GitHub Release: manifesto, ZIP e notas da versão.
4. Verifique em **Releases** se a publicação da versão `v0.3.0` contém `system.json`, `supernatural-cacadores.zip` e `release-notes-v0.3.0.md`.
5. Cole a URL de manifesto acima no Foundry VTT. Para versões futuras, atualize a versão/URL de download em `system.json` e crie a tag correspondente.

### Comandos Git (após colocar os arquivos na raiz do repositório local)

```bash
git add .
git commit -m "feat: publica Supernatural Caçadores da Estrada v0.3.0"
git push origin main
git tag v0.3.0
git push origin v0.3.0
```

O workflow também executa validação a cada `push` para a branch `main` e cria um artefato de teste. Apenas uma tag `v*` gera release instalável.

## Recursos do protótipo

- Fichas responsivas de **caçadores** e **criaturas**; atributos, perícias, inventário, vida e BPM.
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


## Diário paginado e compêndio de itens (v0.3.0)

A ficha alterna entre as páginas **Perícias**, **Arsenal**, **Dossiê** e, em criaturas, **Bestiário**. Clique nas abas superiores ou nas setas para folhear. A mudança de página ocorre no DOM sem descarregar os campos em edição.

Na primeira entrada do Narrador após a atualização, o sistema cria um compêndio de mundo chamado **Supernatural — Itens & Ocultismo**, com 47 itens e 47 ícones específicos. Nas entradas seguintes, o catálogo é verificado sem duplicar registros existentes. A primeira execução precisa de permissão de Narrador e acesso de escrita ao mundo. O material fica no mundo (não é um banco de dados pré-compilado do sistema).
