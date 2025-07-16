import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import ReactToPdf from "react-to-pdf";
import SalarySlip from "../../components/SalarySlip";
import { calculatePayroll } from "../../utils/payroll";

const PdfIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-5 h-5 inline-block"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 16v-4m0 0V8m0 4h4m-4 0H8m8 4v1.5A2.5 2.5 0 0113.5 20h-3A2.5 2.5 0 018 17.5V16m8 0H8"
    />
  </svg>
);

const PayrollManagement = () => {
  const employees = useSelector((state) => state.users.employees);
  const attendanceRecords = useSelector((state) => state.attendance.records);
  const leaveRequests = useSelector((state) => state.leave.leaveRequests);
  const holidays = useSelector((state) => state.attendance.holidays);
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // Create a ref for each employee row
  const slipRefs = useRef([]);
  // Ensure refs array matches employees length
  slipRefs.current = employees.map(
    (_, i) => slipRefs.current[i] || React.createRef()
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payroll Management</h2>
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <label className="flex items-center font-semibold">
          Month:
          <select
            className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center font-semibold">
          Year:
          <input
            type="number"
            className="ml-2 p-2 border rounded w-28 bg-white dark:bg-gray-800 dark:text-white"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          />
        </label>
      </div>
      {(!employees || employees.length === 0) && (
        <div className="text-center text-gray-500">No employees found.</div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border mb-8">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Gross</th>
              <th className="p-2">Deductions</th>
              <th className="p-2">Net Salary</th>
              <th className="p-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {employees
              .filter((emp) => emp.salaryStructure)
              .map((emp, idx) => {
                const payroll = calculatePayroll({
                  employee: emp,
                  attendanceRecords,
                  leaveRequests,
                  holidays,
                  month,
                  year,
                  overtimeHours: 0, // can be extended
                });
                return (
                  <tr key={emp.id || emp.email} className="border-b">
                    <td className="p-2">{emp.name}</td>
                    <td className="p-2">{emp.email}</td>
                    <td className="p-2 capitalize">{emp.role}</td>
                    <td className="p-2">₹{payroll.gross}</td>
                    <td className="p-2">
                      ₹{payroll.totalDeductions.toFixed(2)}
                    </td>
                    <td className="p-2 font-bold text-green-700 dark:text-green-400">
                      ₹{payroll.netSalary.toFixed(2)}
                    </td>
                    <td className="p-2 text-center">
                      <div style={{ display: "none" }}>
                        <SalarySlip
                          ref={slipRefs.current[idx]}
                          employee={emp}
                          payroll={payroll}
                          month={month}
                          year={year}
                        />
                      </div>
                      <ReactToPdf
                        targetRef={slipRefs.current[idx]}
                        filename={`SalarySlip_${emp.name}_${
                          month + 1
                        }_${year}.pdf`}
                        options={{
                          orientation: "portrait",
                          unit: "px",
                          format: [450, 600],
                        }}
                        scale={1.2}
                        x={0}
                        y={0}
                      >
                        {({ toPdf }) => (
                          <button
                            className="px-2 py-1 bg-blue-600 text-white rounded"
                            title="Download Salary Slip"
                            onClick={toPdf}
                          >
                            <PdfIcon />
                          </button>
                        )}
                      </ReactToPdf>
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

export default PayrollManagement;
