import { createProvider, deleteProvider, getAllProviders, updateProvider } from '@/app/libs/providers/providers'
import { NextResponse } from 'next/server'
import { ProviderRole } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'

// Define the Provider input type (for type-safety)
interface ProviderInput {
  id?: string
  firstName: string
  lastName: string
  email: string
  password?: string
  imageurl?: string
  bio?: string
  role?: ProviderRole
  userId?: string
}

// ✅ GET request
export async function GET() {
  const team = await getAllProviders()
  return NextResponse.json(team)
}

// ✅ POST request
export async function POST(req: Request) {
  try {
    const newMember: ProviderInput = await req.json()

    const team = await getAllProviders()
    if (team.some((member) => member.email === newMember.email)) {
      return NextResponse.json({ msg: 'Member with this email already exists' }, { status: 400 })
    }

    // Convert role to enum safely
    let role: ProviderRole | undefined
    if (newMember.role && Object.values(ProviderRole).includes(newMember.role)) {
      role = newMember.role
    }

    // ✅ Create Clerk user (no await clerkClient())
    const client = await clerkClient()
    const clerkUser = await client.users.createUser({
    emailAddress: [newMember.email],
    password: newMember.password,
    firstName: newMember.firstName,
    lastName: newMember.lastName,
    })
    // Build provider data
    const providerData = {
      firstName: newMember.firstName,
      lastName: newMember.lastName,
      email: newMember.email,
      imageurl: newMember.imageurl,
      bio: newMember.bio,
      role,
      userId: newMember.userId,
      clerkId: clerkUser.id,
    }

    const data = await createProvider(providerData)
    console.log('✅ Created Member:', data)
    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error('❌ Error creating member:', error)
    return NextResponse.json({ msg: 'Failed to create member' }, { status: 500 })
  }
}

// ✅ PUT (update member)
export async function PUT(req: Request) {
  try {
    const body: ProviderInput = await req.json()

    let role: ProviderRole | undefined
    if (body.role && Object.values(ProviderRole).includes(body.role)) {
      role = body.role
    }

    const updateData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      imageurl: body.imageurl,
      bio: body.bio,
      role,
    }

    if (!body.id) {
      return NextResponse.json({ msg: 'Missing provider ID' }, { status: 400 })
    }

    const updated = await updateProvider(body.id, updateData)

    if (!updated) {
      return NextResponse.json({ msg: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('❌ Error updating member:', error)
    return NextResponse.json({ msg: 'Error updating member' }, { status: 500 })
  }
}

// ✅ DELETE request
export async function DELETE(req: Request) {
  try {
    const body = (await req.json()) as { id: string }

    if (!body.id) {
      return NextResponse.json({ msg: 'Missing provider ID' }, { status: 400 })
    }

    const deleted = await deleteProvider(body.id)

    if (!deleted) {
      return NextResponse.json({ msg: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(deleted, { status: 200 })
  } catch (error) {
    console.error('❌ Error deleting member:', error)
    return NextResponse.json({ msg: 'Error deleting member' }, { status: 500 })
  }
}
