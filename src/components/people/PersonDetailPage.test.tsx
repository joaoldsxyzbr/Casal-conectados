import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PersonLocation } from '../../types/person'
import { PersonDetailPage } from './PersonDetailPage'

const person = {
  id: 'joao',
  name: 'João',
  initials: 'J',
  status: 'Atualizado agora',
  position: [-27.4942, -48.6556],
  locationLabel: 'Biguaçu, SC',
} as PersonLocation & { locationLabel: string }

afterEach(() => {
  vi.useRealTimers()
})

describe('PersonDetailPage', () => {
  it('mostra localização e as cinco ações rápidas', () => {
    render(
      <PersonDetailPage
        person={person}
        onBack={vi.fn()}
        onViewOnMap={vi.fn()}
      />,
    )

    expect(screen.getByText(person.locationLabel)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ver no mapa' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Rota' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mensagem' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ligar' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Atualizar' })).toBeInTheDocument()
  })

  it.each([
    ['Rota', 'Rota disponível quando a integração real for ativada.'],
    ['Mensagem', 'Mensagem disponível quando a integração real for ativada.'],
    ['Ligar', 'Ligação disponível quando a integração real for ativada.'],
  ])('mostra feedback local para %s', (action, feedback) => {
    render(
      <PersonDetailPage
        person={person}
        onBack={vi.fn()}
        onViewOnMap={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: action }))

    expect(screen.getByRole('status')).toHaveTextContent(feedback)
  })

  it('simula a atualização de localização sem integração externa', () => {
    vi.useFakeTimers()

    render(
      <PersonDetailPage
        person={person}
        onBack={vi.fn()}
        onViewOnMap={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar' }))
    expect(screen.getByRole('status')).toHaveTextContent('Solicitando atualização...')

    act(() => {
      vi.advanceTimersByTime(900)
    })

    expect(screen.getByRole('status')).toHaveTextContent('Localização atualizada agora.')
  })
})
