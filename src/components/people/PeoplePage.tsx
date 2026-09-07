import type { PersonLocation } from '../../types/person'
import './PeoplePage.css'

type PeoplePageProps = {
  people: PersonLocation[]
  onSelectPerson: (person: PersonLocation) => void
}

export function PeoplePage({ people, onSelectPerson }: PeoplePageProps) {
  return (
    <section className="people-page" aria-labelledby="people-page-title">
      <div className="people-page__content">
        <div className="people-page__intro">
          <p>Seu círculo</p>
          <h2 id="people-page-title">Pessoas</h2>
          <span>{people.length} pessoas conectadas</span>
        </div>

        <ul className="people-page__list">
          {people.map((person) => (
            <li key={person.id}>
              <button
                className="people-page__card"
                type="button"
                aria-label={`Abrir ${person.name}`}
                onClick={() => onSelectPerson(person)}
              >
                <span className="people-page__avatar" aria-hidden="true">
                  {person.initials}
                </span>

                <span className="people-page__person">
                  <strong>{person.name}</strong>
                  <small>
                    <span className="status-dot" aria-hidden="true" />
                    {person.status}
                  </small>
                </span>

                <span className="people-page__location">Localização ativa</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
