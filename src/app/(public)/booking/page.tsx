'use client'
import Calender from "@/app/components/(public)/booking/Clendar/Calender"
import Confirm from "@/app/components/(public)/booking/Comfirm/Confirm"
import Member from "@/app/components/(public)/booking/Member/Member"
import ServiceSelect from "@/app/components/(public)/booking/ServiceSelect/ServiceSelect"
import Summery from "@/app/components/(public)/booking/Summery/Summery"
import Time from "@/app/components/(public)/booking/Time/Time"
import normalizeProviderIds from "@/app/libs/normalizeProviderIds"
import { features } from "process"

import { useEffect, useState } from "react"
import React from 'react';

// Define the shape of a single operating hour record
interface OperatingHour {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
  // Add other properties if they exist in your API response
}

// Define the shape of a single booking setting record
interface BookingSetting {
  id: string;
  serviceId: string;
  providerIds: string[];           // always array
  defaultSessionDuration: number;
  defaultPrice: number;
  service: Service | null;
  providers: Provider[]; 
}

// Define the shape of the main booking data state
interface BookingData {
  dayOfWeek: number | null; // Changed to allow null initially
  serviceNum: number | null;
  date: string;
  time: string;
  firstName: string;
  lastName: string;
  price: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
}


interface Provider {
  id: string;
  firstName: string;
  lastName: string;
  bio: string;
  imageurl: string;
  rating: number;
  role: string;
  isAvailable: boolean;
}

// Define the type for the state update functions
type SetBookingData = React.Dispatch<React.SetStateAction<BookingData>>;
type SetView = React.Dispatch<React.SetStateAction<number>>;


const Page: React.FC = () => {
  const [bookingdata, setbookingdata] = useState<BookingData>({
    dayOfWeek: null,
    serviceNum: null,
    date: "",
    time: "",
    firstName: "",
    lastName: "",
    price: ""
  });
  
  // Typed states for API data
  const [daysactive, setDaysActive] = useState<OperatingHour[]>([]);
  const [bookingsetting, setBookingsetting] = useState<BookingSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [view, setview] = useState(0);
  const [timetaken,settimeTaken]=useState([])

  const getdateopening = async () => {
    // We can explicitly type the response using our interfaces
    const res = await fetch('/app/api/operating-hours');
    const data: OperatingHour[] = await res.json();
    const res2=await fetch('/app/api/bookingdates')
    const bookedData=await res2.json() as any
    settimeTaken(bookedData.data)
    setDaysActive(data);
  };

  const getbookingsettings = async () => {
    const res = await fetch('/app/api/booking-settings');
    const serviceRes=await fetch('/app/api/services')
    const providerRes=await fetch('/app/api/team')
  
    const data: BookingSetting[] = await res.json();
    const services: Service[] = await serviceRes.json();
    const providers: Provider[] = await providerRes.json() as any;
  /// 🔥 Enrich booking settings with full service + provider objects
  const enriched:any = data.map(b => {
    const matchedService = services.find(s => s.id === b.serviceId) || null;
    const providerIdArray = normalizeProviderIds(b.providerIds.toString())
    const matchedProviders =providers.filter(p => providerIdArray?.includes(p.id)) || []


    return {
      ...b,
      service: matchedService,
      provider: matchedProviders
    };
  });

  setBookingsetting(enriched);
    setIsLoading(false);
  };

  useEffect(() => {
    getdateopening();
    getbookingsettings();
  }, []);

  const viewstate = () => {
    // Ensure that the props passed to children match their expected types
    switch (view) {
      case 0:
        return <ServiceSelect
          select={setbookingdata as SetBookingData}
          viewNum={setview as SetView}
          data={bookingdata}
          bookingsetting={bookingsetting}
          viewselected={view}
        />;
      case 1:
        return <Member 
          select={setbookingdata as SetBookingData}
          data={bookingdata}
          viewNum={setview as SetView}
          bookingsetting={bookingsetting}
          viewselected={view}
        />;
      case 2:
        return <Calender 
          select={setbookingdata as SetBookingData}
          avaiableDate={daysactive}
          data={bookingdata}
          viewNum={setview as SetView}
          viewselected={view}
        />;

      case 3:
        return <Time 
          select={setbookingdata as SetBookingData}
          avaiableDate={daysactive}
          data={bookingdata}
          bookingsetting={bookingsetting}
          viewNum={setview as SetView}
          viewselected={view}
          timetaken={timetaken}
        />;

      case 4:
        return <Summery 
          viewNum={setview as SetView}
          data={bookingdata}
          bookingsetting={bookingsetting}
          viewselected={view}
        />;
      case 5:
        return <Confirm
          viewNum={setview as SetView}
          data={bookingdata}
          viewselected={view}
        />;
      default:
        return <ServiceSelect
          select={setbookingdata as SetBookingData}
          viewNum={setview as SetView}
          data={bookingdata}
          bookingsetting={bookingsetting}
          viewselected={view}
        />;
    }
  };

  if (isLoading) {
    return <div>... Loading</div>;
  }

  return (
    <div className="text-center">
      <h1>Book Time</h1>
      {viewstate()}
    </div>
  );
};

export default Page;
