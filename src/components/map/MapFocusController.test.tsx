import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MapFocusController } from './MapFocusController'

const setView = vi.fn()

vi.mock('react-leaflet', () => ({
  useMap: () => ({ setView }),
}))

describe('MapFocusController', () => {
  beforeEach(() => {
    setView.mockClear()
  })

  it('move o mapa para a posição solicitada', () => {
    render(<MapFocusController position={[-27.4898, -48.6518]} zoom={16} />)

    expect(setView).toHaveBeenCalledWith(
      [-27.4898, -48.6518],
      16,
      { animate: true },
    )
  })
})
