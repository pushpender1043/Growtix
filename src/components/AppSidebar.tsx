import { LayoutDashboard, BookOpen, Bot, Code, Swords, Laptop, LogOut, UserCheck, Newspaper, GraduationCap } from "lucide-react";
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

// Refactored navItems to be grouped by section
const groupedNavItems = {
  "Core Platform": [
    { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
    { title: "Learning Hub", url: "/learning-hub", icon: BookOpen },
    { title: "AI Mentor", url: "/ai-mentor", icon: Bot },
  ],
  "Skill & Practice": [
    { title: "Mock Interview", url: "/mock-interview", icon: UserCheck },
    { title: "Smart Editor", url: "/smart-editor", icon: Code },
    { title: "Practice Lab", url: "/practice-lab", icon: GraduationCap }, 
  ],
  "Arena & Extras": [
    { title: "Dev Arena", url: "/dev-arena", icon: Swords },
    { title: "Cheat Sheet", url: "/cheatsheets", icon: Swords },
    { title: "Tech News", url: "/tech-news", icon: Newspaper },
  ],
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { signOut } = useAuth();
  const { t } = useLanguage();

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      {/* Updated Logo Area with Laptop Icon and Custom Gradient */}
      <Link to="/dashboard" className="p-5 flex items-center gap-3 hover:opacity-80 transition-opacity mb-2">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-sm">
          <Laptop className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading font-extrabold text-2xl tracking-tight bg-gradient-to-r from-[#5b6ec4] via-[#a37bb0] to-[#df7d64] text-transparent bg-clip-text">
            Growtix
          </span>
        )}
      </Link>

      {/* Added overflow-y-auto and custom-scrollbar here */}
      <SidebarContent className="px-3 py-2 space-y-6 overflow-y-auto custom-scrollbar"> 
        {Object.entries(groupedNavItems).map(([heading, items]) => (
          <SidebarGroup key={heading} className="p-0">
            {!collapsed && (
              <div className="px-4 mb-2 text-[11px] font-bold tracking-widest text-muted-foreground/70 uppercase">
                {t(heading)}
              </div>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
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
        ))}
      </SidebarContent>

      <SidebarFooter className="p-4 space-y-2">
        <button 
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>{t("Logout")}</span>}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}