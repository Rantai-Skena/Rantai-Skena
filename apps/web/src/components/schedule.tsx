import Calendar from "./calendar";
import { Card } from "./ui/card";

interface ScheduleProps {
  variant?: "agent" | "artist";
}

export default function Schedule({ variant = "artist" }: ScheduleProps) {
  const hours = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
  ];

  const schedules = [
    {
      start: new Date(2025, 6, 6),
      end: new Date(2025, 6, 13),
      label: "Summer Workshop",
      available: true,
      startTime: "10:00 AM",
      endTime: "05:00 PM",
    },
    {
      start: new Date(2025, 6, 18),
      end: new Date(2025, 6, 26),
      label: "Rekaman Album Baru",
      available: true,
      startTime: "09:00 AM",
      endTime: "07:00 PM",
    },
    {
      start: new Date(2025, 6, 3),
      end: new Date(2025, 6, 3),
      label: "Konser Amal",
      available: true,
      startTime: "08:00 PM",
      endTime: "10:00 PM",
    },
  ];

  return (
    <div className="flex w-full gap-10">
      <div className="flex h-[500px] w-170 flex-col p-6">
        <h3 className="mb-4 font-semibold text-h6 text-white">
          Today Performance
        </h3>
        <div className="scrollbar-hidden flex grow flex-col gap-10 overflow-y-auto pr-2">
          {hours.map((hour) => (
            <div key={hour} className="flex items-center">
              <span className="w-12 shrink-0 text-left font-medium text-gray-400 text-sm">
                {hour}.00
              </span>
              <div className="ml-4 h-0 grow border-gray-600 border-b" />
            </div>
          ))}
        </div>
      </div>
      <div>
        <Calendar availableRanges={schedules} variant={variant} />
      </div>
    </div>
  );
}
