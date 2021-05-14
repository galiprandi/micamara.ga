import React, { useState } from 'react'

// Hooks
import { useCopyToClipboard } from '../../../Hooks/useCopyToClipboard'

// Component
import { Text } from '@chakra-ui/react'

interface iProps {
  name: string
  price: string
  description: string
}

export const ProductDescription = ({ name, price, description }: iProps) => {
  const [active, setActive] = useState(false)
  const copyToClipboard = useCopyToClipboard()
  return (
    <>
      <span
        title={
          active
            ? 'Ocultar descripción del producto.'
            : 'Mostrar descripción del producto.'
        }
        className="material-icons btn btn-more-info"
        onClick={() => setActive((previous: boolean) => !previous)}
      >
        {active ? 'expand_more' : 'expand_less'}
      </span>
      <section className={active ? 'description active' : 'description'}>
        <b>
          <Text
            paddingBottom={15}
            fontSize="lg"
            style={{ cursor: 'pointer' }}
            onClick={() =>
              copyToClipboard(`${name} ${price}\n\n${description}`)
            }
          >
            {name}
          </Text>
        </b>

        <div dangerouslySetInnerHTML={{ __html: description }}></div>
      </section>
    </>
  )
}
