import type { PersonLocation } from '../../types/person'

type PeopleSheetProps = {
  people: PersonLocation[]
  onSelectPerson: (person: PersonLocation) => void
}

export function PeopleSheet({ people, onSelectPerson }: PeopleSheetProps) {
  return (
    <section className="people-sheet" aria-label="Pessoas conectadas">
      <div className="people-sheet__handle" aria-hidden="true" />
      <ul className="people-list">
        {people.map((person) => (
          <li key={person.id}>
            <button
              className="person-card"
              type="button"
              aria-label={`Abrir ${person.name}`}
              onClick={() => onSelectPerson(person)}
            >
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
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
