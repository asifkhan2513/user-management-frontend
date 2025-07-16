import React, { useState } from "react";

const RoleAssignment = ({ employee, onAssign, onCancel }) => {
  const [role, setRole] = useState(employee.role);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAssign(role);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded"
    >
      <h3 className="mb-2 font-bold">Assign Role to {employee.name}</h3>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white mb-2"
      >
        <option value="employee">Employee</option>
        <option value="hr">HR</option>
        <option value="admin">Admin</option>
      </select>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Assign
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-400 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default RoleAssignment;
