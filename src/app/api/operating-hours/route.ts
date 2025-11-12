import { NextResponse } from 'next/server';
import {
  getAllOperatingHours,
  createOrUpdateOperatingHour,
} from '@/app/libs/Operations/Operations'

export async function GET() {
  try {
    const data = await getAllOperatingHours()
    return NextResponse.json(data)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json() as any;
    const record = await createOrUpdateOperatingHour(body)
    return NextResponse.json(record, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Failed to create' }, { status: 500 })
  }
}

// import { 
//   createOperatingHours, 
//   getOperatingHoursByProvider,
//   updateOperatingHours,
//   deleteOperatingHours 
// } from '@/app/libs/Operations/Operations';

// GET - Get operating hours by provider
// export async function GET(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const providerId = searchParams.get('providerId');

//     if (!providerId) {
//       return NextResponse.json(
//         { error: 'providerId is required' },
//         { status: 400 }
//       );
//     }

//     const operatingHours = await getOperatingHoursByProvider(providerId);
//     return NextResponse.json(operatingHours);
//   } catch (error) {
//     console.error('Error fetching operating hours:', error);
//     return NextResponse.json(
//       { error: 'Failed to fetch operating hours' },
//       { status: 500 }
//     );
//   }
// }

// // POST - Create new operating hours
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
    
//     // Validate required fields
//     const { providerId, dayOfWeek, startTime, endTime } = body;
    
//     if (!providerId || dayOfWeek === undefined || !startTime || !endTime) {
//       return NextResponse.json(
//         { error: 'providerId, dayOfWeek, startTime, and endTime are required' },
//         { status: 400 }
//       );
//     }

//     // Validate dayOfWeek range
//     if (dayOfWeek < 0 || dayOfWeek > 6) {
//       return NextResponse.json(
//         { error: 'dayOfWeek must be between 0 (Sunday) and 6 (Saturday)' },
//         { status: 400 }
//       );
//     }

//     // Validate time format (basic validation)
//     const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//     if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
//       return NextResponse.json(
//         { error: 'startTime and endTime must be in HH:MM format' },
//         { status: 400 }
//       );
//     }

//     const operatingHours = await createOperatingHours({
//       // providerId,
//       dayOfWeek: parseInt(dayOfWeek),
//       startTime,
//       endTime
//     });

//     return NextResponse.json(operatingHours, { status: 201 });
//   } catch (error: any) {
//     console.error('Error creating operating hours:', error);
    
//     if (error.code === 'P2002') {
//       return NextResponse.json(
//         { error: 'Operating hours for this provider and day already exist' },
//         { status: 409 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to create operating hours' },
//       { status: 500 }
//     );
//   }
// }

// // PUT - Update operating hours
// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { id, startTime, endTime, isActive } = body;

//     if (!id) {
//       return NextResponse.json(
//         { error: 'id is required' },
//         { status: 400 }
//       );
//     }

//     const updateData: any = {};
//     if (startTime) {
//       const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//       if (!timeRegex.test(startTime)) {
//         return NextResponse.json(
//           { error: 'startTime must be in HH:MM format' },
//           { status: 400 }
//         );
//       }
//       updateData.startTime = startTime;
//     }

//     if (endTime) {
//       const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
//       if (!timeRegex.test(endTime)) {
//         return NextResponse.json(
//           { error: 'endTime must be in HH:MM format' },
//           { status: 400 }
//         );
//       }
//       updateData.endTime = endTime;
//     }

//     if (isActive !== undefined) {
//       updateData.isActive = isActive;
//     }

//     const updatedHours = await updateOperatingHours(id, updateData);
//     return NextResponse.json(updatedHours);
//   } catch (error: any) {
//     console.error('Error updating operating hours:', error);
    
//     if (error.code === 'P2025') {
//       return NextResponse.json(
//         { error: 'Operating hours not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to update operating hours' },
//       { status: 500 }
//     );
//   }
// }

// // DELETE - Delete operating hours
// export async function DELETE(req: Request) {
//   try {
//     const { searchParams } = new URL(req.url);
//     const id = searchParams.get('id');

//     if (!id) {
//       return NextResponse.json(
//         { error: 'id is required' },
//         { status: 400 }
//       );
//     }

//     await deleteOperatingHours(id);
//     return NextResponse.json({ message: 'Operating hours deleted successfully' });
//   } catch (error: any) {
//     console.error('Error deleting operating hours:', error);
    
//     if (error.code === 'P2025') {
//       return NextResponse.json(
//         { error: 'Operating hours not found' },
//         { status: 404 }
//       );
//     }
    
//     return NextResponse.json(
//       { error: 'Failed to delete operating hours' },
//       { status: 500 }
//     );
//   }
// }