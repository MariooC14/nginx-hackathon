import { CircleGauge, Logs, ShieldAlert } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import { ModeToggle } from "./mode-toggle"
import { Button } from "./ui/button"
import { useAboutDialog } from "./AboutDialogProvider"

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: CircleGauge,
  },
  {
    title: "Anomalies",
    url: "/anomalies",
    icon: ShieldAlert,
  },
  {
    title: "Logs",
    url: "/logs",
    icon: Logs,
  },
]

export function AppSidebar() {
  const { setAboutOpen } = useAboutDialog();;

  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>NGINX Analyzer</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="flex gap-2">
          <ModeToggle />
          <Button className="text-xs flex-1" variant="outline" onClick={() => setAboutOpen(true)}>About</Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
