# Guia Spec-Kit + Caveman do Grupo

**Aula 12 · G3 · Fliperama Local (Recreio Arcade)**

A funcionalidade escolhida foi **Jogar sem identificação**, porque ela envolve tela, rota local e fila, e já tem os três artefatos do Spec-Kit. Depois de avaliar o jogo, o jogador pode salvar a partida como `ANON`, com matrícula vazia. O quiosque guarda o placar e o voto, inclusive quando a API central está indisponível.

Os exercícios 1 e 2 usam o mesmo trecho de `tasks.md`, no commit `c2b379f`. Para a reescrita, usamos prompts equivalentes ao Caveman nos níveis Lite, Full e Ultra.

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
