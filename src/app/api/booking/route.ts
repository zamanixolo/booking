// app/api/booking/route.ts

// ✅ Add this line to force the Edge runtime (required for D1)
// export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { 
  createBooking, 
  getAllBookings, 
  getBookingsByClient, 
  getBookingsByProvider, 
  updateBooking, 
  deleteBooking 
} from '@/app/libs/booking/Booking';
import { getUserByClerkId } from '@/app/libs/users/user';
import { BookingStatus } from '@prisma/client'; // Import the enum


// Define expected shapes for request bodies
interface CreateBookingRequestBody {
  clientId?: string;
  providerId: string;
  serviceId: string;
  price: number;
  sessionDuration: number;
  date: string; // Date string from frontend
  time: string;
  specialRequests?: string;
}

interface UpdateBookingRequestBody {
  id?: string; // ID is expected in the PATCH body for this route's logic
  status?: BookingStatus | string;
  price?: number;
  sessionDuration?: number;
  date?: string; 
  time?: string;
  specialRequests?: string;
}


/* ---------------------- GET (READ BOOKINGS) ---------------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const providerId = searchParams.get("providerId");
    
    let bookings: any[] = [];

    if (clientId) {
      // getUserByClerkId is now Edge-compatible via D1 adapter
      const user = await getUserByClerkId(clientId);
      
      if (!user) {
        bookings = [];
      } else {
        bookings = await getBookingsByClient(user.id);
       
      }
    } else if (providerId) {
      bookings = await getBookingsByProvider(providerId);
    } else {
      bookings = await getAllBookings();
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
  try {
    // Type cast the request body
    const data: CreateBookingRequestBody = await req.json();
    let clientId = data.clientId;

    // If clientId is provided (Clerk userId), find the user in our database
    if (clientId) {
      const user = await getUserByClerkId(clientId);
      
      if (!user) {
        console.warn(`User with clerkId ${clientId} not found in database`);
        // If user not found, you might want to throw an error or handle accordingly
        // For now, we set it to undefined so Prisma handles the relationship correctly
        clientId = undefined; 
      } else {
        clientId = user.id; // Use the internal database ID
      }
    }

    const newBooking = await createBooking({
      clientId: clientId,
      providerId: data.providerId,
      serviceId: data.serviceId,
      price: data.price,
      sessionDuration: data.sessionDuration,
      // Convert the string date to a Date object here
      date: new Date(data.date),
      time: data.time,
      specialRequests: data.specialRequests ?? "",
    });

    return NextResponse.json({...newBooking,status:201});
  } catch (error: any) {
    console.error("Error creating booking:", error);
    if (error.code) {
      // Prisma errors often have a 'code' property
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
  try {
    // Type cast the request body
    const data: UpdateBookingRequestBody = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const updatedBooking = await updateBooking(id, {
      status: updateData.status ? (updateData.status as BookingStatus) : undefined, // Cast to enum/pass undefined
      price: updateData.price,
      sessionDuration: updateData.sessionDuration,
      date: updateData.date ? new Date(updateData.date).toISOString() : undefined, // Convert string to Date
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
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const deleted = await deleteBooking(id);
    return NextResponse.json(deleted, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting booking:", error);
    return NextResponse.json(
      { error: "Failed to delete booking" },
      { status: 500 }
    );
  }
}
