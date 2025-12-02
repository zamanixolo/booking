// src/app/api/booking-settings/[id]/route.ts

// Force the Edge runtime (required for D1)
// export const runtime = 'edge';

import { NextResponse } from 'next/server';
import {
  updateBookingSettings,
  deleteBookingSettings
} from '@/app/libs/bookingSettings/BookingSettings';

// Shape for your data (this part is fine)
interface UpdateBookingSettingsRequestBody {
  providerIds?: string[];
  serviceId?: string;
  defaultSessionDuration?: number;
  defaultPrice?: number;
}

// =======================
// ✅ PUT — Update by ID
// =======================
export async function PUT(req: Request, context: any) {
  try {
    const id = context.params.id;

    const body: UpdateBookingSettingsRequestBody = await req.json();

    const settings = await updateBookingSettings(id, body);

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error in PUT /api/booking-settings/[id]:", error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}

// =======================
// ✅ DELETE — Delete by ID
// =======================
export async function DELETE(req: Request, context: any) {
  try {
    const id = context.params.id;

    await deleteBookingSettings(id);

    return NextResponse.json({ message: 'Settings deleted' });
  } catch (error) {
    console.error("Error in DELETE /api/booking-settings/[id]:", error);
    return NextResponse.json(
      { error: 'Failed to delete settings' },
      { status: 500 }
    );
  }
}
