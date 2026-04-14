import { useEffect, useState } from "react";
import { Newspaper, ExternalLink, AlertCircle, RefreshCcw, Clock } from "lucide-react";

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const apiKey = import.meta.env.VITE_GNEWS_API_KEY;
      // GNews API is much more stable for Vercel and local dev
      const response = await fetch(
        `https://gnews.io/api/v4/top-headlines?category=technology&lang=en&apikey=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error(`GNews Error: ${response.status}. Check your API Key.`);
      }

      const data = await response.json();
      
      if (data.articles) {
        setNews(data.articles);
      } else {
        setNews([]);
      }
    } catch (err: any) {
      console.error("News Error:", err);
      setError("Unable to fetch news. Please check your API key and connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen pb-20">
      <div className="flex items-center justify-between mb-10 bg-card p-6 rounded-3xl border border-border shadow-sm">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
            <Newspaper className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-heading">Tech Radar</h1>
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-medium">Global Technology Updates</p>
          </div>
        </div>
        <button 
          onClick={fetchNews}
          className="p-3 rounded-2xl hover:bg-muted transition-all border border-border"
        >
          <RefreshCcw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {error && (
        <div className="p-4 mb-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 rounded-3xl bg-muted animate-pulse border border-border/50" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item: any, index: number) => (
            <div 
              key={index}
              className="group flex flex-col bg-card rounded-3xl border border-border overflow-hidden hover:border-primary/40 transition-all duration-300 hover:shadow-xl"
            >
              {item.image && (
                <div className="h-40 overflow-hidden">
                  <img src={item.image} alt="news" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-primary uppercase tracking-tighter">
                  <Clock className="w-3 h-3" />
                  {new Date(item.publishedAt).toLocaleDateString()}
                </div>
                <h3 className="text-lg font-bold leading-tight mb-3 line-clamp-2">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1">
                  {item.description}
                </p>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-secondary hover:bg-primary hover:text-primary-foreground transition-all text-sm font-semibold"
                >
                  Read Article <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}