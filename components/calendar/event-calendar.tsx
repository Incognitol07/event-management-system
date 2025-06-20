"use client";

import { useState, useEffect } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";

type Event = {
  id: number;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  venue: { name: string; capacity: number };
  capacity: number;
  priority: "LOW" | "NORMAL" | "HIGH" | "EMERGENCY";
  isApproved: boolean;
  createdBy: { name: string; role: string };
};

export default function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/events?month=${format(currentDate, "yyyy-MM")}`
      );
      if (response.ok) {
        const data = await response.json();
        setEvents(
          data.map((event: any) => ({
            ...event,
            date: new Date(event.date),
          }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEventsForDate = (date: Date) => {
    return events.filter(
      (event) => isSameDay(event.date, date) && event.isApproved
    );
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  return (
    <div className="bg-white">
      {/* Delightful calendar header */}
      <div className="flex items-center justify-between mb-6 group">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:-translate-x-1"
        >
          ←
        </button>
        <h2 className="text-lg font-medium text-gray-900 transition-all duration-300 cursor-default group-hover:scale-105">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:translate-x-1"
        >
          →
        </button>
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-xs font-medium text-gray-700"
          >
            {day}
          </div>
        ))}

        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDate(day);
          const isSelected = selectedDate && isSameDay(day, selectedDate);

          return (
            <div
              key={day.toISOString()}
              onClick={() => setSelectedDate(day)}
              className={`
                min-h-[80px] p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors
                ${isSelected ? "bg-gray-900 text-white" : ""}
                ${!isSameMonth(day, currentDate) ? "opacity-30" : ""}
              `}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isSelected ? "text-white" : "text-gray-900"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs px-1 py-0.5 rounded ${
                      isSelected
                        ? "bg-white text-gray-900"
                        : event.priority === "EMERGENCY"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {event.title.length > 10
                      ? `${event.title.slice(0, 10)}...`
                      : event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div
                    className={`text-xs ${
                      isSelected ? "text-white" : "text-gray-500"
                    }`}
                  >
                    +{dayEvents.length - 2}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <h3 className="text-base font-medium text-gray-900 mb-4">
            {format(selectedDate, "MMMM d, yyyy")}
          </h3>
          {selectedDateEvents.length === 0 ? (
            <p className="text-sm text-gray-600">No events scheduled</p>
          ) : (
            <div className="space-y-3">
              {selectedDateEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-900">
                      {event.title}
                    </h4>
                    {event.priority === "EMERGENCY" && (
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        Emergency
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    <div>
                      <span className="font-medium">Time:</span>{" "}
                      {event.startTime} – {event.endTime}
                    </div>
                    <div>
                      <span className="font-medium">Venue:</span>{" "}
                      {event.venue.name}
                    </div>
                    <div>
                      <span className="font-medium">Capacity:</span>{" "}
                      {event.capacity}
                    </div>
                    <div>
                      <span className="font-medium">By:</span>{" "}
                      {event.createdBy.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
