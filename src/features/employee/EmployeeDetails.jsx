import React from "react";
import { useSelector } from "react-redux";

function getDatesInMonth(year, month) {
  const date = new Date(year, month, 1);
  const dates = [];
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
}

const EmployeeDetails = ({ employee }) => {
  const attendanceRecords = useSelector((state) =>
    state.attendance.records.filter(
      (r) => r.userId === (employee.id || employee.email)
    )
  );
  const holidays = useSelector((state) => state.attendance.holidays);
  const weekends = useSelector((state) => state.attendance.weekends);

  // Show current month
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const days = getDatesInMonth(year, month);

  // Map date string to record
  const recordMap = {};
  attendanceRecords.forEach((r) => {
    recordMap[r.date] = r;
  });

  function getStatus(dateStr, weekday) {
    if (holidays.includes(dateStr)) return "Holiday";
    if (weekends.includes(weekday)) return "Weekend";
    const rec = recordMap[dateStr];
    if (rec) return rec.status;
    // If not holiday/weekend and no record, mark as Absent
    return "Absent";
  }

  // Calculate total working days
  const workingDays = days.filter((d) => {
    const dateStr = d.toISOString().slice(0, 10);
    const weekday = d.getDay();
    return !holidays.includes(dateStr) && !weekends.includes(weekday);
  });
  const totalWorkingDays = workingDays.length;

  // Calculate summary counts
  let halfDays = 0,
    absents = 0;
  workingDays.forEach((d) => {
    const dateStr = d.toISOString().slice(0, 10);
    const status = getStatus(dateStr, d.getDay());
    if (status === "Half-day") halfDays++;
    else if (status === "Absent") absents++;
  });

  return (
    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg w-full max-w-2xl mx-auto mt-8 mb-8">
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>
      <div className="mb-4">
        <div>
          <span className="font-semibold">Name:</span> {employee.name}
        </div>
        <div>
          <span className="font-semibold">Email:</span> {employee.email}
        </div>
        <div>
          <span className="font-semibold">Role:</span> {employee.role}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">
        Attendance History (Current Month)
      </h3>
      <div className="mb-2 font-semibold text-blue-700 dark:text-blue-300">
        Total Working Days: {totalWorkingDays} | Total Half-days: {halfDays} |
        Total Leave: {absents}
      </div>
      <div className="overflow-x-auto border rounded-xl mt-6 shadow bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Day</th>
              <th className="px-4 py-2">Check-in</th>
              <th className="px-4 py-2">Check-out</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Working Hours</th>
            </tr>
          </thead>
          <tbody>
            {days.map((d) => {
              const dateStr = d.toISOString().slice(0, 10);
              const weekday = d.getDay();
              const rec = recordMap[dateStr];
              const status = getStatus(dateStr, weekday);
              return (
                <tr key={dateStr}>
                  <td className="px-4 py-2">{dateStr}</td>
                  <td className="px-4 py-2">
                    {d.toLocaleDateString(undefined, { weekday: "short" })}
                  </td>
                  <td className="px-4 py-2">{rec?.checkInTime || "--:--"}</td>
                  <td className="px-4 py-2">{rec?.checkOutTime || "--:--"}</td>
                  <td className="px-4 py-2">{status}</td>
                  <td className="px-4 py-2">
                    {rec?.workingHours?.toFixed(2) || "0.00"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeDetails;
