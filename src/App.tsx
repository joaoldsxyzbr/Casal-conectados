import { mockPeople } from './data/people'

export default function App() {
  return (
    <main className="app-shell">
      <h1 className="app-title">Casal Conectados</h1>
      <ul aria-label="Perfis simulados">
        {mockPeople.map((person) => (
          <li key={person.id}>{person.name}</li>
        ))}
      </ul>
    </main>
  )
}
