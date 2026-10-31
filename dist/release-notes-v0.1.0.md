# Supernatural — Caçadores da Estrada v0.1.0

Versão experimental e não oficial para Foundry VTT 14.

## Conteúdo

- Sistema instalável via URL do manifesto.
- Fichas de caçadores e criaturas, rolagens d6, investigação e vulnerabilidades.
- Biblioteca inicial com 15 atores, 47 itens e 4 dossiês.

## Instalação

No Foundry VTT, use a URL do manifesto:

`https://github.com/tulioscost/supernatural-rpg/releases/latest/download/system.json`

Esta URL passa a funcionar após a publicação desta Release no GitHub.

## Histórico de alterações

# Histórico de versões

## 0.1.0 — Protótipo inicial (31/10/2026)

- Manifesto para Foundry VTT 14 e modelos tipados de atores/itens.
- Fichas responsivas em estilo arquivo noir, com abas, atributo, perícias, BPM, traumas e equipamentos.
- Motor de 0–10d6, dificuldade 1–5, sucessos 5/6 e ímpetos condicionados ao êxito.
- Rolagens no chat, testes livres, investigação com pista essencial e custos; ataques e rituais.
- Imunidade de criaturas e vulnerabilidades por tags; RD por equipamento.
- Consumo de munição, componentes e materiais descartáveis, quando configurados.
- Biblioteca inicial importável: 15 atores, 47 itens e 4 dossiês.
- Aventura original de abertura, O Último Trecho.
- Testes de regras no Node.js e checagens estáticas de arquivos.

**Pendências deliberadas:** testes numa instância Foundry, testes de usabilidade, migração de dados, efeitos ativos, mapas de batalha, compêndios LevelDB, automação dos relógios, suporte a token/sound efeitos, distribuidor remoto e release hospedado.

### Distribuição pelo GitHub (preparação de publicação v0.1.0)

- URLs de repositório, manifesto de versão mais recente e download específico por release.
- Github Actions para validar Node/JSON, gerar ZIP sem pasta superior e publicar `system.json` e `supernatural-cacadores.zip` na Release.
- Scripts de validação e instruções para instalação por manifesto.

