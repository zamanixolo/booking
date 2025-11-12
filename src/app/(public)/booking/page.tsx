'use client'
import Calender from "@/app/components/(public)/booking/Clendar/Calender"
import Confirm from "@/app/components/(public)/booking/Comfirm/Confirm"
import Member from "@/app/components/(public)/booking/Member/Member"
import ServiceSelect from "@/app/components/(public)/booking/ServiceSelect/ServiceSelect"
import Summery from "@/app/components/(public)/booking/Summery/Summery"
import Time from "@/app/components/(public)/booking/Time/Time"

import { useEffect, useState } from "react"

function Page() {
  const [bookingdata,setbookingdata]=useState({
    dayOfWeek:1,
    serviceNum:null,
    date:"",
    time:"",
    firstName:"",
    lastName:"",
    price:""
  })
  const [daysactive,setDaysActive]=useState([]as any)
  const [bookingsetting,setBookingsetting]=useState([] as any)
  const [isLoading,setIsLoading]=useState(true)
  const getdateopening =async () => {
    const res = await fetch('/api/operating-hours')
    const data=await res.json()
    setDaysActive(data)
  }
  const getbookingsettings =async () => {
    const res = await fetch('/api/booking-settings')
    const data=await res.json()
    setBookingsetting(data)
   
    setIsLoading(false)
  }
  useEffect(()=>{
    getdateopening()
    getbookingsettings()
    
  },[])
  const [view,setview]=useState(0)
  const viewstate = () => {
    switch (view) {
      case 0:return<ServiceSelect
      select={setbookingdata}
      viewNum={setview}
      data={bookingdata}
      bookingsetting={bookingsetting}
      viewselected={view}
      />
      case 1:
        return <Member 
        select={setbookingdata}
        data={bookingdata}
        viewNum={setview}
        bookingsetting={bookingsetting}
        viewselected={view}/>
      case 2:
        return <Calender 
        select={setbookingdata}
        avaiableDate={daysactive}
        data={bookingdata}
        viewNum={setview}
        viewselected={view}
        />

      case 3:
        return <Time 
        select={setbookingdata}
        avaiableDate={daysactive}
        data={bookingdata}
        bookingsetting={bookingsetting}
        viewNum={setview}
        viewselected={view}/>

      case 4:
        return <Summery 
        viewNum={setview}
        data={bookingdata}
        bookingsetting={bookingsetting}
        viewselected={view}/>
      case 5:
        return <Confirm
        viewNum={setview}
        data={bookingdata}
        viewselected={view}/>
      default:
        return <ServiceSelect
        select={setbookingdata}
        viewNum={setview}
        data={bookingdata}
        bookingsetting={bookingsetting}
        viewselected={view}
        /> // fallback
    }
  }
  if(isLoading){
    return <div>... Loading</div>
  }
  return (
    <div className="text-center">
      <h1>Book Time</h1>
      {viewstate()}
    </div>
  )
}

export default Page