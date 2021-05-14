import React, { useEffect, useState } from 'react'

interface iProps {
  active?: boolean
  pid: string
}

export const Favorite = ({ active = false, pid }: iProps) => {
  const [isFavorite, setIsFavorite] = useState(active)

  const localKey = 'Favorites'
  let favorites: string[] = []

  useEffect(() => {
    favorites = JSON.parse(localStorage.getItem(localKey) || '[]')
    setIsFavorite(favorites.includes(pid))
  }, [])

  const toggleFavorite = (addToFavorite: boolean) => {
    let newFavorites: string[] = []
    setIsFavorite(addToFavorite)

    // Get from local
    favorites = JSON.parse(localStorage.getItem(localKey) || '[]')

    addToFavorite
      ? (newFavorites = [...new Set([...favorites, pid])]) // Add
      : (newFavorites = favorites.filter(item => item !== pid)) // Remove

    // Save to local
    localStorage.setItem(localKey, JSON.stringify(newFavorites))
  }

  return (
    <span
      className={`tag btn material-icons favorite ${
        isFavorite ? 'active' : ''
      }`}
      onClick={() => toggleFavorite(!isFavorite)}
      title={isFavorite ? 'Quitar de favoritos' : 'Agregar a Mis Favoritos'}
    >
      {isFavorite ? 'favorite' : 'favorite_border'}
    </span>
  )
}
