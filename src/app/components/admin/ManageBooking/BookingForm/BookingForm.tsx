'use client'
import React, { useEffect, useState } from 'react'
import ProviderSelect from '../ProviderSelect/ProviderSelect'
import BookingField from '../BookingField/BookingField'

interface Provider {
  id: string
  firstName: string
  lastName: string
  email: string
}

interface BookingFormProps {
  booking: any
  onSave: (data: any) => void
}

function BookingForm({ booking, onSave }: BookingFormProps) {
  const [formData, setFormData] = useState(booking)
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    setFormData(booking)
  }, [booking])

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/team/getActiveProvider')
      const data:Provider[] = await res.json()
      setProviders(data)
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchProviders()
  }, [])

  const handleChange = (key: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-4">
      {/* Provider */}
      <ProviderSelect
        providers={providers}
        value={formData.provider.id}
        onChange={(providerId) => {
          const selected = providers.find((p) => p.id === providerId)
          if (selected) handleChange('provider', selected)
        }}
      />

      {/* Date & Time */}
      <div className="grid grid-cols-2 gap-4">
        <BookingField
          label="Date"
          type="date"
          value={formData.date.split('T')[0]}
          onChange={(v) => handleChange('date', v)}
        />
        <BookingField
          label="Time"
          type="time"
          value={formData.time}
          onChange={(v) => handleChange('time', v)}
        />
      </div>

      {/* Price & Duration */}
      <div className="grid grid-cols-2 gap-4">
        <BookingField
          label="Price (R)"
          type="number"
          value={formData.price}
          onChange={(v) => handleChange('price', parseFloat(v))}
        />
        <BookingField
          label="Duration (minutes)"
          type="number"
          value={formData.sessionDuration}
          onChange={(v) => handleChange('sessionDuration', parseInt(v))}
        />
      </div>

      {/* Status */}
      <BookingField
        label="Status"
        type="select"
        options={['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED']}
        value={formData.status}
        onChange={(v) => handleChange('status', v)}
      />

      {/* Special Requests */}
      <BookingField
        label="Special Requests"
        type="textarea"
        value={formData.specialRequests || ''}
        onChange={(v) => handleChange('specialRequests', v)}
      />

      <button
        onClick={() => onSave(formData)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
      >
        Save Changes
      </button>
    </div>
  )
}

export default BookingForm