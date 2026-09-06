import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renderiza a marca Casal Conectados', () => {
    render(<App />)

    expect(screen.getByText('Casal Conectados')).toBeInTheDocument()
  })
})
