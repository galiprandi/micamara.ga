/**
 * Products Search Context and custom Hook: manage query used to
 * filter products in the searches.
 *
 * This file export:
 *    useProductsSearchQuery | Customs Hook
 *    ProductsSearchQueryProvider | Context Provider
 *
 * Author: Germán Aliprandi <galiprandi@gmail.com>
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { App } from '../App.config'

/* Create a Context */
const ctx = {
  query: App.searchEmptyQuery,

  setQuery(query: string) {
    void query
  },

  stockOnly: false,

  setStockOnly(boolean: boolean) {
    void boolean
  },
}
const Context = createContext(ctx)
Context.displayName = 'Products Search Query'

/**
 * Custom Hook: Use to Get and Set query string used to
 * match and filter product to be displayed.
 *
 * query, setQuery: Set string use to search product.
 * onlyWithStock, setOnlyWithStock: Set if only show products with stock >= 1
 *
 * Usage:  const { query, setQuery, stockOnly, setStockOnly } = useProductsSearchQuery()
 */
export const useProductsSearchQuery = () => useContext(Context)

/**
 * Context Provider: Wrap the application or component
 * to get access to this context value.
 *
 * Example:
 * <ProductsSearchQueryProvider>
 *  <App/>
 * </ProductsSearchQueryProvider>
 */
export const ProductsSearchQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const initialQuery = localStorage.getItem('query') || App.searchEmptyQuery

  const [query, setQuery] = useState(initialQuery)
  const [stockOnly, setStockOnly] = useState(false)

  useEffect(() => {
    localStorage.setItem('query', query)
  }, [query])

  return <Context.Provider value={{ query, setQuery, stockOnly, setStockOnly }}>{children}</Context.Provider>
}
