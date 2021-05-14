import React from 'react'

// Hook
import { useAsideMenuState } from '../../Context/AsideMenuState'
import { useProductsInformation } from '../../Context/ProductsInformation'
import { useProductsSearchQuery } from '../../Context/ProductsSearchQuery'

// Styles
import './AsideMenu.scss'

export const AsideMenu = () => {
  const { menuState, menuClose } = useAsideMenuState()
  const { types } = useProductsInformation()
  const { query, setQuery } = useProductsSearchQuery()

  // Handle click on list elements
  const handleItemClick = (value: string) => setQuery(value)

  return (
    <div
      className={`aside-menu ${menuState ? 'active' : ''}`}
      onClick={() => menuClose()}
    >
      <div className="container">
        <div className="title">
          <span className="name">Categorías</span>
          <span className="btn close material-icons" onClick={menuClose}>
            close
          </span>
        </div>

        <ul className="menu-items">
          <li
            className={query === 'Favoritos' ? 'active' : ''}
            onClick={() => handleItemClick('Favoritos')}
          >
            Mis Favoritos
            <span
              style={{ color: 'tomato', fontSize: 'inherit', marginLeft: 10 }}
              className="material-icons"
            >
              favorite
            </span>
          </li>
          <li
            className={query === 'Recomendados' ? 'active' : ''}
            onClick={() => handleItemClick('Recomendados')}
          >
            Recomendados
            <span
              style={{ fontSize: 'inherit', marginLeft: 10 }}
              className="material-icons"
            >
              verified
            </span>
          </li>
          <li
            className={query === 'Usados Seleccionados' ? 'active' : ''}
            onClick={() => handleItemClick('Usados Seleccionados')}
          >
            Usados Seleccionados
            <span
              style={{ fontSize: 'inherit', marginLeft: 10 }}
              className="material-icons"
            >
              gpp_good
            </span>
          </li>

          {types
            .filter(item => item !== 'Usados Seleccionados')
            .map(item => (
              <li
                key={item}
                className={query === item ? 'active' : ''}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
