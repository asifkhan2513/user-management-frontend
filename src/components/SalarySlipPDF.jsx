import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  section: { marginBottom: 8 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  label: { fontWeight: "bold" },
  table: { display: "table", width: "auto", marginVertical: 8 },
  tableRow: { flexDirection: "row" },
  tableCell: { flex: 1, border: 1, borderColor: "#ccc", padding: 4 },
  total: { fontWeight: "bold", fontSize: 14, marginTop: 8 },
});

const SalarySlipPDF = ({ employee, payroll, month, year }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Salary Slip</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Employee Name:</Text>
          <Text>{employee.name}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text>{employee.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Month:</Text>
          <Text>{`${month + 1}/${year}`}</Text>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Salary Structure</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Basic</Text>
            <Text style={styles.tableCell}>HRA</Text>
            <Text style={styles.tableCell}>Allowances</Text>
            <Text style={styles.tableCell}>Gross</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{payroll.basic}</Text>
            <Text style={styles.tableCell}>{payroll.hra}</Text>
            <Text style={styles.tableCell}>{payroll.allowances}</Text>
            <Text style={styles.tableCell}>{payroll.gross}</Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>Attendance & Deductions</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Present</Text>
            <Text style={styles.tableCell}>Leave</Text>
            <Text style={styles.tableCell}>Half-day</Text>
            <Text style={styles.tableCell}>Late</Text>
            <Text style={styles.tableCell}>Absent</Text>
            <Text style={styles.tableCell}>Overtime (hrs)</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>{payroll.presentDays}</Text>
            <Text style={styles.tableCell}>
              {payroll.leaveDays + payroll.leaveHalfDays * 0.5}
            </Text>
            <Text style={styles.tableCell}>{payroll.halfDays}</Text>
            <Text style={styles.tableCell}>{payroll.lateDays}</Text>
            <Text style={styles.tableCell}>{payroll.absentDays}</Text>
            <Text style={styles.tableCell}>{payroll.overtimeHours}</Text>
          </View>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>Leave Deduction</Text>
            <Text style={styles.tableCell}>Half-day Deduction</Text>
            <Text style={styles.tableCell}>Late Deduction</Text>
            <Text style={styles.tableCell}>Absent Deduction</Text>
            <Text style={styles.tableCell}>Overtime Bonus</Text>
          </View>
          <View style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {payroll.leaveDeduction.toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>
              {payroll.halfDayDeduction.toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>
              {payroll.lateDeduction.toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>
              {payroll.absentDeduction.toFixed(2)}
            </Text>
            <Text style={styles.tableCell}>
              {payroll.overtimeBonus.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.section}>
        <Text style={styles.total}>
          Net Salary: ₹{payroll.netSalary.toFixed(2)}
        </Text>
      </View>
    </Page>
  </Document>
);

export default SalarySlipPDF;
