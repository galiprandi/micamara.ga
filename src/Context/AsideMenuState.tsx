import React, { createContext, useContext, useState } from 'react'

// App Config
import { App } from '../App.config'

// Define Context
const ctx = {
  menuState: App.menuInitialSate,
  menuClose() {},
  menuOpen() {},
  menuToggle() {},
}

const Context = createContext(ctx)

// Create custom hook
export const useAsideMenuState = () => useContext(Context)

// Create Provider
export const AsideMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [isActive, setIsActive] = useState(App.menuInitialSate)

  const menuState = isActive
  const menuClose = () => setIsActive(false)
  const menuOpen = () => setIsActive(true)
  const menuToggle = () => setIsActive(previousValue => !previousValue)

  return <Context.Provider value={{ menuState, menuClose, menuOpen, menuToggle }}>{children}</Context.Provider>
}
