import { getUpcomingConfirmedBookings } from "@/app/libs/booking/Booking";
import { NextResponse } from "next/server";
export async function GET(){
    const res:any=await getUpcomingConfirmedBookings()
    const data=res.map((e:any)=>{return{time:e.time,date:e.date}})
    return NextResponse.json({data})
}