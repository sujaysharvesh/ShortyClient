'use client'

import React, { useState } from 'react'
import { Copy, Trash2, ExternalLink, Link as LinkIcon, Check } from 'lucide-react'
import { UrlResponse } from '@/types/url'

interface LinksListProps {
  links: UrlResponse[]
  onDeleteLink: (shortUrl: string) => void
}

export default function LinksList({ links, onDeleteLink }: LinksListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleCopyUrl = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl)
    setCopiedUrl(shortUrl)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  if (links.length === 0) {
    return (
      <div className="flex rounded-2xl border border-[#37322f]/12 bg-white p-12 text-center">
        <div className="w-full">
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-[#f7f5f3] p-4">
              <LinkIcon className="size-8 text-[#37322f]/40" />
            </div>
          </div>
          <h3 className="mb-2 text-xl font-serif text-[#37322f]">No links yet</h3>
          <p className="text-[#37322f]/70 text-sm">
            Create your first shortened link using the form to get started
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-serif text-[#37322f]">Your Links</h2>
        <span className="rounded-full bg-[#37322f]/10 px-3 py-1 text-sm font-medium text-[#37322f]">
          {links.length}
        </span>
      </div>

      <div className="space-y-3">
        {links.map((link) => {
          const isExpired =
            link.expiresAt !== null &&
            new Date(link.expiresAt).getTime() < Date.now()

          return (
            <div
              key={link.shortUrl}
              className="rounded-xl border border-[#37322f]/12 bg-white p-4 shadow-sm transition-all hover:border-[#37322f]/30"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {/* Short URL */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-[#37322f] px-3 py-1">
                      <code className="font-mono text-sm font-medium text-white">
                        {link.shortUrl}
                      </code>
                    </span>

                    <span className="text-xs text-[#37322f]/50">
                      {new Date(link.createAt).toLocaleDateString()}
                    </span>

                    {link.expiresAt && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          isExpired
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-[#f7f5f3] text-[#37322f] border border-[#37322f]/12'
                        }`}
                      >
                        {isExpired ? 'Expired' : 'Expires'}{' '}
                        {new Date(link.expiresAt).toLocaleDateString()}
                      </span>
                    )}

                    {!link.active && (
                      <span className="rounded-full border border-[#37322f]/12 bg-[#f7f5f3] px-2 py-0.5 text-xs text-[#37322f]/70">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Original URL */}
                  <p className="truncate font-mono text-sm text-[#37322f]/70">
                    {link.originalUrl}
                  </p>

                  {/* Stats */}
                  <div className="mt-2 text-xs text-[#37322f]/50">
                    <span className="font-medium text-[#37322f]">
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
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-[#37322f]/12 bg-white text-[#37322f] hover:bg-[#f7f5f3] hover:border-[#37322f]/30'
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
                    onClick={() => window.open(link.shortUrl, '_blank')}
                    className="flex items-center gap-1.5 rounded-lg border border-[#37322f]/12 bg-white px-3 py-2 text-xs font-medium text-[#37322f] transition-all hover:bg-[#f7f5f3] hover:border-[#37322f]/30"
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Open</span>
                  </button>

                  <button
                    onClick={() => onDeleteLink(link.shortUrl)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 transition-all hover:bg-red-50 hover:border-red-300"
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