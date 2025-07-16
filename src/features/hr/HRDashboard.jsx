import React, { useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { assignRole, removeEmployee } from "../../store/userSlice";
import {
  setHoliday,
  setWeekends,
  fetchHolidays,
} from "../../store/attendanceSlice";
import { approveLeave, rejectLeave } from "../../store/leaveSlice";
import RoleAssignment from "./RoleAssignment";
import { EmployeeDetails, EmployeeAttendance } from "../employee";
import { AuthContext } from "../../context/AuthContext";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import PayrollManagement from "./PayrollManagement";

const HRDashboard = () => {
  const employees = useSelector((state) => state.users.employees);
  const weekends = useSelector((state) => state.attendance.weekends);
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(null);
  const [viewDetails, setViewDetails] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const { user } = useContext(AuthContext);
  const [holidayInput, setHolidayInput] = useState("");
  const [weekendInput, setWeekendInput] = useState(weekends.join(","));
  const leaveRequests = useSelector((state) => state.leave.leaveRequests);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  useEffect(() => {
    dispatch(fetchHolidays());
  }, [dispatch]);

  // Only show employees (not HRs or admins)
  const employeeList = employees.filter((emp) => emp.role === "employee");

  const handleDelete = (emp) => {
    setDeleteTarget(emp);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(removeEmployee(deleteTarget.id));
      toast.success(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
    }
  };

  const handleSetHolidays = () => {
    const arr = holidayInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    dispatch(setHoliday(arr));
    toast.success("Holidays updated");
  };

  const handleSetWeekends = () => {
    const arr = weekendInput
      .split(",")
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
    dispatch(setWeekends(arr));
    toast.success("Weekends updated");
  };

  const handleApprove = (id) => {
    dispatch(approveLeave({ requestId: id, adminId: user.id || user.email }));
  };
  const handleReject = (id) => {
    dispatch(rejectLeave({ requestId: id, adminId: user.id || user.email }));
  };
  // Employees currently on leave
  const today = new Date().toISOString().slice(0, 10);
  const onLeave = leaveRequests.filter(
    (req) =>
      req.status === "Approved" &&
      today >= req.startDate &&
      today <= req.endDate
  );

  return (
    <div className="p-4 sm:p-8 max-w-3xl mx-auto w-full border border-gray-200 dark:border-gray-700 shadow-lg bg-white dark:bg-gray-900 rounded-xl mb-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">HR Dashboard</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
        <button
          className="px-4 py-2 bg-primary text-white rounded w-full sm:w-auto hover:bg-orange-500 transition-colors duration-200"
          onClick={() => (window.location.href = "/leave")}
        >
          Apply for Leave
        </button>
        <button
          className="px-4 py-2 bg-primary text-white rounded w-full sm:w-auto hover:bg-orange-500 transition-colors duration-200"
          onClick={() => setShowLeaveModal(true)}
        >
          View All Leave Applications
        </button>
      </div>
      {showLeaveModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-md w-full max-w-xs sm:max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg sm:text-xl font-bold">
                All Leave Applications
              </h2>
              <button
                className="text-lg"
                onClick={() => setShowLeaveModal(false)}
              >
                &times;
              </button>
            </div>
            <div className="mb-4">
              <span className="font-semibold">
                Employees currently on leave:{" "}
              </span>
              {onLeave.length} {onLeave.length > 0 && `- `}
              {onLeave.map((req) => req.userId).join(", ")}
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-sm border">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="p-2">Employee</th>
                    <th className="p-2">Type</th>
                    <th className="p-2">Dates</th>
                    <th className="p-2">Reason</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveRequests.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        No leave applications found.
                      </td>
                    </tr>
                  )}
                  {leaveRequests.map((req) => (
                    <tr key={req.id}>
                      <td className="p-2">{req.userId}</td>
                      <td className="p-2 capitalize">{req.type}</td>
                      <td className="p-2">
                        {req.startDate} to {req.endDate}
                      </td>
                      <td className="p-2">{req.reason}</td>
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
                        {req.status === "Pending" && (
                          <>
                            <button
                              className="px-2 py-1 bg-green-600 text-white rounded mr-2 mb-2 sm:mb-0 w-full sm:w-auto hover:bg-green-700 transition-colors duration-200"
                              onClick={() => handleApprove(req.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 bg-red-600 text-white rounded w-full sm:w-auto hover:bg-red-700 transition-colors duration-200"
                              onClick={() => handleReject(req.id)}
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-700 rounded">
        <h3 className="font-semibold mb-2">
          Public Holidays (comma-separated YYYY-MM-DD):
        </h3>
        <input
          type="text"
          value={holidayInput}
          onChange={(e) => setHolidayInput(e.target.value)}
          placeholder="2024-07-04, 2024-12-25"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <button
          className="px-3 py-1 bg-primary text-white rounded mr-4 w-full sm:w-auto mb-2 sm:mb-0 hover:bg-orange-500 transition-colors duration-200"
          onClick={handleSetHolidays}
        >
          Set Holidays
        </button>
        <h3 className="font-semibold mt-4 mb-2">
          Weekends (comma-separated, 0=Sun, 6=Sat):
        </h3>
        <input
          type="text"
          value={weekendInput}
          onChange={(e) => setWeekendInput(e.target.value)}
          placeholder="0,6"
          className="w-full p-2 mb-2 border rounded dark:bg-gray-800 dark:text-white"
        />
        <button
          className="px-3 py-1 bg-primary text-white rounded w-full sm:w-auto hover:bg-orange-500 transition-colors duration-200"
          onClick={handleSetWeekends}
        >
          Set Weekends
        </button>
      </div>
      <div className="mt-12">
        <PayrollManagement />
      </div>
      {user?.role === "hr" && (
        <div className="mb-8">
          <EmployeeAttendance userId={user.id || user.email} />
        </div>
      )}
      <div className="overflow-x-auto border rounded-xl mt-6 shadow bg-white dark:bg-gray-900">
        <table className="min-w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employeeList.map((emp) => (
              <tr key={emp.id} className="border-b last:border-b-0">
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.role}</td>
                <td className="px-4 py-2 flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-2 py-1 bg-yellow-500 text-white rounded w-full sm:w-auto hover:bg-yellow-600 transition-colors duration-200"
                    onClick={() => setSelected(emp)}
                  >
                    Assign Role
                  </button>
                  <button
                    className="px-2 py-1 bg-primary text-white rounded w-full sm:w-auto hover:bg-orange-500 transition-colors duration-200"
                    onClick={() => setViewDetails(emp)}
                  >
                    View Details
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded w-full sm:w-auto hover:bg-red-700 transition-colors duration-200"
                    onClick={() => handleDelete(emp)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <Modal isOpen={!!selected} onClose={() => setSelected(null)}>
          <RoleAssignment
            employee={selected}
            onAssign={(role) => {
              dispatch(assignRole({ id: selected.id, role }));
              setSelected(null);
              toast.success("Role assigned successfully");
            }}
            onCancel={() => setSelected(null)}
          />
        </Modal>
      )}
      {viewDetails && (
        <Modal isOpen={!!viewDetails} onClose={() => setViewDetails(null)}>
          <EmployeeDetails employee={viewDetails} />
        </Modal>
      )}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="text-lg font-semibold mb-4">
          Are you sure you want to delete {deleteTarget?.name}?
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded w-full sm:w-auto hover:bg-gray-500 transition-colors duration-200"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded w-full sm:w-auto hover:bg-red-700 transition-colors duration-200"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default HRDashboard;
