'use client'

import React, { useState } from 'react'
import { ArrowRight, Zap, BarChart2, Clock, Sparkles } from 'lucide-react'

interface UrlFormProps {
  onCreateLink: (url: string, expiration: string) => void
}

export default function UrlForm({ onCreateLink }: UrlFormProps) {
  const [url, setUrl] = useState('')
  const [expiration, setExpiration] = useState('never')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValidUrl = (urlString: string) => {
    try {
      new URL(urlString)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a URL')
      return
    }

    if (!isValidUrl(url)) {
      setError('Please enter a valid URL (include https://)')
      return
    }

    setLoading(true)
    setTimeout(() => {
      onCreateLink(url, expiration)
      setUrl('')
      setLoading(false)
    }, 500)
  }

  return (
    <div className="flex rounded-2xl shadow-sm p-8 border flex-col gap-4">
      {/* Heading */}
      <div className="flex flex-col gap-1 mb-2">
        <h1 className="text-3xl font-serif text-[#37322f]">
          Shorten your link
        </h1>
        <p className="text-[#37322f]/70 text-sm font-medium">
          Paste your long URL below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
        {/* URL Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#37322f]">
            Enter Long URL
          </label>
          <input
            type="url"
            placeholder="https://example.com/very/long/url"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setError('') }}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-[#37322f]/12 bg-white text-[#37322f] placeholder:text-[#37322f]/50 focus:outline-none focus:ring-2 focus:ring-[#37322f]/50 focus:border-transparent text-sm w-full disabled:opacity-50"
          />
          {error && (
            <p className="mt-1 text-xs text-red-600 font-medium">{error}</p>
          )}
        </div>

        {/* Expiration Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#37322f]">
            Link Expiration
          </label>
          <select
            value={expiration}
            onChange={(e) => setExpiration(e.target.value)}
            disabled={loading}
            className="px-4 py-2.5 rounded-lg border border-[#37322f]/12 bg-white text-[#37322f] focus:outline-none focus:ring-2 focus:ring-[#37322f]/50 focus:border-transparent text-sm w-full disabled:opacity-50 cursor-pointer"
          >
            <option value="never">Never Expires</option>
            <option value="1hour">Expires in 1 Hour</option>
            <option value="24hours">Expires in 24 Hours</option>
            <option value="7days">Expires in 7 Days</option>
            <option value="30days">Expires in 30 Days</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-[#37322f] hover:bg-white hover:text-[#37322f] hover:border-2 hover:border-[#37322f]/70 text-white rounded-lg font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed mt-2 focus:outline-none focus:ring-2 focus:ring-[#37322f]/70 transition-all"
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              Shorten Link
              <ArrowRight className="size-4" />
            </div>
          )}
        </button>

        {/* Features */}
        <div className="mt-2 rounded-lg bg-[#f7f5f3] border border-[#37322f]/12 p-4 space-y-3">
          <h3 className="text-sm font-medium text-[#37322f]">Features</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm text-[#37322f]/70">
              <Zap className="size-4 text-[#37322f] shrink-0" />
              <span>One-click copy to clipboard</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#37322f]/70">
              <BarChart2 className="size-4 text-[#37322f] shrink-0" />
              <span>Real-time click tracking</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-[#37322f]/70">
              <Clock className="size-4 text-[#37322f] shrink-0" />
              <span>Custom link expiration</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}