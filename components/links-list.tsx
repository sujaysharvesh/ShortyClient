'use client'

import React, { useState } from 'react'
import { Copy, Trash2, ExternalLink, Link as LinkIcon, Check } from 'lucide-react'

interface Link {
  id: string
  originalUrl: string
  shortUrl: string
  createdAt: string
  expiresAt: string | null
  clicks: number
  isExpired: boolean
}

interface LinksListProps {
  links: Link[]
  onDeleteLink: (id: string) => void
}

export default function LinksList({ links, onDeleteLink }: LinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopyUrl = (link: Link) => {
    navigator.clipboard.writeText(`https://${link.shortUrl}`)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
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
        <span className="ml-2 text-sm font-normal bg-amber-200 text-amber-800 rounded-full px-2.5 py-0.5">
          {links.length}
        </span>
      </h2>
      <div className="space-y-3">
        {links.map((link) => (
          <div
            key={link.id}
            className="rounded-xl border border-amber-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                {/* Short URL badge */}
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center rounded-lg bg-amber-500 px-3 py-1">
                    <code className="text-sm font-bold text-white font-mono">
                      {link.shortUrl}
                    </code>
                  </span>
                  <span className="text-xs text-amber-500">{link.createdAt}</span>
                  {link.expiresAt && (
                    <span className="text-xs rounded-full bg-orange-100 text-orange-700 border border-orange-200 px-2 py-0.5 font-medium">
                      ⏱ Expires {link.expiresAt}
                    </span>
                  )}
                </div>

                {/* Original URL */}
                <p className="truncate text-sm text-amber-600 font-mono">
                  {link.originalUrl}
                </p>

                {/* Stats */}
                <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                  <span className="font-semibold text-amber-700">{link.clicks}</span>
                  <span>clicks</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleCopyUrl(link)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all ${
                    copiedId === link.id
                      ? 'border-green-300 bg-green-50 text-green-700'
                      : 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:border-amber-300'
                  }`}
                >
                  {copiedId === link.id ? (
                    <>
                      <Check className="size-3.5" />
                      <span className="hidden sm:inline">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => window.open(`https://${link.shortUrl}`, '_blank')}
                  className="flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 hover:border-amber-300 transition-all"
                >
                  <ExternalLink className="size-3.5" />
                  <span className="hidden sm:inline">Open</span>
                </button>

                <button
                  onClick={() => onDeleteLink(link.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 hover:border-red-300 transition-all"
                >
                  <Trash2 className="size-3.5" />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}