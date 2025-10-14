import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { ExpenseProvider } from "./context/ExpenseContext";
import { ThemeProvider } from "./context/ThemeContext";

// Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AddExpense from "./pages/AddExpense";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import Landing from "./pages/Landing";

// Components
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ExpenseProvider>
          <Router>
            <div className="min-h-screen bg-cream-500 dark:bg-dark-base transition-colors duration-300">
              <Navbar />

              {/* Toast notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: "#FFC300",
                    color: "#121212",
                    fontWeight: "600",
                    borderRadius: "1rem",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  },
                  success: {
                    style: {
                      background: "#2ECCB0",
                      color: "#ffffff",
                    },
                  },
                  error: {
                    style: {
                      background: "#ef4444",
                      color: "#ffffff",
                    },
                  },
                }}
              />

              {/* Main Content */}
              <main className="pt-16">
                {" "}
                {/* Account for fixed navbar */}
                <Routes>
                  {/* Direct access to dashboard (bypassing auth) */}
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard" replace />}
                  />
                  <Route path="/dashboard" element={<Dashboard />} />

                  {/* Other routes - temporarily made public */}
                  <Route path="/add-expense" element={<AddExpense />} />
                  <Route path="/insights" element={<Insights />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/groups" element={<Groups />} />

                  {/* Login/Register temporarily accessible but not required */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/landing" element={<Landing />} />

                  {/* Catch all route */}
                  <Route
                    path="*"
                    element={<Navigate to="/dashboard" replace />}
                  />
                </Routes>
              </main>
            </div>
          </Router>
        </ExpenseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
