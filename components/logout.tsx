'use client'

import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/provider/AuthContext'
import { BASE_URL } from '@/lib/config'

interface LogoutProps {
  variant?: 'button' | 'dropdown' | 'icon'
  className?: string
}

export default function Logout({ variant = 'button', className = '' }: LogoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const text = await response.text();
        console.error('Logout failed:', text);
      } 
      // logout() 
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Icon only variant (for header)
  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`relative h-10 w-10 rounded-lg border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] hover:bg-[#f7f5f3] dark:hover:bg-[#333333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Logout"
      >
        {isLoading ? (
          <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4" />
        )}
        <span className="sr-only">Logout</span>
      </button>
    )
  }

  // Dropdown item variant
  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        <span>Logout</span>
      </button>
    )
  }

  // Default button variant
  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900/30 bg-white dark:bg-[#2a2a2a] px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 hover:border-red-300 dark:hover:border-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </>
      )}
    </button>
  )
}