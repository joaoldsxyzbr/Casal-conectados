import { useState } from 'react'
import { AppHeader } from './components/header/AppHeader'
import { MapView } from './components/map/MapView'
import { BottomNav } from './components/navigation/BottomNav'
import { PeoplePage } from './components/people/PeoplePage'
import { PeopleSheet } from './components/people/PeopleSheet'
import { PersonDetailPage } from './components/people/PersonDetailPage'
import { mockPeople } from './data/people'
import type { PersonLocation } from './types/person'

type AppTab = 'map' | 'people'

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('map')
  const [selectedPerson, setSelectedPerson] = useState<PersonLocation | null>(null)
  const [mapFocusPosition, setMapFocusPosition] = useState<
    [number, number] | null
  >(null)

  function handleViewOnMap(person: PersonLocation) {
    setMapFocusPosition(person.position)
    setSelectedPerson(null)
    setActiveTab('map')
  }

  return (
    <main className="app-shell">
      {selectedPerson ? (
        <PersonDetailPage
          person={selectedPerson}
          onBack={() => setSelectedPerson(null)}
          onViewOnMap={handleViewOnMap}
        />
      ) : activeTab === 'map' ? (
        <>
          <MapView focusPosition={mapFocusPosition} />
          <PeopleSheet people={mockPeople} onSelectPerson={setSelectedPerson} />
        </>
      ) : (
        <PeoplePage people={mockPeople} onSelectPerson={setSelectedPerson} />
      )}

      {!selectedPerson ? <AppHeader /> : null}
      {!selectedPerson ? (
        <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      ) : null}
    </main>
  )
}
