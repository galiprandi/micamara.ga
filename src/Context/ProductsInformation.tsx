import React, { createContext, useState, useEffect, useContext } from 'react'
import { useFetchProducts } from '../Hooks/useFetchProducts'
import { iProduct } from '../Interfaces'

// const ctx: iProduct[] = []
interface ctx {
  status: string
  products: iProduct[]
  groups: string[]
  types: string[]
  brands: string[]
}

const ctx: ctx = {
  status: '',
  products: [],
  groups: [],
  types: [],
  brands: [],
}

// Create a Context
const Context = createContext(ctx)
Context.displayName = 'Products Information'

/**
 * Custom Hook: Return a object with status, product, groups and types from API.
 *
 * Usage: const { status, products, group, type } = useProductsInformation()
 */
export const useProductsInformation = () => useContext(Context)

/**
 * Products Provider: Wrap application to access to products list
 */
export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const { status, products, groups, types, brands } = useFetchProducts()
  const [data, setData] = useState(ctx)

  useEffect(() => {
    setData({
      ...data,
      status,
    })

    if (status === 'successful' || status === 'offline') {
      //setProducts(data)
      setData({
        status,
        products,
        groups,
        types,
        brands,
      })
    } else if (status === 'error') throw Error('Can not connect to products API. 😩')
  }, [status])

  return <Context.Provider value={data}>{children}</Context.Provider>
}
