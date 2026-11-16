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
    <header className="h-16 flex items-center justify-between px-4 md:px-8 bg-background/60 backdrop-blur-md sticky top-0 z-40 border-b border-border/30">
      
      {/* Left side: Sidebar Trigger */}
      <div className="flex items-center flex-1">
        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
      </div>

      {/* Right side: Actions & Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        
        {/* Minimal Date - No Background */}
        <div className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground mr-2">
          <Calendar className="w-4 h-4 opacity-70" />
          <span>{todayStr}</span>
        </div>

        {/* Smart Language Toggle - Only Icon is visible */}
        <div className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <Globe className="w-5 h-5" />
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            title="Change Language"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang} value={lang} className="bg-background text-foreground">
                {lang}
              </option>
            ))}
          </select>
        </div>

        {/* Minimal Notification Bell */}
        <button className="relative p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground hover:text-foreground">
          <Bell className="w-5 h-5" />
          {/* Subtle dot indicator */}
          <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-primary" />
        </button>

        {/* Divider */}
        <div className="hidden md:block w-[1px] h-5 bg-border/50 mx-1"></div>

        {/* Ultra-clean Profile */}
        <Link 
          to="/profile" 
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-secondary/40 transition-colors"
        >
          <Avatar className="w-8 h-8">
            <AvatarImage src={avatarUrl || ""} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
              {(userName || user?.email || "U")[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="hidden md:block pr-2">
            <p className="text-sm font-medium text-foreground leading-none">
              {userName || "User"}
            </p>
          </div>
        </Link>
        
      </div>
    </header>
  );
}