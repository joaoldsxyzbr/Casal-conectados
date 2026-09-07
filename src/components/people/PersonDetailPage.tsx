import type { PersonLocation } from '../../types/person'
import './PersonDetailPage.css'

type PersonDetailPageProps = {
  person: PersonLocation
  onBack: () => void
}

export function PersonDetailPage({ person, onBack }: PersonDetailPageProps) {
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
      </div>
    </section>
  )
}
