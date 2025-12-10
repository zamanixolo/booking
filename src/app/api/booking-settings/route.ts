// src/app/api/booking-settings/route.ts

// ✅ Force the Edge runtime (required for D1)
// export const runtime = 'edge';

import { NextResponse } from "next/server";
import {
  createBookingSettings,
  getBookingSettings,
  updateBookingSettings,
} from "@/app/libs/bookingSettings/BookingSettings";

// Define the expected shape of the request body for POST
interface BookingSettingsRequestBody {
  id?: string;
  providerIds: string[];
  serviceId: string;
  defaultSessionDuration: number;
  defaultPrice: number;
}


// ✅ GET (Read Settings)
export async function GET() {

  try {
    const settings = await getBookingSettings();
  
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch booking settings" }, { status: 500 });
  }
}

// ✅ POST (Create or Update Settings)
export async function POST(req: Request) {
  try {
    // Type cast the request body
    const body: BookingSettingsRequestBody = await req.json();
    const { id, providerIds, serviceId, defaultSessionDuration, defaultPrice } = body;

    if (!providerIds?.length || !serviceId) {
      return NextResponse.json({ error: "Missing providerIds or serviceId" }, { status: 400 });
    }

    let result;

    if (id) {
      // Logic for updating settings
      result = await updateBookingSettings(id, {
        providerIds,
        serviceId,
        defaultSessionDuration,
        defaultPrice,
      });
    } else {
      // Logic for creating new settings
      result = await createBookingSettings({
        providerIds,
        serviceId,
        defaultSessionDuration,
        defaultPrice,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to save booking settings" }, { status: 500 });
  }
}
