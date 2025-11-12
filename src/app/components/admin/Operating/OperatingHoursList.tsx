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
  const [selectedProvider, setSelectedProvider] = useState<string>('')
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // const fetchOperatingHours = async (providerId: string) => {
  //   if (!providerId) return
    
  //   setLoading(true)
  //   setError('')
  //   try {
  //     const res = await fetch(`/api/operating-hours?providerId=${providerId}`)
  //     if (res.ok) {
  //       const data = await res.json()
  //       setOperatingHours(data)
  //     } else {
  //       setError('Failed to fetch operating hours')
  //     }
  //   } catch (err) {
  //     setError('Error fetching operating hours')
  //     console.error(err)
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // useEffect(() => {
  //   if (selectedProvider) {
  //     fetchOperatingHours(selectedProvider)
  //   } else {
  //     setOperatingHours([])
  //   }
  // }, [selectedProvider])
 const fetchOperatingHours = async () => {
    
    
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/operating-hours`)
      if (res.ok) {
        const data = await res.json() as any
        console.log(data)
        setOperatingHours(data)
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
  useEffect(()=>{
    fetchOperatingHours()
  },[])
  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/operating-hours/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isActive: !isActive })
      })

      if (res.ok) {
        fetchOperatingHours()
        // fetchOperatingHours(selectedProvider)
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
      const res = await fetch(`/api/operating-hours?id=${id}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        // fetchOperatingHours(selectedProvider)
      } else {
        setError('Failed to delete operating hours')
      }
    } catch (err) {
      setError('Error deleting operating hours')
      console.error(err)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Operating Hours</h2>
      
      {/* Provider Selector */}
      {/* <div className="mb-6">
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
      </div> */}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-4">Loading...</div>
      )}

      {!loading && (
        <div className="space-y-4">
          {operatingHours.length === 0 ? (
            <p className="text-gray-500">No operating hours set.</p>
          ) : (
            operatingHours.map(hours => (
              <div key={hours.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{DAYS_OF_WEEK[hours.dayOfWeek]}</h3>
                    <p className="text-gray-600">
                      {hours.startTime} - {hours.endTime}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleActive(hours.id, hours.isActive)}
                      className={`px-3 py-1 rounded text-sm ${
                        hours.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {hours.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <button
                      onClick={() => handleDelete(hours.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm hover:bg-red-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}