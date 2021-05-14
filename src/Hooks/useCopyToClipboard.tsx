/**
 * useCopyToClipboard: Custom Hook
 * This hook recibe any text and copy this to clipboard when is posible.
 *
 * return: true / false
 *
 * Usage:
 *    const copyToClipboard = useCopyToClipboard()
 *
 *    copyToClipboard('Text t o copy')
 *
 * Author: Germán Aliprandi <galiprandi@gmail.com>
 */

import { useToastNotification } from './useToastNotification'

export const useCopyToClipboard = () => {
  const [toastNotification] = useToastNotification()

  const copyToClipboard = (textToCopy: string, msg: string = '¡Copiado al portapapeles!') => {
    try {
      navigator.clipboard.writeText(textToCopy)
      toastNotification({ description: msg })

      return true
    } catch (error) {
      toastNotification({
        title: 'Error',
        description: 'Opción no disponible en el dispositivo.',
        status: 'error',
        duration: null,
      })
      console.error(error)
      return false
    }
  }
  return copyToClipboard
}
