import { useState, useRef, useEffect } from "react";

interface DatePickerProps {
  label: string;
  date: string;
  onChange: (value: string) => void;
  minDate?: string;
  placeholder?: string;
  className?: string;
}

export default function DatePicker({
  label,
  date,
  onChange,
  minDate,
  placeholder = "Select date",
  className = "",
}: DatePickerProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const dateRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return placeholder;
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

  // Calendar generation functions
  const generateCalendar = () => {
    const today = new Date();
    const minDateObj = minDate ? new Date(minDate) : null;

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
        const isBeforeMin = minDateObj && cellDate < minDateObj;
        const isSelected = dateString === date;

        calendar.push({
          day: dayNumber,
          date: dateString,
          isToday,
          isPast,
          isBeforeMin,
          isSelected,
          isValid: !isPast && !isBeforeMin,
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

  const calendar = generateCalendar();
  return (
    <div className={`group relative ${className}`} ref={dateRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-900 mb-2 transition-all duration-300 group-hover:text-gray-700">
          {label}
        </label>
      )}
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
                  const minDateObj = minDate ? new Date(minDate) : null;

                  // Only set today if it's valid (not before minDate)
                  if (!minDateObj || today >= minDateObj) {
                    onChange(todayString);
                    goToToday();
                  }
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={Boolean(minDate && new Date() < new Date(minDate))}
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  const tomorrowString = tomorrow.toISOString().split("T")[0];
                  const minDateObj = minDate ? new Date(minDate) : null;

                  // Only set tomorrow if it's valid (not before minDate)
                  if (!minDateObj || tomorrow >= minDateObj) {
                    onChange(tomorrowString);
                    // Navigate to tomorrow's month if needed
                    setCurrentMonth(tomorrow.getMonth());
                    setCurrentYear(tomorrow.getFullYear());
                  }
                }}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                disabled={Boolean(
                  minDate && new Date(Date.now() + 86400000) < new Date(minDate)
                )}
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
                        onChange(cell.date);
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
  );
}
