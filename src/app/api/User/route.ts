// src/app/api/User/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getUserByClerkId, createUser, updateUserByClerkId } from '@/app/libs/users/user';
import { getPrismaClient } from '@/app/libs/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { clerkId } = body;
    const prisma=getPrismaClient()
    if (!clerkId) {
      return NextResponse.json(
        { error: 'clerkId is required' },
        { status: 400 }
      );
    }

    // Find user by clerkId
    const user = await getUserByClerkId(prisma,clerkId);

    if (!user) {
      return NextResponse.json({
        email: '',
        firstName: '',
        lastName: '',
        phone: '',
        imageurl: '',
      });
    }

    return NextResponse.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone || '',
      imageurl: user.imageurl || '',
    });

  } catch (error: any) {
    console.error('Error in User API POST:', error);
    
    if (error.name === 'PrismaClientInitializationError') {
      return NextResponse.json(
        { error: 'Database connection failed. Please try again.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json() as any;
    const { clerkId, email, firstName, lastName, phone, imageurl } = body;
    const prisma=getPrismaClient()
    if (!clerkId || !email || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'clerkId, email, firstName, and lastName are required' },
        { status: 400 }
      );
    }

    // Find existing user
    const existingUser = await getUserByClerkId(prisma,clerkId);

    let user;

    if (existingUser) {
      // Update existing user
      user = await updateUserByClerkId(prisma,clerkId, {
        email,
        firstName,
        lastName,
        phone,
        imageurl,
      });
    } else {
      // Create new user
      user = await createUser(prisma,{
        clerkId,
        email,
        firstName,
        lastName,
        phone,
        imageurl,
        role: 'CLIENT',
      });
    }

    return NextResponse.json({
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      imageurl: user.imageurl,
    });

  } catch (error: any) {
    console.error('Error in User API PUT:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}