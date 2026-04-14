import { Search, Bell, Calendar, Globe } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useLanguage, LANGUAGES } from "@/hooks/useLanguage";

export function TopHeader() {
  const { profile, user } = useAuth();
  const userName = profile?.full_name;
  const avatarUrl = profile?.avatar_url;
  const { language, setLanguage, t } = useLanguage();

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
            placeholder={t("Search courses, topics, challenges...")}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-muted/50 border-0 text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{today}</span>
        </div>

        <div className="flex items-center gap-1 bg-muted/30 p-1.5 rounded-lg border border-border/50 min-h-[36px]">
          <Globe className="w-4 h-4 text-muted-foreground ml-1 mr-1 shrink-0" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-sm font-medium focus:outline-none pr-2 cursor-pointer text-foreground appearance-none outline-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-accent" />
        </button>

        <Link to="/profile" className="flex items-center gap-2.5 pl-2 border-l border-border/50 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
              {(userName || user?.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-medium leading-none">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden max-w-[120px] whitespace-nowrap">{user?.email || "Full Stack Dev"}</p>
          </div>
        </Link>
      </div>
    </header>
  );
}
