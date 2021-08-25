import { useState, useEffect } from 'react'
import { iProduct } from '../Interfaces'

const url = location.port
  ? 'src/Hooks/mock-api-data.json'
  : 'https://spreadsheets.google.com/feeds/list/1FjerBKgvNepZfQkPaUbd9DMy5-SMr-XxEKeNsZhcPM4/od6/public/values?alt=json'

export const useFetchProducts = () => {
  const [status, setStatus] = useState<
    'idle' | 'getting' | 'successful' | 'offline' | 'error'
  >('idle')
  const [products, setProducts] = useState<iProduct[]>([])
  const [types, setTypes] = useState<string[]>([])
  const [groups, setGroups] = useState<string[]>([])
  const [brands, setBrands] = useState<string[]>([])

  useEffect(() => {
    setStatus('getting')

    const localData: iProduct[] = getFromLocal('Products')
    // Set data from local
    if (!!localData.length) {
      setBrands(getFromLocal('Products'))
      setTypes(getFromLocal('Types'))
      setGroups(getFromLocal('Groups'))
      setBrands(getFromLocal('Brands'))
      setProducts(localData)
      setStatus('offline')
    }
    // Get remote list
    // fetchData()
    fetchData2().finally(() => setStatus('successful'))
  }, [])

  const fetchData2 = async () => {
    const endpoint = location.port
      ? 'src/Hooks/mock-api-data.txt'
      : 'https://docs.google.com/spreadsheets/d/1FjerBKgvNepZfQkPaUbd9DMy5-SMr-XxEKeNsZhcPM4/gviz/tq?tqx=out:json'

    const response = await fetch(endpoint)
    const data = await response.text()
    const json = JSON.parse(data.slice(47, -2))
    const products = parseApiResult(json)
    updateSate(products)
  }

  const parseApiResult = (data: iFetchResult): iProduct[] => {
    const rows = data.table.rows
    const productsFiltered = rows.filter(
      item => !!item.c[20] && !!item.c[21] && !!item.c[4]
    )
    const products = productsFiltered.map((item, index) =>
      parserItem(item, index)
    )
    return products
  }

  const parserItem = (item: Row, index: number): iProduct => {
    const data = item.c

    return {
      id: 'id' + index,
      pid: encodeURI(String(data[0]?.v).replace(/\s/g, '_')),
      name: String(data[0]?.v),
      price: String(data[1]?.f),
      financing: String(data[2]?.v).split(',') || [],
      stock: data[4]?.v ? data[4].v > 0 : false,
      recommended: !!data[5],
      img: String(data[17]?.v) || false,
      group: String(data[6]?.v),
      type: String(data[7]?.v),
      brand: String(data[8]?.v),
      description: String(data[19]?.v),
      search: `${String(data[0]?.v)} ${String(data[8]?.v)} ${String(
        data[6]?.v
      )} ${String(data[7]?.v)}`.toLocaleLowerCase(),
    }
  }

  const updateSate = (products: iProduct[]) => {
    // Set product type and products group
    const productsType = products.map(item => item.type)
    const productsGroup = products.map(item => item.group)
    const productsBrands = products.map(item => item.brand)

    setProducts(products)
    saveToLocal(products, 'Products')

    const orderedTypes = [...new Set(productsType)].sort()
    setTypes(orderedTypes)
    saveToLocal(orderedTypes, 'Types')

    const orderedGroups = [...new Set(productsGroup)].sort()
    setGroups(orderedGroups)
    saveToLocal(orderedGroups, 'Groups')

    const orderedBrand = [...new Set(productsBrands)].sort()
    setBrands(orderedBrand)
    saveToLocal(orderedBrand, 'Brands')
  }

  // const fetchData = async () => {
  //   // Sleep to simulate low internet connections
  //   // await sleep(3000)

  //   try {
  //     // location.port && console.info('Getting data from data from source' + url)
  //     const response = await fetch(url)
  //     if (!response.ok) Promise.reject('Can not connect to API')
  //     const jsonData = await response.json()

  //     // console.warn('Original Array:', jsonData.feed.entry)

  //     const filtered = filterData(jsonData.feed.entry)
  //     const parsedData = parseData(filtered)
  //     const data = orderData(parsedData, 'name')

  //     // Set product type and products group
  //     const productsType = data.map(item => item.type)
  //     const productsGroup = data.map(item => item.group)
  //     const productsBrands = data.map(item => item.brand)

  //     setProducts(data)
  //     saveToLocal(data, 'Products')

  //     const orderedTypes = [...new Set(productsType)].sort()
  //     setTypes(orderedTypes)
  //     saveToLocal(orderedTypes, 'Types')

  //     const orderedGroups = [...new Set(productsGroup)].sort()
  //     setGroups(orderedGroups)
  //     saveToLocal(orderedGroups, 'Groups')

  //     const orderedBrand = [...new Set(productsBrands)].sort()
  //     setBrands(orderedBrand)
  //     saveToLocal(orderedBrand, 'Brands')

  //     setStatus('successful')

  //     // location.port && console.log(data)
  //   } catch (error) {
  //     setStatus('error')
  //     console.error(error)
  //   }
  // }

  return { status, products, groups, types, brands }
}

