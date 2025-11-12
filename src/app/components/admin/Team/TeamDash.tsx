'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddMember from './AddMember'
import UpdateMember from './editTeamMember'
import { useAuth } from '@clerk/nextjs'
import { ProviderRole } from '@prisma/client'

interface Member {
  id: string
  firstName: string
  lastName: string
  role: ProviderRole
  image: string
  email?: string
  phone?: string
  clerkId?: string
}

function TeamDash() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [openUpdateMemberModal, setOpenUpdateMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const { userId } = useAuth()
  const [isAdmin, setIsAdmin] = useState(false)

  const getTeam = async () => {
    try {
      const response = await fetch('/api/team')
      const data: Member[] = await response.json()

      const adminMember = data.find(
        (member: Member) =>
          member.clerkId === userId && member.role === ProviderRole.ADMIN
      )

      setIsAdmin(adminMember?.role === ProviderRole.ADMIN)
      setTeamMembers(data)
    } catch (error) {
      console.error('Error fetching team members:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getTeam()
  }, [isAddTeamMemberOpen, openUpdateMemberModal])

  const openAddTeamMember = () => {
    setIsAddTeamMemberOpen(!isAddTeamMemberOpen)
  }

  const handleEdit = (member: Member) => {
    setSelectedMember(member)
    setOpenUpdateMemberModal(true)
  }

  const handleDelete = async (member: Member) => {
    try {
      const response = await fetch('/api/team', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member),
      })

      const data = await response.json() as any;
      alert(`${data.firstName} ${data.lastName} was deleted`)
      getTeam()
    } catch (error) {
      console.error('Error deleting team member:', error)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Edit Team</h2>

      {isAdmin && (
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={openAddTeamMember}
        >
          Add Member
        </button>
      )}

      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="border px-4 py-2">Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            {isAdmin && <th className="border px-4 py-2">Actions</th>}
          </tr>
        </thead>

        <tbody>
          {teamMembers.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center py-4">
                No members found
              </td>
            </tr>
          ) : (
            teamMembers.map((member) => (
              <tr key={member.id} className="text-center">
                <td className="border px-2 py-2 h-16 flex justify-center">
                  <div className="h-12 w-12 relative mx-auto">
                    <Image
                      src={member.image || '/next.svg'}
                      alt={member.firstName}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                </td>
                <td className="border px-4 py-2">
                  {member.firstName} {member.lastName}
                </td>
                <td className="border px-4 py-2">{member.role}</td>
                {isAdmin && (
                  <td className="border px-4 py-2">
                    <button
                      className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                      onClick={() => handleEdit(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded"
                      onClick={() => handleDelete(member)}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {openUpdateMemberModal && selectedMember && (
        <UpdateMember
          member={selectedMember}
          closeModal={() => setOpenUpdateMemberModal(false)}
        />
      )}

      {isAddTeamMemberOpen && isAdmin && (
        <AddMember openAddTeamMember={openAddTeamMember} />
      )}
    </div>
  )
}

export default TeamDash
