import { Map, Users } from 'lucide-react'

type AppTab = 'map' | 'people'

type BottomNavProps = {
  activeTab: AppTab
  onTabChange: (tab: AppTab) => void
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      <button
        className={`bottom-nav__item${activeTab === 'map' ? ' bottom-nav__item--active' : ''}`}
        type="button"
        aria-current={activeTab === 'map' ? 'page' : undefined}
        aria-label="Mapa"
        onClick={() => onTabChange('map')}
      >
        <Map size={21} aria-hidden="true" />
        <span>Mapa</span>
      </button>
      <button
        className={`bottom-nav__item${activeTab === 'people' ? ' bottom-nav__item--active' : ''}`}
        type="button"
        aria-current={activeTab === 'people' ? 'page' : undefined}
        aria-label="Pessoas"
        onClick={() => onTabChange('people')}
      >
        <Users size={21} aria-hidden="true" />
        <span>Pessoas</span>
      </button>
    </nav>
  )
}
