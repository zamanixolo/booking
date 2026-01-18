'use client'
import React, { useEffect, useState } from 'react'
import BookingSettings from '../BookingSettings/BookingSettings'
import ViewBooking from '../ViewBooking/ViewBooking'

interface Member {
  id: string
  firstName: string
  lastName:string
  role: string
  image: string
  email?: string
  phone?: string
}
function BookingDash() {
    const [menu,setmenu]=useState(0)
    const [teamMembers, setTeamMembers] = useState<Member[]>([])
//     const getteam=async()=>{
//       const response = await fetch('/api/team')
//       const data = await response.json()
//       setTeamMembers(data)
//     }
    
// useEffect(() => {
//   const fetchTeamMembers = async () => {
//     try {
//       getteam()
//     } catch (error) {
//       console.error('Error fetching team members:', error)
//     }
//   }
//   fetchTeamMembers() // <-- actually call the function
//   // setIsLoading(false)
// }, []) // <-- add dependencies here
  return (
    <div> 
    <section className='flex justify-center gap-[0.5em] p-[2em]'>
        <button onClick={()=>{setmenu(0)}} className={`border ${menu==0&&'bg-gray-400'}`}>View Booking</button>
        <button onClick={()=>{setmenu(1)}} className={`border ${menu==1&&'bg-gray-400'}`}>Booking settings</button>
    </section>
    <section>
    {menu==0&&<ViewBooking/>}
    {menu==1&&<BookingSettings
    />}
    </section>
    </div>
  )
}

export default BookingDash