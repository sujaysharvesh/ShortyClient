"use client";

import { useEffect, useState } from "react";
import Header from "@/components/headers";
import UrlForm from "@/components/url-form";
import LinksList from "@/components/links-list";
import { Card } from "@/components/ui/cards";
import { useAuth } from "@/provider/AuthContext";
import { UrlResponse } from "@/types/url";
import { urlService } from "@/service/urlService";
import { useRouter } from "next/navigation";

export default function Page() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [links, setLinks] = useState<UrlResponse[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      urlService
        .getUserUrls()
        .then(setLinks)
        .finally(() => setFetching(false));
    }
  }, [loading, user]);

  const handleCreateLink = async (
    originalUrl: string,
    expirationOption: number
  ) => {
    try {
      const newUrl = await urlService.shortenUrl(
        originalUrl,
        expirationOption
      );
  
      setLinks((prev) => [newUrl, ...prev]);
    } catch (err) {
      console.error("Failed to create link", err);
    }
  };
  

  const handleDeleteLink = async (shortUrl: string) => {
    const shortCode = shortUrl.split("/").pop() || "";
  
    try {
      await urlService.deleteUrl(shortCode);
  
      setLinks((prev) =>
        prev.filter((link) => !link.shortUrl.endsWith(shortCode))
      );
    } catch (err) {
      console.error("Failed to delete link", err);
    }
  };
  

  // if (loading || fetching) {
  //   return <p className="p-10 text-center">Loading...</p>;
  // }

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  // Fetch URLs
  useEffect(() => {
    if (!loading && user) {
      urlService
        .getUserUrls()
        .then(setLinks)
        .finally(() => setFetching(false));
    }
  }, [loading, user]);

  if (loading || fetching) {
    return <p className="p-10 text-center">Loading...</p>;
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f7f5f3]">
      <Header />

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero */}
        <div className="mb-12 text-center">
          {/* <h1 className="mb-4 text-5xl font-bold tracking-tight text-foreground">
            Shorten Your URLs
          </h1> */}
          <p className="text-lg text-muted-foreground">
            Create clean, shareable links and track their performance - 
            <span className="font-semibold"> {user.data.username}</span>
          </p>
        </div>

        {/* Main Content */}
        <div className="grid gap-8 lg:grid-cols-1">
          {/* Form */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4 border-border bg-card p-6">
              <UrlForm onCreateLink={handleCreateLink} />
            </Card>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <LinksList
              links={links}
              onDeleteLink={handleDeleteLink}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
