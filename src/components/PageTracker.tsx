// @ts-nocheck
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

/** Tracks every route change as a page view */
export function PageTracker() {
  const location = useLocation();
  const track = useMutation(api.admin.trackPageView);
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
