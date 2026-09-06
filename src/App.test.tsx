import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza a marca Casal Conectados como título principal', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Casal Conectados', level: 1 }),
    ).toBeInTheDocument()
  })

  it('mostra os dois perfis simulados do casal', () => {
    render(<App />)

    expect(screen.getByText('João')).toBeInTheDocument()
    expect(screen.getByText('Amor')).toBeInTheDocument()
  })
})
