import { useCallback, useEffect, useRef, useState } from 'react'
import GameCard from '../../components/GameCard/GameCard'
import { buscarJogos } from '../../service/apiLocal'
import './Jogos.css'
import type { Jogo } from '../../types/Jogo'
import { JogosErro } from './JogosErro'
import {
  INSTRUCAO_CATALOGO_ERRO,
  INSTRUCAO_CATALOGO_PADRAO,
  carregarCatalogoJogos,
  processarTeclaCatalogo,
} from './catalogoJogos'

type JogosProps = {
  onSelecionarJogo: (jogo: Jogo) => void
  onVoltarInicio?: () => void
}

function Jogos({ onSelecionarJogo, onVoltarInicio }: JogosProps) {
  const [jogoSelecionado, setJogoSelecionado] = useState(0)
  const [jogos, setJogos] = useState<Jogo[]>([])
  const [erro, setErro] = useState<string | null>(null)
  const tentandoRef = useRef(false)

  const aplicarResultado = useCallback(
    (resultado: { jogos: Jogo[]; erro: string | null }) => {
      setJogos(resultado.jogos)
      setErro(resultado.erro)
      if (resultado.erro === null) {
        setJogoSelecionado(0)
      }
    },
    [],
  )

  const tentarNovamente = useCallback(async () => {
    if (tentandoRef.current) {
      return
    }
    tentandoRef.current = true
    try {
      const resultado = await carregarCatalogoJogos(buscarJogos)
      aplicarResultado(resultado)
    } finally {
      tentandoRef.current = false
    }
  }, [aplicarResultado])

  useEffect(() => {
    let ativo = true

    async function carregarInicial() {
      const resultado = await carregarCatalogoJogos(buscarJogos)
      if (ativo) {
        aplicarResultado(resultado)
      }
    }

    void carregarInicial()

    return () => {
      ativo = false
    }
  }, [aplicarResultado])

  useEffect(() => {
    function aoPressionarTecla(event: KeyboardEvent) {
      const acao = processarTeclaCatalogo(
        event.key,
        jogos,
        jogoSelecionado,
        erro,
      )

      if (acao.tipo === 'voltar_inicio') {
        onVoltarInicio?.()
        return
      }

      if (acao.tipo === 'tentar_novamente') {
        event.preventDefault()
        void tentarNovamente()
        return
      }

      if (acao.tipo === 'selecionar_indice') {
        setJogoSelecionado(acao.indice)
        return
      }

      if (acao.tipo === 'iniciar_jogo') {
        onSelecionarJogo(acao.jogo)
      }
    }

    window.addEventListener('keydown', aoPressionarTecla)

    return () => {
      window.removeEventListener('keydown', aoPressionarTecla)
    }
  }, [
    erro,
    jogos,
    jogoSelecionado,
    onSelecionarJogo,
    onVoltarInicio,
    tentarNovamente,
  ])

  return (
    <main className="jogos-screen">
      <h1>SELEÇÃO DE JOGOS</h1>

      {erro !== null ? (
        <JogosErro
          mensagem={erro}
          onTentarNovamente={() => void tentarNovamente()}
        />
      ) : (
        <section className="jogos-grid">
          {jogos.map((jogo, index) => (
            <GameCard
              key={jogo.id}
              nome={jogo.nome}
              autores={jogo.autores}
              selecionado={index === jogoSelecionado}
            />
          ))}
        </section>
      )}

      <p className="jogos-instrucao">
        {erro !== null ? INSTRUCAO_CATALOGO_ERRO : INSTRUCAO_CATALOGO_PADRAO}
      </p>
    </main>
  )
}

export default Jogos
