import { useConvexAuth } from "convex/react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * Like ProtectedRoute but redirects unauthenticated users
 * to /workspace-login instead of /login.
 */
export function WorkspaceProtectedRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/workspace-login" replace />;

  return <Outlet />;
}
