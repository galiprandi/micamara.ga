import React from 'react'

// Config
import { App } from '../../App.config'

// Context
import { useAsideMenuState } from '../../Context/AsideMenuState'

// Hooks
import { useProductsSearchQuery } from '../../Context/ProductsSearchQuery'
import { useCopyToClipboard } from '../../Hooks/useCopyToClipboard'
import { useToastNotification } from '../../Hooks/useToastNotification'

import './Footer.scss'

export const Footer = () => {
  const { menuState, menuToggle } = useAsideMenuState()
  const copyToClipboard = useCopyToClipboard()
  const {
    stockOnly: onlyWithStock,
    setStockOnly: setOnlyWithStock,
  } = useProductsSearchQuery()
  const [toastNotification] = useToastNotification()

  // Share function
  const handleShareClick = () => {
    try {
      const url = location.href
      copyToClipboard(url)
      navigator.share &&
        navigator.share({
          title: App.title,
          text: App.description,
          url,
        })
    } catch (error) {
      console.error(error)
    }
  }

  // Stock products
  const toggleOnlyWithStock = () => {
    setOnlyWithStock(!onlyWithStock)
    const msg = onlyWithStock
      ? 'Mostrar también productos con entrega pactada'
      : '¡ Solo productos con entrega inmediata !'

    toastNotification({
      description: msg,
      status: onlyWithStock ? 'info' : 'success',
      position: 'bottom-right',
    })
  }

  // Open menu
  const handleMenuClick = () => menuToggle()

  return (
    <footer className="app-footer">
      <span
        className="material-icons btn"
        title="Copiar al portapapeles para compartir"
        onClick={handleShareClick}
      >
        share
      </span>
      <a href="tel:+5493815900868" title="(381) 5900868">
        <span className="material-icons btn" title="Llamar telefónicamente.">
          call
        </span>
      </a>
      <a
        href="https://m.me/100010196598541"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span
          className="material-icons btn"
          title="Enviar mensaje por messenger"
        >
          chat
        </span>
      </a>
      <span
        className="material-icons btn"
        title={
          onlyWithStock
            ? 'Ver productos con entrega inmediata'
            : 'Ver todos los productos, incluso con entrega pactada.'
        }
        onClick={toggleOnlyWithStock}
      >
        {onlyWithStock ? 'sentiment_very_satisfied' : 'error'}
      </span>
      <span
        className="material-icons btn"
        title="No implemented !"
        onClick={handleMenuClick}
      >
        {menuState ? 'close' : 'menu'}
      </span>
    </footer>
  )
}
