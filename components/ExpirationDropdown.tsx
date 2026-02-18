"use client";

import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";

type Option = {
  label: string;
  value: string;
};

const OPTIONS: Option[] = [
  { label: "1 Hour", value: "1hour" },
  { label: "24 Hours", value: "24hours" },
  { label: "7 Days", value: "7days" },
  { label: "30 Days", value: "30days" },
];

export default function ExpirationDropdown({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const selected = OPTIONS.find((o) => o.value === value);

  return (
    <div className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
      >
        <span>{selected?.label ?? "Select expiration"}</span>
        <ChevronDown className="h-4 w-4 opacity-60" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100"
            >
              <Check
                className={`h-4 w-4 ${
                  value === option.value ? "opacity-100" : "opacity-0"
                }`}
              />
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
