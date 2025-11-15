// src/app/api/services/route.ts

import { NextResponse } from "next/server"
import { 
  createService, 
  getAllServices, 
  getServiceById, 
  updateService, 
  deleteService 
} from "@/app/libs/services/services" // Corrected import path/filename
import { getPrismaClient } from '@/app/libs/prisma'; // 🎯 Import the D1 client getter


// ✅ GET (Read All/Single by ID via searchParams)
export async function GET(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  try {
    if (id) {
      // ✅ Pass 'prisma' as the first argument
      const service = await getServiceById(prisma, id);
      if (!service) {
        return NextResponse.json({ msg: "Service not found" }, { status: 404 });
      }
      return NextResponse.json(service, { status: 200 });
    }

    // ✅ Pass 'prisma' as the first argument
    const services = await getAllServices(prisma);
    
    return NextResponse.json(services, { status: 200 });
  } catch (error) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ msg: "Failed to fetch services" }, { status: 500 });
  }
}

// ✅ POST (Create)
export async function POST(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const body = await req.json() as any;
    const { name, description } = body; // Destructure fields used for creation

    if (!name ) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 });
    }

    // ✅ Pass 'prisma' as the first argument
    const newService = await createService(prisma, { 
      name, 
      description, 
    });
    
    return NextResponse.json(newService, { status: 201 });
  } catch (error) {
    console.error("Error creating service:", error);
    return NextResponse.json({ msg: "Failed to create service" }, { status: 500 });
  }
}

// ✅ PUT (Update)
export async function PUT(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const body = await req.json() as any;
    // Assuming 'id' is in the body for a generic PUT/PATCH route
    const { id, name, providers } = body; 

    if (!id) {
       return NextResponse.json({ msg: "Service ID is required for update" }, { status: 400 });
    }

    // ✅ Pass 'prisma' as the first argument
    const updatedService = await updateService(prisma, id, {
      name,
      providers // Make sure this is passed
    });

    return NextResponse.json(updatedService);
  } catch (error) {
    console.error("Error updating service:", error);
    return NextResponse.json({ msg: "Failed to update service" }, { status: 500 });
  }
}

// ✅ DELETE (Soft delete)
export async function DELETE(req: Request) {
  // ✅ Instantiate Prisma inside the handler
  const prisma = getPrismaClient();

  try {
    const body = await req.json() as any;
    const { id } = body;

    if (!id) {
      return NextResponse.json({ msg: "Service ID is required" }, { status: 400 });
    }

    // ✅ Pass 'prisma' as the first argument
    const deletedService = await deleteService(prisma, id);
    return NextResponse.json(deletedService, { status: 200 });
  } catch (error) {
    console.error("Error deleting service:", error);
    return NextResponse.json({ msg: "Failed to delete service" }, { status: 500 });
  }
}
