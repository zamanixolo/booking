import { getBookingById, updateBooking } from "@/app/libs/booking/Booking";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;   // ✅ await params
    const formData = await _req.formData(); // ✅ NOT json()
    const body = Object.fromEntries(formData.entries());
    console.log(body);

    const booking = await getBookingById(id); // ✅ await async call
    const bookingdata={...booking,status:'CONFIRMED'}
    const res=updateBooking(id,bookingdata)
    console.log(res);

    return NextResponse.json(
      { msg: "yes", },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { msg: "error" },
      { status: 400 }
    );
  }
}
