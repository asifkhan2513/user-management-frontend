import React from "react";

const SalarySlip = React.forwardRef(
  ({ employee, payroll, month, year }, ref) => (
    <div
      ref={ref}
      style={{
        background: "#fff",
        color: "#222",
        padding: 24,
        width: 400,
        fontFamily: "Arial, sans-serif",
        border: "1px solid #ccc",
        borderRadius: 8,
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 22,
          marginBottom: 16,
        }}
      >
        Salary Slip
      </h2>
      <div style={{ marginBottom: 8 }}>
        <strong>Employee Name:</strong> {employee.name}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Email:</strong> {employee.email}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Role:</strong> {employee.role}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Month:</strong> {`${month + 1}/${year}`}
      </div>
      <hr style={{ margin: "16px 0" }} />
      <div style={{ marginBottom: 8 }}>
        <strong>Basic:</strong> ₹{payroll.basic}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>HRA:</strong> ₹{payroll.hra}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Allowances:</strong> ₹{payroll.allowances}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Gross:</strong> ₹{payroll.gross}
      </div>
      <hr style={{ margin: "16px 0" }} />
      <div style={{ marginBottom: 8 }}>
        <strong>Present Days:</strong> {payroll.presentDays}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Leave (days):</strong>{" "}
        {payroll.leaveDays + payroll.leaveHalfDays * 0.5}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Half-days:</strong> {payroll.halfDays}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Late Marks:</strong> {payroll.lateDays}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Absent:</strong> {payroll.absentDays}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Overtime (hrs):</strong> {payroll.overtimeHours}
      </div>
      <hr style={{ margin: "16px 0" }} />
      <div style={{ marginBottom: 8 }}>
        <strong>Leave Deduction:</strong> ₹{payroll.leaveDeduction.toFixed(2)}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Half-day Deduction:</strong> ₹
        {payroll.halfDayDeduction.toFixed(2)}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Late Deduction:</strong> ₹{payroll.lateDeduction.toFixed(2)}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Absent Deduction:</strong> ₹{payroll.absentDeduction.toFixed(2)}
      </div>
      <div style={{ marginBottom: 8 }}>
        <strong>Overtime Bonus:</strong> ₹{payroll.overtimeBonus.toFixed(2)}
      </div>
      <hr style={{ margin: "16px 0" }} />
      <div
        style={{
          fontWeight: "bold",
          fontSize: 18,
          color: "#0a7f2e",
          textAlign: "center",
        }}
      >
        Net Salary: ₹{payroll.netSalary.toFixed(2)}
      </div>
    </div>
  )
);

export default SalarySlip;
