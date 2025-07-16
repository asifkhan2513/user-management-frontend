import React, { useContext, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AuthContext } from "../../context/AuthContext";
import { EmployeeAttendance } from "./index";
import { applyLeave } from "../../store/leaveSlice";
import { toast } from "react-toastify";

const EmployeeProfile = () => {
  const { user } = useContext(AuthContext);
  const employees = useSelector((state) => state.users.employees);
  const profile = employees.find((e) => e.email === user.email) || user;
  const dispatch = useDispatch();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveType, setLeaveType] = useState("sick");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const leaveRequests = useSelector((state) => state.leave.leaveRequests);
  const holidays = useSelector((state) => state.attendance.holidays);

  // Salary logic
  const baseSalary = profile.salary || 30000;
  // Get all approved leaves for this month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const approvedLeaves = leaveRequests.filter(
    (req) =>
      req.userId === (profile.id || profile.email) &&
      req.status === "Approved" &&
      new Date(req.startDate).getMonth() === currentMonth &&
      new Date(req.startDate).getFullYear() === currentYear
  );
  // Calculate leave days and half-days (only up to today, skip holidays)
  let totalLeaveDays = 0;
  let totalHalfDays = 0;
  approvedLeaves.forEach((req) => {
    let start = new Date(req.startDate);
    let end = new Date(req.endDate);
    // Only consider days up to today
    if (end > today) end = today;
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().slice(0, 10);
      if (holidays.includes(dateStr)) continue; // skip holidays
      if (req.type === "half-day") totalHalfDays += 1;
      else totalLeaveDays += 1;
    }
  });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const perDay = baseSalary / daysInMonth;
  const deduction = totalLeaveDays * perDay + totalHalfDays * (perDay / 2);
  const adjustedSalary = Math.max(0, baseSalary - deduction);

  const handleLeaveSubmit = (e) => {
    e.preventDefault();
    // Prevent duplicate leave for same date
    const overlap = leaveRequests.some(
      (req) =>
        req.userId === (profile.id || profile.email) &&
        req.status !== "Rejected" &&
        ((startDate >= req.startDate && startDate <= req.endDate) ||
          (endDate >= req.startDate && endDate <= req.endDate) ||
          (startDate <= req.startDate && endDate >= req.endDate))
    );
    if (overlap) {
      toast.error("You have already applied for leave on these dates.");
      return;
    }
    dispatch(
      applyLeave({
        userId: profile.id || profile.email,
        type: leaveType,
        startDate,
        endDate,
        reason,
      })
    );
    setShowLeaveModal(false);
    setLeaveType("sick");
    setStartDate("");
    setEndDate("");
    setReason("");
    toast.success("Your application has been sent to HR and Admin.");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Employee Profile</h2>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded">
        <div className="mb-2">
          <span className="font-semibold">Name:</span> {profile.name}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Email:</span> {profile.email}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Role:</span> {profile.role}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Base Salary:</span> ₹{baseSalary}
        </div>
        <div className="mb-2">
          <span className="font-semibold">Adjusted Salary (after leave):</span>{" "}
          <span className="text-green-700 dark:text-green-400 font-bold">
            ₹{adjustedSalary.toFixed(2)}
          </span>
        </div>
      </div>
      {profile.role === "employee" && (
        <>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => setShowLeaveModal(true)}
          >
            Apply for Leave
          </button>
          {showLeaveModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
                <form onSubmit={handleLeaveSubmit}>
                  <div className="mb-2">
                    <label className="block mb-1">Leave Type</label>
                    <select
                      className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      value={leaveType}
                      onChange={(e) => setLeaveType(e.target.value)}
                    >
                      <option value="sick">Sick</option>
                      <option value="casual">Casual</option>
                      <option value="earned">Earned</option>
                      <option value="half-day">Half-day</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Start Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">End Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label className="block mb-1">Reason</label>
                    <textarea
                      className="w-full p-2 border rounded text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700"
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                      onClick={() => setShowLeaveModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
      {/* Leave Table for current month */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">
          Your Leaves (Current Month)
        </h3>
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Type</th>
              <th className="p-2">Dates</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Status</th>
              <th className="p-2">Label</th>
            </tr>
          </thead>
          <tbody>
            {leaveRequests
              .filter(
                (req) =>
                  req.userId === (profile.id || profile.email) &&
                  new Date(req.startDate).getMonth() === currentMonth &&
                  new Date(req.startDate).getFullYear() === currentYear
              )
              .map((req) => {
                const isUpcoming = new Date(req.startDate) > today;
                return (
                  <tr key={req.id} className="border-b">
                    <td className="p-2 font-semibold text-gray-900 dark:text-gray-100 capitalize">
                      {req.type}
                    </td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">
                      {req.startDate} to {req.endDate}
                    </td>
                    <td className="p-2 text-gray-900 dark:text-gray-100">
                      {req.reason}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded text-white ${
                          req.status === "Pending"
                            ? "bg-yellow-500"
                            : req.status === "Approved"
                            ? "bg-green-600"
                            : "bg-red-600"
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="p-2">
                      {isUpcoming ? (
                        <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
                          Upcoming
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded bg-gray-300 text-gray-800">
                          Past/Current
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
      <EmployeeAttendance userId={profile.id || profile.email} />
    </div>
  );
};

export default EmployeeProfile;
