import { DivIcon } from 'leaflet'
import { Marker, Popup } from 'react-leaflet'
import type { PersonLocation } from '../../types/person'

type PersonMarkerProps = {
  person: PersonLocation
}

export function PersonMarker({ person }: PersonMarkerProps) {
  const icon = new DivIcon({
    className: 'person-marker-wrapper',
    html: `<div class="person-marker" aria-hidden="true"><span>${person.initials}</span></div><div class="person-label">${person.name}</div>`,
    iconSize: [64, 76],
    iconAnchor: [32, 62],
  })

  return (
    <Marker position={person.position} icon={icon}>
      <Popup>
        <strong>{person.name}</strong>
        <br />
        <span>{person.status}</span>
      </Popup>
    </Marker>
  )
}
