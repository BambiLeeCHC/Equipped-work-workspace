import { useConvexAuth, useQuery } from "convex/react";
import { Navigate, Outlet } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";
import { api } from "../../convex/_generated/api";

function WorkspaceAuthSkeleton() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#0a0a0e]">
      <div className="w-full max-w-md space-y-6">
        <Skeleton className="h-9 w-32 mx-auto" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  );
}

/**
 * Like PublicOnlyRoute but redirects authenticated users:
 *  - Admin users → /admin  (platform admin dashboard)
 *  - Regular users → /workspace  (workspace lobby)
 */
export function WorkspacePublicOnlyRoute() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  // Only query isAdmin when authenticated (avoids unnecessary call)
  const isAdmin = useQuery(
    api.admin.isAdmin,
    isAuthenticated ? {} : "skip",
  );

  if (isLoading) return <WorkspaceAuthSkeleton />;

  if (isAuthenticated) {
    // Wait until we know admin status before redirecting
    if (isAdmin === undefined) return <WorkspaceAuthSkeleton />;
    return <Navigate to={isAdmin ? "/admin" : "/workspace"} replace />;
  }

  return <Outlet />;
}
