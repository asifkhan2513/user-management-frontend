import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  employees: JSON.parse(localStorage.getItem("employees")) || [],
};

const DEFAULT_SALARY = 30000;
const getSalaryStructure = (salary = DEFAULT_SALARY) => ({
  basic: Math.round(salary * 0.6),
  hra: Math.round(salary * 0.3),
  allowances: Math.round(salary * 0.1),
  gross: salary,
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    addEmployee: (state, action) => {
      const emp = {
        ...action.payload,
        salary: action.payload.salary || DEFAULT_SALARY,
        salaryStructure: getSalaryStructure(
          action.payload.salary || DEFAULT_SALARY
        ),
      };
      state.employees.push(emp);
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },
    editEmployee: (state, action) => {
      const idx = state.employees.findIndex((e) => e.id === action.payload.id);
      if (idx !== -1) {
        const updated = {
          ...action.payload,
          salary: action.payload.salary || DEFAULT_SALARY,
          salaryStructure: getSalaryStructure(
            action.payload.salary || DEFAULT_SALARY
          ),
        };
        state.employees[idx] = updated;
        localStorage.setItem("employees", JSON.stringify(state.employees));
      }
    },
    removeEmployee: (state, action) => {
      state.employees = state.employees.filter((e) => e.id !== action.payload);
      localStorage.setItem("employees", JSON.stringify(state.employees));
    },
    assignRole: (state, action) => {
      const { id, role } = action.payload;
      const emp = state.employees.find((e) => e.id === id);
      if (emp) {
        emp.role = role;
        localStorage.setItem("employees", JSON.stringify(state.employees));
      }
    },
  },
});

export const { addEmployee, editEmployee, removeEmployee, assignRole } =
  userSlice.actions;
export default userSlice.reducer;
