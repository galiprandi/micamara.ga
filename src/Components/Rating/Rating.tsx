/**
 * Usage: <Rating stars={3} />
 */

import React, { useState, useEffect } from 'react'
import './Rating.css'

interface Props {
  stars: number
}

export default function Ratting({ stars }: Props) {
  const [rating, setRating] = useState(stars)
  useEffect(() => {
    const spans = document.querySelectorAll('.star').forEach((element, index) => {
      if (rating >= index + 1) element.classList.add('active')
      else element.classList.remove('active')
    })
  }, [rating])

  const changeRating = (rate: number) => {
    if (rate === rating) {
      console.log(rate, rating)

      document.querySelectorAll('.star').forEach(element => element.classList.remove('active'))
    } else setRating(rate)
  }

  return (
    <div className="ratting">
      <span onClick={() => changeRating(1)} className="star"></span>
      <span onClick={() => changeRating(2)} className="star"></span>
      <span onClick={() => changeRating(3)} className="star"></span>
      <span onClick={() => changeRating(4)} className="star"></span>
      <span onClick={() => changeRating(5)} className="star"></span>
    </div>
  )
}
