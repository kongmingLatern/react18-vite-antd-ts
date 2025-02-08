import type { ThemeConfig } from 'antd'
import { theme as antdTheme } from 'antd'
import React, { createContext, useContext, useState } from 'react'

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
  theme: ThemeConfig
}

const defaultTheme: ThemeConfig = {
  algorithm: antdTheme.defaultAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Menu: {
      itemBg: '#ffffff',
    },
    Layout: {
      bodyBg: '#f5f5f5',
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
  },
}

const darkTheme: ThemeConfig = {
  algorithm: antdTheme.darkAlgorithm,
  token: {
    colorPrimary: '#1677ff',
    borderRadius: 6,
    wireframe: false,
  },
  components: {
    Menu: {
      itemBg: '#141414',
    },
    Layout: {
      bodyBg: '#000000',
      headerBg: '#141414',
      siderBg: '#141414',
    },
  },
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
  theme: defaultTheme,
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev)
    setTheme(prev => prev.algorithm === antdTheme.defaultAlgorithm ? darkTheme : defaultTheme)
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
