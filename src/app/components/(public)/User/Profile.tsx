'use client'
import React, { useEffect, useState } from 'react'

interface Props {
  id: string
}

interface UserData {
  email: string
  firstName: string
  lastName: string
  phone: string
  imageurl: string
}

function Profile({ id }: Props) {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    imageurl: '',
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch user profile
  const getProfile = async () => {
    try {
      setIsLoading(true)
      
        const res= await fetch('/api/User',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({clerkId:id,userData}),
        }) 
     
      if (res.ok) {
        const data = await res.json()
        setUserData({
          email: data.email || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          imageurl: data.imageurl || '',
        })
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Update user profile
  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const res = await fetch('/api/User', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clerkId: id,
          ...userData
        }),
      })
      
      if (res.ok) {
        const data = await res.json()
        console.log('Profile updated:', data)
        setIsEditing(false)
      } else {
        console.error('Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  useEffect(() => {
    getProfile()
  }, [id])

  if (isLoading && !userData.email) {
    return <div className="p-4">Loading profile...</div>
  }

  return (
    <div className="max-w-2xl  p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        {!isEditing ? (
          // Display mode
          <div className="space-y-4">
            <div className="flex items-center space-x-4 mb-6">
              {userData.imageurl && (
                <img 
                  src={userData.imageurl} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold">
                  {userData.firstName} {userData.lastName}
                </h2>
                <p className="text-gray-600">{userData.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <p className="mt-1 text-sm text-gray-900">{userData.firstName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <p className="mt-1 text-sm text-gray-900">{userData.lastName}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{userData.email}</p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{userData.phone || 'Not provided'}</p>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Edit Profile
            </button>
          </div>
        ) : (
          // Edit mode
          <form onSubmit={updateProfile} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={userData.firstName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={userData.lastName}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="imageurl" className="block text-sm font-medium text-gray-700">
                  Profile Image URL
                </label>
                <input
                  type="url"
                  id="imageurl"
                  name="imageurl"
                  value={userData.imageurl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  getProfile() // Reset form data
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default Profile