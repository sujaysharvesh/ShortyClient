'use client'

import React, { useState } from 'react'
import { ArrowRight, Zap, BarChart2, Clock } from 'lucide-react'

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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-semibold text-amber-900 mb-2">
          Enter Long URL
        </label>
        <input
          type="url"
          placeholder="https://example.com/very/long/url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError('') }}
          disabled={loading}
          className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 placeholder-amber-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50 transition-colors"
        />
        {error && (
          <p className="mt-1.5 text-xs text-red-600 font-medium">{error}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-amber-900 mb-2">
          Link Expiration
        </label>
        <select
          value={expiration}
          onChange={(e) => setExpiration(e.target.value)}
          disabled={loading}
          className="w-full rounded-lg border-2 border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200 disabled:opacity-50 transition-colors cursor-pointer"
        >
          <option value="never">Never Expires</option>
          <option value="1hour">Expires in 1 Hour</option>
          <option value="24hours">Expires in 24 Hours</option>
          <option value="7days">Expires in 7 Days</option>
          <option value="30days">Expires in 30 Days</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-4 py-3 text-sm font-bold text-white hover:bg-amber-600 active:bg-amber-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
      >
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Creating...
          </>
        ) : (
          <>
            Shorten Link
            <ArrowRight className="size-4" />
          </>
        )}
      </button>

      <div className="rounded-xl bg-amber-50 border border-amber-200 p-4 space-y-3">
        <h3 className="text-sm font-bold text-amber-900">Features</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5 text-sm text-amber-700">
            <Zap className="size-4 text-amber-500 shrink-0" />
            <span>One-click copy to clipboard</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-amber-700">
            <BarChart2 className="size-4 text-amber-500 shrink-0" />
            <span>Real-time click tracking</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-amber-700">
            <Clock className="size-4 text-amber-500 shrink-0" />
            <span>Custom link expiration</span>
          </div>
        </div>
      </div>
    </form>
  )
}