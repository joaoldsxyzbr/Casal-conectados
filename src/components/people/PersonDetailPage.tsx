import { useEffect, useRef, useState } from 'react'
import { MapPin, MessageCircle, Phone, RefreshCw, Route } from 'lucide-react'
import type { PersonLocation } from '../../types/person'
import './PersonDetailPage.css'

type PersonDetailPageProps = {
  person: PersonLocation
  onBack: () => void
  onViewOnMap: (person: PersonLocation) => void
}

type MockAction = 'route' | 'message' | 'call'

const actionFeedback: Record<MockAction, string> = {
  route: 'Rota disponível quando a integração real for ativada.',
  message: 'Mensagem disponível quando a integração real for ativada.',
  call: 'Ligação disponível quando a integração real for ativada.',
}

export function PersonDetailPage({
  person,
  onBack,
  onViewOnMap,
}: PersonDetailPageProps) {
  const [feedback, setFeedback] = useState<string | null>(null)
  const refreshTimeout = useRef<ReturnType<typeof window.setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (refreshTimeout.current !== null) {
        window.clearTimeout(refreshTimeout.current)
      }
    }
  }, [])

  function handleMockAction(action: MockAction) {
    setFeedback(actionFeedback[action])
  }

  function handleRefresh() {
    if (refreshTimeout.current !== null) {
      window.clearTimeout(refreshTimeout.current)
    }

    setFeedback('Solicitando atualização...')
    refreshTimeout.current = window.setTimeout(() => {
      setFeedback('Localização atualizada agora.')
      refreshTimeout.current = null
    }, 900)
  }

  return (
    <section className="person-detail" aria-labelledby="person-detail-title">
      <div className="person-detail__content">
        <button
          className="person-detail__back"
          type="button"
          aria-label="Voltar para Pessoas"
          onClick={onBack}
        >
          Voltar
        </button>

        <div className="person-detail__hero">
          <span className="person-detail__avatar" aria-hidden="true">
            {person.initials}
          </span>
          <div>
            <span className="person-detail__eyebrow">Pessoa conectada</span>
            <h2 id="person-detail-title">{person.name}</h2>
            <p>{person.status}</p>
            <span className="person-detail__active">Localização ativa</span>
          </div>
        </div>

        <div className="person-detail__location">
          <MapPin size={20} aria-hidden="true" />
          <div>
            <small>Localização simulada</small>
            <strong>{person.locationLabel}</strong>
          </div>
        </div>

        <div className="person-detail__actions" aria-label="Ações rápidas">
          <button type="button" onClick={() => onViewOnMap(person)}>
            <MapPin size={21} aria-hidden="true" />
            <span>Ver no mapa</span>
          </button>
          <button type="button" onClick={() => handleMockAction('route')}>
            <Route size={21} aria-hidden="true" />
            <span>Rota</span>
          </button>
          <button type="button" onClick={() => handleMockAction('message')}>
            <MessageCircle size={21} aria-hidden="true" />
            <span>Mensagem</span>
          </button>
          <button type="button" onClick={() => handleMockAction('call')}>
            <Phone size={21} aria-hidden="true" />
            <span>Ligar</span>
          </button>
          <button type="button" onClick={handleRefresh}>
            <RefreshCw size={21} aria-hidden="true" />
            <span>Atualizar</span>
          </button>
        </div>

        {feedback ? (
          <div className="person-detail__feedback" role="status">
            {feedback}
          </div>
        ) : null}
      </div>
    </section>
  )
}
