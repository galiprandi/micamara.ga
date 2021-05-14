import React, { useState } from 'react'

// Config
import { App } from '../../App.config'

// Interfaces
import { iProduct } from '../../Interfaces'

// Hooks
import { useCopyToClipboard } from '../../Hooks/useCopyToClipboard'
import { useProductsInformation } from '../../Context/ProductsInformation'

// Styles
import './ProductCard.scss'

// Component
import { ProductImage } from './ProductImage/ProductImage'
import { Badge, VStack } from '@chakra-ui/react'
import { ProductDescription } from './ProductDescription/ProductDescription'

export function ProductCard({ ...props }: iProduct) {
  const { status } = useProductsInformation()
  const copyToClipboard = useCopyToClipboard()

  const { name, price, financing, img, stock, type } = props

  const title = `${name} ${price}` // Title and price
  const src = img ? `${App.productsImagesURL}${img}` : App.noImageSRC // Images src
  const payment = title + '\n 💳 ' + financing.join('\n 💳 ') // Text of financing to copy on clipboard

  return (
    <div className="card">
      <ProductImage src={src} title={title} {...props} />
      <VStack>
        <p
          title="Click para copiar al portapapeles."
          className="card-title"
          onClick={() => copyToClipboard(title)}
        >
          {status === 'offline' ? name : title}
        </p>

        {status === 'successful' ? (
          <p className="financing">
            <span
              title="Click para copiar al portapapeles."
              className="material-icons"
              onClick={() => copyToClipboard(payment)}
            >
              credit_card
            </span>
            <select>
              {financing.map((item: string) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </p>
        ) : (
          <div></div>
        )}

        {
          // Stock true or false
          !!stock ? (
            <Badge variant="solid" bg="#1a535c">
              entrega inmediata
            </Badge>
          ) : (
            <Badge
              title="El producto se entrega en 4 o 5 días hábiles. "
              variant="outline"
            >
              entrega pactada
            </Badge>
          )
        }
        {
          // Used product ?
          type === 'Usados Seleccionados' && (
            <Badge variant="solid" colorScheme="orange">
              Usado Seleccionados
            </Badge>
          )
        }
      </VStack>
      <ProductDescription {...props} />
    </div>
  )
}
