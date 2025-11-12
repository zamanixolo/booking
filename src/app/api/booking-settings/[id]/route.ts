import { NextResponse } from 'next/server';
import { updateBookingSettings, deleteBookingSettings } from '@/app/libs/bookingSettings/BookingSettings';

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> } // ✅ params is now a Promise
) {
  const { id } = await params; // ✅ await the params
  try {
    const body = await req.json() as any;
    const settings = await updateBookingSettings(id, body);
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
  }
}