// const filterData = (data: iOnlineProduct[]) =>
//   data.filter(
//     (item: iOnlineProduct) =>
//       !!item.gsx$act.$t && !!item.gsx$web.$t && item.gsx$stock.$t !== ''
//   )

// const parseData = (data: iOnlineProduct[]) =>
//   data.reduce((accumulator: iProduct[], item: iOnlineProduct) => {
//     const newItem: iProduct = {
//       id: item.id.$t,
//       pid: encodeURI(item.gsx$producto.$t.replace(/\s/g, '_')),
//       name: item.gsx$producto.$t.trim(),
//       price: item.gsx$pvp.$t,
//       financing: item.gsx$cuotas.$t.split(',') || [],
//       stock: Number(item.gsx$stock.$t) > 0 ? true : false,
//       recommended: item.gsx$d.$t !== '' ? true : false,
//       img: item.gsx$img.$t || false,
//       brand: item.gsx$marca.$t.trim(),
//       group: item.gsx$categoria.$t.trim(),
//       type: item.gsx$rubro.$t.trim(),
//       description: item.gsx$desc.$t.trim(),
//       search: `${item.gsx$producto.$t} ${item.gsx$marca.$t} ${item.gsx$categoria.$t} ${item.gsx$rubro.$t}`.toLocaleLowerCase(),
//     }
//     return [...accumulator, newItem]
//   }, [])

/**
 * Order product list by key
 */
const orderData = (data: iProduct[], key: string) => {
  function compare(itemA: any, itemB: any) {
    const valueOfA = String(itemA[key]).toLocaleLowerCase().trim()
    const valueOfB = String(itemB[key]).toLocaleLowerCase().trim()
    if (valueOfA < valueOfB) return -1
    if (valueOfA > valueOfB) return 1
    return 0
  }

  return data.sort(compare)
}

/**
 * Save products list to localStorage
 */
const saveToLocal = (
  data: iProduct[] | string[],
  localKey: 'Products' | 'Types' | 'Groups' | 'Brands'
) => localStorage.setItem(localKey, JSON.stringify(data))

/**
 * Get products list from localStorage
 */
const getFromLocal = (localKey: 'Products' | 'Types' | 'Groups' | 'Brands') =>
  JSON.parse(localStorage.getItem(localKey) || '[]')

/**
 *
 * Sleep function
 * Usage:
 *  await sleep(1000)
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Interfaces
interface iFetchResult {
  version: string
  reqId: string
  status: string
  sig: string
  table: Table
}

interface Table {
  cols: Col[]
  rows: Row[]
  parsedNumHeaders: number
}

interface Row {
  c: (C | null)[]
}

interface C {
  v?: number | string
  f?: string
}

interface Col {
  id: string
  label: string
  type: string
  pattern?: string
}
