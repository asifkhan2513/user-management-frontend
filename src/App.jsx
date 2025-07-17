// src/App.jsx
import "./App.css";
import React from "react";
import { Provider } from "react-redux";
import store from "./store/store";
import { ThemeProvider } from "./context/ThemeContext";
import AuthProvider from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Removed unused imports if they were present (e.g., PDFDownloadLink, EmployeeAttendancePDF)

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <AuthProvider>
          <div className="min-h-screen bg-offwhite dark:bg-gray-900 text-gray-900 dark:text-white pt-16">
            <AppRoutes />
            <ToastContainer position="top-right" autoClose={3000} />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
