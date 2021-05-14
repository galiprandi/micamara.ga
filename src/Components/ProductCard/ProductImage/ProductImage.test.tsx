import React from 'react'
import { render, screen } from '@testing-library/react'

// Import component !
import { ProductImage } from './ProductImage'

const props = {
  title: 'Product of example $ 1000',
  src: 'https://micamara.ga/site/images/no-image.png',
  pid: 'Product_of_example',
  recommended: true,
}

describe('<ProductImage />', () => {
  render(<ProductImage {...props} />)

  it('should find the product image', () => {
    screen.getByRole('img', { name: /Product of example \$ 1000/i })
  })
})
