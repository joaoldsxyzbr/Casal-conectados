import { useState } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import { mockPeople } from '../../data/people'
import { PersonMarker } from './PersonMarker'

const MAP_CENTER: [number, number] = [-27.492, -48.6537]

export function MapView() {
  const [mapFailed, setMapFailed] = useState(false)

  return (
    <section className="map-view" aria-label="Mapa do casal">
      <MapContainer
        center={MAP_CENTER}
        zoom={15}
        zoomControl={false}
        scrollWheelZoom
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            tileerror: () => setMapFailed(true),
          }}
        />
        {mockPeople.map((person) => (
          <PersonMarker key={person.id} person={person} />
        ))}
      </MapContainer>

      {mapFailed ? (
        <div className="map-fallback" role="status">
          Mapa indisponível
        </div>
      ) : null}
    </section>
  )
}
