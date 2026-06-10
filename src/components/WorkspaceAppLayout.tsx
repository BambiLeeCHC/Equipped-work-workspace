import { Outlet } from "react-router-dom";
import { ContentProtection } from "./ContentProtection";
import { PageTracker } from "./PageTracker";
import { WorkspaceNavbar } from "./WorkspaceNavbar";

/**
 * Layout for authenticated workspace pages.
 * Includes the WorkspaceNavbar (hamburger menu, admin link, cross-link to Work).
 */
export function WorkspaceAppLayout() {
  return (
    <ContentProtection>
      <PageTracker />
      <WorkspaceNavbar />
      <Outlet />
    </ContentProtection>
  );
}
