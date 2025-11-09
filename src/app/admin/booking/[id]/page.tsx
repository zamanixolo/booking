'use client'  // <- this makes the entire page a client component


import React from 'react'
import dynamic from 'next/dynamic'

const BookingDetails = dynamic(
  () => import('@/app/components/admin/ManageBooking/BookingDetails/BookingDetails'),
  { ssr: false }
)

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* <BookingDetails /> */}
      </div>
    </main>
  )
}