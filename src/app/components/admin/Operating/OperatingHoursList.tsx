'use client'
import React, { useState, useEffect, ChangeEvent } from 'react'

interface OperatingHours {
  id: string
  providerId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isActive: boolean|number|string
}

interface Provider {
  id: string
  firstName: string
  lastName: string
}

interface OperatingHoursListProps {
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

export default function OperatingHoursList({ providers }: OperatingHoursListProps) {
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingHour, setEditingHour] = useState<OperatingHours | null>(null)

  const fetchOperatingHours = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/app/api/operating-hours`)
      if (res.ok) {
        const data: OperatingHours[] = await res.json()
        const normalized = data.map(h => ({
          ...h,
         isActive: h.isActive === true || h.isActive === 'true' || h.isActive === 1,
        }))
        console.log(data)
        setOperatingHours(normalized)
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
    fetchOperatingHours()
  }, [])

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/app/api/operating-hours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive })
      })

      if (res.ok) {
        fetchOperatingHours()
      } else {
        setError('Failed to update operating hours')
      }
    } catch (err) {
      setError('Error updating operating hours')
      console.error(err)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete these operating hours?')) return

    try {
      const res = await fetch(`/app/api/operating-hours/${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        fetchOperatingHours()
      } else {
        setError('Failed to delete operating hours')
      }
    } catch (err) {
      setError('Error deleting operating hours')
      console.error(err)
    }
  }

  /* ---------------------- EDIT MODAL ---------------------- */
  const openEditModal = (hour: OperatingHours) => {
    setEditingHour(hour)
    setEditModalOpen(true)
  }

  const closeEditModal = () => {
    setEditingHour(null)
    setEditModalOpen(false)
  }

  const handleEditChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editingHour) return
    const { name, value } = e.target
    setEditingHour(prev => prev ? { ...prev, [name]: name === 'dayOfWeek' ? parseInt(value) : value } : null)
  }

  const saveEdit = async () => {
    if (!editingHour) return
    try {
      const res = await fetch(`/app/api/operating-hours/${editingHour.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingHour)
      })
      if (res.ok) {
        fetchOperatingHours()
        closeEditModal()
      } else {
        setError('Failed to save changes')
      }
    } catch (err) {
      console.error(err)
      setError('Error saving changes')
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && <div className="text-center py-4">Loading...</div>}

      {!loading && (
        <div className="space-y-4">
          {operatingHours.length === 0 ? (
            <p className="text-gray-500">No operating hours set.</p>
          ) : (
            operatingHours.map(hour => (
              <div key={hour.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{DAYS_OF_WEEK[hour.dayOfWeek]}</h3>
                  <p className="text-gray-600">{hour.startTime} - {hour.endTime}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleToggleActive(hour.id, Boolean(hour.isActive))}
                    className={`px-3 py-1 rounded text-sm ${
                      hour?.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {hour?.isActive ? 'Active' : 'Inactive'}
                    
                  </button>
                  <button
                    onClick={() => openEditModal(hour)}
                    className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hour.id)}
                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ---------------------- EDIT MODAL ---------------------- */}
      {editModalOpen && editingHour && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Edit Operating Hours</h2>
              <button onClick={closeEditModal} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
            </div>

            <div className="space-y-4">
              <label className="block">
                Day of Week
                <select
                  name="dayOfWeek"
                  value={editingHour.dayOfWeek}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full"
                >
                  {DAYS_OF_WEEK.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                Start Time
                <input
                  type="time"
                  name="startTime"
                  value={editingHour.startTime}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </label>

              <label className="block">
                End Time
                <input
                  type="time"
                  name="endTime"
                  value={editingHour.endTime}
                  onChange={handleEditChange}
                  className="border rounded px-3 py-2 w-full"
                />
              </label>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  onClick={closeEditModal}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={saveEdit}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
