// src/app/api/providers/route.ts

// ✅ Force the Node.js runtime because you use clerkClient() and original Prisma client
// export const runtime = 'nodejs';
// export const runtime = 'edge';
import { createProvider, deleteProvider, getAllProviders, updateProvider } from '@/app/libs/providers/providers'
import { NextResponse } from 'next/server'
import { ProviderRole } from '@prisma/client' // ✅ import enum
import { clerkClient } from '@clerk/nextjs/server' // Requires Node.js

// Define the expected shape for request bodies to fix 'unknown' type errors
interface ProviderRequestBody {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    password?: string;
    imageurl?: string;
    bio?: string;
    role?: string; 
    userId?: string;
    isAvailable:boolean;
    updatedAt :string;
}


// GET request: Route Handlers for GET are now uncached by default in Next 15.
export async function GET() {
  const team = await getAllProviders() // This must be Node.js compatible
  
  return NextResponse.json(team)
}

// POST request: Automatically dynamic, uncached by default.
export async function POST(req: Request) {
  const body: ProviderRequestBody = await req.json() // Use the interface

  const team = await getAllProviders() // This must be Node.js compatible
  if (team.find((member) => member.email === body.email)) {
    // Status 409 (Conflict) is better than 250
    return NextResponse.json({ msg: 'Member with this email already exists' }, { status: 409 })
  }

  // Convert role to enum if provided
  let role: ProviderRole | undefined
  if (body.role && Object.values(ProviderRole).includes(body.role as ProviderRole)) {
    role = body.role as ProviderRole
  }

 // Create Clerk user using Backend API
  const client = await clerkClient() 

  // Now 'client' is a resolved ClerkClient object, and you can safely access 'users'
  const clerkUser = await client.users.createUser({
    emailAddress: [body.email],
    password: body.password,
    firstName: body.firstName,
    lastName: body.lastName,
  })

  // Build provider object safely
  const providerData = {
    id:clerkUser.id.replace(/user/gi, ''),
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    imageurl: body.imageurl,
    bio: body.bio,
    role,         // ✅ enum-safe
    userId: body.userId, // optional
    clerkId: clerkUser.id, 
    updatedAt :new  Date().toString()
  }

  const data = await createProvider(providerData) // This must be Node.js compatible
  
  return NextResponse.json(data, { status: 201 })
}

// PUT (update member): Automatically dynamic, uncached by default.
export async function PUT(req: Request) {
  try {
    const body: ProviderRequestBody = await req.json() // Use the interface

    // Convert role to enum if provided
    let role: ProviderRole | undefined
    if (body.role && Object.values(ProviderRole).includes(body.role as ProviderRole)) {
      role = body.role as ProviderRole
    }

    const updateData = {
      
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      imageurl: body.imageurl,
      bio: body.bio,
      isAvailable:body.isAvailable,
      role,           // ✅ enum-safe
      // isAvailable, rating, totalReviews could also be updated here if needed
    }

    const updated = await updateProvider(body.id!, updateData) // This must be Node.js compatible

    if (!updated) {
      return NextResponse.json({ msg: 'Member not found' }, { status: 404 })
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    console.error('Error updating member:', error)
    return NextResponse.json({ msg: 'Error updating member' }, { status: 500 })
  }
}

// DELETE request: Automatically dynamic, uncached by default.
export async function DELETE(req: Request) {
  try {
    const body: { id: string } = await req.json();
    try {
      await deleteProvider(body.id);
      return NextResponse.json({ msg: 'Deleted' }, { status: 200 });
    } catch (err) {
      return NextResponse.json({ msg: 'Provider not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error deleting provider:', error);
    return NextResponse.json({ msg: 'Error deleting provider' }, { status: 500 });
  }
}

