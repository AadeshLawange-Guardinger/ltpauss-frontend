/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  format,
  addYears,
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";
import "../styles/Calendar.css"; // Import CSS file

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // State to track selected date
  const [yearRangeStart, setYearRangeStart] = useState(
    currentDate.getFullYear() - 11
  );

  const handlePrevYears = () => {
    setYearRangeStart(yearRangeStart - 12);
  };

  const handleNextYears = () => {
    setYearRangeStart(yearRangeStart + 12);
  };

  const handleMonthClick = (month) => {
    setCurrentDate(month);
  };

  const handleYearClick = (year) => {
    setCurrentDate(year);
  };

  const handleDateClick = (date) => {
    setSelectedDate(date); // Update selected date
    setCurrentDate(date);
    console.log(date)
  };

  const yearMonths = eachMonthOfInterval({
    start: new Date(currentDate.getFullYear(), 0, 1),
    end: new Date(currentDate.getFullYear(), 11, 31),
  });

  const yearRange = Array.from({ length: 12 }, (_, i) =>
    addYears(new Date(yearRangeStart, 0, 1), i)
  );

  const monthDates = eachDayOfInterval({
    start: startOfMonth(currentDate),
    end: endOfMonth(currentDate),
  });

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isCurrentYear = (date) => {
    return date.getFullYear() === currentDate.getFullYear();
  };

  return (
    <div className="calendar-container">
      <div className="calendar-card">
        <div className="header">
          <h1>{format(currentDate, "MMMM dd, yyyy")}</h1>
          <div className="range-box">
            <h4>{`${yearRangeStart}-${yearRangeStart + 11}`}</h4>
            <button onClick={handlePrevYears}>{"<"}</button>
            <button onClick={handleNextYears}>{">"}</button>
          </div>
        </div>
        <div className="card-container">
          <div className="dates-container">
            {monthDates.map((date, index) => (
              <div
                key={index}
                className={
                  isCurrentMonth(date)
                    ? selectedDate && date.getTime() === selectedDate.getTime()
                      ? "selected" // Apply selected class if date is selected
                      : "date"
                    : "date other-month"
                }
                onClick={() => handleDateClick(date)} // Handle date click
              >
                {format(date, "dd")}
              </div>
            ))}
          </div>
          <div className="years-container">
            {yearRange.map((year, index) => (
              <button
                key={index}
                onClick={() => handleYearClick(year)}
                className={
                  year.getFullYear() === currentDate.getFullYear()
                    ? "current-year"
                    : "year"
                }
              >
                {format(year, "yyyy")}
              </button>
            ))}
          </div>
          <div className="months-container">
            {yearMonths.map((month, index) => (
              <button
                key={index}
                onClick={() => handleMonthClick(month)}
                className={
                  format(month, "MMMM") === format(currentDate, "MMMM")
                    ? ""
                    : "month"
                }
              >
                {format(month, "MMMM")}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;
