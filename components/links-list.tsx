"use client";

import React, { useState, useMemo } from "react";
import {
  Copy, Trash2, ExternalLink, Link as LinkIcon,
  Check, Clock, Filter, ChevronRight, X,
} from "lucide-react";
import { UrlResponse } from "@/types/url";
import { CustomCalendar } from "./ui/calender";

interface LinksListProps {
  links: UrlResponse[];
  onDeleteLink: (shortUrl: string) => void;
}

type FilterType = "all" | "today" | "week" | "month" | "expired" | "active";

export default function LinksList({ links, onDeleteLink }: LinksListProps) {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" });

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
      return { text: "Expired", expired: true, className: "bg-red-50 text-red-700 border border-red-200" };
    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const days = Math.floor(hours / 24);
    const expiryText = days > 0
      ? `${days}d ${hours % 24}h left`
      : hours > 0 ? `${hours}h ${minutes}m left` : `${minutes}m left`;
    let className = "bg-[#f7f5f3] text-[#37322f] border border-[#37322f]/12";
    if (totalMinutes < 5) className = "bg-orange-50 text-orange-700 border border-orange-200";
    else if (totalMinutes < 30) className = "bg-yellow-50 text-yellow-700 border border-yellow-200";
    return { text: expiryText, expired: false, className };
  };

  const filteredLinks = useMemo(() => links.filter((link) => {
    const createdAt = new Date(link.createAt);
    const now = new Date();
    const isExpired = link.expiresAt ? new Date(link.expiresAt).getTime() < Date.now() : false;
    switch (filterType) {
      case "today": return createdAt >= new Date(now.setHours(0, 0, 0, 0));
      case "week": return createdAt >= new Date(now.setDate(now.getDate() - 7));
      case "month": return createdAt >= new Date(now.setMonth(now.getMonth() - 1));
      case "expired": return isExpired;
      case "active": return !isExpired;
      default: return true;
    }
  }), [links, filterType]);

  const dateFilteredLinks = useMemo(() => {
    if (!dateRange.start && !dateRange.end) return filteredLinks;
    return filteredLinks.filter((link) => {
      const createdAt = new Date(link.createAt).getTime();
      if (dateRange.start && dateRange.end)
        return createdAt >= new Date(dateRange.start).getTime() && createdAt <= new Date(dateRange.end).getTime() + 86400000;
      if (dateRange.start) return createdAt >= new Date(dateRange.start).getTime();
      if (dateRange.end) return createdAt <= new Date(dateRange.end).getTime() + 86400000;
      return true;
    });
  }, [filteredLinks, dateRange]);

  const clearFilters = () => { setFilterType("all"); setDateRange({ start: "", end: "" }); };
  const hasActiveFilters = filterType !== "all" || dateRange.start || dateRange.end;

  const formatDateLabel = (iso: string) => {
    if (!iso) return "";
    const [y, m, d] = iso.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

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
          <p className="text-sm text-[#37322f]/70">Create your first shortened link to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="text-xl sm:text-2xl font-serif text-[#37322f] truncate">Your Links</h2>
            <span className="rounded-full bg-[#37322f]/10 px-2 sm:px-3 py-1 text-xs sm:text-sm font-medium text-[#37322f] shrink-0">
              {dateFilteredLinks.length} / {links.length}
            </span>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 sm:gap-2 rounded-lg border px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all shrink-0 ${
              showFilters || hasActiveFilters
                ? "border-[#37322f] bg-[#37322f] text-white"
                : "border-[#37322f]/12 bg-white text-[#37322f] hover:bg-[#f7f5f3]"
            }`}
          >
            <Filter className="size-3.5 sm:size-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="ml-0.5 rounded-full bg-white/20 px-1.5 py-0.5 text-xs">!</span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="rounded-xl border border-[#37322f]/12 bg-white p-3 sm:p-4">
            <div className="flex flex-col gap-4 sm:gap-5">
              {/* Quick filters — FIX: wrap nicely, smaller on mobile */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#37322f]/50 mb-2">
                  Quick Filters
                </label>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {[
                    { value: "all", label: "All" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "7 Days" },
                    { value: "month", label: "30 Days" },
                    { value: "active", label: "Active" },
                    { value: "expired", label: "Expired" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      onClick={() => setFilterType(filter.value as FilterType)}
                      className={`rounded-lg border px-2.5 sm:px-3 py-1.5 text-xs font-medium transition-all ${
                        filterType === filter.value
                          ? "border-[#37322f] bg-[#37322f] text-white"
                          : "border-[#37322f]/12 bg-[#f7f5f3] text-[#37322f] hover:bg-[#e5e1db]"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date range — FIX: stack vertically on mobile */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-[#37322f]/50 mb-2">
                  Date Range
                </label>
                <div className="flex flex-col sm:flex-row items-stretch gap-2">
                  <div className="flex-1">
                    <CustomCalendar
                      value={dateRange.start}
                      onChange={(v) => setDateRange((prev) => ({ ...prev, start: v }))}
                      placeholder="Start date"
                      label="From"
                      maxDate={dateRange.end || undefined}
                    />
                  </div>
                  {/* FIX: hide chevron on mobile (already stacked vertically) */}
                  <ChevronRight className="size-4 text-[#37322f]/50 shrink-0 self-center hidden sm:block" />
                  <div className="flex-1">
                    <CustomCalendar
                      value={dateRange.end}
                      onChange={(v) => setDateRange((prev) => ({ ...prev, end: v }))}
                      placeholder="End date"
                      label="To"
                      minDate={dateRange.start || undefined}
                    />
                  </div>
                </div>
                {dateRange.start && dateRange.end && (
                  <p className="mt-2 text-[11px] text-[#37322f]/50">
                    {formatDateLabel(dateRange.start)} → {formatDateLabel(dateRange.end)}
                  </p>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center justify-center gap-1 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-100 transition-all"
                >
                  <X className="size-3.5" /> Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {dateFilteredLinks.length === 0 ? (
        <div className="flex rounded-xl border border-[#37322f]/12 bg-white p-8 text-center">
          <div className="w-full">
            <p className="text-sm text-[#37322f]/70">No links match the selected filters</p>
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
                className="rounded-xl border border-[#37322f]/12 bg-white p-3 sm:p-4 shadow-sm transition-all hover:border-[#37322f]/30"
              >
                <div className="flex flex-col gap-3">
                  {/* Top row: short URL + badges */}
                  <div className="flex flex-wrap items-center gap-2 min-w-0">
                    {/* FIX: short URL truncates instead of overflowing */}
                    <span className="inline-flex items-center rounded-lg bg-[#37322f] px-3 py-1 max-w-full overflow-hidden">
                      <code className="font-mono text-xs sm:text-sm text-white truncate">
                        {link.shortUrl}
                      </code>
                    </span>
                    <span className="text-xs text-[#37322f]/50 shrink-0">
                      {new Date(link.createAt).toLocaleDateString()}
                    </span>
                    {expiry && (
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ${expiry.className}`}>
                        <Clock className="size-3" />{expiry.text}
                      </span>
                    )}
                  </div>

                  {/* Original URL — FIX: break-all so long URLs wrap */}
                  <p className="font-mono text-xs sm:text-sm text-[#37322f]/70 break-all">
                    {link.originalUrl}
                  </p>

                  {/* Bottom row: clicks + actions */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="text-xs text-[#37322f]/50">
                      <span className="font-medium text-[#37322f]">{link.clickCount}</span> clicks
                    </div>

                    {/* FIX: action buttons always visible (removed hidden sm:inline) */}
                    <div className="flex gap-1.5 sm:gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleCopyUrl(link.shortUrl)}
                        className={`flex items-center gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all ${
                          copiedUrl === link.shortUrl
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-[#37322f]/12 bg-white hover:bg-[#f7f5f3]"
                        }`}
                      >
                        {copiedUrl === link.shortUrl ? <><Check className="size-3" /><span>Copied</span></> : <><Copy className="size-3" /><span>Copy</span></>}
                      </button>
                      <button
                        disabled={expiry?.expired}
                        onClick={() => { window.location.href = link.shortUrl; }}
                        className={`flex items-center gap-1 sm:gap-1.5 rounded-lg border px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium transition-all ${
                          expiry?.expired
                            ? "cursor-not-allowed opacity-50 border-[#37322f]/12"
                            : "border-[#37322f]/12 bg-white hover:bg-[#f7f5f3]"
                        }`}
                      >
                        <ExternalLink className="size-3" /><span>Open</span>
                      </button>
                      <button
                        onClick={() => onDeleteLink(link.shortUrl)}
                        className="flex items-center gap-1 sm:gap-1.5 rounded-lg border border-red-200 bg-white px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="size-3" /><span>Delete</span>
                      </button>
                    </div>
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