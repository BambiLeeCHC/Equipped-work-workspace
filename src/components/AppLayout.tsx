import { Outlet } from "react-router-dom";
import { TopNavbar } from "./TopNavbar";
import { ContentProtection } from "./ContentProtection";
import { PageTracker } from "./PageTracker";

export function AppLayout() {
  return (
    <ContentProtection>
      <PageTracker />
      <div className="min-h-screen flex flex-col">
        <TopNavbar />
        <main className="flex-1 p-4 lg:p-6 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </ContentProtection>
  );
}
