import { render, screen } from '@testing-library/react'
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

  it('oferece navegação inferior entre mapa e pessoas', () => {
    render(<App />)

    expect(screen.getByRole('button', { name: 'Mapa' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(screen.getByRole('button', { name: 'Pessoas' })).toBeInTheDocument()
  })
})
