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
  category: string;
  department?: string;
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

  const getCategoryColor = (category: string) => {
    const colors = {
      ACADEMIC: "bg-blue-500",
      SPIRITUAL: "bg-purple-500",
      SOCIAL: "bg-green-500",
      STUDENT_ORG: "bg-yellow-500",
      SPORTS: "bg-orange-500",
      CULTURAL: "bg-pink-500",
    };
    return colors[category as keyof typeof colors] || "bg-gray-500";
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
      {" "}
      {/* Delightful calendar header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6 group">
        <button
          onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:-translate-x-1 p-2 touch-manipulation"
        >
          ←
        </button>
        <h2 className="text-lg sm:text-lg font-medium text-gray-900 transition-all duration-300 cursor-default group-hover:scale-105">
          {format(currentDate, "MMMM yyyy")}
        </h2>
        <button
          onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          className="text-lg text-gray-600 hover:text-gray-900 transition-all duration-300 hover:scale-110 hover:translate-x-1 p-2 touch-manipulation"
        >
          →
        </button>
      </div>{" "}
      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
          <div
            key={day}
            className="bg-gray-50 p-2 text-center text-xs sm:text-sm font-medium text-gray-700"
          >
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
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
                min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 bg-white cursor-pointer hover:bg-gray-50 transition-colors touch-manipulation
                ${isSelected ? "bg-gray-900 text-white" : ""}
                ${!isSameMonth(day, currentDate) ? "opacity-30" : ""}
              `}
            >
              <div
                className={`text-xs sm:text-sm font-medium mb-1 ${
                  isSelected ? "text-white" : "text-gray-900"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents
                  .slice(0, window.innerWidth < 640 ? 1 : 2)
                  .map((event) => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/events/${event.id}`;
                      }}
                      className={`text-xs px-1 py-0.5 rounded text-white cursor-pointer hover:opacity-80 transition-opacity ${
                        isSelected
                          ? "bg-white text-gray-900"
                          : event.priority === "EMERGENCY"
                          ? "bg-red-500"
                          : getCategoryColor(event.category)
                      }`}
                      title={`${event.title} - Click to view details`}
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
                <div
                  key={event.id}
                  className="border border-gray-200 p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => (window.location.href = `/events/${event.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-sm font-medium text-gray-900">
                        {event.title}
                      </h4>
                      <span
                        className={`text-xs px-2 py-1 rounded text-white ${getCategoryColor(
                          event.category
                        )}`}
                      >
                        {event.category.replace("_", " ")}
                      </span>
                    </div>
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
                  <div className="mt-2 text-xs text-blue-600 hover:text-blue-800">
                    Click to view details →
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
