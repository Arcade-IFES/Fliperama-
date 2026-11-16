# Teste de Perda de Informação — Feature `003-registro-anonimo` (Base: F2 / DSM)

Auditoria de rastreabilidade entre os artefatos de planejamento da EaD 07 (`constitution.md`, `features-fim-a-fim.md` e `dsm.md`) e os artefatos gerados pelo GitHub Spec-Kit (`spec.md` e `tasks.md`) para o Fliperama Local (Grupo 03).

---

## 1. Tabela de Rastreabilidade (Origem EaD 07 → Artefatos Spec-Kit)

| Transição | O que o grupo definiu na Origem (EaD 07) | O que o Spec-Kit gerou (Destino) | Classificação | Impacto no Produto |
| :--- | :--- | :--- | :--- | :--- |
| **F2 (`features-fim-a-fim.md`) → `spec.md`** | Coleta de matrícula (12 dígitos) + apelido, com filtro de termos ofensivos via `config.json`. | Matrícula tornou-se opcional (`FR-004`); criado botão **JOGAR SEM IDENTIFICAÇÃO** (`FR-001`); filtro de termos ofensivos removido do escopo (*Assumptions*). | **Distorção + Perda (Omissão)** | Risco de apelidos ofensivos passarem sem bloqueio se a F2 não tiver outra task dedicada; divergência entre `docs/planejamento/` e `specs/`. |
| **`constitution.md` → `spec.md` / `tasks.md`** | Navegação 100% por teclado, alto contraste a 2m, erros em `pt-BR` e testes com `node --test`. | Preservado nos critérios `FR-002`, `FR-007` e nas tarefas `T003`, `T005`, `T006` e `T007`. | **Retenção Integral** | Garante acessibilidade no quiosque físico e cobertura de testes de contrato no Fastify. |
| **`constitution.md` (Princípio III) → `tasks.md`** | Toda escrita persistente em disco deve usar persistência atômica (*write-then-rename*). | `tasks.md` verifica persistência na fila (`T003`), mas não explicita validação de escrita atômica na gravação do registro anônimo. | **Perda Parcial** | Depende de implementação prévia sem verificação explícita nos critérios de aceite da tarefa. |
| **`dsm.md` → `tasks.md`** | A DSM indicava que a tela de identificação (E3) poderia avançar em paralelo sem esperar regras de backend. | `tasks.md` bloqueou o frontend (`T005`) atrás da refatoração da rota Fastify (`T002`) e do teste falho de backend (`T003`). | **Distorção de Ordem (Invenção técnica)** | Aumentou a dependência sequencial no início, mas evitou retrabalho de integração ao congelar o contrato HTTP antes da UI. |

---

## 2. Análise e Conclusões do Teste

1. **Taxa de Retenção:** Dos requisitos centrais da `constitution.md` (operação por teclado, modo offline-first, testes nativos e UX de quiosque), **100% foram preservados**. Já em relação ao planejamento funcional da EaD 07 (Feature F2), **cerca de 70% foi mantido**, enquanto 30% sofreu alteração de regra (matrícula opcional) ou omissão (lista de palavras bloqueadas em `config.json`).
2. **Onde ocorreu o maior vazamento:** O maior desvio não foi uma alucinação aleatória da IA, mas a **desatualização entre camadas de documentação**: a Issue #17 alterou regras de negócio na `spec.md` sem que o documento base (`docs/planejamento/features-fim-a-fim.md`) fosse atualizado, e o filtro de termos ofensivos acabou deixado de fora do escopo.
3. **Comparação DSM vs. `tasks.md`:** A visão do Spec-Kit em `tasks.md` mostrou-se mais segura para integração do que a DSM original. Embora a DSM sugerisse paralelizar UI e backend desde o início, a exigência do Spec-Kit de extrair a rota (`T002`) e escrever o teste de contrato primeiro (`T003`) garantiu que frontend (`T009`) e servidor (`T008`) aplicassem exatamente as mesmas regras de validação.
4. **Veredito sobre SDD:** A abordagem *spec-anchored* evitou que o agente inventasse dependências externas ou quebrasse o modo offline/teclado (comum no *vibe coding*). Contudo, exige vigilância humana ativa nas seções *Assumptions* e *Out of Scope* para evitar que requisitos antigos da EaD 07 sejam silenciosamente descartados.