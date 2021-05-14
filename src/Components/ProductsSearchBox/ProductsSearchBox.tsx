import React, { useRef, FormEvent, useState } from 'react'

// Hooks
import { useProductsSearchQuery } from '../../Context/ProductsSearchQuery'
import { useProductsInformation } from '../../Context/ProductsInformation'

// Styles
import './ProductsSearchBox.scss'

export function ProductsSearchBox() {
  const { query, setQuery } = useProductsSearchQuery()
  const { types, groups, brands } = useProductsInformation()

  const datalist = [...new Set(brands.concat(types, groups))].sort()

  const [active, setActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFocus = () => inputRef.current && inputRef.current.select()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    inputRef.current?.value && setQuery(inputRef.current.value)
    inputRef.current?.blur()
    handleBtnClick()
  }

  const handleBtnClick = async () => {
    setActive(prev => !prev)
    await timeout(800) // Time for transition end
    inputRef.current?.classList.contains('active') && inputRef.current?.focus()
  }

  const timeout = (delay: number) => new Promise(res => setTimeout(res, delay))

  return (
    <div className="btn search">
      <form onSubmit={handleSubmit} className="searchForm">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={event => setQuery(event.target.value)}
          onFocus={handleFocus}
          className={active ? 'active' : ''}
          placeholder="Buscar"
          list="searchAssistant"
        />
        <datalist id="searchAssistant">
          {datalist.map(item => (
            <option value={item} key={item} />
          ))}
        </datalist>
        <span className="material-icons btn" onClick={handleBtnClick}>
          search
        </span>
      </form>
    </div>
  )
}
