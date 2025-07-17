User Management Frontend Application
This project is a web-based user management system built with React and Vite, designed to handle employee data, attendance tracking, leave applications, and payroll generation for different user roles (Admin, HR, Employee).

Table of Contents
Features

Technologies Used

Folder Structure

Detailed Functionality Breakdown

Setup Instructions

Login Credentials

Features
Role-Based Access Control: Separate dashboards and functionalities for Admin, HR, and Employee roles.

Employee Management (Admin): Add, edit, and remove employee details.

Attendance Tracking: Employees can check in/out daily. HR can view and manage attendance.

Leave Management: Employees can apply for various types of leave (sick, casual, earned, half-day). Admin/HR can approve or reject leave requests.

Payroll Generation: Calculate and generate salary slips for individual employees or view a payroll overview for all. Customizable inputs for present/half days for individual slips.

PDF Generation: Download salary slips and attendance reports in PDF format.

Theming: Toggle between light and dark modes.

Client-Side Data Storage: Uses localStorage for user, attendance, leave, and holiday data persistence (suitable for demo purposes).

Google Calendar Integration (for Holidays): Fetches public holidays from a Google Calendar API (requires API key setup).

Technologies Used
Frontend Framework: React.js

Build Tool: Vite

State Management: Redux Toolkit (for global state management of users, attendance, and leave)

Routing: React Router DOM

Styling: Tailwind CSS (for utility-first CSS)

Icons: Heroicons

Toast Notifications: React Toastify

PDF Generation: @react-pdf/renderer (for creating dynamic PDFs)

Folder Structure
The project follows a component-based structure, organizing code by features.

.
├── .gitignore
├── README.md
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── server/
│   └── models/
│       ├── Attendance.js
│       └── Payroll.js
├── src/
│   ├── App.css
│   ├── App.jsx
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── EmployeeAttendancePDF.jsx
│   │   ├── IndividualSalarySlipGenerator.jsx
│   │   ├── Input.jsx
│   │   ├── Login.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── SalarySlipPDF.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── index.js
│   ├── context/
│   │   ├── AuthContext.jsx
│   │   ├── ThemeContext.jsx
│   │   └── index.js
│   ├── features/
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── EmployeeForm.jsx
│   │   │   └── index.js
│   │   ├── employee/
│   │   │   ├── EmployeeAttendance.jsx
│   │   │   ├── EmployeeDetails.jsx
│   │   │   ├── EmployeeProfile.jsx
│   │   │   └── index.js
│   │   ├── hr/
│   │   │   ├── HRDashboard.jsx
│   │   │   ├── PayrollManagement.jsx
│   │   │   ├── RoleAssignment.jsx
│   │   │   └── index.js
│   │   └── leave/
│   │       ├── LeavePage.jsx
│   │       └── index.js
│   ├── hooks/
│   │   ├── index.js
│   │   ├── useAuth.js
│   │   └── useTheme.js
│   ├── index.css
│   ├── main.jsx
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── index.js
│   ├── store/
│   │   ├── attendanceSlice.js
│   │   ├── index.js
│   │   ├── leaveSlice.js
│   │   ├── store.js
│   │   └── userSlice.js
│   └── utils/
│       ├── index.js
│       ├── localStorage.js
│       ├── payroll.js
│       └── sessionStorage.js
└── tailwind.config.js
└── vite.config.js
Detailed Functionality Breakdown
src/ Directory
App.jsx: The main application component, wrapping the entire app with Redux, Theme, and Auth providers. It sets up react-toastify for notifications.

main.jsx: The entry point of the React application. It initializes the React DOM, imports global CSS, and registers fonts for PDF generation.

index.css, App.css, tailwind.config.js, postcss.config.js: Configuration and definition for global styles and Tailwind CSS.

src/context/
AuthContext.jsx: Manages user authentication state (login/logout) and provides user data across the application. It includes static fallback users for demonstration.

ThemeContext.jsx: Provides context for theme (light/dark mode) management.

src/store/ (Redux)
store.js: Configures the Redux store, combining various slices.

