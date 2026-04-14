import { LayoutDashboard, BookOpen, Bot, Code, Swords, GraduationCap, LogOut, UserCheck, Newspaper } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Learning Hub", url: "/learning-hub", icon: BookOpen },
  { title: "AI Mentor", url: "/ai-mentor", icon: Bot },
  { title: "Tech News", url: "/tech-news", icon: Newspaper },
  { title: "Mock Interview", url: "/mock-interview", icon: UserCheck },
  { title: "Smart Editor", url: "/smart-editor", icon: Code },
  { title: "Dev Arena", url: "/dev-arena", icon: Swords },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <Link to="/dashboard" className="p-4 flex items-center gap-2 hover:opacity-80 transition-opacity">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-lg gradient-text">Growtix</span>
        )}
      </Link>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-11 rounded-xl">
                    <NavLink
                      to={item.url}
                      end={item.url === "/dashboard"}
                      className="flex items-center gap-3 px-3 py-2 rounded-xl text-muted-foreground transition-all hover:bg-sidebar-accent"
                      activeClassName="gradient-primary text-primary-foreground font-medium shadow-md"
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && <span className="text-sm">{t(item.title)}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("Logout")}</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}