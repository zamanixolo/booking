// app/api/booking/route.ts

import { NextResponse } from 'next/server';
import { 
  createBooking, 
  getAllBookings, 
  getBookingsByClient, 
  getBookingsByProvider, 
  updateBooking, 
  deleteBooking,
} from '@/app/libs/booking/Booking';
import { getUserByClerkId } from '@/app/libs/users/user'; // Corrected import path
import { getPrismaClient } from '@/app/libs/prisma';


/* ---------------------- GET (READ BOOKINGS) ---------------------- */
export async function GET(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const providerId = searchParams.get("providerId");
    
    let bookings: any[] = [];

    if (clientId) {
      // ✅ Pass 'prisma' as the first argument
      const user = await getUserByClerkId(prisma, clientId);
      
      if (!user) {
        bookings = [];
      } else {
        // ✅ Pass 'prisma' as the first argument
        bookings = await getBookingsByClient(prisma, user.id);
      }
    } else if (providerId) {
      // ✅ Pass 'prisma' as the first argument
      bookings = await getBookingsByProvider(prisma, providerId);
    } else {
      // ✅ Pass 'prisma' as the first argument
      bookings = await getAllBookings(prisma);
    }

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 }
    );
  }
}

/* ---------------------- POST (CREATE BOOKING) ---------------------- */
export async function POST(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const data = await req.json() as any;
    let finalClientId: string | undefined = data.clientId;

    if (finalClientId) {
      // ✅ Pass 'prisma' as the first argument
      const user = await getUserByClerkId(prisma, finalClientId);
      
      if (!user) {
        console.warn(`User with clerkId ${finalClientId} not found in database`);
        finalClientId = undefined;
      } else {
        finalClientId = user.id;
      }
    }

    // 🎯 FIX: Use 'as any' on the input object to bypass the type conflict
    const newBooking = await createBooking(prisma, {
      clientId: finalClientId || null, 
      providerId: data.providerId,
      serviceId: data.serviceId,
      price: data.price,
      sessionDuration: data.sessionDuration,
      date: new Date(data.date), 
      time: data.time,
      specialRequests: data.specialRequests ?? "",
    } as any); // <--- Type assertion applied here

    return NextResponse.json(newBooking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);

    if (error.code) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}

/* ---------------------- PATCH (UPDATE BOOKING) ---------------------- */
export async function PATCH(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const data = await req.json() as any;
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    // ✅ Pass 'prisma' as the first argument to updateBooking
    const updatedBooking = await updateBooking(prisma, id, {
      status: updateData.status,
      price: updateData.price,
      sessionDuration: updateData.sessionDuration,
      date: updateData.date,
      time: updateData.time,
      specialRequests: updateData.specialRequests,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}

/* ---------------------- DELETE (DELETE BOOKING) ---------------------- */
export async function DELETE(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    // ✅ Pass 'prisma' as the first argument to deleteBooking
    const deleted = await deleteBooking(prisma, id);
    return NextResponse.json(deleted, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
