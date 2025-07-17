import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";


const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Open Sans", color: "#333" },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#FC783F", 
  },
  subHeader: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 15,
    borderBottom: "1px solid #eee",
    paddingBottom: 5,
    color: "#555",
  },
  section: { marginBottom: 15 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  label: { fontWeight: "bold", width: "40%" },
  value: { width: "60%", textAlign: "right" },
  table: {
    display: "table",
    width: "auto",
    marginTop: 10,
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
    backgroundColor: "#f9f9f9",
  },
  tableColHeader: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderBottomColor: "#000",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    backgroundColor: "#e0e0e0",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCol: {
    width: "25%",
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    textAlign: "center",
  },
  tableColHalf: {
    width: "16.66%", // For 6 columns
    borderStyle: "solid",
    borderColor: "#bfbfbf",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 8,
    textAlign: "center",
  },
  netSalary: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#0a7f2e",
    backgroundColor: "#e6ffe6",
    padding: 10,
    borderRadius: 5,
  },
});

const SalarySlipPDF = ({ employee, payroll, month, year }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Salary Slip</Text>

      <Text style={styles.subHeader}>Employee Details</Text>
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Employee Name:</Text>
          <Text style={styles.value}>{employee?.name || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Employee ID:</Text>
          <Text style={styles.value}>{employee?.id || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{employee?.email || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Role:</Text>
          <Text style={styles.value}>{employee?.role || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Department:</Text>
          <Text style={styles.value}>{employee?.department || "N/A"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Month & Year:</Text>
          <Text style={styles.value}>{`${new Date(0, month).toLocaleString("default", { month: "long" })} ${year}`}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Earnings</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Basic</Text>
          <Text style={styles.tableColHeader}>HRA</Text>
          <Text style={styles.tableColHeader}>Allowances</Text>
          <Text style={styles.tableColHeader}>Gross Salary</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>₹{(payroll?.basic || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.hra || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.allowances || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.gross || 0).toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Attendance & Deductions</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHalf}>Present Days</Text>
          <Text style={styles.tableColHalf}>Half-days</Text>
          <Text style={styles.tableColHalf}>Late Marks</Text>
          <Text style={styles.tableColHalf}>Absent Days</Text>
          <Text style={styles.tableColHalf}>Leave Days</Text>
          <Text style={styles.tableColHalf}>Overtime (hrs)</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHalf}>{(payroll?.presentDays || 0)}</Text>
          <Text style={styles.tableColHalf}>{(payroll?.halfDays || 0)}</Text>
          <Text style={styles.tableColHalf}>{(payroll?.lateDays || 0)}</Text>
          <Text style={styles.tableColHalf}>{(payroll?.absentDays || 0)}</Text>
          <Text style={styles.tableColHalf}>
            {(payroll?.leaveDays || 0) + (payroll?.leaveHalfDays || 0) * 0.5}
          </Text>
          <Text style={styles.tableColHalf}>{(payroll?.overtimeHours || 0)}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={styles.tableColHeader}>Leave Deduction</Text>
          <Text style={styles.tableColHeader}>Half-day Deduction</Text>
          <Text style={styles.tableColHeader}>Late Deduction</Text>
          <Text style={styles.tableColHeader}>Absent Deduction</Text>
        </View>
        <View style={styles.tableRow}>
          <Text style={styles.tableCol}>₹{(payroll?.leaveDeduction || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.halfDayDeduction || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.lateDeduction || 0).toFixed(2)}</Text>
          <Text style={styles.tableCol}>₹{(payroll?.absentDeduction || 0).toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.label}>Overtime Bonus:</Text>
          <Text style={styles.value}>₹{(payroll?.overtimeBonus || 0).toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total Deductions:</Text>
          <Text style={styles.value}>₹{(payroll?.totalDeductions || 0).toFixed(2)}</Text>
        </View>
      </View>

      <Text style={styles.netSalary}>
        Net Salary: ₹{(payroll?.netSalary || 0).toFixed(2)}
      </Text>
    </Page>
  </Document>
);

export default SalarySlipPDF;