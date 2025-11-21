"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export interface DateRange {
  start: Date;
  end: Date;
  label: string;
  available: boolean;
  startTime?: string;
  endTime?: string;
}

interface CalendarProps {
  availableRanges?: DateRange[];
  onRangeSelect?: (range: DateRange | null) => void;
  selectedRange?: DateRange | null;
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({
  availableRanges = [],
  onRangeSelect,
  selectedRange,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const defaultAvailableRanges: DateRange[] = [
    {
      start: new Date(2025, 6, 6),
      end: new Date(2025, 6, 13),
      label: "Summer Workshop",
      available: true,
      startTime: "10:00 AM", // Durasi Waktu Ditambahkan
      endTime: "05:00 PM", // Durasi Waktu Ditambahkan
    },
    {
      start: new Date(2025, 6, 18),
      end: new Date(2025, 6, 26),
      label: "Rekaman Album Baru",
      available: true,
      startTime: "09:00 AM", // Durasi Waktu Ditambahkan
      endTime: "07:00 PM", // Durasi Waktu Ditambahkan
    },
    {
      start: new Date(2025, 6, 3), // Contoh event 1 hari
      end: new Date(2025, 6, 3),
      label: "Konser Amal",
      available: true,
      startTime: "08:00 PM",
      endTime: "10:00 PM",
    },
  ];

  const ranges =
    availableRanges.length > 0 ? availableRanges : defaultAvailableRanges;

  // Navigation functions
  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  // Calendar calculations
  const monthData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const startDate = new Date(firstDayOfMonth);
    startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return {
      year,
      month,
      firstDayOfMonth,
      days,
    };
  }, [currentDate]);

  // Check if a date is within any available range
  const getDateStatus = (date: Date) => {
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );

    for (const range of ranges) {
      const rangeStart = new Date(
        range.start.getFullYear(),
        range.start.getMonth(),
        range.start.getDate(),
      );
      const rangeEnd = new Date(
        range.end.getFullYear(),
        range.end.getMonth(),
        range.end.getDate(),
      );

      if (dateOnly >= rangeStart && dateOnly <= rangeEnd) {
        return {
          inRange: true,
          range,
          isStart: dateOnly.getTime() === rangeStart.getTime(),
          isEnd: dateOnly.getTime() === rangeEnd.getTime(),
        };
      }
    }

    return { inRange: false, range: null, isStart: false, isEnd: false };
  };

  // Check if a date is selected
  const isSelected = (date: Date) => {
    if (!selectedRange) return false;
    const dateOnly = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
    );
    const selectedStart = new Date(
      selectedRange.start.getFullYear(),
      selectedRange.start.getMonth(),
      selectedRange.start.getDate(),
    );
    const selectedEnd = new Date(
      selectedRange.end.getFullYear(),
      selectedRange.end.getMonth(),
      selectedRange.end.getDate(),
    );

    return dateOnly >= selectedStart && dateOnly <= selectedEnd;
  };

  // Handle date click
  const handleDateClick = (date: Date) => {
    const status = getDateStatus(date);
    if (status.inRange && status.range?.available) {
      onRangeSelect?.(status.range);
    }
  };

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  return (
    <div className="flex w-full flex-col gap-2 max-md:flex max-lg:grid max-lg:grid-cols-[2fr_1fr] lg:min-w-76">
      <div
        className={cn(
          "mx-auto w-full rounded-xl border border-[#ffffff59] p-6 shadow-lg",
          className,
        )}
      >
        {/* Header */}
        <div className="flex w-full cursor-default justify-between rounded-xl border border-[#ffffff59] bg-autumn-500 px-2 py-2 font-semibold text-base">
          <button className="cursor-pointer" onClick={goToPreviousMonth}>
            <ChevronLeft />
          </button>
          {monthNames[monthData.month]} {monthData.year}
          <button className="cursor-pointer" onClick={goToNextMonth}>
            <ChevronRight />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7">
          {dayNames.map((day) => (
            <div
              key={day}
              className="py-2 text-center font-bold text-base text-white"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-2">
          {monthData.days.map((date, index) => {
            const isCurrentMonth = date.getMonth() === monthData.month;
            const status = getDateStatus(date);
            const selected = isSelected(date);
            const isToday = new Date().toDateString() === date.toDateString();

            return (
              <button
                key={index}
                onClick={() => handleDateClick(date)}
                disabled={!status.inRange || !status.range?.available}
                className={cn(
                  "relative h-8 w-full text-center font-bold text-base transition-all duration-200",
                  {
                    "z-20 text-white": isCurrentMonth,
                    "z-20 text-neutral-900": !isCurrentMonth,

                    "after:absolute after:top-0 after:left-0 after:z-[-1] after:h-full after:w-full after:rounded-full after:bg-autumn-500 after:content-['']":
                      isToday && !selected,

                    // Range styling
                    "rounded-l-full border-autumn-500 border-y-2 border-l-2":
                      status.isStart && status.inRange,
                    "rounded-r-full border-autumn-500 border-y-2 border-r-2":
                      status.isEnd && status.inRange,
                    "border-autumn-500 border-y-2":
                      !status.isStart && status.inRange && !status.isEnd,

                    // Disabled styling
                    "": !status.inRange || !status.range?.available,
                    "cursor-pointer": status.inRange && status.range?.available,
                  },
                )}
              >
                {date.getDate()}
              </button>
            );
          })}
        </div>
      </div>

      <hr className="my-4" />

      <div className="flex w-full flex-col">
        <div className="scrollbar-hidden grow space-y-2 overflow-y-auto">
          {ranges.map((range, index) => (
            <div
              key={index}
              className="mx-auto flex w-full flex-col justify-center gap-2 rounded-lg border border-gray-600 bg-neutral-800 p-4 text-body-mobile shadow-lg lg:text-body"
            >
              <div className="flex flex-col items-start">
                {/* Event Label */}
                <p className="font-bold text-white">{range.label}</p>
                {/* Date Range */}
                <p className="bg-clip-text text-sm text-white">
                  {range.start.getDate() === range.end.getDate()
                    ? `${range.start.getDate()} ${monthNames[range.start.getMonth()]}`
                    : `${range.start.getDate()} - ${range.end.getDate()} ${monthNames[range.start.getMonth()]}`}
                </p>
              </div>

              {/* Durasi Waktu Ditampilkan */}
              {range.startTime && range.endTime && (
                <div className="flex justify-start text-gray-400 text-small">
                  {range.startTime} - {range.endTime}
                </div>
              )}
            </div>
          ))}
        </div>{" "}
        {/* </div> Penutup Wrapper Scroll */}
      </div>
    </div>
  );
};

export default Calendar;
