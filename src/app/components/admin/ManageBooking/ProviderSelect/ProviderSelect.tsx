'use client'
import React from 'react'

interface Provider {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface Props {
  providers: Provider[]
  value: string
  onChange: (value: string) => void
}

function ProviderSelect({ providers, value, onChange }: Props) {
  
  return (
    <div>
      <label className="font-medium block mb-1">Provider:</label>
      <select
        className="border rounded p-2 w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {providers.length === 0 && <option>No active providers</option>}
        {providers.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.lastName}
          </option>
        ))}
      </select>
    </div>
  )
}

export default ProviderSelect