'use client'
interface Props {
    select:(val: any) => void
    viewNum:(val:any)=>void
    viewselected:number
    data:any
    avaiableDate: { startTime: string; endTime: string }[];
    bookingsetting:any
  }
function Time({select,viewNum,viewselected,data,avaiableDate,bookingsetting}:Props) {
 
  const startTime = avaiableDate[data.dayOfWeek]?.startTime||'09:00';
  const endTime = avaiableDate[data.dayOfWeek]?.endTime||'17:00';
  const intervalMinutes = bookingsetting[data.serviceNum].defaultSessionDuration||60; // interval between slots

  function generateTimeSlots(start: string, end: string, interval: number) {
    const slots: string[] = [];
  
    let [startHour, startMinute] = start.split(":").map(Number);
    let [endHour, endMinute] = end.split(":").map(Number);
  
    let current = new Date();
    current.setHours(startHour, startMinute, 0, 0);
  
    const endDate = new Date();
    endDate.setHours(endHour, endMinute, 0, 0);
  
    while (current <= endDate) {
      const hour = current.getHours().toString().padStart(2, "0");
      const minute = current.getMinutes().toString().padStart(2, "0");
      slots.push(`${hour}:${minute}`);
      current.setMinutes(current.getMinutes() + interval);
    }
  
    return slots;
  }
  
  const timeSlots = generateTimeSlots(startTime, endTime, intervalMinutes);

  return (
    <div>
        <h2>Time</h2>
              <div className="grid grid-cols-3 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot}
            onClick={() => select({ ...data, time: slot })}
            className={`px-4 py-2 rounded-lg border 
              ${
                data.time === slot
                  ? 'bg-blue-500 text-white border-blue-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
          >
            {slot}
          </button>
        ))}
      </div>
        <br/>
        <button onClick={()=>{viewNum(viewselected-1)}}>prev</button>
        <button onClick={()=>{viewNum(viewselected+1)}} disabled={data.time=== ""}>next</button>
    </div>
  )
}

export default Time