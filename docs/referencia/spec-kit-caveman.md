# Guia Spec-Kit + Caveman do Grupo

**Aula 12 · G3 · Fliperama Local (Recreio Arcade)**

A funcionalidade escolhida foi **Jogar sem identificação**, porque ela envolve tela, rota local e fila, e já tem os três artefatos do Spec-Kit. Depois de avaliar o jogo, o jogador pode salvar a partida como `ANON`, com matrícula vazia. O quiosque guarda o placar e o voto, inclusive quando a API central está indisponível.

Os exercícios 1 a 5 usam a mesma funcionalidade como base, partindo do commit `c2b379f`. Para as reescritas e revisões, usamos prompts equivalentes ao Caveman nos níveis Lite, Full e Ultra. As seções 6 e 7 consolidam o guia do grupo e a aplicação prática na [issue #18](https://github.com/Arcade-IFES/Fliperama-/issues/18).

[Aula 12](https://paulossjunior.github.io/aula-extensao/plano-de-aula/aulas/aula-12-2026-11-09/) · [Issue #17](https://github.com/Arcade-IFES/Fliperama-/issues/17) · [Backlog do G3](../planejamento/backlog.md#us-08-identificar-o-jogador-por-matricula-e-apelido) · [PR original da funcionalidade](https://github.com/nribjoaovictor/Fliperama-/pull/11)

## 1. Diagnóstico de verbosidade

O trecho é a fase P1 do [`tasks.md` original, linhas 27–38](https://github.com/nribjoaovictor/Fliperama-/blob/c2b379f/specs/003-registro-anonimo/tasks.md#L27-L38). Os números correspondem às linhas no GitHub.

> **Goal**: O botão salva `ANON` com matrícula vazia, avaliação e pontos, só retorna à atração após sucesso.
>
> **Independent Test**: Simular POST anônimo no servidor local, inspecionar a fila e executar Tab+Enter no botão após uma partida.
>
> - [x] T003 [US1] Adicionar teste inicialmente falho de POST anônimo, persistência offline, resposta e placar sem matrícula em fliperama-local/tests/anonimo.test.ts
> - [x] T004 [P] [US1] Aceitar `ANON` sem matrícula e descartar matrícula recebida junto com `ANON` em fliperama-local/server/routes/resultados.ts
> - [x] T005 [P] [US1] Adicionar botão nativo JOGAR SEM IDENTIFICAÇÃO que envia ('', 'ANON'), evita duplicidade e mantém erro/retry em fliperama-local/src/pages/Identificacao/Identificacao.tsx
> - [x] T006 [US1] Dar ao botão foco de alto contraste e tamanho legível em fliperama-local/src/pages/Identificacao/Identificacao.css
>
> **Checkpoint**: P1 funciona offline e por teclado; uma falha de gravação não descarta a partida.

| Linha | Marcação | Motivo |
| --- | --- | --- |
| 29 | Preservar | `ANON`, matrícula vazia, dados da partida e retorno após sucesso definem o aceite. |
| 31 | Preservar e condensar | Conferir o arquivo da fila e usar Tab + Enter são verificações distintas. A menção ao POST repete T003. |
| 33 | Preservar | O teste começa antes da mudança da rota e verifica HTTP, fila e payload enviado. |
| 34 | Preservar | O servidor também descarta matrícula recebida com `ANON`. Limpar o formulário sozinho deixaria a regra incompleta. |
| 35 | Precisar | “Evita duplicidade” precisa indicar quando. “Erro/retry” deixa em aberto se o jogador pode tentar de novo com Enter. |
| 36 | Preservar | Foco de alto contraste e tamanho legível orientam a revisão da tela do quiosque. |
| 38 | Condensar | “Funciona offline e por teclado” repete os testes. Preservar a exceção de gravação e traduzi-la em passos verificáveis. |

## 2. Reescrita em três níveis

Pedido comum ao agente:

```text
Reescreva a fase P1 de tasks.md. Preserve ordem de execução, campos, condição de sucesso,
falha e validação por teclado. Remova repetição. Gere lite com frases completas, full
com instruções curtas e ultra com os pontos mínimos para agir.
```

### Lite

> Após a avaliação, o botão **JOGAR SEM IDENTIFICAÇÃO** registra pontos e nota como `ANON`, com matrícula vazia. Retorne à atração só após salvar. Em falha, mantenha a partida para nova tentativa.
>
> Comece por um teste do POST anônimo e da fila offline. Confira a resposta e o placar enviado sem matrícula. Na rota, descarte qualquer matrícula junto de `ANON`. Na tela, use botão nativo, bloqueie envios simultâneos e exiba o erro. Garanta foco contrastante e texto legível. Após jogar, valide com Tab e Enter.

### Full

> Botão nativo após avaliação. Registre `ANON`, matrícula vazia, pontos e nota. Sucesso local volta à atração. Falha preserva partida para retry.
>
> Teste primeiro o POST, a fila offline e o envio sem matrícula. Na rota, descarte matrícula com `ANON`. Na tela, bloqueie duplo envio. Confira foco visível, legibilidade e Tab + Enter após a partida.

### Ultra

> Botão anônimo: `ANON`, matrícula vazia, pontos e nota. Fila offline. Sucesso volta à atração. Falha mantém partida. Testar POST, fila e Tab+Enter. Bloquear envio duplo.

| Versão | Palavras aproximadas | Redução ante o trecho original |
| --- | ---: | ---: |
| Original | 116 | — |
| Lite | 84 | 28% |
| Full | 54 | 53% |
| Ultra | 25 | 78% |

A medição é por palavras separadas por espaços, incluindo nomes de arquivo e IDs de tarefas. Símbolos isolados e caixas de seleção ficam fora. A tabela mede palavras. A contagem de tokens depende do modelo. Usamos `lite` para documentar decisões, `full` para revisar tarefas e `ultra` para lembrar a equipe do que verificar.

## 3. Revisão do ciclo Spec-Kit com Caveman

Aplicamos o Caveman em duas fases do ciclo da funcionalidade `003-registro-anonimo`: revisão de `tasks.md` contra `spec.md` e `plan.md`, e revisão do código implementado contra `spec.md`.

### 3.1. Revisão de tasks (`tasks.md` vs `spec.md` e `plan.md`)

Pedido feito ao agente:

```text
/caveman full
Compare specs/003-registro-anonimo/tasks.md com spec.md e plan.md.
Liste tasks faltantes, fora de escopo, sem teste ou em ordem errada.
```

Resposta concisa recebida:

```text
- Lacuna de tarefa (RF-L11): falta verificar foco inicial automático ao abrir Identificacao.tsx para navegar só com teclado.
- Tarefa sem teste automatizado de UI: T005/T006 validam botão e foco apenas em checagem manual; anonimo.test.ts cobre só a rota Fastify.
- Tarefa aberta: T011 (quickstart e limites de validação) segue pendente em tasks.md:61.
- Cobertura implícita (Princípio III): T003 checa presença do arquivo em data/fila/, mas não valida escrita atômica na 003 (coberta apenas em fila-resultados.test.ts).
- Ordem: T002 -> T003 -> T004/T005 -> T006 -> T007 -> T008 -> T009 -> T010 -> T011 está correta; T004 e T005 são paralelas por arquivo distinto.
```

Decisão do grupo: manter a ordem de dependências definida em `tasks.md`, registrar a pendência de `T011` para fechamento antes do marco E4 e adotar teste de marcação HTML via `renderToStaticMarkup` nas novas funcionalidades de frontend, como feito na issue #18.

### 3.2. Revisão da implementação (código vs `spec.md`)

Pedido feito ao agente:

```text
/caveman-review
Compare Identificacao.tsx e server/routes/resultados.ts com specs/003-registro-anonimo/spec.md.
Formato: arquivo:linha - divergência - correção - teste necessário.
```

Resposta concisa recebida:

```text
Identificacao.tsx:57 - input de matrícula não recebe foco inicial ao montar a tela (RF-L11). Adicionar autoFocus ou ref.focus() no mount. Teste: verificar foco ativo ao entrar na identificação sem mouse.
Identificacao.tsx:96 - comentário didático residual no export não agrega regra de negócio. Remover em futura limpeza do componente. Teste: lint sem erro.
routes/resultados.ts:34 - retorno 400 devolve mensagem única "Dados da partida inválidos." para matrícula e apelido, enquanto Identificacao.tsx:18-26 diferencia cada campo. Manter mensagem genérica ou detalhar código de campo se UI passar a exibir erro vindo do servidor. Teste: POST com matrícula parcial e apelido inválido em anonimo.test.ts.
```

Decisão do grupo: manter o comportamento atual da rota `POST /resultados` para evitar quebra nos testes de contrato existentes e priorizar a correção de foco inicial e feedback por teclado nas próximas alterações de interface.

## 4. Teste de perda de informação

Para o teste de perda de informação da Tarefa 4, a equipe analisou primeiro a versão `ultra` da seção 2 sem consultar o `tasks.md` original, respondendo o que conseguiu entender sobre problema, ação, testes e riscos. Depois comparou a interpretação com a tarefa original e cruzou os achados com a auditoria de rastreabilidade da funcionalidade.

| Informação preservada | Informação perdida |
| --- | --- |
| Objetivo central: botão anônimo envia `ANON`, matrícula vazia, pontos e nota. | Ordem de execução (TDD): `T003` precisa falhar antes das mudanças em `T004` e `T005`. |
| Resiliência: gravação em fila offline, retorno à atração no sucesso e preservação da partida na falha. | Regra defensiva no servidor (`T004`): a rota também descarta matrícula enviada com `ANON`, sem confiar apenas na tela. |
| Validações principais: testar POST, testar fila, testar `Tab` + `Enter` e bloquear envio duplo. | Caminhos exatos dos arquivos (`anonimo.test.ts`, `resultados.ts`, `Identificacao.tsx`, `Identificacao.css`). |
| Risco operacional implícito: falha ao gravar ou clique duplo não pode perder nem duplicar a partida. | Critérios visuais do quiosque (`T006`): botão nativo, foco de alto contraste, texto legível a 2 metros e mensagem de erro em português. |

Na auditoria mais ampla entre os artefatos de planejamento (`docs/planejamento/features-fim-a-fim.md` e `backlog.md`) e `specs/003-registro-anonimo/spec.md`, a equipe também percebeu que o bloqueio de apelidos ofensivos (`RF-L26`) saiu do escopo na seção *Assumptions* de `spec.md` sem atualização correspondente no documento de features. Essa divergência mostrou que é necessário conferir as seções *Assumptions* e *Out of Scope* antes de aprovar qualquer especificação.

## 5. Aplicação no fluxo do projeto

Resumo consolidado da funcionalidade `003-registro-anonimo` no formato enxuto proposto na Aula 12:

```text
Spec: botão JOGAR SEM IDENTIFICAÇÃO salva ANON sem matrícula; apelido vazio vira ANON; matrícula é opcional (12 dígitos se preenchida); erro em português mantém partida.
Plano: extrair POST /resultados para server/routes/resultados.ts e validar no Fastify com inject, reutilizando fila individual atômica e envio G1 existentes.
Tasks: 11 tarefas; T001-T010 concluídas; falta conferir quickstart.md e registrar limites no PR (T011).
Implementação: Identificacao.tsx, Identificacao.css e routes/resultados.ts aderentes às regras de validação e bloqueio de duplo clique; falta foco inicial ao abrir a tela e teste automatizado da interface.
Riscos: filtro de termos ofensivos (RF-L26) fora de escopo em Assumptions; T011 pendente; risco de quiosque sem mouse exigir Tab manual ao entrar na tela de identificação.
Próximo passo: concluir T011 em quickstart.md e abrir tarefa específica para foco inicial e lista de bloqueio (RF-L26).
```

Onde o Caveman ajudou: expôs em poucas linhas a discrepância entre a pendência de `T011`, a ausência de teste de marcação HTML no frontend e a diferença nas mensagens de erro entre cliente e servidor.

Onde o Caveman precisou de expansão: na versão `ultra`, a compressão escondeu a regra de descarte da matrícula no backend (`T004`), a sequência de TDD (`T003` antes de `T004/T005`) e os requisitos visuais do quiosque (`T006`). Em tarefas com regra de segurança, contrato HTTP ou restrição de hardware, o nível `ultra` serviu apenas como lembrete de verificação depois da leitura da spec.

## 6. Guia Spec-Kit + Caveman do Grupo

Regras adotadas pelo Grupo G3 para usar o Spec-Kit junto ao Caveman nas próximas entregas.

### 6.1. Quando usar cada nível no ciclo Spec-Kit

| Fase | Comando / Nível | O que verificar antes de avançar |
| --- | --- | --- |
| `constitution.md` | `lite` | Princípios conflitantes ou impossíveis de testar em `node --test` ou no quiosque. |
| `spec.md` | `full` | Requisitos inventados, itens de `backlog.md` omitidos em *Out of Scope* e regras de teclado (`RF-L11`). |
| `plan.md` | `lite` | Decisões técnicas, contratos entre G1/G3/G4, arquivos afetados, estratégia de teste e riscos. |
| `tasks.md` | `full` | Tarefa faltante contra `spec.md`, tarefa sem teste, dependência invertida e critérios de contraste (`RF-L14`). |
| Implementação / PR | `/caveman-review` | Divergência linha a linha com `spec.md`, vazamento de erro técnico na UI e testes ausentes. |
| Checklist final | `ultra` | Lista rápida de até 8 itens antes de rodar `npm test`, `npm run lint` e `npm run build`. |

### 6.2. Quando pedir explicação detalhada

O grupo evita compressão extrema e pede explicação completa nestes casos:

- Segurança de execução do iframe (`sandbox="allow-scripts"`, ausência de `allow-same-origin` e validação de `event.source` contra origem `"null"`).
- Persistência em disco contra queda de energia (estratégia *write-then-rename* em `data/fila/` e formato append-only em `partidas.jsonl`).
- Mudanças em contratos compartilhados com G1 (`POST /api/placares`, `GET /api/jogos`) e G4 (`ARCADE_INIT`, `ARCADE_MUDO`, `PLACAR`).
- Decisões arquiteturais com troca de biblioteca, alteração de fluxo de telas ou restrições do ambiente TypeScript/Node no projeto.

### 6.3. Formato padrão para revisar divergências entre spec e código

```text
/caveman-review
Compare os arquivos alterados com spec.md e constitution.md.
Liste apenas bugs, critérios não atendidos e requisitos de quiosque ignorados.
Formato: arquivo:linha - divergência - correção - teste necessário.
```

### 6.4. Formato padrão para revisar tasks

```text
/caveman full
Compare tasks.md com spec.md e plan.md.
Liste apenas:
- tarefa faltante (incluindo teclado RF-L11 e contraste RF-L14)
- tarefa fora de escopo
- tarefa sem verificação automatizada em node --test
- dependência em ordem errada
Não explique além do necessário.
```

### 6.5. Três exemplos reais do projeto

#### Exemplo 1: Plano técnico (`001-fila-arquivo-individual`)

Saída original de [`specs/001-fila-arquivo-individual/plan.md`](https://github.com/nribjoaovictor/Fliperama-/blob/main/specs/001-fila-arquivo-individual/plan.md):

> **Structure Decision**: Estrutura existente de aplicação web (frontend em `src/`, backend em `server/`). Nenhum arquivo ou módulo novo no código de produção. Os consumidores (`server.ts`, `reenvioService.ts`) não mudam.
> **Constraints**: Escrita atômica; operação offline; assinaturas públicas inalteradas; caminhos relativos (`./data/...`) resolvidos no momento da chamada, pois os testes trocam o diretório de trabalho.

Versão Caveman (`lite`):

> Decisão: alterar apenas `filaResultadosService.ts` e manter assinaturas públicas para não quebrar `server.ts`, `reenvioService.ts` e `placar.test.ts`.
> Dados: um arquivo por partida em `data/fila/<id>.json` com *write-then-rename*; mover para `data/enviadas/` após envio.
> Riscos: caminho `./data/...` precisa ser resolvido em runtime porque os testes trocam `process.cwd()`.

Decisão do grupo: aprovar o plano enxuto e exigir teste específico de diretório temporário e arquivo corrompido em `fila-resultados.test.ts`.

#### Exemplo 2: Lista de tarefas (`002-arcade-init`)

Saída original da tarefa `T001` em [`specs/002-arcade-init/tasks.md`](https://github.com/nribjoaovictor/Fliperama-/blob/main/specs/002-arcade-init/tasks.md#L31) (101 palavras):

> `- [x] T001 [P] [US1] Add native Node tests in fliperama-local/tests/arcade-messages.test.ts and update score regressions in fliperama-local/tests/placar.test.ts; render the CSS-free GameFrame component from fliperama-local/src/pages/Jogo/GameFrame.tsx with ReactDOMServer and assert the actual emitted iframe has sandbox="allow-scripts" exactly, explicitly confirming its tokens exclude allow-same-origin, allow-popups, and allow-top-navigation; also verify the exact ARCADE_INIT object and "*" target origin, dispatch only when the loaded iframe is the connected active iframe, suppression for absent/disconnected/replaced iframe, and rejection of incoming messages from the wrong source, game id, or malformed score; cover PLACAR with finite non-negative payload.pontos and legacy GAME_OVER with finite non-negative payload.score, without using event.origin === "null" as authentication.`

Versão Caveman (`full`, 39 palavras, redução de 61%):

> Criar `arcade-messages.test.ts` e atualizar `placar.test.ts`.
> Validar `GameFrame` (sem CSS) com `sandbox="allow-scripts"`, sem `allow-same-origin`, `allow-popups` ou `allow-top-navigation`.
> Validar envio único de `ARCADE_INIT` para iframe conectado, supressão se ausente/trocado, e captura de `PLACAR`/`GAME_OVER` checando `source` e `jogo` (nunca `origin === "null"`).

Decisão do grupo: manter a versão `full` na revisão diária para conferir cada asserção rapidamente e consultar o texto completo apenas se houver dúvida sobre o payload exato.

#### Exemplo 3: Especificação e plano de nova correção (`006-erro-catalogo-jogos`, Issue #18)

Rascunho original da [issue #18](https://github.com/Arcade-IFES/Fliperama-/issues/18):

> Alterar `Jogos.tsx`: adicionar estado `erro`, definir `"Não foi possível carregar os jogos. Verifique se o servidor está rodando."` no `catch`, renderizar a mensagem em lugar da grade vazia e manter `console.error`.

Versão Caveman (`full`) após cruzar a issue com `constitution.md` e `package.json`:

> Lacuna de teclado (`RF-L11`): `Jogos.tsx:31` ignora teclas se `jogos.length === 0`. Só mostrar texto trava quiosque sem mouse. Adicionar `Enter` para tentar novamente e `Escape` para voltar à atração.
> Bloqueio de teste (`Princípio V`): importar `Jogos.tsx` no `node --test` quebra com `ERR_UNKNOWN_FILE_EXTENSION` em `.css` e `import.meta.env` no `tsconfig.node.json`. Separar lógica em `catalogoJogos.ts` e alerta sem CSS em `JogosErro.tsx`.

Decisão do grupo: incorporar a recuperação por teclado em `spec.md`, a separação de módulos sem CSS em `plan.md` e os testes de sanitização e markup em `tasks.md` antes de implementar.

## 7. Aplicação prática na Issue #18

Aplicamos o fluxo completo Spec-Kit + Caveman na correção descrita na [issue #18](https://github.com/Arcade-IFES/Fliperama-/issues/18) (`specs/006-erro-catalogo-jogos/`).

### Melhorias aplicadas após a revisão com Caveman

1. Em `specs/006-erro-catalogo-jogos/spec.md`: a issue original pedia apenas exibir o texto amigável. A revisão `full` detectou que `Jogos.tsx` retornava cedo quando `jogos.length === 0`, deixando o quiosque sem saída em caso de erro. A spec passou a exigir o botão `TENTAR NOVAMENTE` acionável por `Enter` (`FR-003`), o retorno à tela de atração com `Escape` (`FR-004`) e a atualização das instruções no rodapé (`FR-005`).
2. Em `specs/006-erro-catalogo-jogos/plan.md`: a revisão mostrou que `node --import tsx --test` rejeita importações `.css` (`Jogos.css` e `GameCard.css`), que o `eslint-plugin-react-refresh` bloqueia exportações não-componentes em `.tsx` e que importar `apiLocal.ts` nos testes traz `import.meta.env` para o `tsconfig.node.json` sem `vite/client`. O plano adotou o padrão já usado em `002-arcade-init`: extrair funções puras em `catalogoJogos.ts` (recebendo `buscarJogos` por parâmetro) e isolar o bloco de alerta em `JogosErro.tsx` sem importação de CSS e com `React.createElement`.
3. Em `specs/006-erro-catalogo-jogos/tasks.md`: foram incluídas tarefas específicas para estilização com alto contraste a 2 metros em `Jogos.css` (`T006`) e para teste automatizado garantindo que códigos HTTP e detalhes como `503` ou `ECONNREFUSED` não cheguem à tela (`T003`).

### Resultados registrados

Após a implementação em `fliperama-local/src/pages/Jogos/` (`catalogoJogos.ts`, `JogosErro.tsx`, `Jogos.tsx`, `Jogos.css`), `fliperama-local/src/App.tsx` e `fliperama-local/tests/catalogo-erro.test.ts`, a suíte `npm test` executou 39 testes sem falhas (incluindo os 4 novos testes de sanitização, renderização com `role="alert"` e navegação por `Enter`/`Escape`), junto com `npm run lint` e `npm run build` aprovados.

O uso do Caveman na revisão inicial dos artefatos evitou duas rodadas de retrabalho: impediu a entrega de uma tela de erro sem saída por teclado no quiosque e definiu a arquitetura testável em Node nativo antes da codificação do componente.
