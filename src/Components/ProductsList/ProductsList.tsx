import React from 'react'

// Styles
import './ProductsList.scss'

// Hooks
import { useFilterProducts } from '../../Hooks/useFilterProducts'
import { useProductsInformation } from '../../Context/ProductsInformation'
import { useProductsSearchQuery } from '../../Context/ProductsSearchQuery'
import { useAsideMenuState } from '../../Context/AsideMenuState'

// Components
import { ProductCard } from '../ProductCard/ProductCard'
import { CleanAllFavorites } from '../CleanAllFavorites/CleanAllFavorites'

export const ProductsList: React.FC = () => {
  const { query, stockOnly: onlyWithStock } = useProductsSearchQuery()
  const products = useFilterProducts()
  const { status } = useProductsInformation()
  const { menuOpen } = useAsideMenuState()

  let swipeStart = -1
  const handleSwipe = (event: React.TouchEvent) => {
    const position = event.changedTouches[0].clientX
    if (event.type === 'touchstart') swipeStart = position
    if (event.type === 'touchend' && swipeStart - position > 100) menuOpen()
  }

  return (
    <>
      <div
        className="products-list"
        onTouchStart={e => handleSwipe(e)}
        onTouchEnd={e => handleSwipe(e)}
      >
        {
          // On successful search
          (status === 'successful' || status === 'offline') &&
            !!products.length &&
            products
              .filter(item =>
                onlyWithStock ? item.stock === onlyWithStock : true
              )
              .map(item => <ProductCard {...item} key={item.id} />)
        }
        {
          // Not products fonded
          (status === 'successful' || status === 'offline') &&
            !products.length &&
            NoProductsMessage(
              '🤪',
              'Ningún producto coincide con esa búsqueda.'
            )
        }
        {
          // Clean favorites button
          query === 'Favoritos' && !!products.length && <CleanAllFavorites />
        }
        {
          // While getting products
          status === 'getting' &&
            NoProductsMessage('⏳', 'La paciencia es la virtud de los sabios.')
        }
        {
          // On error
          status === 'error' && NoProductsMessage('😱', 'Algo salió mal.')
        }
      </div>
    </>
  )
}

/**
 * Component abstraction
 */
const NoProductsMessage = (emoji: string, message: string) => {
  return (
    <div className="no-products-message">
      {emoji && <p>{emoji}</p>}
      {message && <p>{message}</p>}
    </div>
  )
}
