//date and time issue
// export const runtime = 'edge';

import { NextResponse } from 'next/server';
import { 
  getBookingById, 
  updateBooking, 
  deleteBooking 
} from '@/app/libs/booking/Booking';
import { BookingStatus } from '@prisma/client';
import { getAllOperatingHours } from '@/app/libs/Operations/Operations';

// Define the expected shape of the request body for an update (PUT/PATCH)
interface BookingRequestBody {
  status?: BookingStatus | string;
  price?: number;
  sessionDuration?: number;
  date?: string;
  time?: string;
  specialRequests?: string;
  clientId?: string;
  providerId?: string;
  serviceId?: string;
}

// =======================
// ✅ GET (Read by ID)
// =======================
export async function GET(req: Request, context: any) {
  try {
    const { id } = await context.params;

    const booking = await getBookingById(id);
 
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// =======================
// ✅ PUT (Update)
// =======================
export async function PUT(req: Request, context: any) {
  try {
    const params = await context.params; 
    const id = params.id;
    const body: BookingRequestBody = await req.json();

    const updated = await updateBooking(id, {
      status: body.status as BookingStatus,
      price: body.price,
      sessionDuration: body.sessionDuration,
      date: body.date ? new Date(body.date).toString() : undefined,
      time: body.time,
      specialRequests: body.specialRequests,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// =======================
// ✅ DELETE
// =======================
export async function DELETE(req: Request, context: any) {
  try {
    const id = context.params.id;

    await deleteBooking(id);
    return NextResponse.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// =======================
// ✅ PATCH (Partial Update)
// =======================

    function timeToMinutes(t: string) {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
    }
export async function PATCH(req: Request) {
  try {
    const data: BookingRequestBody & { id: string } = await req.json();
    const { id, ...updateData } = data;
 
    if (!id) {
      return NextResponse.json(
        { error: "Booking ID is required" },
        { status: 400 }
      );
    }

    const currentBooking = await getBookingById(id);
    const operations= await getAllOperatingHours()
    if (!currentBooking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    const validationErrors: string[] = [];

    const immutableStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (immutableStatuses.includes(currentBooking.status)) {
      validationErrors.push(`Cannot modify ${currentBooking.status.toLowerCase()} bookings`);
    }

    const bookingDate = new Date(currentBooking.date);
    const now = new Date();

      const today = new Date();
      bookingDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
    if (bookingDate < now) {
      validationErrors.push("Cannot modify past bookings");
    }

    if (updateData.status) {
      const validTransitions: Record<string, string[]> = {
        'PENDING': ['CONFIRMED', 'CANCELLED'],
        'CONFIRMED': ['IN_PROGRESS', 'CANCELLED'],
        'IN_PROGRESS': ['COMPLETED', 'CANCELLED']
      };
      const allowedTransitions = validTransitions[currentBooking.status] || [];

      if (!allowedTransitions.includes(updateData.status)) {
        validationErrors.push(
          `Cannot change status from ${currentBooking.status} to ${updateData.status}`
        );
      }
    }

    if (updateData.date) {
      const newDate = new Date(updateData.date);
  
      const today = new Date();
      newDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (newDate < today) {
      validationErrors.push("Cannot change booking to a past date");
        }
      }

    if (updateData.serviceId && updateData.serviceId !== currentBooking.serviceId) {
      validationErrors.push("Cannot change service for existing booking");
    }

    if (updateData.price !== undefined && currentBooking.status === 'COMPLETED') {
      if (updateData.price < currentBooking.price) {
        validationErrors.push("Cannot reduce price for completed bookings");
      }
    }

// Validate required fields
if (!updateData.time) {
  validationErrors.push("Time is required");
} else if (!operations[0].startTime || !operations[0].endTime) {
  validationErrors.push("Operation hours missing");
} else {
  const updateTime = timeToMinutes(updateData.time);
  const startTime = timeToMinutes(operations[0].startTime);
  const endTime = timeToMinutes(operations[0].endTime);

  if (updateTime < startTime) {
    validationErrors.push("Cannot change booking earlier than operating hours");
  }

  if (updateTime > endTime) {
    validationErrors.push("Cannot change booking later than operating hours");
  }
}


    if (validationErrors.length > 0) {
      return NextResponse.json(
        { errors: validationErrors },
        { status: 400 }
      );
    }
// console.log(id)
    const updatedBooking = await updateBooking(id, {
      status: updateData.status ? (updateData.status as BookingStatus) : undefined,
      price: updateData.price,
      sessionDuration: updateData.sessionDuration,
      date: updateData.date ? new Date(updateData.date).toString() : undefined,
      time: updateData.time,
    });

    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error) {
    console.error("Error updating booking:", error);
    return NextResponse.json(
      { error: "Failed to update booking" },
      { status: 500 }
    );
  }
}



// Booking Update Validation Rules
// 1. Status-Based Restrictions
// ❌ COMPLETED bookings cannot be modified

// ❌ CANCELLED bookings cannot be modified

// ❌ NO_SHOW bookings cannot be modified

// 2. Time-Based Restrictions
// ❌ Past bookings (date has passed) cannot be modified

// ⚠️ Bookings within 24 hours of start time cannot be modified (except by admin)

// 3. Status Flow Rules
// ✅ PENDING → CONFIRMED, CANCELLED

// ✅ CONFIRMED → IN_PROGRESS, CANCELLED

// ✅ IN_PROGRESS → COMPLETED, CANCELLED

// ❌ Cannot go backwards in status (e.g., CONFIRMED → PENDING)

// 4. Date/Time Rules
// ❌ Cannot change to a past date

// ❌ Cannot change to a time that has already passed

// ⚠️ Rescheduling must be at least 2 hours in advance

// 5. Price Rules
// ❌ Cannot reduce price for COMPLETED bookings

// ✅ Can add discounts before service starts

// 6. Provider Rules
// ❌ Cannot change provider after booking has started

// ❌ Cannot change service type after booking has started