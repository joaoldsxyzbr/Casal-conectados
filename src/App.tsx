import { AppHeader } from './components/header/AppHeader'
import { MapView } from './components/map/MapView'
import { BottomNav } from './components/navigation/BottomNav'
import { PeopleSheet } from './components/people/PeopleSheet'
import { mockPeople } from './data/people'

export default function App() {
  return (
    <main className="app-shell">
      <MapView />
      <AppHeader />
      <PeopleSheet people={mockPeople} />
      <BottomNav />
    </main>
  )
}
