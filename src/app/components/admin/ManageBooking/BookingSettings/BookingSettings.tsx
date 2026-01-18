'use client'
import normalizeProviderIds from '@/app/libs/normalizeProviderIds'
import React, { useEffect, useState } from 'react'

interface TeamMember {
  id: string
  memberName: string
}

interface Booking {
  members: TeamMember[]
  price: number
  session: number
}

interface Service {
  id: string
  name: string
}

interface Provider {
  id: string
  firstName: string
  lastName: string
}

interface BookingSetting {
  id: string
  service: Service
  serviceId: string
  providerIds: string
  providers: Provider[]
  defaultPrice: number
  defaultSessionDuration: number
}

function BookingSettings() {
  const [services, setServices] = useState<Service[]>([])
  const [providers, setProviders] = useState<Provider[]>([])
  const [existingSettings, setExistingSettings] = useState<BookingSetting[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string>('')
  const [booking, setBooking] = useState<Booking>({
    members: [],
    price: 650,
    session: 60,
  })
  const [currentSettingId, setCurrentSettingId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  /* ---------------------- FETCH DATA ---------------------- */
  useEffect(() => {
    fetchServices()
    fetchProviders()
    fetchExistingSettings()
  }, [])

  const fetchServices = async () => {
    try {
      const res = await fetch('/app/api/services')
      if (res.ok) setServices(await res.json())
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const fetchProviders = async () => {
    try {
      const res = await fetch('/app/api/team/getActiveProvider')
      if (res.ok) {
        const data: any = await res.json()
        setProviders(data.team || [])
      }
    } catch (error) {
      console.error('Error fetching providers:', error)
    }
  }

  const fetchExistingSettings = async () => {
    try {
      const res = await fetch('/app/api/booking-settings')
      if (res.ok) {
        const data: BookingSetting[] = await res.json()
        setExistingSettings(data)
      }
    } catch (error) {
      console.error('Error fetching booking settings:', error)
    }
  }

  /* ---------------------- LOAD OR RESET BOOKING ON SERVICE CHANGE ---------------------- */
  useEffect(() => {
    if (!selectedServiceId) {
      setBooking({ members: [], price: 650, session: 60 })
      setCurrentSettingId(null)
      return
    }

    const setting = existingSettings.find((s) => s.serviceId === selectedServiceId)

    if (setting) {
      setCurrentSettingId(setting.id)
      const providerIds = normalizeProviderIds(setting.providerIds)

      const existingProviders = providers.filter((p) => providerIds.includes(p.id))

      setBooking({
        members: existingProviders.map((p) => ({
          id: p.id,
          memberName: `${p.firstName} ${p.lastName}`,
        })),
        price: setting.defaultPrice,
        session: setting.defaultSessionDuration,
      })
    } else {
      // Reset for new service
      setCurrentSettingId(null)
      setBooking({ members: [], price: 650, session: 60 })
    }
  }, [selectedServiceId, existingSettings, providers])

  /* ---------------------- HANDLERS ---------------------- */
  const handleServiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedServiceId(e.target.value)
  }

  const handleAddMember = (memberName: string, id: string) => {
    if (!booking.members.some((m) => m.id === id)) {
      setBooking((prev) => ({
        ...prev,
        members: [...prev.members, { id, memberName }],
      }))
    }
  }

  const handleRemoveMember = (memberId: string) => {
    setBooking((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }))
  }

  const handleSave = async () => {
    if (!selectedServiceId) return alert('Please select a service')
    setIsLoading(true)

    try {
      const data = {
        providerIds: booking.members.map((m) => m.id),
        serviceId: selectedServiceId,
        defaultSessionDuration: booking.session,
        defaultPrice: booking.price,
      }

      const url = currentSettingId
        ? `/app/api/booking-settings/${currentSettingId}`
        : '/app/api/booking-settings'
      const method = currentSettingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (res.ok) {
        alert('Booking setting saved')
        fetchExistingSettings()
      } else {
        alert('Failed to save booking setting')
      }
    } catch (error) {
      console.error('Error saving booking setting:', error)
      alert('Error saving booking setting')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!currentSettingId) return
    if (!confirm('Are you sure you want to delete this booking setting?')) return

    setIsLoading(true)
    try {
      const res = await fetch(`/app/api/booking-settings/${currentSettingId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        alert('Booking setting deleted')
        setBooking({ members: [], price: 650, session: 60 })
        setSelectedServiceId('')
        setCurrentSettingId(null)
        fetchExistingSettings()
      } else {
        alert('Failed to delete booking setting')
      }
    } catch (err) {
      console.error('Error deleting booking setting:', err)
      alert('Error deleting booking setting')
    } finally {
      setIsLoading(false)
    }
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Booking Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* SERVICE DROPDOWN */}
        <div className="bg-white p-4 shadow rounded md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Select Service</h2>
          <select
            value={selectedServiceId}
            onChange={handleServiceSelect}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {/* SESSION DURATION */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">Session Duration</h2>
          <input
            type="number"
            value={booking.session}
            onChange={(e) =>
              setBooking((prev) => ({
                ...prev,
                session: parseInt(e.target.value) || 60,
              }))
            }
            className="border px-3 py-2 w-full rounded"
            min={15}
            step={15}
          />
        </div>

        {/* PRICE */}
        <div className="bg-white p-4 shadow rounded">
          <h2 className="text-lg font-semibold mb-4">Price</h2>
          <input
            type="number"
            value={booking.price}
            onChange={(e) =>
              setBooking((prev) => ({
                ...prev,
                price: parseFloat(e.target.value) || 650,
              }))
            }
            className="border px-3 py-2 w-full rounded"
            min={0}
            step={0.01}
          />
        </div>

        {/* TEAM MEMBERS */}
        <div className="bg-white p-4 shadow rounded md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Team Members</h2>

          <div className="flex gap-2 flex-wrap mb-4">
            {providers.map((member) => (
              <button
                key={member.id}
                type="button"
                className={`border px-3 py-2 rounded transition ${
                  booking.members.some((m) => m.id === member.id)
                    ? 'bg-blue-100 border-blue-300'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() =>
                  handleAddMember(`${member.firstName} ${member.lastName}`, member.id)
                }
                disabled={booking.members.some((m) => m.id === member.id)}
              >
                {member.firstName} {member.lastName}
              </button>
            ))}
          </div>

          {booking.members.length > 0 && (
            <div className="mt-2">
              <h3 className="text-sm font-medium mb-2">Selected Members</h3>
              <div className="flex gap-2 flex-wrap">
                {booking.members.map((member) => (
                  <button
                    key={member.id}
                    type="button"
                    className="border px-3 py-2 rounded bg-red-100 hover:bg-red-200 transition"
                    onClick={() => handleRemoveMember(member.id)}
                  >
                    {member.memberName} ×
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SAVE + DELETE BUTTONS */}
        <div className="md:col-span-2 flex justify-between items-center">
          {/* DELETE BUTTON */}
          {currentSettingId && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition disabled:bg-red-400"
            >
              Delete Setting
            </button>
          )}

          {/* SAVE / UPDATE BUTTON */}
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:bg-blue-400"
          >
            {isLoading
              ? 'Saving...'
              : currentSettingId
              ? 'Update Setting'
              : 'Create Setting'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BookingSettings
