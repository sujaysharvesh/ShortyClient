'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight, ChevronDown, Calendar as CalendarIcon } from 'lucide-react'

interface CustomCalendarProps {
  value: string // YYYY-MM-DD
  onChange: (date: string) => void
  placeholder?: string
  label?: string
  minDate?: string
  maxDate?: string
}

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

function toLocalDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function toISO(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function CustomCalendar({ value, onChange, placeholder, label, minDate, maxDate }: CustomCalendarProps) {
  const [open, setOpen] = useState(false)
  const [yearPickerOpen, setYearPickerOpen] = useState(false)
  const today = new Date()
  const initial = value ? toLocalDate(value) : today
  const [viewYear, setViewYear] = useState(initial.getFullYear())
  const [viewMonth, setViewMonth] = useState(initial.getMonth())
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setYearPickerOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Sync view when value changes externally
  useEffect(() => {
    if (value) {
      const d = toLocalDate(value)
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [value])

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

  const handleSelect = useCallback((day: number) => {
    const selected = new Date(viewYear, viewMonth, day)
    const iso = toISO(selected)
    if (minDate && iso < minDate) return
    if (maxDate && iso > maxDate) return
    onChange(iso)
    setOpen(false)
  }, [viewYear, viewMonth, minDate, maxDate, onChange])

  const handleYearSelect = (year: number) => {
    setViewYear(year)
    setYearPickerOpen(false)
  }

  const isSelected = (day: number) => {
    if (!value) return false
    return toISO(new Date(viewYear, viewMonth, day)) === value
  }

  const isToday = (day: number) => {
    return toISO(new Date(viewYear, viewMonth, day)) === toISO(today)
  }

  const isDisabled = (day: number) => {
    const iso = toISO(new Date(viewYear, viewMonth, day))
    if (minDate && iso < minDate) return true
    if (maxDate && iso > maxDate) return true
    return false
  }

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)

  const displayValue = value
    ? toLocalDate(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

  // Generate year range (current year - 10 to current year + 5)
  const currentYear = new Date().getFullYear()
  const startYear = currentYear - 10
  const endYear = currentYear + 5
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all outline-none
          ${open
            ? 'border-[#37322f] dark:border-[#e5e1db] ring-2 ring-[#37322f]/10 dark:ring-[#e5e1db]/10'
            : value
              ? 'border-[#37322f]/30 dark:border-[#e5e1db]/30 bg-[#37322f]/5 dark:bg-[#e5e1db]/5'
              : 'border-[#37322f]/15 dark:border-[#e5e1db]/15 bg-[#f7f5f3] dark:bg-[#2a2a2a] hover:border-[#37322f]/30'
          }`}
      >
        {/* Mini calendar icon */}
        <div className={`shrink-0 flex flex-col items-center justify-center w-8 h-8 rounded-lg border transition-all overflow-hidden
          ${value
            ? 'border-[#37322f]/20 dark:border-[#e5e1db]/20 bg-[#37322f] dark:bg-[#e5e1db]'
            : 'border-[#37322f]/15 dark:border-[#e5e1db]/15 bg-white dark:bg-[#1a1a1a]'
          }`}
        >
          <div className={`w-full h-1.5 ${value ? 'bg-white/25 dark:bg-[#1a1a1a]/25' : 'bg-[#37322f]/15 dark:bg-[#e5e1db]/15'}`} />
          <div className={`text-[10px] font-bold mt-0.5 ${value ? 'text-white dark:text-[#1a1a1a]' : 'text-[#37322f]/50 dark:text-[#e5e1db]/50'}`}>
            {value ? toLocalDate(value).getDate() : '—'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {label && <div className="text-[10px] font-semibold uppercase tracking-widest text-[#37322f]/40 dark:text-[#e5e1db]/40 mb-0.5">{label}</div>}
          <div className={`text-sm font-medium truncate ${value ? 'text-[#37322f] dark:text-[#e5e1db]' : 'text-[#37322f]/35 dark:text-[#e5e1db]/35'}`}>
            {displayValue || placeholder || 'Pick a date'}
          </div>
        </div>

        <ChevronRight className={`size-4 text-[#37322f]/30 dark:text-[#e5e1db]/30 transition-transform duration-200 ${open ? 'rotate-90' : ''}`} />
      </button>

      {/* Dropdown calendar */}
      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 w-72 rounded-2xl border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#1a1a1a] shadow-xl shadow-[#37322f]/10 dark:shadow-black/30 overflow-hidden">
          {/* Month and Year header with year picker */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#37322f]/8 dark:border-[#e5e1db]/8">
            <button
              type="button"
              onClick={prevMonth}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-[#37322f]/50 dark:text-[#e5e1db]/50 hover:bg-[#37322f]/8 dark:hover:bg-[#e5e1db]/8 hover:text-[#37322f] dark:hover:text-[#e5e1db] transition-all"
            >
              <ChevronLeft className="size-4" />
            </button>

            <div className="flex items-center gap-1">
              <span className="text-sm font-semibold text-[#37322f] dark:text-[#e5e1db]">
                {MONTHS[viewMonth]}
              </span>
              
              {/* Year picker trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setYearPickerOpen(!yearPickerOpen)}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg text-sm font-semibold text-[#37322f] dark:text-[#e5e1db] hover:bg-[#37322f]/8 dark:hover:bg-[#e5e1db]/8 transition-all"
                >
                  {viewYear}
                  <ChevronDown className={`size-3.5 transition-transform duration-200 ${yearPickerOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Year dropdown */}
                {yearPickerOpen && (
                  <div className="absolute top-full left-0 mt-1 w-32 max-h-48 overflow-y-auto rounded-lg border border-[#37322f]/12 dark:border-[#e5e1db]/12 bg-white dark:bg-[#2a2a2a] shadow-lg z-10">
                    <div className="p-1">
                      {years.map((year) => (
                        <button
                          key={year}
                          type="button"
                          onClick={() => handleYearSelect(year)}
                          className={`w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors ${
                            year === viewYear
                              ? 'bg-[#37322f] dark:bg-[#e5e1db] text-white dark:text-[#1a1a1a] font-medium'
                              : 'text-[#37322f] dark:text-[#e5e1db] hover:bg-[#37322f]/8 dark:hover:bg-[#e5e1db]/8'
                          }`}
                        >
                          {year}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={nextMonth}
              className="flex items-center justify-center w-7 h-7 rounded-lg text-[#37322f]/50 dark:text-[#e5e1db]/50 hover:bg-[#37322f]/8 dark:hover:bg-[#e5e1db]/8 hover:text-[#37322f] dark:hover:text-[#e5e1db] transition-all"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 px-3 pt-3 pb-1">
            {DAYS.map(d => (
              <div key={d} className="flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-[#37322f]/30 dark:text-[#e5e1db]/30 h-7">
                {d}
              </div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {/* Empty cells for offset */}
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const selected = isSelected(day)
              const todayDay = isToday(day)
              const disabled = isDisabled(day)

              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => handleSelect(day)}
                  className={`flex items-center justify-center h-8 w-full rounded-lg text-sm font-medium transition-all
                    ${disabled
                      ? 'opacity-25 cursor-not-allowed text-[#37322f] dark:text-[#e5e1db]'
                      : selected
                        ? 'bg-[#37322f] dark:bg-[#e5e1db] text-white dark:text-[#1a1a1a] shadow-sm'
                        : todayDay
                          ? 'bg-[#37322f]/10 dark:bg-[#e5e1db]/10 text-[#37322f] dark:text-[#e5e1db] ring-1 ring-inset ring-[#37322f]/20 dark:ring-[#e5e1db]/20'
                          : 'text-[#37322f] dark:text-[#e5e1db] hover:bg-[#37322f]/8 dark:hover:bg-[#e5e1db]/8'
                    }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-[#37322f]/8 dark:border-[#e5e1db]/8">
            <button
              type="button"
              onClick={() => { onChange(''); setOpen(false); setYearPickerOpen(false) }}
              className="text-xs font-medium text-[#37322f]/50 dark:text-[#e5e1db]/50 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => { 
                onChange(toISO(today)); 
                setOpen(false); 
                setYearPickerOpen(false);
              }}
              className="text-xs font-semibold text-[#37322f] dark:text-[#e5e1db] hover:text-[#37322f]/70 transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  )
}