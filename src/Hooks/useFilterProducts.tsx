import { iProduct } from '../Interfaces'
import { App } from '../App.config'

// Hooks
import { useProductsInformation } from '../Context/ProductsInformation'
import { useProductsSearchQuery } from '../Context/ProductsSearchQuery'

/**
 * Custom Hook: Return filtered list of product using
 * query string define by useProductsSearch()
 *
 * Usage: const products = useFilterProducts()
 */
export const useFilterProducts = (): iProduct[] => {
  const {
    searchEmptyLimitResults: limitResults,
    searchEmptyQuery: searchEmptyLabel,
  } = App

  // Get full products list
  const { products } = useProductsInformation()

  // Get query string
  const { query } = useProductsSearchQuery()

  const querySearch = !!query ? query : searchEmptyLabel
  // console.info(`Showing '${querySearch}' over ${products.length} products.`)

  // Return shuffle products if query is equal to Config.searchEmptyLimitResults
  if (querySearch === searchEmptyLabel)
    return [...arrayShuffle(products)].slice(0, limitResults)

  // Return list of user favorites products
  if (querySearch === 'Favoritos') {
    const favorites = JSON.parse(localStorage.getItem('Favorites') || '[]')
    return products.filter(item => favorites.includes(item.pid))
  }

  // Return list of recommended products
  if (querySearch === 'Recomendados') {
    return products.filter(item => item.recommended)
  }

  // Make Regex expression
  const rgx = new RegExp(querySearch, 'i')
  const filteredList = products
    .filter(item => item.search.match(rgx))
    .slice(0, App.searchLimitResult)

  return filteredList
}

/**
 * Array.shuffle()
 * Return a new randomly ordered array based on an old one.
 * (Based on [algorithm](https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle) invented by Ronald Fisher and Frank Yates)
 */
const arrayShuffle = (array: any[]) => {
  try {
    const arr = [...array]
    let m = arr.length,
      i
    while (m) {
      i = (Math.random() * m--) >>> 0
      ;[arr[m], arr[i]] = [arr[i], arr[m]]
    }
    return arr
  } catch (error) {
    console.error(error)
    return []
  }
}
