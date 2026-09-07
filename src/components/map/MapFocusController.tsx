import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

type MapFocusControllerProps = {
  position?: [number, number] | null
  zoom?: number
}

export function MapFocusController({
  position,
  zoom = 16,
}: MapFocusControllerProps) {
  const map = useMap()

  useEffect(() => {
    if (!position) return

    map.setView(position, zoom, { animate: true })
  }, [map, position, zoom])

  return null
}
