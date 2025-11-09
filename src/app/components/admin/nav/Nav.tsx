import Link from 'next/link'
import React from 'react'

function Nav() {
  return (
    <div>
    {/* <h1>Admin</h1> */}
    <nav className='flex gap-5'>
        <Link href='/admin'>Manage Booking</Link>
        {/* <Link href='/admin/ContentManagement'>Content Management</Link> */}
        <Link href='/admin/Team'>Team</Link>
        {/* <Link href='/admin/Reports'>Reports</Link> */}
        <Link href='/admin/Services'>Services</Link>
        <Link href='/admin/OperatingHours'>Operating Hours</Link>
    </nav>
    </div>
  )
}

export default Nav