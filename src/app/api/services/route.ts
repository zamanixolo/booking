// src/app/api/services/route.ts

// ✅ Force the Edge runtime (required for D1)
// export const runtime = 'edge';

import { NextResponse } from "next/server"
import { createService, getAllServices, getServiceById, updateService, deleteService } from "@/app/libs/services/services"

// Define the expected shapes for request bodies
interface CreateServiceRequestBody {
  name: string;
  description?: string;
  providers?: string[]; 
}

interface UpdateServiceRequestBody {
  id: string;
  name?: string;
  description?: string;
  duration?: number;
  price?: number;
  isActive?: boolean;
  providers?: string[]; 
}


// ✅ GET (Read All or by ID)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")

  try {
    if (id) {
      const service = await getServiceById(id)
      if (!service) {
        return NextResponse.json({ msg: "Service not found" }, { status: 404 })
      }
      
      return NextResponse.json(service, { status: 200 })
    }

    const services = await getAllServices()
 
    return NextResponse.json(services, { status: 200 })
  } catch (error) {
    console.error("Error fetching services:", error)
    return NextResponse.json({ msg: "Failed to fetch services" }, { status: 500 })
  }
}

// ✅ POST (Create)
export async function POST(req: Request) {
  try {
    // Type cast the request body
    const body: CreateServiceRequestBody = await req.json();
    const { name, description } = body;

    if (!name ) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 })
    }

    const newService = await createService({ 
      id:`${name}-${Math.floor(Math.random() * 1000000)}`,
      name, 
      description, 
      updatedAt:new Date().toString()
    })
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ msg: "Failed to create service" }, { status: 500 })
  }
}

// ✅ PUT (Update)
export async function PUT(req: Request) {
  try {
    // Type cast the request body
    const body: UpdateServiceRequestBody = await req.json();
    const { name,id } = body;

    const updatedService = await updateService(id, {
      name,
      // providers // Make sure this is passed
    })

    return NextResponse.json(updatedService)
  } catch (error) {
    console.error("Error updating service:", error)
    return NextResponse.json({ msg: "Failed to update service" }, { status: 500 })
  }
}

// ✅ DELETE (Soft delete)
export async function DELETE(req: Request) {
  try {
    // Type cast the request body
    const body: { serviceId: string } = await req.json();

    if (!body) {
      return NextResponse.json({ msg: "Service ID is required" }, { status: 400 })
    }

    const deletedService = await deleteService(body.toString())
    return NextResponse.json( { status: 200 })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ msg: "Failed to delete service" }, { status: 500 })
  }
}
