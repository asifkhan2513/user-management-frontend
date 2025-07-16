import React, { useState, useEffect } from "react";

const EmployeeForm = ({ initial, onSubmit, onCancel }) => {
  const [name, setName] = useState(initial?.name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [role, setRole] = useState(initial?.role || "employee");
  const [password, setPassword] = useState(initial?.password || "");

  useEffect(() => {
    setName(initial?.name || "");
    setEmail(initial?.email || "");
    setRole(initial?.role || "employee");
    setPassword(initial?.password || "");
  }, [initial]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...initial, name, email, role, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 shadow-lg"
    >
      <div className="mb-2">
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded shadow-sm dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="mb-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded shadow-sm dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="mb-2">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded shadow-sm dark:bg-gray-700 dark:text-white"
        >
          <option value="employee">Employee</option>
          <option value="hr">HR</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <div className="mb-2">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded shadow-sm dark:bg-gray-700 dark:text-white"
          required
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save
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

export default EmployeeForm;
