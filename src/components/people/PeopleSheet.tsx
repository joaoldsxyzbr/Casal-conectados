import type { PersonLocation } from '../../types/person'

type PeopleSheetProps = {
  people: PersonLocation[]
}

export function PeopleSheet({ people }: PeopleSheetProps) {
  return (
    <section className="people-sheet" aria-label="Pessoas conectadas">
      <div className="people-sheet__handle" aria-hidden="true" />
      <ul className="people-list">
        {people.map((person) => (
          <li className="person-card" key={person.id}>
            <span className="person-avatar" aria-hidden="true">
              {person.initials}
            </span>
            <span className="person-copy">
              <strong>{person.name}</strong>
              <small>
                <span className="status-dot" aria-hidden="true" />
                {person.status}
              </small>
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
