// Utility to calculate payroll for a given employee and month
// Inputs: employee, attendanceRecords, leaveRequests, holidays, month, year, overtimeHours (optional)
export function calculatePayroll({
  employee,
  attendanceRecords,
  leaveRequests,
  holidays,
  month,
  year,
  overtimeHours = 0,
}) {
  const { salaryStructure } = employee;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const perDay = salaryStructure.gross / daysInMonth;

  // Attendance: count present, late, half-day, absent
  let presentDays = 0;
  let halfDays = 0;
  let lateDays = 0;
  let absentDays = 0;
  let leaveDays = 0;
  let leaveHalfDays = 0;

  // Map attendance by date for quick lookup
  const attendanceMap = {};
  attendanceRecords.forEach((rec) => {
    if (rec.userId === employee.id || rec.userId === employee.email) {
      attendanceMap[rec.date] = rec;
    }
  });

  // Map leaves by date
  const leaveMap = {};
  leaveRequests.forEach((req) => {
    if (
      (req.userId === employee.id || req.userId === employee.email) &&
      req.status === "Approved" &&
      new Date(req.startDate).getMonth() === month &&
      new Date(req.startDate).getFullYear() === year
    ) {
      let start = new Date(req.startDate);
      let end = new Date(req.endDate);
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().slice(0, 10);
        if (holidays.includes(dateStr)) continue;
        if (req.type === "half-day") leaveHalfDays += 1;
        else leaveDays += 1;
        leaveMap[dateStr] = req.type;
      }
    }
  });

  // Calculate present, half, late, absent
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().slice(0, 10);
    if (holidays.includes(dateStr)) continue;
    const att = attendanceMap[dateStr];
    if (leaveMap[dateStr]) continue; // already counted as leave
    if (att) {
      if (att.status === "Present") presentDays += 1;
      else if (att.status === "Half-day") halfDays += 1;
      else if (att.status === "Late") lateDays += 1;
      else if (att.status === "Absent") absentDays += 1;
    } else {
      absentDays += 1;
    }
  }

  // Deductions
  const leaveDeduction = leaveDays * perDay + leaveHalfDays * (perDay / 2);
  const halfDayDeduction = halfDays * (perDay / 2);
  const lateDeduction = lateDays * (perDay * 0.25); // e.g., 25% deduction for late
  const absentDeduction = absentDays * perDay;
  // Overtime bonus (optional): e.g., 1.5x per hour
  const overtimeBonus = overtimeHours * ((salaryStructure.gross / 240) * 1.5); // assuming 240 working hours/month

  const gross = salaryStructure.gross;
  const totalDeductions =
    leaveDeduction + halfDayDeduction + lateDeduction + absentDeduction;
  const netSalary = Math.max(0, gross - totalDeductions + overtimeBonus);

  return {
    ...salaryStructure,
    presentDays,
    halfDays,
    lateDays,
    absentDays,
    leaveDays,
    leaveHalfDays,
    overtimeHours,
    leaveDeduction,
    halfDayDeduction,
    lateDeduction,
    absentDeduction,
    overtimeBonus,
    gross,
    totalDeductions,
    netSalary,
  };
}
