import { createProvider, deleteProvider, getAllProviders, updateProvider } from '@/app/libs/providers/providers'
import { NextResponse } from 'next/server'
import { ProviderRole } from '@prisma/client' // ✅ import enum
import { clerkClient } from '@clerk/nextjs/server'

// GET request
export async function GET() {
  const team = await getAllProviders()
  return NextResponse.json(team)
}

// POST request
export async function POST(req: Request) {
  const newMember = await req.json()

  const team = await getAllProviders()
  if (team.find((member) => member.email === newMember.email)) {
    return NextResponse.json({ msg: 'Member with this email already exists' }, { status: 250 })
  }

  // Convert role to enum if provided
  let role: ProviderRole | undefined
  if (newMember.role && Object.values(ProviderRole).includes(newMember.role)) {
    role = newMember.role as ProviderRole
  }
  // Create Clerk user using Backend API
  const client = await clerkClient()
  const clerkUser = await client.users.createUser({
    emailAddress: [newMember.email],
    password: newMember.password,
    firstName: newMember.firstName,
    lastName: newMember.lastName,
  })
  // Build provider object safely
  const providerData = {
    firstName: newMember.firstName,
    lastName: newMember.lastName,
    email: newMember.email,
    imageurl: newMember.imageurl,
    bio: newMember.bio,
    role,         // ✅ enum-safe
    userId: newMember.userId, // optional
    clerkId: clerkUser.id, 
  }

  const data = await createProvider(providerData)
  console.log('Created Member:', data)
  return NextResponse.json(data, { status: 201 })
}

// PUT (update member)
export async function PUT(req: Request) {
  try {
    const body = await req.json()

    // Convert role to enum if provided
    let role: ProviderRole | undefined
    if (body.role && Object.values(ProviderRole).includes(body.role)) {
      role = body.role as ProviderRole
    }

    const updateData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      imageurl: body.imageurl,
      bio: body.bio,
      role,           // ✅ enum-safe
      // isAvailable, rating, totalReviews could also be updated here if needed
    }

    const updated = await updateProvider(body.id, updateData)

    if (!updated) {
      return NextResponse.json({ msg: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ msg: 'Error updating member' }, { status: 500 })
  }
}

// DELETE request
export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const deleted = await deleteProvider(body.id)

    if (!deleted) {
      return NextResponse.json({ msg: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(deleted, { status: 200 })
  } catch (error) {
    console.error('Error deleting member:', error)
    return NextResponse.json({ msg: 'Error deleting member' }, { status: 500 })
  }
}
