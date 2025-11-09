import { NextResponse } from "next/server"
import { createService, getAllServices, getServiceById, updateService, deleteService } from "@/app/libs/services/services"

// ✅ GET (Read All)
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
    const body = await req.json()
    const { name, description, duration, price, providers } = body

    if (!name ) {
      return NextResponse.json({ msg: "Missing required fields" }, { status: 400 })
    }

    const newService = await createService({ 
      name, 
      description, 
    })
    
    return NextResponse.json(newService, { status: 201 })
  } catch (error) {
    console.error("Error creating service:", error)
    return NextResponse.json({ msg: "Failed to create service" }, { status: 500 })
  }
}

// ✅ PUT (Update)
export async function PUT(
  req: Request
) {
  try {
    const body = await req.json()
    const { name, description, duration, price, providers ,id} = body

    const updatedService = await updateService(id, {
      name,
      providers // Make sure this is passed
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
    const body = await req.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ msg: "Service ID is required" }, { status: 400 })
    }

    const deletedService = await deleteService(id)
    return NextResponse.json(deletedService, { status: 200 })
  } catch (error) {
    console.error("Error deleting service:", error)
    return NextResponse.json({ msg: "Failed to delete service" }, { status: 500 })
  }
}
