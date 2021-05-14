import React from 'react'
import { render, screen } from '@testing-library/react'

// Components
import { Favorite } from './Favorite'

beforeEach(() => render(<Favorite active={true} pid="Product" />))

describe('<Favorite />', () => {
  it('Should be show a favorite icon', () => {
    screen.getAllByText(/favorite/i)
  })
})
