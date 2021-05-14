import React from 'react'

// Components
import { Header } from '../Header/Header'
import { ProductsList } from '../ProductsList/ProductsList'
import { Footer } from '../Footer/Footer'
import { AsideMenu } from '../AsideMenu/AsideMenu'

// Styles
import './App.scss'

export const App = () => {
  return (
    <>
      <main className="home">
        <Header />
        <ProductsList />
        <Footer />
      </main>
      <AsideMenu />
    </>
  )
}
