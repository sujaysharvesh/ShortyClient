'use client'

import React, { useState } from 'react'
import {
  Copy,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Check,
  Clock,
} from 'lucide-react'
import { UrlResponse } from '@/types/url'

interface LinksListProps {
  links: UrlResponse[]
  onDeleteLink: (shortUrl: string) => void
}

export default function LinksList({ links, onDeleteLink }: LinksListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleCopyUrl = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl)
      setCopiedUrl(shortUrl)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch {
      alert('Failed to copy URL')
    }
  }

  const getExpiryDisplay = (link: UrlResponse) => {
    if (!link.expiresAt) return null

    const expireDate = new Date(link.expiresAt).getTime()
    const now = Date.now()
    const diffMs = expireDate - now

    if (diffMs <= 0) {
      return {
        text: 'Expired',
        expired: true,
        className:
          'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800',
      }
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60))
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const days = Math.floor(hours / 24)

    let expiryText = ''
    if(days > 0) {
      expiryText = hours > 0 ? `${days}d ${hours}h ${minutes}m left` : `${minutes}m left`
    } else {
      expiryText = hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left` 
    }

    let className =
      'bg-[#f7f5f3] dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] border border-[#37322f]/12 dark:border-[#e5e1db]/12'

    if (totalMinutes < 5) {
      className =
        'bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800'
    } else if (totalMinutes < 30) {
      className =
        'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800'
    }

    return { expiryText, expired: false, className }
  }

  if (links.length === 0) {
    return (
      <div className="flex rounded-2xl border border-[#37322f]/12 bg-white dark:bg-[#1a1a1a] p-12 text-center">
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-[#f7f5f3] dark:bg-[#2a2a2a] p-4">
              <LinkIcon className="size-8 text-[#37322f]/40 dark:text-[#e5e1db]/40" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-serif text-[#37322f] dark:text-[#e5e1db]">
            No links yet
          </h3>
          <p className="text-sm text-[#37322f]/70 dark:text-[#e5e1db]/70">
            Create your first shortened link to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37322f] dark:text-[#e5e1db]">
          Your Links
        </h2>
        <span className="rounded-full bg-[#37322f]/10 dark:bg-[#e5e1db]/10 px-3 py-1 text-sm font-medium text-[#37322f] dark:text-[#e5e1db]">
          {links.length}
        </span>
      </div>

      <div className="space-y-3">
        {links.map((link) => {
          const expiry = getExpiryDisplay(link)
          const shortCode = link.shortUrl.split('/').pop() ?? link.shortUrl

          return (
            <div
              key={shortCode}
              className="rounded-xl border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm transition-all hover:border-[#37322f]/30 dark:hover:border-[#e5e1db]/30"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {/* Header */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-[#37322f] dark:bg-[#e5e1db] px-3 py-1">
                      <code className="font-mono text-sm text-white dark:text-[#1a1a1a]">
                        {link.shortUrl}
                      </code>
                    </span>

                    <span className="text-xs text-[#37322f]/50 dark:text-[#e5e1db]/50">
                      {new Date(link.createAt).toLocaleDateString()}
                    </span>

                    {expiry && (
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${expiry.className}`}
                      >
                        <Clock className="size-3" />
                        {expiry.expiryText}
                      </span>
                    )}
                  </div>

                  {/* Original URL */}
                  <p className="truncate font-mono text-sm text-[#37322f]/70 dark:text-[#e5e1db]/70">
                    {link.originalUrl}
                  </p>

                  {/* Clicks */}
                  <div className="mt-2 text-xs text-[#37322f]/50 dark:text-[#e5e1db]/50">
                    <span className="font-medium text-[#37322f] dark:text-[#e5e1db]">
                      {link.clickCount}
                    </span>{' '}
                    clicks
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleCopyUrl(link.shortUrl)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      copiedUrl === link.shortUrl
                        ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                        : 'border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] hover:bg-[#f7f5f3] dark:hover:bg-[#333]'
                    }`}
                  >
                    {copiedUrl === link.shortUrl ? (
                      <>
                        <Check className="size-3.5" />
                        <span className="hidden sm:inline">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span className="hidden sm:inline">Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    disabled={expiry?.expired}
                    onClick={() => window.open(link.shortUrl, '_blank')}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                      expiry?.expired
                        ? 'cursor-not-allowed opacity-50'
                        : 'border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] hover:bg-[#f7f5f3] dark:hover:bg-[#333]'
                    }`}
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Open</span>
                  </button>

                  <button
                    onClick={() => onDeleteLink(link.shortUrl)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 dark:border-red-800 bg-white dark:bg-[#2a2a2a] px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <Trash2 className="size-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
