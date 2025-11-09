import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import {
  getOperatingHourById,
  updateOperatingHour,
  deleteOperatingHour,
} from '@/app/libs/Operations/Operations'

// ✅ Get a record by ID
export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 must be a Promise now
) {
  try {
    const { id } = await context.params
    const record = await getOperatingHourById(id)
    if (!record)
      return NextResponse.json({ error: 'Record not found' }, { status: 404 })

    return NextResponse.json(record)
  } catch (error) {
    console.error('GET error:', error)
    return NextResponse.json({ error: 'Failed to fetch record' }, { status: 500 })
  }
}

// ✅ Update a record by ID
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const body = await req.json()
    const updatedRecord = await updateOperatingHour(id, body)
    return NextResponse.json(updatedRecord)
  } catch (error) {
    console.error('PUT error:', error)
    return NextResponse.json({ error: 'Failed to update record' }, { status: 500 })
  }
}

// ✅ Delete a record by ID
export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    await deleteOperatingHour(id)
    return NextResponse.json({ message: 'Record deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Failed to delete record' }, { status: 500 })
  }
}

// import { updateOperatingHoursBulk } from '@/app/libs/Operations/Operations';

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { updates } = body;

//     if (!updates || !Array.isArray(updates)) {
//       return NextResponse.json(
//         { error: 'updates array is required' },
//         { status: 400 }
//       );
//     }

//     const result = await updateOperatingHoursBulk(updates);
//     return NextResponse.json(result);
//   } catch (error) {
//     console.error('Error bulk updating operating hours:', error);
//     return NextResponse.json(
//       { error: 'Failed to update operating hours' },
//       { status: 500 }
//     );
//   }
// }