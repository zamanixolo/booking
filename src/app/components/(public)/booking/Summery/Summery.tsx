'use client'
import { useAuth } from '@clerk/nextjs';

interface Props {
  viewNum: (val: any) => void;
  viewselected: number
  data: any;
  bookingsetting:any;
}

function Summery({ viewNum, viewselected, data ,bookingsetting}: Props) {
  const { isSignedIn, userId } = useAuth();

  const handlesubmit = async () => {
    // Check if user is signed in
    if (!isSignedIn) {
      alert('Please sign in to complete your booking.');
      return;
    }

    // Get providers for the selected service
    const providerData = Array.isArray(bookingsetting[data.serviceNum]?.providers)
      ? bookingsetting[data.serviceNum].providers
      : [bookingsetting[data.serviceNum]?.providers].filter(Boolean);
  
    // Find the provider matching the selected firstName
    const selectedProvider = providerData.find(
      (p: any) => p.firstName === data.firstName
    );
  
    if (!selectedProvider) {
      alert('Provider not found!');
      return;
    }
  
    const bookinginfo = {
      clientId: userId, // Use Clerk userId instead of null
      providerId: selectedProvider.id, // must be string
      serviceId: bookingsetting[data.serviceNum].serviceId, // connect by id
      price: bookingsetting[data.serviceNum].defaultPrice,
      sessionDuration: bookingsetting[data.serviceNum].defaultSessionDuration,
      time: data.time,
      date: data.date,
      specialRequests: "",
    };
  
    try {
      const createbooking = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookinginfo),
      });
  
      const res = await createbooking.json();
      
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };
  return (
    <div className="w-[90%] mx-auto">
      
      <h2 className="text-xl font-semibold mb-4">Summary</h2>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <tbody>
          {data.date && (
            <tr className="border-b">
              <td className="p-2 font-semibold">Date</td>
              <td className="p-2">{data.date}</td>
            </tr>
          )}
          {data.time && (
            <tr className="border-b">
              <td className="p-2 font-semibold">Time</td>
              <td className="p-2">{data.time}</td>
            </tr>
          )}
          {data.firstName && (
            <tr className="border-b">
              <td className="p-2 font-semibold">Member</td>
              <td className="p-2">{data.firstName} {data.lastName}</td>
            </tr>
          )}
          {bookingsetting[0].defaultPrice && (
            <tr>
              <td className="p-2 font-semibold">Price</td>
              <td className="p-2">R{bookingsetting[data.serviceNum].defaultPrice}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="flex ">
        <button
          onClick={() => viewNum(viewselected - 1)}
          className=""
        >
          Prev
        </button>
        <button
        onClick={handlesubmit}
        >
          comfirm
        </button>
      </div>
    </div>
  );
}

export default Summery;