import React from 'react'
import { render, screen } from '@testing-library/react'

// Import component !
import { Footer } from './Footer'

let container = null

beforeEach(() => (container = render(<Footer />)))

describe('<Footer />', () => {
  it('should found call icon:', () => {
    screen.getByText(/call/i)
  })

  it('should found share icon:', () => {
    screen.getByText(/share/i)
  })

  it('should found menu icon:', () => {
    screen.getByText(/menu/i)
  })

  it('should found stock icon:', () => {
    screen.getByText(/error/i)
  })

  it('should found chat icon:', () => {
    screen.getByText(/chat/i)
  })

  it('should found menu icon:', () => {
    screen.getByText(/menu/i)
  })
})
