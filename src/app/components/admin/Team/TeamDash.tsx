'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import AddMember from './AddMember'
import UpdateMember from './editTeamMember'
import { useAuth } from '@clerk/nextjs'
import { ProviderRole } from '@prisma/client' // Import the actual enum type

// Update the Member interface to match the structure returned by your API (which includes clerkId)
interface Member {
  id: string
  firstName: string
  lastName:string
  role: ProviderRole // Use the correct enum type
  imageurl?: string // Matches schema name
  email?: string
  phone?: string
  clerkId?: string // Add clerkId as it's used for validation
}


function TeamDash() {
  const [isloading, setIsLoading] = useState(true)
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<Member[]>([])
  const [openupdateMemberModal, setOpenUpdateMemberModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<Member | null>(null)
  const {userId} = useAuth()
  const [isAdmin,setisAdmin]=useState(false)

// we need a loading state
const getteam=async()=>{
 setIsLoading(true)
  // ✅ FIX: Use the correct API endpoint path
  const response = await fetch('/app/api/team') 
  const data: Member[] = await response.json()

  const adminMember = data.find((member) => 
      member.clerkId === userId && member?.role === 'ADMIN'
    )
    
    setisAdmin(adminMember?.role === 'ADMIN')
console.log(data)
  setTeamMembers(data)
  setIsLoading(false)
}
useEffect(() => {
  const fetchTeamMembers = async () => {
    try {
      getteam()
    } catch (error) {
      // ✅ FIX: Resolve 'unknown' type error
      console.error('Error fetching team members:', error as any) 
    }
  }
  fetchTeamMembers() // <-- actually call the function
  setIsLoading(false)
}, [isAddTeamMemberOpen, openupdateMemberModal]) // <-- add dependencies here


  const openAddTeamMember = () => {
    setIsAddTeamMemberOpen(!isAddTeamMemberOpen)
  }

  const handleEdit = async(member: Member) => {
    setSelectedMember(member) // pass full member object
    setOpenUpdateMemberModal(true)
  }
  const handleDelete=async(member:Member)=>{
    try {
      // ✅ FIX: Use the correct API endpoint path
      const response = await fetch('/app/api/team',{ 
        method:"DELETE",
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({ id: member.id }) // Only send the ID for deletion
      })
  
      const data: Member= await response.json()
     alert(`${data.firstName} ${data.lastName} was deleted`)
     getteam()
    } catch (error) {
      // ✅ FIX: Resolve 'unknown' type error
      console.error('Error fetching team members:', error as any) 
    }
  }
if (isloading) {
  return <div>Loading...</div>
}
  return (
    <div>
      <h2>Edit Team</h2>
      {isAdmin&&<button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={openAddTeamMember}
      >
        Add Member
      </button>}

      <table className="min-w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th>Image</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
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
        teamMembers.map((member, index) => (
        <tr key={index} className="text-center">
          <td className="border px-2 h-16 flex justify-center">
          <div className='h-full w-full  relative mx-auto '>
          <img
            src={member.imageurl || '/next.svg'} // Use the correct property name
            alt={member.firstName}
            
            className="rounded-full"
          />
          </div>
          </td>
          <td className="border px-4 py-2">{member.firstName} {member.lastName}</td>
          <td className="border px-4 py-2">{member.role}</td>
          {isAdmin &&<td className="border px-4 py-2">
            <button className="bg-green-500 text-white px-2 py-1 rounded mr-2" onClick={() => handleEdit(member)}>Edit</button>
            <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={()=>{handleDelete(member)}}>Delete</button>
          </td>}
        </tr>
        ))
        )}
      </tbody>
      </table>
      {openupdateMemberModal &&
        <UpdateMember
          member={selectedMember}
          closeModal={() => setOpenUpdateMemberModal(false)}
        />
      }
      {isAddTeamMemberOpen && isAdmin&&<AddMember openAddTeamMember={openAddTeamMember} />}
    </div>
  )
}

export default TeamDash
