import React from 'react'
import { render } from '@testing-library/react'

// Import component !
import { ProductsList } from './ProductsList'

describe('<ProductsList />', () => {
  const { container } = render(<ProductsList />)
  it('should find the class products-list', () => {
    //@ts-ignore
    expect(container.firstChild).toHaveClass('products-list')
  })
})
