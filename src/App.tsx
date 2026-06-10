import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./components/AppLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicLayout } from "./components/PublicLayout";
import { PublicOnlyRoute } from "./components/PublicOnlyRoute";
import { WorkspacePublicOnlyRoute } from "./components/WorkspacePublicOnlyRoute";
import { WorkspaceProtectedRoute } from "./components/WorkspaceProtectedRoute";
import { WorkspaceAppLayout } from "./components/WorkspaceAppLayout";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./contexts/ThemeContext";
import {
  WorkspaceLandingPage,
  LandingPage,
  SplitLandingPage,
  LoginPage,
  SettingsPage,
  SignupPage,
} from "./pages";
import { CourseDashboard } from "./pages/CourseDashboard";
import { LessonPage } from "./pages/LessonPage";
import { LegalPage } from "./pages/LegalPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { PricingPage } from "./pages/PricingPage";
import { WorkspacePricingPage } from "./pages/WorkspacePricingPage";
import { WorkspaceLegalPage } from "./pages/WorkspaceLegalPage";
import { WorkspaceLoginPage } from "./pages/WorkspaceLoginPage";

import { WorkspaceLobby, WorkspaceView } from "./pages/WorkspacePage";
import WorkspaceAdminPage from "./pages/WorkspaceAdminPage";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" switchable>
        <Toaster />
        <Routes>
          {/* ── Split chooser ── */}
          <Route path="/" element={<SplitLandingPage />} />

          {/* ── Workspace public pages (own nav, no PublicLayout) ── */}
          <Route path="/workspace-home" element={<WorkspaceLandingPage />} />
          <Route path="/workspace-pricing" element={<WorkspacePricingPage />} />
          <Route path="/workspace-legal/:slug" element={<WorkspaceLegalPage />} />
          <Route path="/workspace-legal" element={<WorkspaceLegalPage />} />

          {/* ── Workspace auth (dark theme, redirects → /workspace) ── */}
          <Route element={<WorkspacePublicOnlyRoute />}>
            <Route path="/workspace-login" element={<WorkspaceLoginPage />} />
          </Route>

          {/* ── Workspace protected pages (own layout, no Work TopNavbar) ── */}
          <Route element={<WorkspaceProtectedRoute />}>
            <Route element={<WorkspaceAppLayout />}>
              <Route path="/workspace" element={<WorkspaceLobby />} />
              <Route path="/workspace/:workspaceId" element={<WorkspaceView />} />
              <Route path="/workspace/:workspaceId/admin" element={<WorkspaceAdminPage />} />
            </Route>
          </Route>

          {/* ── Work public pages (PublicLayout chrome) ── */}
          <Route element={<PublicLayout />}>
            <Route path="/work" element={<LandingPage />} />
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route path="/legal" element={<LegalPage />} />
          </Route>

          {/* ── Work protected pages (AppLayout with TopNavbar) ── */}
          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<CourseDashboard />} />
              <Route path="/lessons/:lessonId" element={<LessonPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
