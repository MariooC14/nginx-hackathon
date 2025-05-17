import { AppSidebar } from "./app-sidebar";
import { ThemeProvider } from "./theme-provider";
import { SidebarProvider, SidebarTrigger } from "./ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <main className="max-w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ThemeProvider>
  )
}