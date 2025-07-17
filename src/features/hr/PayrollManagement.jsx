
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalarySlipPDF from "../../components/SalarySlipPDF"; 
import { calculatePayroll } from "../../utils/payroll";

import IndividualSalarySlipGenerator from "../../components/IndividualSalarySlipGenerator"; 

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
  const weekends = useSelector((state) => state.attendance.weekends);

  // State for the existing payroll table (all employees) filters
  const [tableMonth, setTableMonth] = useState(null); 
  const [tableYear, setTableYear] = useState(null); 

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Payroll Management</h2>

      <div className="mb-8">
        <IndividualSalarySlipGenerator />
      </div>

      <div className="mt-12">
        <h3 className="text-xl font-bold mb-4">
          Payroll Overview (All Employees)
        </h3>
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <label className="flex items-center font-semibold">
            Month:
            <select
              className="ml-2 p-2 border rounded bg-white dark:bg-gray-800 dark:text-white"
              value={tableMonth !== null ? tableMonth : ""}
              onChange={(e) => setTableMonth(Number(e.target.value))}
            >
              <option value="" disabled>
                Select Month
              </option>
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
              value={tableYear !== null ? tableYear : ""}
              onChange={(e) => setTableYear(Number(e.target.value))}
              placeholder="YYYY"
            />
          </label>
        </div>
        {/* Conditional rendering: Only show table if both month and year are selected */}
        {tableMonth !== null && tableYear !== null ? (
          employees.length === 0 ? (
            <div className="text-center text-gray-500">No employees found.</div>
          ) : (
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
                    .map((emp) => {
                      const payroll = calculatePayroll({
                        employee: emp,
                        attendanceRecords,
                        leaveRequests,
                        holidays,
                        weekends: weekends,
                        month: tableMonth,
                        year: tableYear,
                        overtimeHours: 0,
                      });
                      return (
                        <tr key={emp.id || emp.email} className="border-b">
                          <td className="px-4 py-2">{emp.name}</td>
                          <td className="px-4 py-2">{emp.email}</td>
                          <td className="px-4 py-2 capitalize">{emp.role}</td>
                          <td className="p-2">₹{payroll?.gross || 0}</td>
                          <td className="p-2">
                            ₹{(payroll?.totalDeductions || 0).toFixed(2)}
                          </td>
                          <td className="p-2 font-bold text-green-700 dark:text-green-400">
                            ₹{(payroll?.netSalary || 0).toFixed(2)}
                          </td>
                          <td className="p-2 text-center">
                            <PDFDownloadLink
                              document={
                                <SalarySlipPDF 
                                  employee={emp}
                                  payroll={payroll}
                                  month={tableMonth}
                                  year={tableYear}
                                />
                              }
                              fileName={`SalarySlip_${Date.now()}.pdf`}
                            >
                              {({ loading }) =>
                                loading ? (
                                  "Loading..."
                                ) : (
                                  <button
                                    className="px-2 py-1 bg-blue-600 text-white rounded"
                                    title="Download Salary Slip"
                                  >
                                    <PdfIcon />
                                  </button>
                                )
                              }
                            </PDFDownloadLink>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="text-center text-gray-500 mt-4">
            Please select a month and year to view payroll data.
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollManagement;
