# Feature Specification: Mensagem amigável e recuperação por teclado no catálogo (#18)

**Feature Branch**: `feature/aula12-caveman-speckit`

**Created**: 2026-11-14

**Status**: Implemented

**Input**: Issue Arcade-IFES/Fliperama-#18: exibir mensagem amigável quando o catálogo de jogos não carrega em `fliperama-local/src/pages/Jogos/Jogos.tsx`, mantendo a operação por teclado do quiosque (`RF-L11`, `RF-L14`, `RF-L24`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Exibir aviso amigável quando o catálogo falha (Priority: P1)

Como jogador no quiosque, quero ver um aviso claro em português quando a lista de jogos não puder ser carregada, para entender que o servidor local está indisponível quando a tela não exibe títulos.

**Why this priority**: Corrige a falha silenciosa descrita na issue #18 e atende à US-14 (`RF-L24`), evitando tela em branco ou exposição de detalhes técnicos.

**Independent Test**: Simular falha na busca de jogos e verificar que a grade de cards é substituída pelo alerta `"Não foi possível carregar os jogos. Verifique se o servidor está rodando."`, sem exibir códigos HTTP, mensagens de exceção ou stack traces.

**Acceptance Scenarios**:

1. **Given** a tela de seleção de jogos está montada e a busca do catálogo falha tanto na API local quanto no arquivo estático, **When** o carregamento termina com erro, **Then** o sistema exibe a mensagem `"Não foi possível carregar os jogos. Verifique se o servidor está rodando."` em um bloco com `role="alert"`.
2. **Given** ocorreu falha no carregamento do catálogo, **When** a interface é renderizada, **Then** a grade de jogos não aparece e o registro técnico do erro fica restrito ao `console.error`.
3. **Given** a API local ou o catálogo estático responde normalmente, **When** o carregamento conclui sem erro, **Then** os cards dos jogos são exibidos e o alerta permanece oculto.

---

### User Story 2 - Tentar novamente ou voltar ao início pelo teclado (Priority: P2)

Como jogador ou operador em um quiosque sem mouse, quero tentar recarregar os jogos com `Enter` ou retornar à tela de atração com `Escape` quando ocorrer um erro no catálogo, para que a estação não fique presa na tela de falha.

**Why this priority**: Melhoria identificada na revisão com Caveman contra o requisito `RF-L11` e a Constituição do projeto. Exibir apenas texto estático travaria o quiosque caso o servidor demorasse a responder durante o boot.

**Independent Test**: Renderizar o estado de erro e simular as teclas `Enter` e `Escape`, além do clique no botão `TENTAR NOVAMENTE`, confirmando a nova tentativa de busca e o retorno à tela inicial.

**Acceptance Scenarios**:

1. **Given** a tela de seleção de jogos exibe a mensagem de erro, **When** o jogador pressiona `Enter` ou aciona o botão `TENTAR NOVAMENTE`, **Then** o componente dispara uma nova busca do catálogo.
2. **Given** a tela de seleção de jogos está em estado de erro ou aberta normalmente, **When** o jogador pressiona `Escape`, **Then** a aplicação retorna para a tela de atração.
3. **Given** a tela de erro está ativa e o catálogo voltou a responder, **When** a nova tentativa tem sucesso, **Then** o aviso de erro desaparece, o primeiro jogo fica selecionado e a grade volta ao estado normal.

### Edge Cases

- Durante o estado de erro, pressionar `ArrowLeft` ou `ArrowRight` não altera índices nem provoca erro sobre lista vazia.
- Erros de rede com código HTTP ou endereço local (como `HTTP 503` ou `ECONNREFUSED`) são registrados apenas no `console.error` e nunca chegam ao texto renderizado.
- Caso o usuário acione `TENTAR NOVAMENTE` repetidas vezes com o servidor fora do ar, o aviso amigável continua visível sem duplicar alertas.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O módulo de seleção de jogos MUST capturar falhas de `buscarJogos()`, registrar o erro original via `console.error` e ativar o estado de erro com a mensagem `"Não foi possível carregar os jogos. Verifique se o servidor está rodando."`.
- **FR-002**: Quando houver erro ativo, a tela MUST ocultar a grade vazia e exibir a mensagem dentro de um elemento com `role="alert"`, sem expor códigos HTTP, stack traces ou termos técnicos (`RF-L24`).
- **FR-003**: Na condição de erro, o sistema MUST oferecer o botão nativo `TENTAR NOVAMENTE` e disparar nova busca de catálogo ao pressionar `Enter` ou acionar o botão (`RF-L11`).
- **FR-004**: Na tela de seleção de jogos, pressionar `Escape` MUST retornar à tela de atração (`RF-L11`).
- **FR-005**: A barra inferior de instruções MUST exibir `[ ENTER ] TENTAR NOVAMENTE • [ ESC ] VOLTAR AO INÍCIO` quando houver erro e manter `← → SELECIONAR • ENTER JOGAR` na operação normal.
- **FR-006**: O bloco de alerta e o botão de nova tentativa MUST usar alto contraste, foco visível e fonte legível a 2 metros de distância em monitor 1024×768 (`RF-L14`).

### Key Entities

- **Estado do catálogo**: resultado do carregamento da lista de jogos composto pela lista de títulos disponíveis (`jogos`) e pela mensagem de erro opcional (`erro`).
- **Ação de teclado no catálogo**: comando disparado por tecla na tela de seleção (`selecionar_indice`, `iniciar_jogo`, `tentar_novamente`, `voltar_inicio` ou `nenhuma`).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das falhas simuladas de `buscarJogos()`, a função de carregamento retorna `jogos` vazio e `erro` igual à mensagem amigável, sem incluir mensagens da exceção original.
- **SC-002**: A renderização em estado de erro contém `role="alert"`, a mensagem amigável, o botão `TENTAR NOVAMENTE` e as instruções de `Enter` e `Escape`, omitindo `jogos-grid`.
- **SC-003**: A suíte `node --test`, o ESLint e o build de produção do frontend concluem sem erros.

## Assumptions

- O fallback para `/jogos/catalogo.json` em `fliperama-local/src/service/apiLocal.ts` continua inalterado; o erro ocorre apenas quando a API local e o arquivo estático falham.
- O botão `TENTAR NOVAMENTE` atende tanto ao uso por teclado (`Enter` global ou foco no botão) quanto à demonstração web com mouse.
- Esta especificação não altera rotas do servidor Fastify nem o comportamento de `sincronizacaoService.ts`.
