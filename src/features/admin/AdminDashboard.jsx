import React, { useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  addEmployee,
  editEmployee,
  removeEmployee,
} from "../../store/userSlice";
import EmployeeForm from "./EmployeeForm";
import { EmployeeDetails } from "../employee";
import Modal from "../../components/Modal";
import { toast } from "react-toastify";
import EmployeeAttendancePDF from "../../components/EmployeeAttendancePDF";
import { approveLeave, rejectLeave } from "../../store/leaveSlice";
import PayrollManagement from "../hr/PayrollManagement";
import {
  PencilSquareIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

// Static HR user (for demo)
const STATIC_HRS = [
  { id: "static-hr", name: "Default HR", email: "hr@gmail.com", role: "hr" },
];

const AdminDashboard = () => {
  const employees = useSelector((state) => state.users.employees);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [viewDetails, setViewDetails] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const leaveRequests = useSelector((state) => state.leave.leaveRequests);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Merge static HRs if not present in Redux
  const allHRs = [
    ...employees.filter((e) => e.role === "hr"),
    ...STATIC_HRS.filter(
      (staticHr) => !employees.some((e) => e.email === staticHr.email)
    ),
  ];
  const allEmployees = employees.filter((e) => e.role === "employee");
  const visibleUsers = useMemo(
    () =>
      [...allHRs, ...allEmployees].sort((a, b) => a.name.localeCompare(b.name)),
    [allHRs, allEmployees]
  );

  const handleDelete = (user) => {
    setDeleteTarget(user);
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      dispatch(removeEmployee(deleteTarget.id));
      toast.success(`${deleteTarget.name} deleted successfully`);
      setDeleteTarget(null);
    }
  };

  const handleApprove = (id) => {
    dispatch(approveLeave({ requestId: id, adminId: "admin" }));
  };
  const handleReject = (id) => {
    dispatch(rejectLeave({ requestId: id, adminId: "admin" }));
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
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
        <button
          className="mb-0 sm:mb-0 px-4 py-2 bg-green-600 text-white rounded w-full sm:w-auto"
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
        >
          Add Employee
        </button>
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded w-full sm:w-auto"
          onClick={() => setShowLeaveModal(true)}
        >
          View All Leave Applications
        </button>
      </div>
      {showForm && (
        <EmployeeForm
          initial={editing}
          onSubmit={(data) => {
            if (editing) {
              dispatch(editEmployee(data));
              toast.success("User updated successfully");
            } else {
              dispatch(addEmployee({ ...data, id: Date.now() }));
              toast.success("User added successfully");
            }
            setShowForm(false);
            setEditing(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
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
            {visibleUsers.map((emp) => (
              <tr
                key={emp.id || emp.email}
                className="border-b last:border-b-0"
              >
                <td className="px-4 py-2">{emp.name}</td>
                <td className="px-4 py-2">{emp.email}</td>
                <td className="px-4 py-2">{emp.role}</td>
                <td className="px-4 py-2 flex flex-col sm:flex-row gap-2">
                  <button
                    className="px-2 py-1 bg-blue-500 text-white rounded w-full sm:w-auto flex items-center gap-1"
                    onClick={() => {
                      setEditing(emp);
                      setShowForm(true);
                    }}
                    disabled={emp.id === "static-hr"}
                  >
                    <PencilSquareIcon className="h-5 w-5 inline" />
                    Edit
                  </button>
                  <button
                    className="px-2 py-1 bg-red-500 text-white rounded w-full sm:w-auto flex items-center gap-1"
                    onClick={() => handleDelete(emp)}
                    disabled={emp.id === "static-hr"}
                  >
                    <TrashIcon className="h-5 w-5 inline" />
                    Delete
                  </button>
                  <button
                    className="px-2 py-1 bg-indigo-500 text-white rounded w-full sm:w-auto flex items-center gap-1"
                    onClick={() => setViewDetails(emp)}
                  >
                    <EyeIcon className="h-5 w-5 inline" />
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {viewDetails && (
        <Modal isOpen={!!viewDetails} onClose={() => setViewDetails(null)}>
          <EmployeeDetails employee={viewDetails} />
        </Modal>
      )}
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
                              className="px-2 py-1 bg-green-600 text-white rounded mr-2 mb-2 sm:mb-0"
                              onClick={() => handleApprove(req.id)}
                            >
                              Approve
                            </button>
                            <button
                              className="px-2 py-1 bg-red-600 text-white rounded"
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
      {/* Payroll Management Section */}
      <div className="mt-12">
        <PayrollManagement />
      </div>
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}>
        <div className="text-lg font-semibold mb-4">
          Are you sure you want to delete {deleteTarget?.name}?
        </div>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => setDeleteTarget(null)}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded"
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
