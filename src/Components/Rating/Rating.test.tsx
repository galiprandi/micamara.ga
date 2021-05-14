import React from 'react'
import { render } from '@testing-library/react'

// Import component !
import Rating from './Rating'

describe('<Rating />', () => {
  const { container } = render(<Rating stars={3} />)

  it('should find the class products-list', () => {
    //@ts-ignore
    expect(container.firstChild).toHaveClass('ratting')
  })
})
