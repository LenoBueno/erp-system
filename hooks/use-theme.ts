"use client"

import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  useEffect(() => {
    // Verificar tema inicial
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)

    // Sincronizar com localStorage se disponível
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark' && !isDark) {
      document.documentElement.classList.add('dark')
      setIsDarkMode(true)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
  }

  return { isDarkMode, toggleTheme }
}