/**
 * useToastNotification: Custom Hook
 * Send toast notification.
 *
 * Usage:
 *   const [toastNotification] = useToastNotification()
 *
 *   toastNotification({ description: 'message' })
 *
 * Author: Germán Aliprandi <galiprandi@gmail.com>
 */

import { useToast } from '@chakra-ui/react'

export const useToastNotification = () => {
  const toastNotification = useToast({ position: 'top-right', status: 'success', isClosable: true })
  return [toastNotification]
}
