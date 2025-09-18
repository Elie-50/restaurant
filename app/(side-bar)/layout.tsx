import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import ReduxProvider from "@/components/client/ReduxProvider";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full">
        <SidebarTrigger />
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </main>
    </SidebarProvider>
  );
}
