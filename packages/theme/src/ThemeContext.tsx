import type { ThemeConfig } from 'antd'
import React, { createContext, useContext, useState } from 'react'
import { defaultTheme, themes } from './themes'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: (themeName: string) => void
  theme: ThemeConfig
}
export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: defaultTheme,
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)

  const toggleTheme = (themeName: string) => {
    setIsDarkMode(prev => !prev)

    Object.entries(themes).map(([key, value]) => {
      if (key === themeName) {
        setTheme(value.theme)
      }
    })
  }

  const value = React.useMemo(
    () => ({
      isDarkMode,
      toggleTheme,
      theme,
    }),
    [isDarkMode, theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
