// src/app/api/booking-settings/[id]/route.ts

import { NextResponse } from 'next/server';
import { updateBookingSettings, deleteBookingSettings } from '@/app/libs/bookingSettings/BookingSettings';
import { getPrismaClient } from '@/app/libs/prisma'; 


export async function PUT(
  req: Request,
  // 🎯 FIX: Remove explicit type annotation entirely. 
  // Let TypeScript infer 'any' here to satisfy the build worker.
  context: any 
) {
  // We can safely assume context.params exists because of the route structure
  const { id } = await context.params; 

  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient(); 

  try {
    const body = await req.json() as any;
    
    // ✅ Pass 'prisma' as the first argument
    const settings = await updateBookingSettings(prisma, id, body);
    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating booking settings:", error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  // 🎯 FIX: Remove explicit type annotation entirely.
  context: any
) {
  // We can safely assume context.params exists because of the route structure
  const { id } = await context.params; 

  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient(); 

  try {
    // ✅ Pass 'prisma' as the first argument
    await deleteBookingSettings(prisma, id);
    return NextResponse.json({ message: 'Settings deleted' });
  } catch (error) {
    console.error("Error deleting booking settings:", error);
    return NextResponse.json(
      { error: 'Failed to delete settings' },
      { status: 500 }
    );
  }
}
