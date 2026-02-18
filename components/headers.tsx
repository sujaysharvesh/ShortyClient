"use client"

import Link from "next/link"
import { Link2 } from "lucide-react"
import Logout from "./logout"
import { useAuth } from "@/provider/AuthContext"

export default function Header() {
  const { user } = useAuth()

  return (
    <header className="mt-3 z-50 w-full px-3 sm:px-0">
      <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#1a1a1a] shadow-sm">
        <div className="flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-[#e5e1db] sm:h-6 sm:w-6" />
            <span className="text-lg font-bold text-[#e5e1db] sm:text-xl">
              ShortyURL
            </span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            {user && (
              <span className="hidden sm:block text-sm text-white/70">
                {user.data?.username}
              </span>
            )}

            <Logout variant="icon" />
          </div>

        </div>
      </div>
    </header>
  )
}
