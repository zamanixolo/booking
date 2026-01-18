'use client'
import React, { useEffect, useState } from 'react'

interface Props {
    id: string
    select:(val: any) => void
  }
function Menu({id,select}:Props) {
    const [renderState,setRenderState]=useState('Profile')
    useEffect(()=>{
        switch (renderState) {
            case 'Profile':
                select(0)
                break;
            case 'Current Booking':
                select(1)
            break;
            case 'Booking History':
                select(2)
                break;
            default:
                select(0)
                break;
        }
    },[renderState])
  return (
  <div className="flex flex-col h-[100vh] w-fit p-2 bg-gray-400 text-left items-start">
    <h2 className="font-semibold">{renderState}</h2>
    <p>{id}</p>

    <button
      className="text-left w-[100%] text-white p-2 hover:bg-gray-300"
      onClick={() => setRenderState('Profile')}
    >
      Profile
    </button>

    <button
      className="text-left w-[100%] text-white p-2 hover:bg-gray-300"
      onClick={() => setRenderState('Booking History')}
    >
      Bookings
    </button>
  </div>
  )
}

export default Menu