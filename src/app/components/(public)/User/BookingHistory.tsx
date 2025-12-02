'use client'
import React, { ChangeEvent, useEffect, useState } from 'react'

interface Props {
  userId: string
}

interface Booking {
  id: string
  date: string
  time: string
  price: number
  status: string
  services: {
    name: string
  }
  provider: {
    firstName: string
    lastName: string
  }
}
interface Provider {
  
  firstName: string
  lastName: string
}
function BookingHistory({ userId }: Props) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [openmodule, setOpenModule] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)
  const [availableProviders,setAvailableProviders]=useState<Provider[]>([])
  const [bookingData,setBookingData]=useState({date: null,
    id: null,
    providerId:null,
    time: null
    })
  
  useEffect(() => {
    const fetchBookings = async () => {
      if (!userId) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/app/api/booking?clientId=${userId}`)
        const data: Booking[] = await response.json()
        console.log(data)
        setBookings(data)
   
      } catch (error) {
        console.error('Error fetching bookings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookings()
  }, [userId])

  useEffect(()=>{
    const getProviders=async()=>{
      const res=await fetch('/app/api/team/getActiveProvider')
      const providerdata: Provider[] =await res.json()
      setAvailableProviders(providerdata)
    }
    getProviders()
  },[])
  
  const editmodule = (booking:any) => {
    setSelectedBooking(booking.id)
    setBookingData({...bookingData,
      date:booking.date.split('T')[0],
      id: booking.id,
      time: booking.time,
      providerId:booking.providerId})
    setOpenModule(true)
    console.log(booking)
    console.log(bookingData)
  }

  const closeModule = () => {
    setOpenModule(false)
    setSelectedBooking(null)
  }
  const bookingupdate=async(id:string)=>{
    console.log(id)
    const res=await fetch(`/app/api/booking/${id}`,{
      method:'PATCH',
      headers:{ 'Content-Type': 'application/json' },
      body:JSON.stringify({id:id,updateData:bookingData})
    })
    const data=await res.json()

  }

 // Handle changes for top-level fields
 const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setBookingData(prev => ({
    ...prev,
    [name]: value === '' ? null : value
  }));
};




  const EditBooking = ({ id, onClose }: { id: string; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Booking</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <p>Editing Booking ID: <strong>{id}</strong></p>
            <p className="text-sm text-gray-600">
          
          
            {/* Provider Information */}
            <fieldset>
                <legend>Provider </legend>
              <select>
              {availableProviders.map((e:any)=>{return <option key={e.id}>{e.firstName} {e.lastName}</option>})}
             
              </select>

            </fieldset>

            {/* Booking Details */}
            <fieldset>
                <legend>Booking Details</legend>


                <div className="form-group">
                    <label>Date:</label>
                    <input
                        type="date"
                        name="date"
                        value={bookingData.date || ''}
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group">
                    <label>Time:</label>
                    <input
                        type="time"
                        name="time"
                        value={bookingData.time || ''}
                        onChange={handleInputChange}
                    />
                </div>
            </fieldset>


            </p>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Add your save logic here
                  bookingupdate(id)
                  
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!userId) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        <p>Please sign in to view your booking history.</p>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Bookings</h2>
        <p>Loading your bookings...</p>
      </div>
    )
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Bookings</h2>
      
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="space-y-4">
          {bookings?.map((booking: Booking) => (
            <div 
              key={booking.id} 
              className="border-b pb-4 last:border-b-0 cursor-pointer hover:bg-gray-50 p-2 rounded"
              onClick={() => editmodule(booking)}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium">{booking.services?.name}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.date).toLocaleDateString()} at {booking?.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    with {booking.provider?.firstName} {booking.provider?.lastName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R{booking?.price}</p>
                  <p className="text-sm text-gray-600">{booking?.status}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {openmodule && selectedBooking && (
        <EditBooking id={selectedBooking} onClose={closeModule} />
      )}
    </div>
  )
}

export default BookingHistory