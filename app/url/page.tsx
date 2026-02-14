'use client'

import { useState } from 'react'
import Header from '@/components/headers'
import UrlForm from '@/components/url-form'
import LinksList from '@/components/links-list'
import { Card } from '@/components/ui/cards'

export default function Page() {
  const [links, setLinks] = useState<
    Array<{
      id: string
      originalUrl: string
      shortUrl: string
      createdAt: string
      expiresAt: string | null
      clicks: number
      isExpired: boolean
    }>
  >([])

  const handleCreateLink = (originalUrl: string, expirationOption: string) => {
    const shortCode = Math.random().toString(36).substring(2, 8).toUpperCase()
    
    let expiresAt: string | null = null
    const now = new Date()
    
    switch (expirationOption) {
      case '1hour':
        expiresAt = new Date(now.getTime() + 60 * 60 * 1000).toLocaleString()
        break
      case '24hours':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toLocaleString()
        break
      case '7days':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleString()
        break
      case '30days':
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleString()
        break
      case 'never':
      default:
        expiresAt = null
    }

    const newLink = {
      id: Date.now().toString(),
      originalUrl,
      shortUrl: `short.link/${shortCode}`,
      createdAt: new Date().toLocaleDateString(),
      expiresAt,
      clicks: 0,
      isExpired: false,
    }
    setLinks([newLink, ...links])
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
            Shorten Your URLs
          </h1>
          <p className="text-lg text-muted-foreground">
            Create clean, shareable links and track their performance in real-time
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-border bg-card p-6">
              <UrlForm onCreateLink={handleCreateLink} />
            </Card>
          </div>

          {/* Links List Section */}
          <div className="lg:col-span-2">
            <LinksList
              links={links}
              onDeleteLink={handleDeleteLink}
            />
          </div>
        </div>
      </div>
    </main>
  )
}
