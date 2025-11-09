'use client'

import { SignIn, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function Login() {
  const { isSignedIn, userId, isLoaded } = useAuth()
  const router=useRouter()
  useEffect(() => {
    // If user is signed in AND we have userId, redirect to user page
    if (isSignedIn && userId) {
      router.push(`/user/${userId}`)
    }
  }, [isSignedIn, userId, router])
 // Show loading while Clerk is initializing
 if (!isLoaded) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow text-center">
      Loading...
    </div>
  )
}

// If signed in but still redirecting, show loading
if (isSignedIn && userId) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow text-center">
      Redirecting to your profile...
    </div>
  )
}

// Only show SignIn if user is definitely not signed in
if (!isSignedIn) {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow">
      <SignIn 
        withSignUp={true}
        routing="hash"
        redirectUrl={userId ? `/user/${userId}` : '/user'}
        afterSignInUrl={userId ? `/user/${userId}` : '/user'}
        afterSignUpUrl={userId ? `/user/${userId}` : '/user'}
      />
    </div>
  )
}

return null
}
