import React from 'react'
import { render, screen } from '@testing-library/react'

// Import component !
import { ProductCard } from './ProductCard'

const product = {
  id: 'uniqueId',
  pid: 'Product of example',
  name: 'Product of example',
  price: '$ 1000',
  financing: [
    '1 cuota de  $ 1000',
    '3 cuotas de $ 333',
    '6 cuotas de $ 200',
    '9 cuotas de $ 100',
    '12 cuotas $ 50',
  ],
  stock: true,
  recommended: true,
  img: 'canon_70D_body.jpg',
  brand: 'Canon',
  group: 'Fotografía',
  type: 'Cámaras Profesionales',
  description: 'Product description',
  search: 'Product of example',
}

beforeEach(() => {
  render(<ProductCard {...product} />)
})

describe('<ProductCard />', () => {
  it('should find the title and price', () => {
    screen.getAllByText(/Product of example \$ 1000/i)
  })

  it('should find the stock tag', () => {
    screen.getByText(/entrega inmediata/i)
  })
})
