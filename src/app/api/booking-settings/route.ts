import { NextResponse } from "next/server";
import {
  createBookingSettings,
  getBookingSettings,
  updateBookingSettings,
} from "@/app/libs/bookingSettings/BookingSettings";

export async function GET() {
  try {
    const settings = await getBookingSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch booking settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { id, providerIds, serviceId, defaultSessionDuration, defaultPrice } = body;

    if (!providerIds?.length || !serviceId) {
      return NextResponse.json({ error: "Missing providerIds or serviceId" }, { status: 400 });
    }

    let result;

    if (id) {
      result = await updateBookingSettings(id, {
        providerIds,
        serviceId,
        defaultSessionDuration,
        defaultPrice,
      });
    } else {
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
