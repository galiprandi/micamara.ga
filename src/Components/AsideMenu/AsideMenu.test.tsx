import React from 'react'
import { render, screen } from '@testing-library/react'

// Import component !
import { AsideMenu } from './AsideMenu'

beforeEach(() => {
  render(<AsideMenu />)
})

describe('<AsideMenu />', () => {
  it('should show "Categorías" text', () => {
    screen.getByText(/categorías/i)
  })
})
