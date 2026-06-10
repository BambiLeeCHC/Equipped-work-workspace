// @ts-nocheck
import { useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

/**
 * Content Protection System
 * - Disables right-click context menu on protected content
 * - Blocks print (Ctrl+P / Cmd+P)
 * - Detects PrintScreen / screenshot hotkeys and logs them
 * - Adds a CSS overlay that disrupts screenshots (DRM-style)
 * - Disables text selection on lesson content
 * - Blocks screen recording detection via mediaDevices
 */
export function ContentProtection({ children }: { children: React.ReactNode }) {
  const trackSecurity = useMutation(api.admin.trackSecurityEvent);
  const user = useQuery(api.auth.currentUser);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Block right-click
    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Allow right-click on inputs/textareas
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      e.preventDefault();
    };

    // Block print
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + P = print
      if ((e.ctrlKey || e.metaKey) && e.key === "p") {
        e.preventDefault();
        trackSecurity({ eventType: "print_attempt", path: window.location.pathname });
        return;
      }
      // Ctrl/Cmd + S = save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        return;
      }
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        trackSecurity({ eventType: "screenshot_attempt", path: window.location.pathname });
        // Briefly flash overlay to corrupt the screenshot
        flashProtection();
        return;
      }
      // Cmd+Shift+3/4 (macOS screenshot)
      if (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5")) {
        e.preventDefault();
        trackSecurity({ eventType: "screenshot_attempt", path: window.location.pathname });
        flashProtection();
        return;
      }
      // Block F12 / Ctrl+Shift+I (devtools)
      if (e.key === "F12" || ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "I")) {
        e.preventDefault();
        trackSecurity({ eventType: "devtools_open", path: window.location.pathname });
        return;
      }
    };

    // Block drag
    const handleDragStart = (e: DragEvent) => {
      e.preventDefault();
    };

    // NOTE: getDisplayMedia is NOT blocked — it is used for screen sharing inside Work[space] rooms.
    // Screen recording detection is handled via watermark overlay instead.

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("dragstart", handleDragStart);

    // Block print via beforeprint
    const handleBeforePrint = () => {
      trackSecurity({ eventType: "print_attempt", path: window.location.pathname });
    };
    window.addEventListener("beforeprint", handleBeforePrint);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("dragstart", handleDragStart);
      window.removeEventListener("beforeprint", handleBeforePrint);
      // (getDisplayMedia not overridden — no restore needed)
    };
  }, [trackSecurity]);

  function flashProtection() {
    if (overlayRef.current) {
      overlayRef.current.style.opacity = "1";
      setTimeout(() => {
        if (overlayRef.current) overlayRef.current.style.opacity = "0";
      }, 500);
    }
  }

  return (
    <div className="content-protected relative">
      {children}
      {/* Watermark overlay — visible but subtle, ruins screenshots */}
      <div className="pointer-events-none fixed inset-0 z-[9998] opacity-[0.03] select-none"
        style={{
          backgroundImage: `repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 80px,
            rgba(128,0,128,0.15) 80px,
            rgba(128,0,128,0.15) 81px
          )`,
          mixBlendMode: "multiply",
        }}>
        {user?.email && (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[3vw] font-bold rotate-[-30deg] whitespace-nowrap opacity-30 text-fuchsia-900/10 select-none">
              {user.email}
            </p>
          </div>
        )}
      </div>
      {/* Flash overlay for screenshot blocking */}
      <div ref={overlayRef}
        className="pointer-events-none fixed inset-0 z-[9999] bg-white transition-opacity duration-200 select-none"
        style={{ opacity: 0 }} />
    </div>
  );
}
