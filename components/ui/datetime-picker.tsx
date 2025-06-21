import { useState, useRef, useEffect } from "react";

interface DateTimePickerProps {
  date: string;
  startTime: string;
  endTime: string;
  onChange: (field: "date" | "startTime" | "endTime", value: string) => void;
}

export default function DateTimePicker({
  date,
  startTime,
  endTime,
  onChange,
}: DateTimePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const dateRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<HTMLDivElement>(null);
  const endTimeRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
      if (
        startTimeRef.current &&
        !startTimeRef.current.contains(event.target as Node)
      ) {
        setShowStartTimePicker(false);
      }
      if (
        endTimeRef.current &&
        !endTimeRef.current.contains(event.target as Node)
      ) {
        setShowEndTimePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate time options (15-minute intervals)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = formatTime(timeString);
        times.push({ value: timeString, display: displayTime });
      }
    }
    return times;
  };

  const formatTime = (time: string) => {
    if (!time) return "";
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };
  const formatDate = (dateString: string) => {
    if (!dateString) return "Select date";
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();

    if (isToday) return "Today";
    if (isTomorrow) return "Tomorrow";

    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  // Generate date options (next 30 days)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateString = currentDate.toISOString().split("T")[0];

      let displayDate;
      if (i === 0) displayDate = "Today";
      else if (i === 1) displayDate = "Tomorrow";
      else {
        displayDate = currentDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      dates.push({ value: dateString, display: displayDate });
    }
    return dates;
  };
  // Calendar generation functions
  const generateCalendar = () => {
    const today = new Date();

    // Get first day of the month and number of days
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday

    // Generate calendar grid
    const calendar = [];
    const totalCells = Math.ceil((daysInMonth + startingDayOfWeek) / 7) * 7;

    for (let i = 0; i < totalCells; i++) {
      const dayNumber = i - startingDayOfWeek + 1;

      if (dayNumber > 0 && dayNumber <= daysInMonth) {
        const cellDate = new Date(currentYear, currentMonth, dayNumber);
        const dateString = cellDate.toISOString().split("T")[0];
        const isToday = cellDate.toDateString() === today.toDateString();
        const isPast = cellDate < today;
        const isSelected = dateString === date;

        calendar.push({
          day: dayNumber,
          date: dateString,
          isToday,
          isPast,
          isSelected,
          isValid: !isPast,
        });
      } else {
        calendar.push(null); // Empty cell
      }
    }

    return calendar;
  };

  const getMonthName = () => {
    const monthDate = new Date(currentYear, currentMonth);
    return monthDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };
  const timeOptions = generateTimeOptions();
  const calendar = generateCalendar();

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Date Picker */}
      <div className="group relative" ref={dateRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
          Date
        </label>
        <button
          type="button"
          onClick={() => setShowDatePicker(!showDatePicker)}
          className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105 text-left bg-white flex items-center justify-between"
        >
          <span className={date ? "text-gray-900" : "text-gray-500"}>
            {formatDate(date)}
          </span>
          <span className="text-gray-400">📅</span>
        </button>
        {showDatePicker && (
          <div className="absolute z-50 top-full mt-1 w-80 bg-white border border-gray-200 rounded-md shadow-lg p-4">
            {/* Calendar header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => navigateMonth("prev")}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Previous month"
                >
                  <span className="text-gray-600">←</span>
                </button>
                <h3 className="font-medium text-gray-900 min-w-0 text-center">
                  {getMonthName()}
                </h3>
                <button
                  type="button"
                  onClick={() => navigateMonth("next")}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Next month"
                >
                  <span className="text-gray-600">→</span>
                </button>
              </div>
              <div className="flex space-x-1">
                <button
                  type="button"
                  onClick={() => {
                    const today = new Date();
                    const todayString = today.toISOString().split("T")[0];
                    onChange("date", todayString);
                    goToToday();
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Today
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const tomorrowString = tomorrow.toISOString().split("T")[0];
                    onChange("date", tomorrowString);
                    // Navigate to tomorrow's month if needed
                    setCurrentMonth(tomorrow.getMonth());
                    setCurrentYear(tomorrow.getFullYear());
                  }}
                  className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                >
                  Tomorrow
                </button>
              </div>
            </div>

            {/* Calendar weekday headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendar.map((cell, index) => (
                <div key={index} className="aspect-square">
                  {cell ? (
                    <button
                      type="button"
                      onClick={() => {
                        if (cell.isValid) {
                          onChange("date", cell.date);
                          setShowDatePicker(false);
                        }
                      }}
                      disabled={!cell.isValid}
                      className={`w-full h-full text-sm rounded transition-all duration-200 ${
                        cell.isSelected
                          ? "bg-gray-900 text-white font-medium"
                          : cell.isToday
                          ? "bg-blue-100 text-blue-900 font-medium hover:bg-blue-200"
                          : cell.isValid
                          ? "hover:bg-gray-100 text-gray-900"
                          : "text-gray-300 cursor-not-allowed"
                      }`}
                    >
                      {cell.day}
                    </button>
                  ) : (
                    <div className="w-full h-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Quick actions */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="w-full text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Start Time Picker */}
      <div className="group relative" ref={startTimeRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
          Start Time
        </label>
        <button
          type="button"
          onClick={() => setShowStartTimePicker(!showStartTimePicker)}
          className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105 text-left bg-white flex items-center justify-between"
        >
          <span className={startTime ? "text-gray-900" : "text-gray-500"}>
            {startTime ? formatTime(startTime) : "Select time"}
          </span>
          <span className="text-gray-400">🕐</span>
        </button>
        {showStartTimePicker && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {/* Popular times */}
            <div className="border-b border-gray-100 bg-gray-50 px-3 py-2">
              <div className="text-xs text-gray-500 mb-1">Popular times</div>
              <div className="flex flex-wrap gap-1">
                {["09:00", "10:00", "14:00", "15:00", "18:00", "19:00"].map(
                  (time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => {
                        onChange("startTime", time);
                        setShowStartTimePicker(false);
                      }}
                      className="text-xs px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-100 transition-colors"
                    >
                      {formatTime(time)}
                    </button>
                  )
                )}
              </div>
            </div>
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange("startTime", option.value);
                  setShowStartTimePicker(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  startTime === option.value ? "bg-gray-100 font-medium" : ""
                }`}
              >
                {option.display}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* End Time Picker */}
      <div className="group relative" ref={endTimeRef}>
        <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
          End Time
        </label>
        <button
          type="button"
          onClick={() => setShowEndTimePicker(!showEndTimePicker)}
          className="w-full px-3 py-2 border border-gray-200 focus:border-gray-900 focus:outline-none transition-all duration-300 hover:border-gray-400 focus:scale-105 text-left bg-white flex items-center justify-between"
        >
          <span className={endTime ? "text-gray-900" : "text-gray-500"}>
            {endTime ? formatTime(endTime) : "Select time"}
          </span>
          <span className="text-gray-400">🕐</span>
        </button>

        {showEndTimePicker && (
          <div className="absolute z-50 top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {timeOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange("endTime", option.value);
                  setShowEndTimePicker(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                  endTime === option.value ? "bg-gray-100 font-medium" : ""
                } ${
                  startTime && option.value <= startTime
                    ? "text-gray-400 cursor-not-allowed"
                    : ""
                }`}
                disabled={Boolean(startTime && option.value <= startTime)}
              >
                {option.display}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
