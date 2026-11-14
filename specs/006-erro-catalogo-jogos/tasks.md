# Tasks: Mensagem amigável e recuperação por teclado no catálogo (#18)

**Input**: `specs/006-erro-catalogo-jogos/spec.md`, `specs/006-erro-catalogo-jogos/plan.md`

**Tests**: A Constituição (Princípio V) exige validação com `node --test` sem JSDOM.

## Phase 1: Foundational & Tests

- [x] T001 Criar `fliperama-local/src/pages/Jogos/catalogoJogos.ts` com `MENSAGEM_ERRO_CATALOGO`, `INSTRUCAO_CATALOGO_PADRAO`, `INSTRUCAO_CATALOGO_ERRO`, `carregarCatalogoJogos` e `processarTeclaCatalogo`
- [x] T002 Criar componente apresentacional sem CSS `fliperama-local/src/pages/Jogos/JogosErro.tsx` com bloco `role="alert"` e botão `TENTAR NOVAMENTE`
- [x] T003 Criar testes em `fliperama-local/tests/catalogo-erro.test.ts` validando falha sem vazamento de código HTTP, sucesso do carregamento, renderização SSR de `JogosErro` e regras de teclado (`Enter`, `Escape` e bloqueio das setas em erro)

## Phase 2: Integration & Styling

- [x] T004 Integrar estado `erro`, nova tentativa por `Enter`/botão, retorno por `Escape` e exibição condicional de `JogosErro` em `fliperama-local/src/pages/Jogos/Jogos.tsx`
- [x] T005 Passar `onVoltarInicio={voltarInicio}` para `<Jogos />` em `fliperama-local/src/App.tsx`
- [x] T006 Adicionar estilos `.jogos-erro`, `.jogos-erro-mensagem` e `.jogos-tentar-novamente` (com `:focus-visible`) em alto contraste para leitura a 2 metros em `fliperama-local/src/pages/Jogos/Jogos.css`

## Phase 3: Verification & Documentation

- [x] T007 Executar `npm test`, `npm run lint` e `npm run build` em `fliperama-local/`
- [x] T008 Registrar a revisão com Caveman e os resultados da aplicação prática em `docs/referencia/spec-kit-caveman.md`
