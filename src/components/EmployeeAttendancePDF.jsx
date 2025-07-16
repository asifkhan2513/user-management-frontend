import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 12, fontFamily: "Helvetica" },
  header: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#2a4365",
  },
  section: { marginBottom: 10 },
  label: { fontWeight: "bold", color: "#2a4365" },
  table: { display: "table", width: "auto", marginTop: 10 },
  tableRow: { flexDirection: "row" },
  tableHeader: { backgroundColor: "#e2e8f0", fontWeight: "bold" },
  tableCell: {
    padding: 4,
    border: "1px solid #cbd5e1",
    minWidth: 60,
    textAlign: "center",
  },
});

const EmployeeAttendancePDF = ({ employee, days, recordMap, getStatus }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Employee Attendance Report</Text>
      <View style={styles.section}>
        <Text>
          <Text style={styles.label}>Name:</Text> {employee.name}
        </Text>
        <Text>
          <Text style={styles.label}>Email:</Text> {employee.email}
        </Text>
        <Text>
          <Text style={styles.label}>Role:</Text> {employee.role}
        </Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Date</Text>
          <Text style={styles.tableCell}>Day</Text>
          <Text style={styles.tableCell}>Check-in</Text>
          <Text style={styles.tableCell}>Check-out</Text>
          <Text style={styles.tableCell}>Status</Text>
          <Text style={styles.tableCell}>Working Hours</Text>
        </View>
        {days.map((d) => {
          const dateStr = d.toISOString().slice(0, 10);
          const weekday = d.getDay();
          const rec = recordMap[dateStr];
          const status = getStatus(dateStr, weekday);
          return (
            <View style={styles.tableRow} key={dateStr}>
              <Text style={styles.tableCell}>{dateStr}</Text>
              <Text style={styles.tableCell}>
                {d.toLocaleDateString(undefined, { weekday: "short" })}
              </Text>
              <Text style={styles.tableCell}>
                {rec?.checkInTime || "--:--"}
              </Text>
              <Text style={styles.tableCell}>
                {rec?.checkOutTime || "--:--"}
              </Text>
              <Text style={styles.tableCell}>{status}</Text>
              <Text style={styles.tableCell}>
                {rec?.workingHours?.toFixed(2) || "0.00"}
              </Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default EmployeeAttendancePDF;
