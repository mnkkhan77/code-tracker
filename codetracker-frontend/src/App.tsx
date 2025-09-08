import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Layouts
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { HybridLayout } from "./components/layout/HybridLayout";

// Auth wrappers
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// --- Page Imports ---

// Public Pages
import AboutPage from "@/pages/AboutPage";
import AuthPage from "@/pages/Auth";
import LandingPage from "@/pages/Landing";
import LoginPage from "@/pages/LoginPage";
import NotFoundPage from "@/pages/NotFound";
import PrivacyPage from "@/pages/PrivacyPage";
import ProblemsPage from "@/pages/ProblemsPage";
import RegisterPage from "@/pages/RegisterPage";
import TermsPage from "@/pages/TermsPage";

// Authenticated User Pages
import ATSResumeChecker from "@/pages/ATSResumeCheckerContent";
import Dashboard from "@/pages/Dashboard";
import ProfilePage from "@/pages/ProfilePage";
import ProgressPage from "@/pages/ProgressPage";
import RemindersPage from "@/pages/RemindersPage";
import TopicsPage from "@/pages/Topics";

// Admin Pages
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProblemDetailsPage from "@/pages/admin/AdminProblemDetailsPage";
import AdminRevenuePage from "@/pages/admin/AdminRevenuePage";
import AdminUserDetailsPage from "@/pages/admin/AdminUserDetailsPage";
import AdminUsersPage from "@/pages/admin/AdminUsersPage";
import { AdBlockerDetector } from "./components/AdBlockerDetector";
import TopicPage from "./pages/TopicPage";

function App() {
  return (
    <AdBlockerDetector>
      <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            {/* Hybrid Route for Problems Page */}
            <Route element={<HybridLayout />}>
              <Route path="/problems" element={<ProblemsPage />} />
            </Route>

            {/* Authenticated Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/progress" element={<ProgressPage />} />
                <Route path="/reminders" element={<RemindersPage />} />
                <Route
                  path="/ats-resume-checker"
                  element={<ATSResumeChecker />}
                />
                <Route path="/topics" element={<TopicsPage />} />
                <Route path="/topics/:slug" element={<TopicPage />} />
                {/* <Route path="/topics/:slug" element={<DummyPage />} /> */}

                {/* Admin-only Routes */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<AdminUsersPage />} />
                  <Route
                    path="/admin/users/:id"
                    element={<AdminUserDetailsPage />}
                  />
                  <Route
                    path="/admin/problems/:id"
                    element={<AdminProblemDetailsPage />}
                  />
                  <Route path="/admin/revenue" element={<AdminRevenuePage />} />
                </Route>
              </Route>
            </Route>

            {/* Catch-all Not Found Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </AdBlockerDetector>
  );
}

export default App;
