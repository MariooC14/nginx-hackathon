import NetworkLogsProvider from "@/NetworkLogsProvider";
import { AppSidebar } from "./app-sidebar";
import { ThemeProvider } from "./theme-provider";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NetworkLogsProvider>
        <SidebarProvider defaultOpen={true} className="flex max-w-screen">
          <AppSidebar />
          <SidebarInset>
            <main className="p-4">
              <SidebarTrigger />
              {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </NetworkLogsProvider>
    </ThemeProvider>
  )
}