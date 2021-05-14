import React, { FC, useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'

interface iProps {
  startOpened?: boolean
  title: string
  body: string
  btnCancel?: string
  btnConfirmText: string
  confirmCallback: Function
  children: JSX.Element
}
export const CustomAlertDialog: FC<iProps> = ({
  startOpened: initialState = true,
  title = 'title',
  body = 'Body',
  btnCancel = 'Cancelar',
  btnConfirmText: btnConfirmText = 'Confirmar',
  confirmCallback = () => {},
  children,
}: iProps) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const cancelRef = useRef(null)
  const onConfirm = () => {
    confirmCallback()
    setIsOpen(false)
  }

  const handleClickOpenAlert = () => setIsOpen(true)
  return (
    <>
      {React.cloneElement(children, { onClick: handleClickOpenAlert })}

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onConfirm}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {title}
            </AlertDialogHeader>
            <AlertDialogBody>{body}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref:any={cancelRef} onClick={() => setIsOpen(false)}>
                {btnCancel}
              </Button>
              <Button colorScheme="red" onClick={onConfirm} ml={3}>
                {btnConfirmText}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}
