import React from 'react'

// Styles
import './Header.scss'

// Hooks
import { useProductsInformation } from '../../Context/ProductsInformation'

// Components
import { ProductsSearchBox } from '../ProductsSearchBox/ProductsSearchBox'

export const Header = () => {
  const { status } = useProductsInformation()

  return (
    <nav className={`header ${status !== 'successful' && 'loading'}`}>
      <div>
        <img
          src="gadget.svg"
          alt="Gadget"
          title="Gadget"
          className="header__logo"
        />
      </div>
      <div>
        <ProductsSearchBox />
      </div>
    </nav>
  )
}
