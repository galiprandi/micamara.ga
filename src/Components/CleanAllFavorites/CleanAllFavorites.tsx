import React from 'react'

// Hook
import { CustomAlertDialog } from '../AlertDialog/AlertDialog'
import { useProductsSearchQuery } from '../../Context/ProductsSearchQuery'

export const CleanAllFavorites: React.FC = () => {
  const { setQuery } = useProductsSearchQuery()

  const clearAll = () => {
    localStorage.removeItem('Favorites')
    setQuery('')
  }

  return (
    <CustomAlertDialog
      startOpened={false}
      title="Limpiar Favoritos"
      body="¿Seguro que desea borrar todos los favoritos?"
      btnConfirmText="Limpiar"
      confirmCallback={clearAll}
    >
      <button style={styles}>Limpiar favoritos</button>
    </CustomAlertDialog>
  )
}

/**
 * CSS Styles
 */
const styles = {
  flexBasis: '100%',
  color: 'tomato',
  backgroundColor: 'white',
  lineHeight: 3,
}
