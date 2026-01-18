// src/app/api/operating-hours/route.ts

// ✅ Force the Edge runtime (required for D1)
// export const runtime = 'edge';

import { NextResponse } from 'next/server';
// import {
//   getAllOperatingHours,
//   createOrUpdateOperatingHour,
// } from '@/app/libs/Operations/Operations' // Note: This path uses 'Operations', not 'operatingHours'
import { getAllOperatingHours } from '@/app/libs/Operations/Operations';
import { createOrUpdateOperatingHour } from '@/app/libs/Operations/Operations';

// Define the expected shape of the request body for POST
interface CreateOrUpdateOperatingHourRequestBody {
  id:string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}


// ✅ GET (Read All)
export async function GET() {
  try {
    const data = await getAllOperatingHours()
    
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

// ✅ POST (Create or Update)
export async function POST(req: Request) {
  try {
    // Type cast the request body
    const body: CreateOrUpdateOperatingHourRequestBody = await req.json();
     const res= {...body,id:body.dayOfWeek.toString()}
    const record = await createOrUpdateOperatingHour({...res})
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}
