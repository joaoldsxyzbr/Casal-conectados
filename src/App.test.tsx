import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./components/map/MapView', () => ({
  MapView: () => <div data-testid="map-view" aria-label="Mapa do casal" />,
}))

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
    expect(screen.getAllByText('Atualizado agora')).toHaveLength(2)
  })

  it('renderiza o mapa como base da tela principal', () => {
    render(<App />)

    expect(screen.getByTestId('map-view')).toBeInTheDocument()
  })

  it('troca entre mapa e pessoas pela navegação inferior', () => {
    render(<App />)

    const mapButton = screen.getByRole('button', { name: 'Mapa' })
    const peopleButton = screen.getByRole('button', { name: 'Pessoas' })

    expect(mapButton).toHaveAttribute('aria-current', 'page')

    fireEvent.click(peopleButton)

    expect(screen.queryByTestId('map-view')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pessoas', level: 2 })).toBeInTheDocument()
    expect(peopleButton).toHaveAttribute('aria-current', 'page')
    expect(mapButton).not.toHaveAttribute('aria-current')

    fireEvent.click(mapButton)

    expect(screen.getByTestId('map-view')).toBeInTheDocument()
    expect(mapButton).toHaveAttribute('aria-current', 'page')
  })

  it('abre o detalhe da pessoa selecionada e volta para Pessoas', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: 'Pessoas' }))
    fireEvent.click(screen.getByRole('button', { name: /Abrir João/i }))

    expect(screen.getByRole('heading', { name: 'João', level: 2 })).toBeInTheDocument()
    expect(
      screen.queryByRole('navigation', { name: 'Navegação principal' }),
    ).not.toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Voltar para Pessoas' }))

    expect(screen.getByRole('heading', { name: 'Pessoas', level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Pessoas' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })
})
