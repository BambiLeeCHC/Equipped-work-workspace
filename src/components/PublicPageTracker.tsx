import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Tracks page views on public (unauthenticated) pages.
 * Drop this into any page component to record the visit.
 */
export function PublicPageTracker() {
  const location = useLocation();
  const track = useMutation(api.admin.trackPublicPageView);
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      track({
        path: location.pathname,
        userAgent: navigator.userAgent,
      }).catch(() => {/* silent */});
    }
  }, [location.pathname, track]);

  return null;
}
