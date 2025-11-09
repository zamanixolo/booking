'use client'

import { SignUp } from '@clerk/nextjs'

export default function Signup() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  )
}
