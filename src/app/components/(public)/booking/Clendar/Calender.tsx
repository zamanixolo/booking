import { useState } from "react";

interface Props {
  select: (val: any) => void;
  viewNum: (val: any) => void;
  viewselected: number;
  data: any;
  avaiableDate: { dayOfWeek: number; isActive: boolean ; startTime: string;
  endTime: string; }[];
}

function Calendar({ select, viewNum, viewselected, data, avaiableDate }: Props) {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Get active day indexes (0–6)
  const activeDays = avaiableDate
    ?.filter((d) => d.isActive)
    .map((d) => d.dayOfWeek) ?? [];

  // Helper: is a given date active?
  const isDayActive = (year: number, month: number, day: number) => {
    const dow = new Date(year, month, day).getDay();
    return activeDays.includes(dow);
  };

  return (
    <div className="w-[90%] mx-auto my-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Prev
        </button>
        <h2 className="text-lg font-semibold">
          {new Date(currentYear, currentMonth).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 text-center border-b font-semibold">
        {weekdays.map((day) => (
          <div key={day} className="p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0">
        {/* Empty placeholders before 1st */}
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[5em]" />
        ))}

        {daysOfMonth.map((d) => {
          const date = new Date(currentYear, currentMonth, d);
          const dow = date.getDay();
          const isActive = isDayActive(currentYear, currentMonth, d);
          const isToday =
            d === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear();

          const selectedDate = `${currentYear}-${currentMonth + 1}-${d}`;
          const isSelected = data?.date === selectedDate;

          return (
            <div
              key={d}
              className={`min-h-[5em] p-2 border text-right box-border ${
                isActive
                  ? "cursor-pointer hover:bg-gray-200"
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              } ${isToday ? "text-red-500 font-bold" : ""} ${
                isSelected ? "bg-gray-400 font-bold" : ""
              }`}
              onClick={() => isActive && select({ ...data, date: selectedDate,dayOfWeek:dow })}
            >
              {d}
            </div>
          );
        })}
      </div>

      <br />
      <button
          onClick={() => viewNum(viewselected - 1)}
          className="">
          Prev
        </button>
      <button onClick={() => viewNum(viewselected + 1)} 
      disabled={data.date === ""}>next</button>
    </div>
  );
}

export default Calendar;