export function calculatePayroll({
  employee,
  attendanceRecords,
  leaveRequests,
  holidays,
  weekends = [], 
  month,
  year,
  overtimeHours = 0,
  presentDaysOverride = null,
  halfDaysOverride = null,
}) {
  const { salaryStructure } = employee;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const perDay = salaryStructure.gross / daysInMonth;

  let presentDays = 0;
  let halfDays = 0;
  let lateDays = 0;
  let absentDays = 0;
  let leaveDays = 0;
  let leaveHalfDays = 0;


  if (presentDaysOverride !== null && halfDaysOverride !== null) {
    presentDays = presentDaysOverride;
    halfDays = halfDaysOverride;
    lateDays = 0;
    absentDays = 0;
    leaveDays = 0;
    leaveHalfDays = 0;
  } else {
    
    const attendanceMap = {};
    attendanceRecords.forEach((rec) => {
      // Ensure String(rec.userId) === String(employee.id) for robust comparison
      if (String(rec.userId) === String(employee.id) || String(rec.userId) === String(employee.email)) {
        attendanceMap[rec.date] = rec;
      }
    });

    // Map leaves by date
    const leaveMap = {};
    leaveRequests.forEach((req) => {
      // Ensure String(req.userId) === String(employee.id) for robust comparison
      if (
        (String(req.userId) === String(employee.id) || String(req.userId) === String(employee.email)) &&
        req.status === "Approved" &&
        new Date(req.startDate).getMonth() === month &&
        new Date(req.startDate).getFullYear() === year
      ) {
        let start = new Date(req.startDate);
        let end = new Date(req.endDate);
        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().slice(0, 10);
          if (holidays.includes(dateStr)) continue; // Skip holidays
          // Do not count weekends as leave days
          const dayOfWeek = d.getDay();
          if (weekends.includes(dayOfWeek)) continue; 

          if (req.type === "half-day") leaveHalfDays += 1;
          else leaveDays += 1;
          leaveMap[dateStr] = req.type;
        }
      }
    });

    // Calculate present, half, late, absent for actual working days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().slice(0, 10);
      const dayOfWeek = date.getDay(); // 0 for Sunday, 6 for Saturday

      // Skip holidays and weekends from attendance calculation
      if (holidays.includes(dateStr) || weekends.includes(dayOfWeek)) {
        continue;
      }

      const att = attendanceMap[dateStr];
      if (leaveMap[dateStr]) continue; // already counted as leave

      if (att) {
        if (att.status === "Present") presentDays += 1;
        else if (att.status === "Half-day") halfDays += 1;
        else if (att.status === "Late") lateDays += 1;
        else if (att.status === "Absent") absentDays += 1;
      } else {
        absentDays += 1; // If no attendance record, not a holiday, and not a weekend, then it's absent
      }
    }
  }

  
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