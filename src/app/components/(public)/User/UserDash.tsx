'use client'
import React, { useState } from 'react'
import Menu from './Menu'
import Profile from './Profile'

import BookingHistory from './BookingHistory'

interface Props {
    id: string
    
  }
function UserDash({id}:Props) {
    const [selected,setSelected]= useState(0)
  return (
    <div className='flex w-[100vw]'>
        <Menu
        id={id}
        select={setSelected}
        />
        {selected==0&&<Profile
        id={id}
        />}
     
        {selected==2&&<BookingHistory userId={id} />}
    </div>
  )
}

export default UserDash