## v0.3.0

- Corrigida a navegação da ficha: abas são páginas reais do diário, com botões anterior/próximo, contador e alternância sem re-renderização da ficha.
- Adicionados 47 ícones diferentes e temáticos, associados diretamente aos 47 itens da biblioteca inicial.
- Adicionado compêndio de itens criado automaticamente no mundo do Foundry quando o Narrador entra, com mecanismo de atualização idempotente e sem duplicações por nome.
- Itens já importados no mundo que ainda usem o ícone genérico original recebem o ícone correspondente; imagens personalizadas pelo usuário são preservadas.

## v0.2.0

- Nova ficha em tema de diário de campo/caderno de anotações.
- Retrato principal padronizado em moldura visual 256×256.
- Chat de rolagens com estética de página rasgada e anotações de caso.
- Tipografias personalizadas incorporadas ao sistema.

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
