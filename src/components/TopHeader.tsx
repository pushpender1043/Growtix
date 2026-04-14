import { useState, useEffect } from "react";
import { Bell, Calendar, Globe } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useLanguage, LANGUAGES } from "@/hooks/useLanguage";

export function TopHeader() {
  const { profile, user } = useAuth();
  const userName = profile?.full_name;
  const avatarUrl = profile?.avatar_url;
  const { language, setLanguage } = useLanguage();

  // Real-time Date State
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    // Har 1 minute mein date update hogi
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-border/50 bg-card/60 backdrop-blur-md sticky top-0 z-30">
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-1.5 text-sm text-muted-foreground font-medium">
          <Calendar className="w-4 h-4" />
          <span>{todayStr}</span>
        </div>

        {/* Clean & Simple Language Toggle */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 hover:bg-secondary/80 border border-border/50 transition-all">
          <Globe className="w-4 h-4 text-muted-foreground shrink-0" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer text-foreground appearance-none"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-background text-foreground">
                {lang}
              </option>
            ))}
          </select>
        </div>

        <button className="relative p-2 rounded-full hover:bg-secondary/80 transition-colors">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
        </button>

        <Link to="/profile" className="flex items-center gap-2.5 pl-2 border-l border-border/50 hover:opacity-80 transition-opacity">
          <Avatar className="w-8 h-8 ring-2 ring-primary/20">
            <AvatarImage src={avatarUrl || ""} />
            <AvatarFallback className="gradient-primary text-primary-foreground text-xs font-semibold">
              {(userName || user?.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block">
            <p className="text-sm font-semibold leading-none">{userName || "User"}</p>
            <p className="text-xs text-muted-foreground text-ellipsis overflow-hidden max-w-[120px] whitespace-nowrap">
              {user?.email || "Developer"}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}