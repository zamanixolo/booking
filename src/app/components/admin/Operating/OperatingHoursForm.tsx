'use client'
import React, { useState } from 'react'

interface Provider {
  id: string
  firstName: string
  lastName: string
}

interface OperatingHoursFormProps {
  providers: Provider[]
  onSuccess?: () => void
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' }
]

export default function OperatingHoursForm({ providers, onSuccess }: OperatingHoursFormProps) {
  const [formData, setFormData] = useState({
    // providerId: '',
    dayOfWeek: '',
    startTime: '09:00',
    endTime: '17:00'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await fetch('/api/operating-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dayOfWeek: parseInt(formData.dayOfWeek)
        })
      })

      if (res.ok) {
        setSuccess('Operating hours created successfully!')
        setFormData({
          // providerId: '',
          dayOfWeek: '',
          startTime: '09:00',
          endTime: '17:00'
        })
        if (onSuccess) onSuccess()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to create operating hours')
      }
    } catch (err) {
      setError('Error creating operating hours')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Add Operating Hours</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* <div>
          <label className="block text-sm font-medium mb-2">Provider</label>
          <select
            name="providerId"
            value={formData.providerId}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select a provider</option>
            {providers.map(provider => (
              <option key={provider.id} value={provider.id}>
                {provider.firstName} {provider.lastName}
              </option>
            ))}
          </select>
        </div> */}

        <div>
          <label className="block text-sm font-medium mb-2">Day of Week</label>
          <select
            name="dayOfWeek"
            value={formData.dayOfWeek}
            onChange={handleChange}
            required
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select a day</option>
            {DAYS_OF_WEEK.map(day => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="border rounded px-3 py-2 w-full"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
        >
          {loading ? 'Creating...' : 'Create Operating Hours'}
        </button>
      </form>
    </div>
  )
}