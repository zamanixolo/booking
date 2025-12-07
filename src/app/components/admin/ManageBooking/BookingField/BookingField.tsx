'use client'
import React from 'react'

interface Props {
  label: string
  type?: 'text' | 'number' | 'date' | 'time' | 'select' | 'textarea'
  value: any
  onChange: (value: any) => void
  options?: string[]
}

function BookingField({ label, type = 'text', value, onChange, options }: Props) {
  const safeValue = value ?? ''   // <<< KEY FIX

  return (
    <div>
      <label className="font-medium block mb-1">{label}</label>

      {type === 'textarea' ? (
        <textarea
          className="border rounded p-2 w-full"
          rows={3}
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : type === 'select' && options ? (
        <select
          className="border rounded p-2 w-full"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          className="border rounded p-2 w-full"
          value={safeValue}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </div>
  )
}

export default BookingField
