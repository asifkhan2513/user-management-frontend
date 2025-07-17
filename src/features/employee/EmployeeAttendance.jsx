import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkIn, checkOut } from "../../store/attendanceSlice";
import { toast } from "react-toastify";

const getToday = () => new Date().toISOString().slice(0, 10);

const EmployeeAttendance = ({ userId }) => {
  const dispatch = useDispatch();
  const today = getToday();
  const attendance = useSelector((state) =>
    state.attendance.records.find(
      (r) => r.userId === userId && r.date === today
    )
  );
  const [method] = useState("manual"); 

  const handleCheckIn = () => {
    const now = new Date().toTimeString().slice(0, 5);
    dispatch(checkIn({ userId, date: today, time: now, method }));
    toast.success("Checked in successfully!");
  };

  const handleCheckOut = () => {
    const now = new Date().toTimeString().slice(0, 5);
    dispatch(checkOut({ userId, date: today, time: now }));
    toast.success("Checked out successfully!");
  };

  return (
    <div className="p-2 sm:p-4 bg-offwhite dark:bg-gray-800 rounded shadow w-full max-w-xs sm:max-w-md mx-auto mt-8">
      <h2 className="text-lg sm:text-xl font-bold mb-4">Daily Attendance</h2>
      <div className="mb-2">Date: {today}</div>
      <div className="mb-2">
        Status: {attendance ? attendance.status : "Not Marked"}
      </div>
      <div className="mb-2">Check-in: {attendance?.checkInTime || "--:--"}</div>
      <div className="mb-2">
        Check-out: {attendance?.checkOutTime || "--:--"}
      </div>
      <div className="mb-2">
        Working Hours: {attendance?.workingHours?.toFixed(2) || "0.00"}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 mt-4">
        <button
          className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50 w-full sm:w-auto hover:bg-green-700 transition-colors duration-200"
          onClick={handleCheckIn}
          disabled={!!attendance?.checkInTime}
        >
          Check In
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50 w-full sm:w-auto hover:bg-orange-500 transition-colors duration-200"
          onClick={handleCheckOut}
          disabled={!attendance?.checkInTime || !!attendance?.checkOutTime}
        >
          Check Out
        </button>
      </div>
    </div>
  );
};

export default EmployeeAttendance;
