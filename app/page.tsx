'use client'

import Link from 'next/link'
import { Link2 } from 'lucide-react'

export default function Page() {
  return (
    <div className="min-h-screen bg-[#f7f5f3] flex flex-col">

      <div className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-[#37322f] mb-4">
            Welcome to ShortyURL
          </h1>
          <p className="text-[#37322f]/70  mb-8">
            Create short, memorable links in seconds
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-3 rounded-lg border border-[#37322f]/12 bg-[#2a2a2a] text-[#e5e1db] font-medium hover:bg-[#333333] transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="px-8 py-3 rounded-lg bg-[#e5e1db] text-[#1a1a1a] font-medium border hover:bg-[#f5f1eb] transition-colors"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}