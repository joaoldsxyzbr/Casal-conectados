import { useState } from 'react'
import { AppHeader } from './components/header/AppHeader'
import { MapView } from './components/map/MapView'
import { BottomNav } from './components/navigation/BottomNav'
import { PeoplePage } from './components/people/PeoplePage'
import { PeopleSheet } from './components/people/PeopleSheet'
import { mockPeople } from './data/people'

type AppTab = 'map' | 'people'

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('map')

  return (
    <main className="app-shell">
      {activeTab === 'map' ? (
        <>
          <MapView />
          <PeopleSheet people={mockPeople} />
        </>
      ) : (
        <PeoplePage people={mockPeople} />
      )}

      <AppHeader />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </main>
  )
}
