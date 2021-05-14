import React from 'react'

// Context
import { useProductsSearchQuery } from '../../../Context/ProductsSearchQuery'

// Components
import { Favorite } from '../Favorite/Favorite'

// Styles
import './ProductImage.scss'

interface iProps {
  src: string
  title: string
  pid: string
  recommended: boolean
}
export const ProductImage = ({ src, title, pid, recommended }: iProps) => {
  const { setQuery } = useProductsSearchQuery()
  return (
    <div className="card-image">
      <img src={src} alt={title} title={title} />
      <Favorite pid={pid} />
      {recommended && (
        <span
          className="tag btn material-icons recommended"
          title="¡Producto recomendado!"
          onClick={() => setQuery('Recomendados')}
        >
          verified
        </span>
      )}
    </div>
  )
}
