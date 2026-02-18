'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <button className="relative h-10 w-10 rounded-lg border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db]">
        <span className="sr-only">Toggle theme</span>
      </button>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative h-10 w-10 rounded-lg border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] hover:bg-[#f7f5f3] dark:hover:bg-[#333333] transition-colors"
      >
        <Sun className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0" />
        <Moon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute right-0 z-50 mt-2 w-36 rounded-lg border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] shadow-lg overflow-hidden">
            <button
              onClick={() => {
                setTheme('light')
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f7f5f3] dark:hover:bg-[#333333] ${
                theme === 'light' 
                  ? 'bg-[#f7f5f3] dark:bg-[#333333] text-[#37322f] dark:text-[#e5e1db] font-medium' 
                  : 'text-[#37322f]/70 dark:text-[#e5e1db]/70'
              }`}
            >
              Light
            </button>
            <button
              onClick={() => {
                setTheme('dark')
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f7f5f3] dark:hover:bg-[#333333] ${
                theme === 'dark' 
                  ? 'bg-[#f7f5f3] dark:bg-[#333333] text-[#37322f] dark:text-[#e5e1db] font-medium' 
                  : 'text-[#37322f]/70 dark:text-[#e5e1db]/70'
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => {
                setTheme('system')
                setIsOpen(false)
              }}
              className={`w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-[#f7f5f3] dark:hover:bg-[#333333] ${
                theme === 'system' 
                  ? 'bg-[#f7f5f3] dark:bg-[#333333] text-[#37322f] dark:text-[#e5e1db] font-medium' 
                  : 'text-[#37322f]/70 dark:text-[#e5e1db]/70'
              }`}
            >
              System
            </button>
          </div>
        </>
      )}
    </div>
  )
}