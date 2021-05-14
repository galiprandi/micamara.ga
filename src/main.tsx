import React from 'react'
import ReactDOM from 'react-dom'

// Providers
import { ProductsSearchQueryProvider } from './Context/ProductsSearchQuery'
import { AsideMenuProvider } from './Context/AsideMenuState'
import { ProductsProvider } from './Context/ProductsInformation'
import { ChakraProvider } from '@chakra-ui/react'

// Components
import { App } from './Components/App/App'

// Styles
import './main.scss'

ReactDOM.render(
  <React.StrictMode>
    <ProductsSearchQueryProvider>
      <ProductsProvider>
        <AsideMenuProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </AsideMenuProvider>
      </ProductsProvider>
    </ProductsSearchQueryProvider>
  </React.StrictMode>,
  document.getElementById('root')
)
