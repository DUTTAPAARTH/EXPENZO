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
import { BudgetProvider } from "./context/BudgetContext";
import { RuleProvider } from "./context/RuleContext";

// Pages
import Login from "./pages/Login";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import OnboardingPage from "./pages/OnboardingPage";
import Dashboard from "./pages/Dashboard";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetsPage from "./pages/BudgetsPage";
import SettingsPage from "./pages/SettingsPage";
import AddExpense from "./pages/AddExpense";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";
import Groups from "./pages/Groups";
import Landing from "./pages/Landing";
import AuthLanding from "./pages/AuthLanding";
import RulesPage from "./pages/RulesPage";
import SplitsPage from "./pages/SplitsPage";

// Components
import Navbar from "./components/Navbar";
import MainLayout from "./components/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BudgetProvider>
          <RuleProvider>
            <ExpenseProvider>
              <Router>
                <div className="min-h-screen bg-cream-500 dark:bg-dark-base transition-colors duration-300">
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
                  <main>
                    <Routes>
                      {/* Public Routes */}
                      <Route path="/" element={<Landing />} />
                      <Route path="/auth" element={<AuthLanding />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signin" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/register" element={<SignupPage />} />
                      <Route path="/onboarding" element={<OnboardingPage />} />

                      {/* Protected Routes - Wrapped in MainLayout */}
                      <Route
                        path="/dashboard"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <DashboardPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/add-expense"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <AddExpense />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/expenses"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <ExpensesPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/analytics"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <AnalyticsPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/insights"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Insights />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/profile"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Profile />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/settings"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <SettingsPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/rules"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <RulesPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      {/* Groups Route */}
                      <Route
                        path="/groups"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Groups />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      {/* Friendly redirect for typos */}
                      <Route path="/group" element={<Navigate to="/groups" replace />} />
                      <Route
                        path="/budgets"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <BudgetsPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/ai-insights"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <Insights />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />
                      <Route
                        path="/splits"
                        element={
                          <ProtectedRoute>
                            <MainLayout>
                              <SplitsPage />
                            </MainLayout>
                          </ProtectedRoute>
                        }
                      />

                      {/* Catch all route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </main>
                </div>
              </Router>
            </ExpenseProvider>
          </RuleProvider>
        </BudgetProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
