import React from 'react'
import { render, screen } from '@testing-library/react'

// Component
import { Header } from './Header'

beforeEach(() => {
  render(<Header />)
})

describe('<Header />', () => {
  it('should find the logo image', () => {
    screen.getByAltText(/Gadget/i)
  })

  it('should find the search icon', () => {
    screen.getByText(/search/i)
  })

  it('should find the search box', () => {
    screen.getByRole('combobox')
  })
})
