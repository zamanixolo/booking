// app/api/booking/route.ts
// app/api/booking/route.ts
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

/* ---------------------- GET (READ BOOKINGS) ---------------------- */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const clientId = searchParams.get("clientId");
    const providerId = searchParams.get("providerId");
    
    let bookings: any[] = [];

    if (clientId) {
      const user = await getUserByClerkId(clientId);
      
      if (!user) {
        // Return empty array if user not found
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
    const data = await req.json() as any;

    let clientId = data.clientId;

    // If clientId is provided (Clerk userId), find the user in our database
    if (clientId) {
      const user = await getUserByClerkId(clientId);
      
      // If user doesn't exist in our database, set clientId to undefined
      if (!user) {
        console.warn(`User with clerkId ${clientId} not found in database`);
        clientId = undefined;
      } else {
        // Use the internal database ID, not the Clerk ID
        clientId = user.id;
      }
    }

    const newBooking = await createBooking({
      clientId: clientId, // Use the internal database user ID or undefined
      providerId: data.providerId,
      serviceId: data.serviceId,
      price: data.price,
      sessionDuration: data.sessionDuration,
      date: data.date, // Your createBooking already handles Date conversion
      time: data.time,
      specialRequests: data.specialRequests ?? "",
    });

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
  try {
    const data = await req.json() as any;
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Missing booking ID" },
        { status: 400 }
      );
    }

    const updatedBooking = await updateBooking(id, {
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