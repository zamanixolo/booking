// src/app/api/operating-hours/[id]/route.ts

// export const runtime = 'edge';

import { NextResponse,NextRequest } from 'next/server';
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


export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← params is Promise
): Promise<NextResponse> {
  try {
    const { id } = await params;  // ← Await the params
    
    const body: UpdateOperatingHourRequestBody = await request.json();
    
    const updated = await updateOperatingHour(id, body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// ✅ DELETE
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }  // ← Add Promise
) {
  try {
    const { id } = await params;  // ← Add await
    
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