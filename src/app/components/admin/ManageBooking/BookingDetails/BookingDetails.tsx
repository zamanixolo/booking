'use client'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import BookingForm from '../BookingForm/BookingForm'

interface BookingDetail {
  id: string
  client?: {
    id: string
    firstName: string
    lastName: string
    email: string
    phone:string
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
  price: number
  sessionDuration: number
  date: string
  time: string
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'
  specialRequests: string | null
}

function BookingDetails() {
  const { id } = useParams()
  const router = useRouter()

  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/booking/${id}`)
      if (!res.ok) throw new Error('Failed to fetch booking')
      const data = await res.json()
      console.log(data)
      setBooking(data)
    } catch (err) {
      setError('Error fetching booking details')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (updatedData: Partial<BookingDetail>) => {
    if (!booking) return
    try {
      const res = await fetch(`/api/booking/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      })
      if (!res.ok) throw new Error('Failed to update booking')
      await fetchBooking()
      alert('✅ Booking updated successfully!')
    } catch (err) {
      console.error(err)
      alert('❌ Failed to update booking.')
    }
  }

  useEffect(() => {
    if (id) fetchBooking()
  }, [id])

  if (loading) return <div className="p-6">Loading booking...</div>
  if (error) return <div className="p-6 text-red-600">{error}</div>
  if (!booking) return <div className="p-6">Booking not found</div>

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">{booking.services.name}</h1>
      <h2>client: {booking.client?.firstName} {booking.client?.lastName}</h2>
      <h2>contact: {booking.client?.email} </h2>
      <h2> {booking.client?.phone} </h2>
      <BookingForm booking={booking} onSave={handleUpdate} />
    </div>
  )
}

export default BookingDetails