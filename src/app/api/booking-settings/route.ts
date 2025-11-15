// app/api/booking-settings/route.ts

import { NextResponse } from "next/server";
import {
  createBookingSettings,
  getBookingSettings,
  updateBookingSettings,
} from "@/app/libs/bookingSettings/BookingSettings"; // Corrected import path
import { getPrismaClient } from '@/app/libs/prisma'; // 🎯 Import the D1 client getter


export async function GET() {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    // ✅ Pass 'prisma' as the first argument
    const settings = await getBookingSettings(prisma);
    return NextResponse.json(settings);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch booking settings" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const body = await req.json() as any;
    const { id, providerIds, serviceId, defaultSessionDuration, defaultPrice } = body;

    if (!providerIds?.length || !serviceId) {
      return NextResponse.json({ error: "Missing providerIds or serviceId" }, { status: 400 });
    }

    let result;

    if (id) {
      // ✅ Pass 'prisma' as the first argument
      result = await updateBookingSettings(prisma, id, {
        providerIds,
        serviceId,
        defaultSessionDuration,
        defaultPrice,
      });
    } else {
      // ✅ Pass 'prisma' as the first argument
      result = await createBookingSettings(prisma, {
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
