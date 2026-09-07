import type { PersonLocation } from '../../types/person'

type PeoplePageProps = {
  people: PersonLocation[]
}

export function PeoplePage({ people }: PeoplePageProps) {
  return (
    <section className="people-page" aria-labelledby="people-page-title">
      <div className="people-page__content">
        <div className="people-page__intro">
          <p>Seu círculo</p>
          <h2 id="people-page-title">Pessoas</h2>
          <span>2 pessoas conectadas</span>
        </div>

        <ul className="people-page__list">
          {people.map((person) => (
            <li className="people-page__card" key={person.id}>
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
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
