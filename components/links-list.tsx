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
      <div className="rounded-xl border-2 border-dashed border-amber-300 bg-white p-12 text-center">
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-amber-100 p-4">
            <LinkIcon className="size-8 text-amber-400" />
          </div>
        </div>
        <h3 className="mb-2 text-xl font-bold text-amber-900">No links yet</h3>
        <p className="text-amber-600 text-sm">
          Create your first shortened link using the form to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-amber-900">
        Your Links
        <span className="ml-2 rounded-full bg-amber-200 px-2.5 py-0.5 text-sm font-normal text-amber-800">
          {links.length}
        </span>
      </h2>

      <div className="space-y-3">
        {links.map((link) => {
          const isExpired =
            link.expiresAt !== null &&
            new Date(link.expiresAt).getTime() < Date.now()

          return (
            <div
              key={link.shortUrl}
              className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm transition-all hover:border-amber-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0 flex-1">
                  {/* Short URL */}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1">
                      <code className="font-mono text-sm font-bold text-white">
                        {link.shortUrl}
                      </code>
                    </span>

                    <span className="text-xs text-amber-500">
                      {new Date(link.createAt).toLocaleDateString()}
                    </span>

                    {link.expiresAt && (
                      <span
                        className={`rounded-full border px-2 py-0.5 text-xs font-medium ${
                          isExpired
                            ? 'border-red-200 bg-red-100 text-red-700'
                            : 'border-orange-200 bg-orange-100 text-orange-700'
                        }`}
                      >
                        ⏱ {isExpired ? 'Expired' : 'Expires'}{' '}
                        {new Date(link.expiresAt).toLocaleDateString()}
                      </span>
                    )}

                    {!link.active && (
                      <span className="rounded-full border border-gray-300 bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Original URL */}
                  <p className="truncate font-mono text-sm text-amber-600">
                    {link.originalUrl}
                  </p>

                  {/* Stats */}
                  <div className="mt-2 text-xs text-amber-500">
                    <span className="font-semibold text-amber-700">
                      {link.clickCount}
                    </span>{' '}
                    clicks
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-2">
                  <button
                    onClick={() => handleCopyUrl(link.shortUrl)}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                      copiedUrl === link.shortUrl
                        ? 'border-green-300 bg-green-50 text-green-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-300 hover:bg-amber-100'
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
                    className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition-all hover:border-amber-300 hover:bg-amber-100"
                  >
                    <ExternalLink className="size-3.5" />
                    <span className="hidden sm:inline">Open</span>
                  </button>

                  <button
                    onClick={() => onDeleteLink(link.shortUrl)}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition-all hover:border-red-300 hover:bg-red-100"
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
