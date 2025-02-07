import type { ThemeConfig } from 'antd'
import React, { createContext, useContext, useState } from 'react'
import { darkTheme, defaultTheme } from './themes'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  currentTheme: ThemeConfig
}

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  currentTheme: defaultTheme,
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
  }

  const currentTheme = isDarkMode ? darkTheme : defaultTheme

  const value = React.useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      currentTheme,
    }),
    [isDarkMode, currentTheme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
