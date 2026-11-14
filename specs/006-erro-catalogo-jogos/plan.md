# Implementation Plan: Mensagem amigável e recuperação por teclado no catálogo (#18)

**Branch**: `feature/aula12-caveman-speckit` | **Date**: 2026-11-14 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `specs/006-erro-catalogo-jogos/spec.md`.

## Summary

Tratar falhas ao carregar o catálogo em `fliperama-local/src/pages/Jogos/Jogos.tsx` com a mensagem amigável da issue #18, mantendo o erro técnico apenas no `console.error`. Além da exibição da mensagem, a revisão com Caveman identificou a necessidade de permitir nova tentativa com `Enter` (ou botão `TENTAR NOVAMENTE`) e retorno à tela de atração com `Escape`, evitando que o quiosque sem mouse fique preso. Para viabilizar testes unitários e de renderização no `node --test` sem JSDOM, a lógica de carregamento e teclado fica em módulo TypeScript puro (`catalogoJogos.ts`) e o bloco de erro fica em componente sem importação de CSS (`JogosErro.tsx`).

## Technical Context

**Language/Version**: TypeScript 6 / Node.js 24

**Primary Dependencies**: React 19, Vite 8, ESLint com `eslint-plugin-react-refresh`

**Storage**: Sem alterações em disco; mantém leitura via `buscarJogos()` em `apiLocal.ts`

**Testing**: `node --import tsx --test tests/*.test.ts`, `tsc -b`, `vite build` e `eslint .`

**Target Platform**: Quiosque Linux em modo kiosk (1024×768, navegação só por teclado) e demonstração web

**Project Type**: Frontend React + Vite em `fliperama-local/`

**Performance Goals**: Exibição imediata do alerta após falha de rede e reinício da seleção no índice `0` após recuperação

**Constraints**: Sem JSDOM nos testes; arquivos `.tsx` importados pelo Node não podem importar `.css` nem misturar exportações de componente e utilitários devido ao `react-refresh`

**Scale/Scope**: Uma tela (`Jogos`), integração mínima em `App.tsx`, dois módulos auxiliares e uma suíte de testes

## Constitution Check

*GATE: Reavaliado após revisão com Caveman.*

| Princípio | Decisão e verificação |
| --- | --- |
| I. Offline-first | Preserva a tentativa na API local e o fallback estático em `apiLocal.ts`; exibe erro amigável somente se ambos falharem. |
| II. Idempotência | Não se aplica; tela apenas lê o catálogo. |
| III. Persistência atômica | Não se aplica; sem escrita em disco. |
| IV. Isolamento do jogo | Não altera iframe nem protocolo `postMessage`. |
| V. Testes com `node --test` | Decisão da revisão Caveman: separar `catalogoJogos.ts` (sem CSS) e `JogosErro.tsx` (sem CSS, seguindo o padrão de `GameFrame.tsx` em `002-arcade-init`) para testar lógica e markup com `renderToStaticMarkup` no Node nativo. |
| UX e requisitos (`RF-L11`, `RF-L14`, `RF-L24`) | `Enter` tenta recarregar o catálogo, `Escape` volta à atração, mensagens técnicas ficam ocultas da tela e o alerta usa alto contraste para leitura a 2 metros. |

## Project Structure

### Documentation (this feature)

```text
specs/006-erro-catalogo-jogos/
├── spec.md
├── plan.md
└── tasks.md
```

### Source Code (repository root)

```text
fliperama-local/
├── src/
│   ├── App.tsx                       # passa onVoltarInicio para <Jogos />
│   └── pages/Jogos/
│       ├── catalogoJogos.ts          # novo: constantes, carregarCatalogoJogos e processarTeclaCatalogo
│       ├── JogosErro.tsx             # novo: componente de alerta sem import CSS para SSR/teste
│       ├── Jogos.tsx                 # integra estado de erro, teclado e JogosErro
│       └── Jogos.css                 # estilos de alto contraste e foco visível
└── tests/
    └── catalogo-erro.test.ts         # novo: testes de sanitização, teclado e markup
```

**Structure Decision**: Executar `node --import tsx --test` diretamente em `Jogos.tsx` falha com `ERR_UNKNOWN_FILE_EXTENSION` ao tentar carregar `Jogos.css` e `GameCard.css`, exportar funções de dentro de `Jogos.tsx` viola `react-refresh/only-export-components` no ESLint, e importar `apiLocal.ts` a partir dos testes puxa `import.meta.env` para o `tsconfig.node.json` (que não inclui `vite/client`). Separar `catalogoJogos.ts` (recebendo a função de busca por parâmetro a partir de `Jogos.tsx`) e `JogosErro.tsx` resolve esses três pontos sem adicionar dependências de teste como JSDOM.

## Complexity Tracking

Nenhuma exceção à Constituição necessária. A decomposição segue o mesmo padrão adotado na feature `002-arcade-init` (`arcadeMessages.ts` e `GameFrame.tsx`).
