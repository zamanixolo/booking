'use client'
import React, { useState, useEffect } from 'react'

interface OperatingHours {
  id: string
  providerId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean
}

interface Provider {
  id: string
  firstName: string
  lastName: string
}

interface BulkOperatingHoursEditorProps {
  providers: Provider[]
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday', 
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export default function BulkOperatingHoursEditor({ providers }: BulkOperatingHoursEditorProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([])
  const [editableHours, setEditableHours] = useState<OperatingHours[]>([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const fetchOperatingHours = async (providerId: string) => {
    if (!providerId) return
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/operating-hours?providerId=${providerId}`)
      if (res.ok) {
        const data:OperatingHours[] = await res.json()
        setOperatingHours(data)
        setEditableHours(data)
      } else {
        setError('Failed to fetch operating hours')
      }
    } catch (err) {
      setError('Error fetching operating hours')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (selectedProvider) {
      fetchOperatingHours(selectedProvider)
    } else {
      setOperatingHours([])
      setEditableHours([])
    }
  }, [selectedProvider])

  const handleTimeChange = (dayOfWeek: number, field: 'startTime' | 'endTime', value: string) => {
    setEditableHours(prev => 
      prev.map(hours => 
        hours.dayOfWeek === dayOfWeek 
          ? { ...hours, [field]: value }
          : hours
      )
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const updates = editableHours.map(hours => ({
        id: hours.id,
        startTime: hours.startTime,
        endTime: hours.endTime
      }))

      const res = await fetch('/api/operating-hours/bulk', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates })
      })

      if (res.ok) {
        setSuccess('Operating hours updated successfully!')
        fetchOperatingHours(selectedProvider)
      } else {
        setError('Failed to update operating hours')
      }
    } catch (err) {
      setError('Error updating operating hours')
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = () => {
    return editableHours.some((editable, index) => 
      editable.startTime !== operatingHours[index]?.startTime ||
      editable.endTime !== operatingHours[index]?.endTime
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Bulk Edit Operating Hours</h2>
      
      {/* Provider Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select Provider</label>
        <select
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          className="border rounded px-3 py-2 w-full md:w-64"
        >
          <option value="">Choose a provider</option>
          {providers.map(provider => (
            <option key={provider.id} value={provider.id}>
              {provider.firstName} {provider.lastName}
            </option>
          ))}
        </select>
      </div>

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

      {loading && (
        <div className="text-center py-4">Loading...</div>
      )}

      {selectedProvider && !loading && (
        <>
          <div className="space-y-3 mb-6">
            {DAYS_OF_WEEK.map((day, index) => {
              const hours = editableHours.find(h => h.dayOfWeek === index)
              return (
                <div key={index} className="flex items-center justify-between p-3 border rounded">
                  <span className="font-medium w-24">{day}</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="time"
                      value={hours?.startTime || '09:00'}
                      onChange={(e) => handleTimeChange(index, 'startTime', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={hours?.endTime || '17:00'}
                      onChange={(e) => handleTimeChange(index, 'endTime', e.target.value)}
                      className="border rounded px-2 py-1"
                    />
                  </div>
                  <div className={`w-3 h-3 rounded-full ${hours?.isActive ? 'bg-green-500' : 'bg-gray-300'}`} 
                       title={hours?.isActive ? 'Active' : 'Inactive'} />
                </div>
              )
            })}
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </>
      )}
    </div>
  )
}