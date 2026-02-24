'use client'

import { LogOut, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/provider/AuthContext'
import { API_URL} from '@/lib/config'

interface LogoutProps {
  variant?: 'button' | 'dropdown' | 'icon' | 'minimal'
  className?: string
  showLabel?: boolean
}

export default function Logout({ variant = 'button', className = '', showLabel = true }: LogoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { logout } = useAuth()

  const handleLogout = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/user/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const text = await response.text();
        console.error('Logout failed:', text);
      } else {
      }
      
      router.push('/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`group relative h-9 w-9 rounded-full border border-[#37322f]/10 dark:border-[#e5e1db]/10 bg-white/80 dark:bg-[#2a2a2a]/80 backdrop-blur-sm text-[#5c4f3d] dark:text-[#e5e1db] hover:bg-[#f0eae4] dark:hover:bg-[#333333] hover:border-[#5c4f3d]/20 dark:hover:border-[#e5e1db]/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
        title="Logout"
      >
        {isLoading ? (
          <Loader2 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
        )}
        <span className="sr-only">Logout</span>
      </button>
    )
  }

  if (variant === 'minimal') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`flex items-center gap-2 px-2 py-1 text-sm text-[#5c4f3d] hover:text-[#2a2520] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <LogOut className="h-3.5 w-3.5" />
        )}
        {showLabel && <span>Logout</span>}
      </button>
    )
  }

  if (variant === 'dropdown') {
    return (
      <button
        onClick={handleLogout}
        disabled={isLoading}
        className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#b91c1c] dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <LogOut className="h-4 w-4" />
        )}
        <span>Log out</span>
      </button>
    )
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 rounded-lg border border-[#5c4f3d]/20 dark:border-red-900/30 bg-white dark:bg-[#2a2a2a] px-4 py-2 text-sm font-medium text-[#5c4f3d] dark:text-red-400 hover:bg-[#f0eae4] dark:hover:bg-red-950/30 hover:border-[#5c4f3d]/30 dark:hover:border-red-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span>Logging out...</span>
        </>
      ) : (
        <>
          <LogOut className="h-3.5 w-3.5" />
          <span>Log out</span>
        </>
      )}
    </button>
  )
}