'use client'

import { ThemeContext, useThemeState } from '@/lib/theme'

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { theme, setTheme, toggleTheme, mounted } = useThemeState()

  if (!mounted) {
    return <div className="bg-background text-primary">{children}</div>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}