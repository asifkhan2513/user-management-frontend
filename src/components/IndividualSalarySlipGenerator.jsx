import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";

// pdf css 
const styles = StyleSheet.create({
  page: {
    padding: 35,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#f7f7f7",
  },
  heading: {
    fontSize: 22,
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#fc8a44",
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#ffffff",
    border: "1pt solid #e0e0e0",
  },
  sectionHeader: {
    backgroundColor: "#fc8a44",
    color: "#fff",
    padding: 6,
    fontWeight: "bold",
    borderRadius: 4,
    marginBottom: 8,
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  value: {
    color: "#333",
  },
  netSalary: {
    backgroundColor: "#2ecc71",
    color: "#fff",
    padding: 8,
    borderRadius: 4,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
});

// PDF Content 
const SalaryPDF = ({ formData }) => {
  const { name, empId, department, baseSalary, month, presentDays, halfDays } =
    formData;

  // Ensure baseSalary, presentDays, halfDays are numbers before calculations
  const parsedBaseSalary = Number(baseSalary) || 0;
  const parsedPresentDays = Number(presentDays) || 0;
  const parsedHalfDays = Number(halfDays) || 0;

  // Your provided calculation logic
  const totalDays = 30; 
  const attendanceRatio =
    (parsedPresentDays + parsedHalfDays * 0.5) / totalDays;

  const actualBase = parsedBaseSalary * attendanceRatio;
  const hra = actualBase * 0.4;
  const da = actualBase * 0.1;
  const ta = 1500 * attendanceRatio; 
  const pf = actualBase * 0.12;
  const netSalary = actualBase + hra + da + ta - pf;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.heading}>Salary Slip - {month}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Employee Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{name || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Employee ID:</Text>
            <Text style={styles.value}>{empId || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Department:</Text>
            <Text style={styles.value}>{department || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Present Days:</Text>
            <Text style={styles.value}>{parsedPresentDays}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Half Days:</Text>
            <Text style={styles.value}>{parsedHalfDays}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Earnings (Prorated)</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Basic Salary:</Text>
            <Text style={styles.value}>₹{actualBase.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>HRA (40%):</Text>
            <Text style={styles.value}>₹{hra.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>DA (10%):</Text>
            <Text style={styles.value}>₹{da.toFixed(2)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>TA:</Text>
            <Text style={styles.value}>₹{ta.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Deductions</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Provident Fund (12%):</Text>
            <Text style={styles.value}>₹{pf.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionHeader}>Net Salary</Text>
          {/* Ensure netSalary is a number before calling toFixed */}
          <Text style={styles.netSalary}>₹{(netSalary || 0).toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
};

// ---------------- Main Component ----------------
const IndividualSalarySlipGenerator = () => {
  const employees = useSelector((state) => state.users.employees); // Get employees from Redux

  const [formData, setFormData] = useState({
    name: "",
    empId: "",
    department: "",
    baseSalary: "",
    month: "",
    presentDays: "",
    halfDays: "",
  });

  const [generatedPDFData, setGeneratedPDFData] = useState(null); // To hold data for PDF download

  // Update formData when selected employee changes
  useEffect(() => {
    if (employees.length > 0 && formData.empId === "") {
      const defaultEmployee = employees[0];
      setFormData((prev) => ({
        ...prev,
        name: defaultEmployee.name,
        empId: defaultEmployee.id,
        department: defaultEmployee.department || "",
        baseSalary: defaultEmployee.salary || "", 
      
        presentDays: 0,
        halfDays: 0,
        month: new Date().toLocaleString("default", {
          month: "long",
          year: "numeric",
        }), 
      }));
    }
  }, [employees, formData.empId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));


    if (name === "empId") {
      const selectedEmployee = employees.find((emp) => emp.id === value);
      if (selectedEmployee) {
        setFormData((prev) => ({
          ...prev,
          name: selectedEmployee.name,
          empId: selectedEmployee.id,
          department: selectedEmployee.department || "",
          baseSalary: selectedEmployee.salary || "",
        
          // Reset presentDays and halfDays when a new employee is selected
          presentDays: 0,
          halfDays: 0,
          month: new Date().toLocaleString("default", {
            month: "long",
            year: "numeric",
          }), 
        }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate required fields before generating PDF
    if (
      !formData.empId ||
      !formData.baseSalary ||
      formData.presentDays === "" ||
      formData.halfDays === "" ||
      !formData.month
    ) {
      alert(
        "Please fill all required fields: Employee, Base Salary, Present Days, Half Days, and Month."
      );
      return;
    }
    setGeneratedPDFData(formData);
  };

  const employeeOptions = employees.map((emp) => ({
    label: `${emp.name} (ID: ${emp.id})`,
    value: emp.id,
  }));

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 600,
        margin: "0 auto",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#fc8a44", marginBottom: 20 }}>
        Generate Individual Salary Slip
      </h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <FormSelect
          label="Employee Name & ID"
          name="empId"
          value={formData.empId}
          onChange={handleChange}
          options={employeeOptions}
        />
        <FormInput
          label="Department"
          name="department"
          value={formData.department}
          onChange={handleChange}
          readOnly
        />{" "}
       
        <FormInput
          label="Base Salary (₹)"
          name="baseSalary"
          type="number"
          value={formData.baseSalary}
          onChange={handleChange}
          readOnly
        />{" "}
        <FormInput
          label="Month"
          name="month"
          value={formData.month}
          onChange={handleChange}
          placeholder="e.g., July 2025"
        />
        <FormInput
          label="Present Days"
          name="presentDays"
          type="number"
          value={formData.presentDays}
          onChange={handleChange}
        />
        <FormInput
          label="Half Days"
          name="halfDays"
          type="number"
          value={formData.halfDays}
          onChange={handleChange}
        />
        <button type="submit" style={buttonStyle}>
    
        </button>
      </form>

      {generatedPDFData && (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <PDFDownloadLink
            document={<SalaryPDF formData={generatedPDFData} />}
            fileName={`SalarySlip_${Date.now()}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                <button style={{ ...buttonStyle, backgroundColor: "#ccc" }}>
                  Loading PDF...
                </button>
              ) : (
                <button style={{ ...buttonStyle, backgroundColor: "#2ecc71" }}>
                  Download Salary Slip
                </button>
              )
            }
          </PDFDownloadLink>
        </div>
      )}
    </div>
  );
};

export default IndividualSalarySlipGenerator;

// ---------------- Reusable Input ----------------
const FormInput = ({
  label,
  name,
  type = "text",
  placeholder = "",
  value,
  onChange,
  readOnly = false,
}) => (
  <div style={{ marginBottom: 12 }}>
    <label>{label}:</label>
    <br />
    <input
      type={type}
      name={name}
      required
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={inputStyle}
      readOnly={readOnly} 
    />
  </div>
);

// ---------------- Reusable Select ----------------
const FormSelect = ({ label, name, value, onChange, options }) => (
  <div style={{ marginBottom: 12 }}>
    <label>{label}:</label>
    <br />
    <select
      name={name}
      required
      value={value}
      onChange={onChange}
      style={inputStyle} // Reuse input style for select
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// ---------------- UI Styles ----------------
const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#fc8a44",
  color: "#fff",
  padding: "12px 25px",
  fontSize: "16px",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  marginTop: "10px",
};
