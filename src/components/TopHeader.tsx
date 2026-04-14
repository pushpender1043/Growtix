import { Search, Bell, Calendar } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function TopHeader({ userName }: { userName?: string }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger className="text-muted-foreground" />
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses, topics, challenges..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </button>

        <div className="flex items-center gap-2.5 pl-2 border-l border-border/50">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
              {(userName || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground">Full Stack Dev</p>
          </div>
        </div>
      </div>
    </header>
  );
}
