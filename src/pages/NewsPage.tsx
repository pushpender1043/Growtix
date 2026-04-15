import { useEffect, useState } from "react";
import { 
  Cpu, 
  ExternalLink, 
  Trophy, 
  Video, 
  Newspaper, 
  RefreshCcw, 
  Calendar,
  Clock,
  Globe
} from "lucide-react";
import { useNotifications } from "@/hooks/useNotifications";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("tech"); 
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const fetchContent = async (tab: string) => {
  setLoading(true);
  setError(null);
  try {
    if (tab === "tech") {
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
      const response = await fetch(`https://gnews.io/api/v4/search?q=technology&lang=en&max=12&apikey=${apiKey}`);
      const result = await response.json();
      
      if (result.articles && result.articles.length > 0) {
        setData(result.articles);
        // Trigger News Notification
        addNotification(`Tech News: ${result.articles[0].title.substring(0, 30)}...`, 'news');
      }
    } 
    else if (tab === "hackathons") {
      try {
        // Timeout logic: Agar 3 seconds mein response nahi aaya toh fallback use karo
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const targetUrl = "https://kontests.net/api/v1/all";
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`;
        
        const response = await fetch(proxyUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        const json = await response.json();
        const result = JSON.parse(json.contents);
        
        if (result && result.length > 0) {
          setData(result.slice(0, 15));
          addNotification(`New Hackathons available!`, 'hackathon');
        } else {
          throw new Error("No data");
        }
      } catch (err) {
        console.warn("Using Fallback for Hackathons due to Timeout/CORS");
        const fallback = [
          { name: "Smart India Hackathon 2026", start_time: "2026-08-15", url: "https://sih.gov.in", site: "SIH" },
          { name: "Global AI Build Challenge", start_time: "2026-05-10", url: "https://devpost.com", site: "Devpost" },
          { name: "MLH Summer Hack", start_time: "2026-06-01", url: "https://mlh.io", site: "MLH" }
        ];
        setData(fallback);
        // Notification for fallback too!
        addNotification(`Alert: 3 New Hackathons added to your feed!`, 'hackathon');
      }
    }
    else if (tab === "events") {
      const eventsData = [
        { name: "Google I/O 2026", start_time: "2026-05-20", url: "https://events.google.com", site: "Google" },
        { name: "React India Summit", start_time: "2026-06-12", url: "https://reactindia.org", site: "ReactIndia" },
        { name: "AWS Summit Mumbai", start_time: "2026-04-30", url: "https://aws.amazon.com", site: "AWS" }
      ];
      setData(eventsData);
      // Event Notification trigger
      addNotification(`Upcoming Webinar: ${eventsData[0].name}`, 'event');
    }
  } catch (error) {
    console.error("General Fetch Error:", error);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchContent(activeTab);
  }, [activeTab]);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
      
      {/* --- HEADER SECTION --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading">Tech Hub</h1>
          <p className="text-muted-foreground text-sm font-medium">Your daily dose of tech, contests, and learning events</p>
        </div>

        {/* --- TOGGLE BUTTONS (TABS) --- */}
        <div className="flex p-1.5 bg-muted/50 backdrop-blur-sm rounded-2xl border border-border w-fit shadow-inner">
          {[
            { id: "tech", label: "Tech News", icon: Newspaper },
            { id: "events", label: "Webinars", icon: Video },
            { id: "hackathons", label: "Hackathons", icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? "bg-background text-primary shadow-lg scale-105" 
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-2xl text-destructive text-center mb-8">
          {error}
        </div>
      )}

      {/* --- CONTENT SECTION --- */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-72 rounded-3xl bg-muted animate-pulse border border-border/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
          {activeTab === "tech" ? (
            data.map((item, index) => (
              <a 
                key={index} 
                href={item.url} 
                target="_blank" 
                rel="noreferrer"
                className="group flex flex-col bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/40 transition-all hover:shadow-2xl"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10" />
                  <img src={item.image} alt="news" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-3 h-3 text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.source.name}</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight mb-4 line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between text-muted-foreground pt-4 border-t border-border/50">
                    <span className="text-xs font-semibold flex items-center gap-1">Read Article <ExternalLink className="w-3 h-3" /></span>
                    <Clock className="w-3 h-3" />
                  </div>
                </div>
              </a>
            ))
          ) : (
            data.map((item, index) => (
              <div 
                key={index} 
                className="bg-card p-7 rounded-3xl border border-border hover:border-primary/40 transition-all group relative overflow-hidden flex flex-col"
              >
                <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   {activeTab === "hackathons" ? <Trophy size={120} /> : <Video size={120} />}
                </div>

                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm ${activeTab === "hackathons" ? "bg-yellow-500/10 text-yellow-600" : "bg-blue-500/10 text-blue-600"}`}>
                  {activeTab === "hackathons" ? <Trophy className="w-7 h-7" /> : <Video className="w-7 h-7" />}
                </div>

                <h3 className="text-xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors flex-1">
                  {item.name || item.title}
                </h3>
                
                <div className="space-y-3 mb-8">
                   <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">Starts: {new Date(item.start_time).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                   </div>
                   <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary text-[10px] font-bold text-secondary-foreground uppercase tracking-widest">
                      {item.site || 'Verified Event'}
                   </div>
                </div>

                <a 
                  href={item.url} 
                  target="_blank" 
                  rel="noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-bold text-sm shadow-lg shadow-primary/20"
                >
                  Register Now <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}