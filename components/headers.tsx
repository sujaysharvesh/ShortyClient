'use client'

import { Link as LinkIcon } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-amber-200 bg-white shadow-sm">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-amber-500 p-1.5">
              <LinkIcon className="size-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-amber-900">LinkShort</span>
              <p className="text-xs text-amber-500 leading-none">Fast URL Shortener</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
              About
            </a>
            <a href="#" className="text-sm font-medium text-amber-700 hover:text-amber-900 transition-colors">
              Pricing
            </a>
            <a
              href="#"
              className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-white hover:bg-amber-600 transition-colors shadow-sm"
            >
              Get Started
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}