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

export async function POST(req: Request) {
  try {
    const body: ProviderRequestBody = await req.json();

    // 1️⃣ Check if email already exists in Providers table
    const team = await getAllProviders();
    if (team.find((member) => member.email === body.email)) {
      return NextResponse.json(
        { msg: 'Provider with this email already exists' },
        { status: 409 }
      );
    }

    // 2️⃣ Convert role to enum if provided
    let role: ProviderRole | undefined;
    if (body.role && Object.values(ProviderRole).includes(body.role as ProviderRole)) {
      role = body.role as ProviderRole;
    }

    // 3️⃣ Create Clerk user
    const client = await clerkClient();
    const clerkUser = await client.users.createUser({
      emailAddress: [body.email],
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
    });

    // 4️⃣ Build provider object
    const providerData = {
      id: clerkUser.id.replace(/user/gi, ''), // your internal ID
      clerkId: clerkUser.id,
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      imageurl: body.imageurl,
      bio: body.bio,
      role,
      isAvailable: body.isAvailable ?? true,
      updatedAt: new Date().toISOString(),
    };

    // 5️⃣ Create provider in your database
    const data = await createProvider(providerData);

    return NextResponse.json(data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating provider:', error);

    // Handle unique constraint errors more gracefully
    if (error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json(
        { msg: 'Email already exists in the database' },
        { status: 409 }
      );
    }

    return NextResponse.json({ msg: 'Internal server error' }, { status: 500 });
  }
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

