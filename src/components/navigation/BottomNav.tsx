import { Map, Users } from 'lucide-react'

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <button
        className="bottom-nav__item bottom-nav__item--active"
        type="button"
        aria-current="page"
        aria-label="Mapa"
      >
        <Map size={21} aria-hidden="true" />
        <span>Mapa</span>
      </button>
      <button className="bottom-nav__item" type="button" aria-label="Pessoas">
        <Users size={21} aria-hidden="true" />
        <span>Pessoas</span>
      </button>
    </nav>
  )
}
