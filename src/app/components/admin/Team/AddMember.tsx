'use client'
import React, { useState } from 'react'
import { ProviderRole } from '@prisma/client'

interface NewProvider {
  firstName: string
  lastName: string
  email?: string
  imageurl?: string
  bio?: string
  role: ProviderRole
}

interface AddMemberProps {
  openAddTeamMember: () => void
}

function AddMember({ openAddTeamMember }: AddMemberProps) {
  const [newProvider, setNewProvider] = useState<NewProvider>({
    firstName: '',
    lastName: '',
    email: '',
    imageurl: '',
    bio: '',
    role: ProviderRole.TRAINER,
  })
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Provider fields (direct fields from your schema)
          firstName: newProvider.firstName,
          lastName: newProvider.lastName,
          email: newProvider.email,
          password: password,
          imageurl: newProvider.imageurl,
          bio: newProvider.bio,
          role: newProvider.role,
        }),
      })

      if (response.status === 201) {
        const createdProvider = await response.json()
        console.log('Created provider:', createdProvider)
        openAddTeamMember()
      } else if (response.status === 409) {
        alert('Provider with this email already exists')
      } else {
        const error = await response.json() as any
        console.error('Failed to create provider:', error)
        alert(error.msg || 'Failed to create provider')
      }
    } catch (error) {
      console.error('Error creating provider:', error)
      alert('Error creating provider')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 shadow-lg w-96 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between px-4 items-center">
          <h2 className="text-xl mb-4 font-semibold">Add Provider</h2>
          <button className='text-xl mb-4 font-semibold' onClick={openAddTeamMember}>x</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block mb-1">First Name *</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={newProvider.firstName}
              onChange={(e) =>
                setNewProvider({ ...newProvider, firstName: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Last Name *</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={newProvider.lastName}
              onChange={(e) =>
                setNewProvider({ ...newProvider, lastName: e.target.value })
              }
              disabled={isLoading}
              required
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={newProvider.email}
              onChange={(e) =>
                setNewProvider({ ...newProvider, email: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Password</label>
            <input
              type="Password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value )
              }
              disabled={isLoading}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Bio</label>
            <textarea
              className="w-full border px-3 py-2 rounded"
              value={newProvider.bio}
              onChange={(e) =>
                setNewProvider({ ...newProvider, bio: e.target.value })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Image URL</label>
            <input
              type="text"
              className="w-full border px-3 py-2 rounded"
              value={newProvider.imageurl}
              onChange={(e) =>
                setNewProvider({ ...newProvider, imageurl: e.target.value })
              }
              disabled={isLoading}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1">Provider Role</label>
            <select
              className="w-full border px-3 py-2 rounded"
              value={newProvider.role}
              onChange={(e) =>
                setNewProvider({
                  ...newProvider,
                  role: e.target.value as ProviderRole,
                })
              }
              disabled={isLoading}
            >
              {Object.values(ProviderRole).map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end mt-4">
            <button
              type="button"
              className="bg-gray-300 text-black px-4 py-2 mr-2"
              onClick={openAddTeamMember}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-white ${
                isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Provider'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddMember