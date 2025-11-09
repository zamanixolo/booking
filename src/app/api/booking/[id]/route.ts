<<<<<<< HEAD
import { NextResponse } from 'next/server';
import { getBookingById, updateBooking, deleteBooking } from '@/app/libs/booking/Booking';
=======
import { NextResponse, NextRequest } from 'next/server'
// Assuming these types/functions are defined in your application
import { getBookingById, updateBooking, deleteBooking } from '@/app/libs/booking/Booking'
>>>>>>> 892ad36 (Your commit message)

// Define the expected structure for the dynamic segment params
type RouteContext = {
  params: {
    id: string; // This corresponds to the [id] folder name
  };
};

// GET a single booking
export async function GET(
  request: Request,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await params
  try {
    const booking = await getBookingById(id);
=======
  context: RouteContext // Using unified context type
) {
  const { id } = context.params;

  try {
    const booking = await getBookingById(id)
>>>>>>> 892ad36 (Your commit message)
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json(booking);
  } catch (error) {
    console.error('Error fetching booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT (update) a booking
export async function PUT(
  request: Request,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await params
=======
  context: RouteContext // Using unified context type
) {
  const { id } = context.params;

>>>>>>> 892ad36 (Your commit message)
  try {
    const body = await request.json();

    const {
      status,
      price,
      sessionDuration,
      date,
      time,
      specialRequests,
      clientId,
      providerId,
      serviceId
    } = body;

<<<<<<< HEAD
    const updated = await updateBooking(id, {
=======
    const updated = await updateBooking(id, { // Use id from context.params
>>>>>>> 892ad36 (Your commit message)
      status,
      price,
      sessionDuration,
      date,
      time,
      specialRequests,
      ...(clientId && { clientId }),
      ...(providerId && { providerId }),
      ...(serviceId && { serviceId }),
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE a booking
export async function DELETE(
  request: Request,
<<<<<<< HEAD
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params; // ✅ Await params
  try {
    await deleteBooking(id);
    return NextResponse.json({ message: 'Booking deleted successfully' });
=======
  context: RouteContext // Using unified context type
) {
  const { id } = context.params;

  try {
    await deleteBooking(id) // Use id from context.params
    return NextResponse.json({ message: 'Booking deleted successfully' })
>>>>>>> 892ad36 (Your commit message)
  } catch (error) {
    console.error('Error deleting booking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

<<<<<<< HEAD
// PATCH a booking
export async function PATCH(req: Request) {
  try {
    const data = await req.json();
    const { id, ...updateData } = data;
    const { date, providerId, time } = updateData.updateData || {};

=======
// PATCH (partial update) a booking with validation
export async function PATCH(
  request: Request, 
  context: RouteContext // Using unified context type and accessing params
) {
  const id = context.params.id; // Get ID from URL params

  try {
    const data = await request.json();
    
    // --- START: Original PATCH logic adjustment ---
    // The original code was extracting 'id' from the body, but it's now in the URL (params.id).
    // The rest of the body is treated as the update data.
    const updateData = data;
    const{date,providerId,time}=updateData.updateData || {}; // Retaining nested access if updateData is wrapped
    
    // The ID check is redundant if the route is [id], but keep the error response structure
>>>>>>> 892ad36 (Your commit message)
    if (!id) {
      return NextResponse.json(
        { error: 'Booking ID is required' },
        { status: 400 }
      );
    }
    // --- END: Original PATCH logic adjustment ---

    const currentBooking = await getBookingById(id);

    if (!currentBooking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Validation Rules
    const validationErrors: string[] = [];

    // Rule 1: Cannot modify completed, cancelled, or no-show bookings
    const immutableStatuses = ['COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (immutableStatuses.includes(currentBooking.status)) {
      validationErrors.push(`Cannot modify ${currentBooking.status.toLowerCase()} bookings`);
    }

    // Rule 2: Cannot modify past bookings
    const bookingDate = new Date(currentBooking.date);
    const now = new Date();
    if (bookingDate < now) {
      validationErrors.push('Cannot modify past bookings');
    }

    // Rule 3: Status transition validation
    if (updateData.status) {
      const validTransitions: Record<string, string[]> = {
        PENDING: ['CONFIRMED', 'CANCELLED'],
        CONFIRMED: ['IN_PROGRESS', 'CANCELLED'],
        IN_PROGRESS: ['COMPLETED', 'CANCELLED'],
      };

      const allowedTransitions = validTransitions[currentBooking.status] || [];
      if (!allowedTransitions.includes(updateData.status)) {
        validationErrors.push(`Cannot change status from ${currentBooking.status} to ${updateData.status}`);
      }
    }

    // Rule 4: Cannot change to past date
    if (date) {
      const newDate = new Date(date);
      if (newDate < now) {
        validationErrors.push('Cannot change booking to a past date');
      }
    }

    // Rule 5: Cannot change provider or service after booking has started
    if (updateData.providerId && updateData.providerId !== currentBooking.providerId) {
      validationErrors.push('Cannot change provider for existing booking');
    }

    if (updateData.serviceId && updateData.serviceId !== currentBooking.serviceId) {
      validationErrors.push('Cannot change service for existing booking');
    }

    // Rule 6: Price validation for completed bookings
    if (updateData.price !== undefined && currentBooking.status === 'COMPLETED') {
      if (updateData.price < currentBooking.price) {
        validationErrors.push('Cannot reduce price for completed bookings');
      }
    }

    // If any validation errors, return them
    if (validationErrors.length > 0) {
      console.log(validationErrors);
      return NextResponse.json({ errors: validationErrors }, { status: 400 });
    }

    // All validations passed - update the booking
<<<<<<< HEAD
    const updatedBooking = await updateBooking(id, {
      status: currentBooking.status,
      price: currentBooking.price,
      sessionDuration: currentBooking.sessionDuration,
      date: date ? new Date(date) : currentBooking.date,
      time: time ?? currentBooking.time,
    });

=======
    const updatedBooking = await updateBooking(id, { // Use ID from params
      status: updateData.status ?? currentBooking.status, // Apply status update if present
      price: updateData.price ?? currentBooking.price,
      sessionDuration: updateData.sessionDuration ?? currentBooking.sessionDuration,
      date: date ? new Date(date) : currentBooking.date,
      time: time ? time : currentBooking.time,
      // FIX: Use 'as any' to bypass the type check until the type definition in '@/app/libs/booking/Booking' is updated
      clientId: updateData.clientId ?? currentBooking.clientId,
      providerId: updateData.providerId ?? currentBooking.providerId,
      serviceId: updateData.serviceId ?? currentBooking.serviceId,
    } as any); // <-- Applied 'as any' here
 
>>>>>>> 892ad36 (Your commit message)
    return NextResponse.json(updatedBooking, { status: 200 });
  } catch (error: any) {
    console.error('Error updating booking:', error);
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    );
  }
}
<<<<<<< HEAD


=======
>>>>>>> 892ad36 (Your commit message)
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