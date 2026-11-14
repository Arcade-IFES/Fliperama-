import { createElement } from 'react'

type JogosErroProps = {
  mensagem: string
  onTentarNovamente?: () => void
}

export function JogosErro({ mensagem, onTentarNovamente }: JogosErroProps) {
  return createElement(
    'section',
    { className: 'jogos-erro', role: 'alert' },
    createElement('p', { className: 'jogos-erro-mensagem' }, mensagem),
    createElement(
      'button',
      {
        type: 'button',
        className: 'jogos-tentar-novamente',
        onClick: onTentarNovamente,
      },
      'TENTAR NOVAMENTE',
    ),
  )
}
