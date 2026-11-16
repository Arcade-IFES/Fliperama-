import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { test } from 'node:test'
import { JogosErro } from '../src/pages/Jogos/JogosErro'
import {
  MENSAGEM_ERRO_CATALOGO,
  carregarCatalogoJogos,
  processarTeclaCatalogo,
} from '../src/pages/Jogos/catalogoJogos'
import type { Jogo } from '../src/types/Jogo'

const JOGOS_EXEMPLO: Jogo[] = [
  {
    id: 'orbita-do-saber',
    nome: 'Órbita do Saber',
    autores: 'Equipe G4',
    caminho: '/jogos/orbita-do-saber/index.html',
  },
  {
    id: 'corrida-contra-o-sino',
    nome: 'Corrida Contra o Sino',
    autores: 'Equipe G4',
    caminho: '/jogos/corrida-contra-o-sino/index.html',
  },
]

test('carregarCatalogoJogos oculta erro técnico e retorna mensagem amigável', async () => {
  const registrosConsole: unknown[][] = []
  const consoleErrorOriginal = console.error
  console.error = (...args: unknown[]) => {
    registrosConsole.push(args)
  }

  try {
    const resultado = await carregarCatalogoJogos(async () => {
      throw new Error('HTTP 503 Service Unavailable: ECONNREFUSED 127.0.0.1:3000')
    })

    assert.deepEqual(resultado.jogos, [])
    assert.equal(resultado.erro, MENSAGEM_ERRO_CATALOGO)
    assert.equal(resultado.erro?.includes('503'), false)
    assert.equal(resultado.erro?.includes('ECONNREFUSED'), false)
    assert.equal(registrosConsole.length, 1)
  } finally {
    console.error = consoleErrorOriginal
  }
})

test('carregarCatalogoJogos retorna os jogos e erro nulo quando a busca funciona', async () => {
  const resultado = await carregarCatalogoJogos(async () => JOGOS_EXEMPLO)

  assert.deepEqual(resultado.jogos, JOGOS_EXEMPLO)
  assert.equal(resultado.erro, null)
})

test('JogosErro renderiza role=alert, mensagem amigável e botão de nova tentativa', () => {
  const html = renderToStaticMarkup(
    createElement(JogosErro, {
      mensagem: MENSAGEM_ERRO_CATALOGO,
    }),
  )

  assert.equal(html.includes('role="alert"'), true)
  assert.equal(html.includes(MENSAGEM_ERRO_CATALOGO), true)
  assert.equal(html.includes('TENTAR NOVAMENTE'), true)
})

test('processarTeclaCatalogo permite retry com Enter, saída com Escape e bloqueia setas durante erro', () => {
  assert.deepEqual(
    processarTeclaCatalogo('Enter', [], 0, MENSAGEM_ERRO_CATALOGO),
    { tipo: 'tentar_novamente' },
  )
  assert.deepEqual(
    processarTeclaCatalogo('Escape', [], 0, MENSAGEM_ERRO_CATALOGO),
    { tipo: 'voltar_inicio' },
  )
  assert.deepEqual(
    processarTeclaCatalogo('ArrowRight', [], 0, MENSAGEM_ERRO_CATALOGO),
    { tipo: 'nenhuma' },
  )
  assert.deepEqual(
    processarTeclaCatalogo('ArrowRight', JOGOS_EXEMPLO, 0, null),
    { tipo: 'selecionar_indice', indice: 1 },
  )
  assert.deepEqual(
    processarTeclaCatalogo('Enter', JOGOS_EXEMPLO, 1, null),
    { tipo: 'iniciar_jogo', jogo: JOGOS_EXEMPLO[1] },
  )
  assert.deepEqual(
    processarTeclaCatalogo('Escape', JOGOS_EXEMPLO, 0, null),
    { tipo: 'voltar_inicio' },
  )
})
