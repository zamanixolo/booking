'use client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

interface Booking {
  id: string
  clientId: string | null
  providerId: string
  serviceId: string
  price: number
  sessionDuration: number
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  specialRequests: string | null
  createdAt: string
  updatedAt: string
  client?: {
    id: string
    firstName: string
    lastName: string
    email: string
  } | null
  provider: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  services: {
    id: string
    name: string
    description: string | null
  }
}

function ViewBooking() {
  const router=useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const getBookings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/booking')
      if (!res.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await res.json() as any;
      setBookings(data)
     
    } catch (err) {
      setError('Error fetching bookings')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getBookings()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-lg">Loading bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">All Bookings</h1>
      
      {bookings.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No bookings found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div key={booking.id} className="bg-white border shadow-sm hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.services.name}
                    </h3>
                    
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>

                {/* Provider Info */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Provider</p>
                  <p className="text-sm text-gray-900">
                    {booking.provider.firstName} {booking.provider.lastName}
                  </p>
                </div>

                {/* Client Info (if available) */}
                {booking.client && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Client</p>
                    <p className="text-sm text-gray-900">
                      {booking.client.firstName} {booking.client.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{booking.client.email}</p>
                  </div>
                )}

                {/* Date & Time */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Date & Time</p>
                  <p className="text-sm text-gray-900">{formatDate(booking.date)}</p>
                  <p className="text-sm text-gray-900">{booking.time}</p>
                </div>

                {/* Session Details */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700">Session Details</p>
                  <p className="text-sm text-gray-900">{booking.sessionDuration} minutes</p>
                  <p className="text-sm text-gray-900">R{booking.price.toFixed(2)}</p>
                </div>

                {/* Special Requests */}
                {booking.specialRequests && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700">Special Requests</p>
                    <p className="text-sm text-gray-600">{booking.specialRequests}</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Created: {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <button 
                    onClick={()=>{router.push(`/admin/booking/${booking.id}`)}}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ViewBooking