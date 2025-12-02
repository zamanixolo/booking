// src/app/api/operating-hours/[id]/route.ts

// export const runtime = 'edge';

import { NextResponse } from 'next/server';
import {
  getOperatingHourById,
  updateOperatingHour,
  deleteOperatingHour,
} from '@/app/libs/Operations/Operations';

interface UpdateOperatingHourRequestBody {
  dayOfWeek?: number;
  startTime?: string;
  endTime?: string;
  isActive?: boolean;
}
interface DeleteParams {
  id: string;
}
// ✅ GET
export async function GET(_req: Request, context: any) {
  try {
    const id = context.params.id;
    const record = await getOperatingHourById(id);

    if (!record) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

// ✅ PUT
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    
    const body: UpdateOperatingHourRequestBody = await req.json();

    const updated = await updateOperatingHour(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(
  _req: Request,
  { params }: { params: DeleteParams }
) {
  try {
    const { id } = params;

    console.log("Deleting operating hour:", id);

    await deleteOperatingHour(id);

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
