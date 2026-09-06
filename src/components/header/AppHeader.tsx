import { MoreHorizontal } from 'lucide-react'

export function AppHeader() {
  return (
    <header className="app-header">
      <h1>Casal Conectados</h1>
      <button
        className="icon-button"
        type="button"
        aria-label="Opções do aplicativo"
      >
        <MoreHorizontal size={20} aria-hidden="true" />
      </button>
    </header>
  )
}