userSlice.js: Manages employee data (add, edit, remove, assign role), including basic salary structures. Ensures IDs are consistently strings.

attendanceSlice.js: Manages daily attendance records (check-in, check-out, status), holidays (fetched from Google Calendar API), and weekend configurations. Ensures userIds are consistently strings.

leaveSlice.js: Manages leave requests (apply, approve, reject) and tracks leave balances. Ensures userIds and request ids are consistently strings.

src/routes/
AppRoutes.jsx: Defines the application's routing logic, including protected routes based on user roles.

src/hooks/
useAuth.js, useTheme.js: Custom React hooks for easy access to authentication and theme context.

src/utils/
payroll.js: Contains the calculatePayroll utility function, used for computing an employee's net salary based on their salary structure, attendance records, leave, holidays, and weekends.

localStorage.js, sessionStorage.js: Utilities for interacting with browser's localStorage and sessionStorage.

src/components/ (Reusable UI Elements)
Navbar.jsx: Application navigation bar with dynamic links based on user role and theme toggle.

Login.jsx: User login form.

Modal.jsx: A reusable modal component.

Button.jsx, Input.jsx, ThemeToggle.jsx: Generic UI components.

SalarySlipPDF.jsx: Defines the structure and styling for the PDF version of salary slips generated from the payroll overview.

EmployeeAttendancePDF.jsx: Defines the structure and styling for the PDF version of employee attendance reports.

IndividualSalarySlipGenerator.jsx: (Newly Integrated) Contains a form to manually input employee details (selected from a dropdown of existing employees) and specific attendance days (present, half-days) to generate a customized salary slip in PDF format using its internal SalaryPDF component. This component also has its own calculation logic.

src/features/ (Feature-Specific Components)
admin/:

AdminDashboard.jsx: Dashboard for administrators, allowing management of employees (add, edit, delete), viewing all leave applications, and accessing payroll management.

EmployeeForm.jsx: Form for adding and editing employee details, including name, email, role, password, and department.

hr/:

HRDashboard.jsx: Dashboard for HR users, providing access to employee management (assign role, view details, delete), leave application overview, and payroll management. Includes settings for holidays and weekends.

PayrollManagement.jsx: Central component for payroll functionalities, integrating the IndividualSalarySlipGenerator form and displaying the monthly payroll overview table for all employees. It handles downloading slips for each employee in the table.

RoleAssignment.jsx: Component for HR to assign roles to employees.

employee/:

EmployeeProfile.jsx: Displays an employee's personal profile, adjusted salary, and allows applying for leave.

EmployeeAttendance.jsx: Allows employees to check in and check out, and displays their daily attendance status.

EmployeeDetails.jsx: Displays detailed attendance history for a specific employee.

leave/:

LeavePage.jsx: A placeholder page for leave management functionalities (apply, requests, balances).

server/models/
Attendance.js, Payroll.js: Mongoose schemas (JavaScript models for MongoDB) indicating the intended backend data structures for Attendance and Payroll records. (Note: A full backend implementation is not included in the provided frontend code.)

Setup Instructions
To get the project up and running on your local machine:

Clone the repository:

Bash

git clone https://github.com/asifkhan2513/user-management-frontend.git
cd user-management-frontend
Install dependencies:

Bash

npm install
# or yarn install
Set up Google Calendar API (Optional, for holidays):

Create a .env file in the root of the project.

Add your Google Calendar ID and API Key to the .env file:

VITE_GOOGLE_CALENDAR_ID=your_calendar_id
VITE_GOOGLE_API_KEY=your_api_key
(Replace your_calendar_id and your_api_key with your actual Google Calendar API credentials. Ensure your API key is restricted and has access to the Google Calendar API.)

Start the development server:

Bash

npm run dev
# or yarn dev
The application will typically open in your browser at http://localhost:5173.

Login Credentials
For demonstration purposes, the application includes static login credentials:

Admin:

Email: admin@gmail.com

Password: admin

HR:

Email: hr@gmail.com

Password: hr

Employee:

Email: employee@gmail.com

Password: employee

You can also create new employees (from the Admin dashboard) and log in with their credentials.

