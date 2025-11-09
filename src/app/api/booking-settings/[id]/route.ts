import { NextResponse, NextRequest } from 'next/server';
// Assuming these are functions interacting with your database/logic layer
import { updateBookingSettings, deleteBookingSettings } from '@/app/libs/bookingSettings/BookingSettings';

// Define the expected structure for the dynamic segment params
type RouteContext = {
  params: {
    id: string; // This corresponds to the [id] folder name
  };
};

/**
 * @description Handles PUT requests to update a specific booking setting.
 * @param request The incoming request object. Using NextRequest allows access to Next.js specific features.
 * @param context The context object containing dynamic route parameters (params).
 * @returns A NextResponse containing the updated settings or an error message.
 */
export async function PUT(
<<<<<<< HEAD
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is now a Promise
) {
  const { id } = await params; // ✅ await the params
  try {
    const body = await req.json();
    const settings = await updateBookingSettings(id, body);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
=======
  request: NextRequest, // Using NextRequest is often preferred over generic Request
  context: RouteContext // Using the defined type ensures consistency
) {
  // Destructuring for easier access, though 'context' is already typed above.
  const { params } = context; 

  try {
    // 1. Get the request body
    const body = await request.json();

    // 2. Update the settings using the ID from the route params and the body
    // NOTE: Ensure 'updateBookingSettings' is handling potential null/undefined returns gracefully.
    const settings = await updateBookingSettings(params.id, body);

    // 3. Return the updated settings with a 200 OK response
    return NextResponse.json(settings, { status: 200 });

  } catch (error) {
    console.error('Error updating booking settings:', error);
    // Return a 500 Internal Server Error
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
>>>>>>> 892ad36 (Your commit message)
  }
}

/**
 * @description Handles DELETE requests to remove a specific booking setting.
 * @param request The incoming request object (not used here, but needed for signature).
 * @param context The context object containing dynamic route parameters (params).
 * @returns A NextResponse with a success message or an error message.
 */
export async function DELETE(
<<<<<<< HEAD
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ same here
) {
  const { id } = await params; // ✅ await the params
  try {
    await deleteBookingSettings(id);
    return NextResponse.json({ message: 'Settings deleted' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete settings' },
      { status: 500 }
    );
=======
  request: NextRequest, 
  context: RouteContext 
) {
  // Destructuring for easier access
  const { params } = context;

  try {
    // 1. Delete the settings using the ID from the route params
    await deleteBookingSettings(params.id);

    // 2. Return a 200 OK response
    return NextResponse.json({ message: `Settings with ID ${params.id} deleted successfully` }, { status: 200 });
  } catch (error) {
    console.error('Error deleting booking settings:', error);
    // Return a 500 Internal Server Error
    return NextResponse.json({ error: 'Failed to delete settings' }, { status: 500 });
>>>>>>> 892ad36 (Your commit message)
  }
}
