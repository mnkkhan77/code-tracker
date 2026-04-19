import { ThemeProvider } from "@/components/ThemeProvider";
import { AdBlockerDetector } from "./components/AdBlockerDetector";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { HybridLayout } from "./components/layout/HybridLayout";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { Suspense, lazy } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Public Pages
const LandingPage          = lazy(() => import("@/pages/Landing"));
const AboutPage            = lazy(() => import("@/pages/AboutPage"));
const PrivacyPage          = lazy(() => import("@/pages/PrivacyPage"));
const TermsPage            = lazy(() => import("@/pages/TermsPage"));
const AuthPage             = lazy(() => import("@/pages/Auth"));
const LoginPage            = lazy(() => import("@/pages/LoginPage"));
const RegisterPage         = lazy(() => import("@/pages/RegisterPage"));
const NotFoundPage         = lazy(() => import("@/pages/NotFound"));

// Hybrid / standalone
const ProblemsPage         = lazy(() => import("@/pages/ProblemsPage"));
const PricingPage          = lazy(() => import("@/pages/PricingPage"));
const PaymentSuccessPage   = lazy(() => import("@/pages/payment/PaymentSuccessPage"));
const PaymentCancelPage    = lazy(() => import("@/pages/payment/PaymentCancelPage"));

// Authenticated User Pages
const Dashboard            = lazy(() => import("@/pages/Dashboard"));
const ProfilePage          = lazy(() => import("@/pages/ProfilePage"));
const ProgressPage         = lazy(() => import("@/pages/ProgressPage"));
const RemindersPage        = lazy(() => import("@/pages/RemindersPage"));
const ATSResumeChecker     = lazy(() => import("@/pages/ATSResumeCheckerContent"));
const TopicsPage           = lazy(() => import("@/pages/Topics"));
const TopicPage            = lazy(() => import("./pages/TopicPage"));

// Admin Pages
const AdminDashboard       = lazy(() => import("@/pages/AdminDashboard"));
const AdminUsersPage       = lazy(() => import("@/pages/admin/AdminUsersPage"));
const AdminUserDetailsPage = lazy(() => import("@/pages/admin/AdminUserDetailsPage"));
const AdminProblemsPage    = lazy(() => import("@/pages/admin/AdminProblemsPage"));
const AdminProblemDetailsPage = lazy(() => import("@/pages/admin/AdminProblemDetailsPage"));
const AdminRevenuePage     = lazy(() => import("@/pages/admin/AdminRevenuePage"));
const AdminAnalyticsPage   = lazy(() => import("@/pages/admin/AdminAnalyticsPage"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
  </div>
);

function App() {
  return (
    <AdBlockerDetector>
      <ThemeProvider defaultTheme="system">
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
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

              {/* Hybrid Route for Problems Page + Pricing */}
              <Route element={<HybridLayout />}>
                <Route path="/problems" element={<ProblemsPage />} />
                <Route path="/pricing" element={<PricingPage />} />
              </Route>

              {/* Payment result pages — standalone (no sidebar) */}
              <Route path="/payment/success" element={<PaymentSuccessPage />} />
              <Route path="/payment/cancel" element={<PaymentCancelPage />} />

              {/* Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/progress" element={<ProgressPage />} />
                  <Route path="/reminders" element={<RemindersPage />} />
                  <Route path="/ats-resume-checker" element={<ATSResumeChecker />} />
                  <Route path="/topics" element={<TopicsPage />} />
                  <Route path="/topics/:slug" element={<TopicPage />} />

                  {/* Admin-only Routes */}
                  <Route element={<AdminRoute />}>
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<AdminUsersPage />} />
                    <Route path="/admin/users/:id" element={<AdminUserDetailsPage />} />
                    <Route path="/admin/problems" element={<AdminProblemsPage />} />
                    <Route path="/admin/problems/:id" element={<AdminProblemDetailsPage />} />
                    <Route path="/admin/revenue" element={<AdminRevenuePage />} />
                    <Route path="/admin/analytics" element={<AdminAnalyticsPage />} />
                  </Route>
                </Route>
              </Route>

              {/* Catch-all Not Found Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </AdBlockerDetector>
  );
}

export default App;
