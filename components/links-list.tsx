"use client";

import React, { useState, useMemo } from "react";
import {
  Copy,
  Trash2,
  ExternalLink,
  Link as LinkIcon,
  Check,
  Clock,
  Filter,
  ChevronRight,
  X,
} from "lucide-react";
import { UrlResponse } from "@/types/url";
import { CustomCalendar } from "./ui/calender";
import { urlService } from "@/service/urlService";

interface LinksListProps {
  links: UrlResponse[];
  onDeleteLink: (shortUrl: string) => void;
}

type FilterType = "all" | "today" | "week" | "month" | "expired" | "active";

export default function LinksList({ links, onDeleteLink }: LinksListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });

  const handleCopyUrl = async (shortUrl: string) => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopiedUrl(shortUrl);
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch {
      alert("Failed to copy URL");
    }
  };

  const getExpiryDisplay = (link: UrlResponse) => {
    if (!link.expiresAt) return null;
    const expireDate = new Date(link.expiresAt).getTime();
    const now = Date.now();
    const diffMs = expireDate - now;
    if (diffMs <= 0)
      return {
        text: "Expired",
        expired: true,
        className:
          "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800",
      };
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);
    let expiryText =
      days > 0
        ? hours > 0
          ? `${days}d ${hours % 24}h ${minutes}m left`
          : `${days}d ${minutes}m left`
        : hours > 0
        ? `${hours}h ${minutes}m left`
        : `${minutes}m left`;
    let className =
      "bg-[#f7f5f3] dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] border border-[#37322f]/12 dark:border-[#e5e1db]/12";
    if (totalMinutes < 5)
      className =
        "bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-800";
    else if (totalMinutes < 30)
      className =
        "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
    return { text: expiryText, expired: false, className };
  };

  const filteredLinks = useMemo(
    () =>
      links.filter((link) => {
        const createdAt = new Date(link.createAt);
        const now = new Date();
        const isExpired = link.expiresAt
          ? new Date(link.expiresAt).getTime() < Date.now()
          : false;
        switch (filterType) {
          case "today":
            return createdAt >= new Date(now.setHours(0, 0, 0, 0));
          case "week":
            return createdAt >= new Date(now.setDate(now.getDate() - 7));
          case "month":
            return createdAt >= new Date(now.setMonth(now.getMonth() - 1));
          case "expired":
            return isExpired;
          case "active":
            return !isExpired;
          default:
            return true;
        }
      }),
    [links, filterType]
  );

  const dateFilteredLinks = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return filteredLinks;
    return filteredLinks.filter((link) => {
      const createdAt = new Date(link.createAt).getTime();
      if (dateRange.start && dateRange.end)
        return (
          createdAt >= new Date(dateRange.start).getTime() &&
          createdAt <= new Date(dateRange.end).getTime() + 86400000
        );
      if (dateRange.start)
        return createdAt >= new Date(dateRange.start).getTime();
      if (dateRange.end)
        return createdAt <= new Date(dateRange.end).getTime() + 86400000;
      return true;
    });
  }, [filteredLinks, dateRange]);

  const clearFilters = () => {
    setFilterType("all");
    setDateRange({ start: "", end: "" });
  };
  const hasActiveFilters =
    filterType !== "all" || dateRange.start || dateRange.end;

  const formatDateLabel = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUrlRedirect = (shortUrl: string) => {
    window.location.href = shortUrl;
  };

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
    );
  }

  // links.forEach(link => {
  //   console.log("Rendering link:", link.shortUrl);
  // });
    

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-serif text-[#37322f] dark:text-[#e5e1db]">
              Your Links
            </h2>
            <span className="rounded-full bg-[#37322f]/10 dark:bg-[#e5e1db]/10 px-3 py-1 text-sm font-medium text-[#37322f] dark:text-[#e5e1db]">
              {dateFilteredLinks.length} / {links.length}
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
              showFilters || hasActiveFilters
                ? "border-[#37322f] bg-[#37322f] text-white dark:border-[#e5e1db] dark:bg-[#e5e1db] dark:text-[#1a1a1a]"
                : "border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] hover:bg-[#f7f5f3] dark:hover:bg-[#333]"
            }`}
          >
            <Filter className="size-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-1 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">
                !
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#1a1a1a] p-4">
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#37322f]/50 mb-2.5">
                  Quick Filters
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Last 7 Days" },
                    { value: "month", label: "Last 30 Days" },
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value as FilterType)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                        filterType === filter.value
                          ? "border-[#37322f] bg-[#37322f] text-white dark:border-[#e5e1db] dark:bg-[#e5e1db] dark:text-[#1a1a1a]"
                          : "border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-[#f7f5f3] dark:bg-[#2a2a2a] text-[#37322f] dark:text-[#e5e1db] hover:bg-[#e5e1db] dark:hover:bg-[#333]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#37322f]/50 mb-2.5">
                  Date Range
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1">
                    <CustomCalendar
                      value={dateRange.start}
                      onChange={(v) =>
                        setDateRange((prev) => ({ ...prev, start: v }))
                      }
                      placeholder="Select start date"
                      label="From"
                      maxDate={dateRange.end || undefined}
                    />
                  </div>
                  <ChevronRight className="size-4 text-[#37322f]/50 font-serif shrink-0 self-center hidden sm:block" />
                  <div className="flex-1">
                    <CustomCalendar
                      value={dateRange.end}
                      onChange={(v) =>
                        setDateRange((prev) => ({ ...prev, end: v }))
                      }
                      placeholder="Select end date"
                      label="To"
                      minDate={dateRange.start || undefined}
                    />
                  </div>
                </div>
                {dateRange.start && dateRange.end && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-[#37322f]/50 dark:text-[#e5e1db]/50">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#37322f]/40 dark:bg-[#e5e1db]/40" />
                    Showing results from{" "}
                    <span className="font-semibold text-[#37322f] dark:text-[#e5e1db]">
                      {formatDateLabel(dateRange.start)}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-[#37322f] dark:text-[#e5e1db]">
                      {formatDateLabel(dateRange.end)}
                    </span>
                  </div>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1 rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 px-3 py-2 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/50 transition-all"
                >
                  <X className="size-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {dateFilteredLinks.length === 0 ? (
        <div className="flex rounded-xl border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#1a1a1a] p-8 text-center">
          <div className="w-full">
            <p className="text-sm text-[#37322f]/70 dark:text-[#e5e1db]/70">
              No links match the selected filters
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {dateFilteredLinks.map((link) => {
            const expiry = getExpiryDisplay(link);
            const shortCode = link.shortUrl.split("/").pop() ?? link.shortUrl;
            return (
              <div
                key={shortCode}
                className="rounded-xl border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#1a1a1a] p-4 shadow-sm transition-all hover:border-[#37322f]/30 dark:hover:border-[#e5e1db]/30"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0 flex-1">
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
                          {expiry.text}
                        </span>
                      )}
                    </div>
                    <p className="truncate font-mono text-sm text-[#37322f]/70 dark:text-[#e5e1db]/70">
                      {link.originalUrl}
                    </p>
                    <div className="mt-2 text-xs text-[#37322f]/50 dark:text-[#e5e1db]/50">
                      <span className="font-medium text-[#37322f] dark:text-[#e5e1db]">
                        {link.clickCount}
                      </span>{" "}
                      clicks
                    </div>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleCopyUrl(link.shortUrl)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        copiedUrl === link.shortUrl
                          ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                          : "border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] hover:bg-[#f7f5f3] dark:hover:bg-[#333]"
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
                      onClick={() => handleUrlRedirect(link.shortUrl)}
                      className={`flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                        expiry?.expired
                          ? "cursor-not-allowed opacity-50"
                          : "border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] hover:bg-[#f7f5f3] dark:hover:bg-[#333]"
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
            );
          })}
        </div>
      )}
    </div>
  );
}
