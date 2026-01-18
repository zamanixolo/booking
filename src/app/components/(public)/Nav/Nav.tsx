'use client'
import { useUserStore } from '@/app/libs/useUserStore'
import Link from 'next/link'
import React from 'react'
import { SignIn, SignOutButton, useAuth } from '@clerk/nextjs'
function Nav() {
    const links = [{url:'/about',tag:'About'},{url:'/booking',tag:'Booking'},{url:'/contact',tag:'Contact Us'},{url:'/client',tag:'Clients'},{url:'/',tag:'Home'}]
    const order = ['Home', 'About', 'Clients', 'Booking', 'Contact Us','Log in / Sign Up']
    const { isSignedIn, userId} = useAuth()
    const { user} = useUserStore()
    const sortedLinks = links.sort(
    (a, b) => order.indexOf(a.tag) - order.indexOf(b.tag)
    )
    return (
    <nav className='h-[5em] p-[2.5em] bg-black text-white items-center flex justify-between'>
        <span><p>LOGO</p></span>
        <span className='justify-between flex w-[50%]'>{sortedLinks.map((e)=>{return <Link href={e.url} className="no-underline" key={e.tag}>{e.tag}</Link>})}
        {userId!==null||userId!==undefined&&<Link href={'/user'}>Log in / Sign Up</Link>}
        {userId&&<Link href={'/user'}>profile</Link>}
        {userId&&<SignOutButton/>}
        </span>
        
    </nav>
  )
}

export default Nav