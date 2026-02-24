'use client'

import React, { useState } from 'react'
import { ArrowRight, Zap, BarChart2, Clock } from 'lucide-react'
import ExpirationDropdown from './ExpirationDropdown'

interface UrlFormProps {
  onCreateLink: (url: string, expiration: string) => void
}

export default function UrlForm({ onCreateLink }: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [expiration, setExpiration] = useState('never')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidUrl = (urlString: string) => {
    try { new URL(urlString); return true } catch { return false }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!url.trim()) { setError('Please enter a URL'); return }
    if (!isValidUrl(url)) { setError('Please enter a valid URL (include https://)'); return }
    setLoading(true)
    setTimeout(() => {
      onCreateLink(url, expiration)
      setUrl('')
      setLoading(false)
    }, 500)
  }

  return (
    // FIX: p-4 on mobile, p-6 on sm, p-8 on lg
    <div className="flex rounded-2xl shadow-sm p-4 sm:p-6 lg:p-8 border border-[#37322f]/12 flex-col gap-4">
      <div className="flex flex-col gap-1 mb-2">
        {/* FIX: smaller heading on mobile */}
        <h1 className="text-2xl sm:text-3xl font-serif text-[#37322f]">
          Shorten your link
        </h1>
        <p className="text-[#37322f]/70 text-sm font-medium">
          Paste your long URL below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#37322f]">Enter Long URL</label>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            disabled={loading}
            // FIX: ensure text doesn't overflow on small screens
            className="px-4 py-2.5 rounded-lg border border-[#37322f]/12 bg-white text-[#37322f] placeholder:text-[#37322f]/50 focus:outline-none focus:ring-2 focus:ring-[#37322f]/50 focus:border-transparent text-sm w-full disabled:opacity-50 min-w-0"
          />
          {error && <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>}
        </div>

        <h4>
          <span className="text-sm font-medium text-[#37322f]">Link Expiration</span>
        </h4>
        <ExpirationDropdown value={expiration} onChange={setExpiration} />

        {/* FIX: remove border-2 hover (causes layout shift) — use box-shadow instead */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#37322f] hover:bg-white hover:text-[#37322f] text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-[#37322f]/70 transition-all"
          style={{ boxShadow: undefined }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = "inset 0 0 0 2px rgba(55,50,47,0.7)")}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = "")}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Creating...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Shorten Link <ArrowRight className="size-4" />
            </div>
          )}
        </button>

        {/* Features — FIX: stack on mobile, row on sm */}
        <div className="mt-2 rounded-lg bg-[#f7f5f3] border border-[#37322f]/12 p-3 sm:p-4 space-y-2 sm:space-y-3">
          <h3 className="text-sm font-medium text-[#37322f]">Features</h3>
          {/* FIX: grid on sm so items don't wrap awkwardly */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
              <Zap className="size-4 text-[#37322f] shrink-0" />
              <span>One-click copy</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
              <BarChart2 className="size-4 text-[#37322f] shrink-0" />
              <span>Click tracking</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#37322f]/70">
              <Clock className="size-4 text-[#37322f] shrink-0" />
              <span>Custom expiry</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}