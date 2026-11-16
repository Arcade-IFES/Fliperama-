import type { Jogo } from '../../types/Jogo'

export const MENSAGEM_ERRO_CATALOGO =
  'Não foi possível carregar os jogos. Verifique se o servidor está rodando.'

export const INSTRUCAO_CATALOGO_PADRAO = '← → SELECIONAR • ENTER JOGAR'
export const INSTRUCAO_CATALOGO_ERRO =
  '[ ENTER ] TENTAR NOVAMENTE • [ ESC ] VOLTAR AO INÍCIO'

export async function carregarCatalogoJogos(
  buscar: () => Promise<Jogo[]>,
): Promise<{ jogos: Jogo[]; erro: string | null }> {
  try {
    const jogos = await buscar()
    return { jogos, erro: null }
  } catch (erro) {
    console.error('Erro ao carregar jogos:', erro)
    return { jogos: [], erro: MENSAGEM_ERRO_CATALOGO }
  }
}

export type AcaoTeclaCatalogo =
  | { tipo: 'nenhuma' }
  | { tipo: 'selecionar_indice'; indice: number }
  | { tipo: 'iniciar_jogo'; jogo: Jogo }
  | { tipo: 'tentar_novamente' }
  | { tipo: 'voltar_inicio' }

export function processarTeclaCatalogo(
  tecla: string,
  jogos: Jogo[],
  jogoSelecionado: number,
  erro: string | null,
): AcaoTeclaCatalogo {
  if (tecla === 'Escape') {
    return { tipo: 'voltar_inicio' }
  }

  if (erro !== null) {
    if (tecla === 'Enter') {
      return { tipo: 'tentar_novamente' }
    }
    return { tipo: 'nenhuma' }
  }

  if (jogos.length === 0) {
    return { tipo: 'nenhuma' }
  }

  if (tecla === 'ArrowRight') {
    return {
      tipo: 'selecionar_indice',
      indice: jogoSelecionado < jogos.length - 1 ? jogoSelecionado + 1 : 0,
    }
  }

  if (tecla === 'ArrowLeft') {
    return {
      tipo: 'selecionar_indice',
      indice: jogoSelecionado > 0 ? jogoSelecionado - 1 : jogos.length - 1,
    }
  }

  if (tecla === 'Enter') {
    const jogo = jogos[jogoSelecionado]
    if (jogo) {
      return { tipo: 'iniciar_jogo', jogo }
    }
  }

  return { tipo: 'nenhuma' }
}
