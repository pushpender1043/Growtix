import React, { useState, useMemo, useRef, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, Code2, Terminal, Layers, Database, FileJson, 
  ZoomIn, X, Sparkles, Cpu, BookOpen, FileText, DownloadCloud 
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';
import { useAuth } from "../hooks/useAuth"; 

// --- Supabase Client ---
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL, 
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- Interfaces ---
interface Topic {
  id: string;
  name: string;
  completed: number;
  total: number;
  icon: ReactNode;
}

interface PackedNode extends Topic {
  x: number;
  y: number;
  r: number;
  floatDuration: number;
  floatDelay: number;
  floatY: number;
}

const initialTopics: Topic[] = [
  { id: "dsa", name: "DSA", completed: 0, total: 300, icon: <Code2 size={14}/> },
  { id: "full_stack", name: "Full Stack", completed: 0, total: 150, icon: <Layers size={14}/> },
  { id: "mern", name: "MERN Stack", completed: 0, total: 120, icon: <FileJson size={14}/> },
  { id: "oops", name: "OOPs", completed: 0, total: 50, icon: <BookOpen size={14}/> },
  { id: "dbms", name: "DBMS", completed: 0, total: 100, icon: <Database size={14}/> },
  { id: "python", name: "Python", completed: 0, total: 110, icon: <Terminal size={14}/> },
  { id: "java", name: "Java", completed: 0, total: 150, icon: <Terminal size={14}/> },
  { id: "cpp", name: "C++", completed: 0, total: 100, icon: <Code2 size={14}/> },
  { id: "c", name: "C", completed: 0, total: 60, icon: <Code2 size={14}/> },
  { id: "os", name: "OS", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "HTML", name: "HTML", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "CSS", name: "CSS", completed: 0, total: 80, icon: <Cpu size={14}/> },
  { id: "JS", name: "JS", completed: 0, total: 80, icon: <Cpu size={14}/> },
];

const cheatSheetContent: Record<string, { description: string, pdfUrl: string | null }> = {
  "DSA": { description: "Complete Data Structures & Algorithms handwritten notes.", pdfUrl: "/pdfs/Dsa.pdf" },
  "OOPs": { description: "Core Object-Oriented Programming concepts and examples.", pdfUrl: "/pdfs/oops.pdf" },
  "MERN Stack": { description: "MongoDB, Express, React, Node.js essential configurations.", pdfUrl: "/pdfs/mern.pdf" },
  "Full Stack": { description: "End-to-end architecture and integrations.", pdfUrl: "/pdfs/fullstack.pdf" },
  "DBMS": { description: "Database Management Systems & SQL.", pdfUrl: "/pdfs/sql.pdf" },
  "Python": { description: "Advanced Python & Data Science basics.", pdfUrl: "/pdfs/pythonq.pdf" },
  "Java": { description: "Java fundamentals & Collections Framework.", pdfUrl: "/pdfs/Java.pdf" },
  "C++": { description: "STL containers and memory management.", pdfUrl: "/pdfs/C++.pdf" },
  "C": { description: "Low-level system programming.", pdfUrl: "/pdfs/C.pdf" },
  "OS": { description: "Operating Systems concepts.", pdfUrl: "/pdfs/os.pdf" },
  "HTML": { description: "HTML concepts.", pdfUrl: "/pdfs/html.pdf" },
  "CSS": { description: "CSS concepts.", pdfUrl: "/pdfs/css.pdf" },
  "JS": { description: "JS concepts.", pdfUrl: "/pdfs/js.pdf" },
};

const CheatSheets: React.FC = () => {
  const { user } = useAuth(); 
  const [topicsState, setTopicsState] = useState<Topic[]>(initialTopics);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredNode, setHoveredNode] = useState<PackedNode | null>(null);
  const [activeCheatSheet, setActiveCheatSheet] = useState<Topic | null>(null); 
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loadProgress, setLoadProgress] = useState(0);
  const canvasRef = useRef<HTMLDivElement>(null);

  const lightCard = "bg-white border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px]";
  const ghostInput = "w-full bg-[#f8f9fc] border-none rounded-xl px-5 py-3 text-sm text-gray-700 placeholder-gray-400 focus:ring-2 focus:ring-indigo-100 transition-all";
  const accentGradient = "bg-gradient-to-br from-[#7e7df2] to-[#a2a1ff]";

  useEffect(() => {
    const fetchProgress = async () => {
      const localData = JSON.parse(localStorage.getItem('cheatSheetProgress') || '{}');
      if (user?.email) {
        const { data, error } = await supabase
          .from('user_progress')
          .select('topic_id, completed')
          .eq('email', user.email);

        if (!error && data) {
          const dbMap = Object.fromEntries(data.map(item => [item.topic_id, item.completed]));
          setTopicsState(initialTopics.map(t => ({
            ...t, 
            completed: Math.max(dbMap[t.id] || 0, localData[t.id] || 0)
          })));
        }
      }
    };
    fetchProgress();
  }, [user]);

  useEffect(() => {
    let xpTimer: NodeJS.Timeout;
    if (activeCheatSheet) {
      xpTimer = setInterval(() => {
        setTopicsState((prevTopics) => {
          return prevTopics.map((topic) => {
            if (topic.id === activeCheatSheet.id) {
              if (topic.completed >= topic.total) return topic;
              const increment = Math.ceil(topic.total * 0.01);
              const newCompleted = Math.min(topic.completed + increment, topic.total);
              const currentLocal = JSON.parse(localStorage.getItem('cheatSheetProgress') || '{}');
              localStorage.setItem('cheatSheetProgress', JSON.stringify({...currentLocal, [topic.id]: newCompleted}));
              if (user?.email) {
                supabase.from('user_progress').upsert({ email: user.email, topic_id: topic.id, completed: newCompleted }, { onConflict: 'email,topic_id' });
              }
              if (activeCheatSheet.id === topic.id) {
                setActiveCheatSheet(prev => prev ? { ...prev, completed: newCompleted } : null);
              }
              return { ...topic, completed: newCompleted };
            }
            return topic;
          });
        });
      }, 120000);
    }
    return () => clearInterval(xpTimer);
  }, [activeCheatSheet?.id, user?.email]);

  useEffect(() => {
    let start: number;
    const animate = (time: number) => {
      if (!start) start = time;
      const p = Math.min((time - start) / 2000, 1);
      setLoadProgress(1 - Math.pow(1 - p, 3));
      if (p < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, []);

  const filteredTopics = topicsState.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // SCATTER LOGIC UPDATED HERE
  const packedNodes = useMemo<PackedNode[]>(() => {
    const nodes: PackedNode[] = [];
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    
    // SCATTER FIX: Increased scatter padding significantly
    const scatterPadding = isMobile ? 40 : 80; 

    // Sort to put biggest bubbles in the center, then scatter outwards
    [...topicsState].sort((a, b) => b.total - a.total).forEach((topic, index) => {
      const r = (isMobile ? 35 : 55) + (Math.min(topic.total, 300) / 300) * (isMobile ? 30 : 45);
      let angle = 0, radiusStep = 0, placed = false;
      
      while (!placed) {
        // Multiplier to force outer nodes even further away as the index increases
        const distanceMultiplier = 1 + (index * 0.15); 
        const x = Math.cos(angle) * (radiusStep * distanceMultiplier);
        const y = Math.sin(angle) * (radiusStep * distanceMultiplier);
        
        const collision = nodes.some(n => {
          const dx = n.x - x;
          const dy = n.y - y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          return distance < (n.r + r + scatterPadding);
        });

        if (!collision) {
          nodes.push({ 
            ...topic, x, y, r, 
            floatDuration: 4 + Math.random() * 2, 
            floatDelay: Math.random() * 2, 
            floatY: 8 + Math.random() * 10 
          });
          placed = true;
        } else {
          angle += 0.4; // Rotate
          radiusStep += 8; // Expand faster for scatter effect
        }
      }
    });
    return nodes;
  }, [topicsState]);

  const currentContent = activeCheatSheet ? (cheatSheetContent[activeCheatSheet.name] || { description: "Generating...", pdfUrl: null }) : null;

  return (
    <div className="min-h-screen bg-[#f3f4f9] text-gray-800 font-sans flex flex-col" onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}>
     

      <main className="max-w-[1400px] mx-auto w-full px-6 pt-24 pb-8 flex flex-col flex-1 h-screen overflow-hidden">
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#1a1b2f] tracking-tight">Skill Progression</h1>
            <p className="text-gray-500 text-sm mt-1">Track your mastery across technologies</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 overflow-hidden">
            {/* List Sidebar */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className={`w-full lg:w-[320px] p-6 flex flex-col ${lightCard}`}>
                <div className="relative mb-6">
                    <input type="text" placeholder="Search topics..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className={ghostInput} />
                    <Search size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300" />
                </div>
                <div className="flex flex-row md:flex-col gap-2 overflow-auto custom-scrollbar">
                    {filteredTopics.map((topic) => (
                        <button key={topic.id} onClick={() => setActiveCheatSheet(topic)} className="flex items-center justify-between p-3 rounded-xl hover:bg-[#f8f9fc] text-gray-600 hover:text-[#7e7df2] transition-all group">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-gray-50 group-hover:bg-white border border-gray-100 group-hover:border-[#7e7df2]/20 transition-all">
                                    {topic.icon}
                                </div>
                                <span className="text-xs font-semibold">{topic.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-300 group-hover:text-[#7e7df2]/40">
                              {Math.round((topic.completed/topic.total)*100)}%
                            </span>
                        </button>
                    ))}
                </div>
            </motion.div>

            {/* Bubble Canvas */}
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={`flex-1 relative overflow-hidden ${lightCard} bg-white/50 border-white`} ref={canvasRef}>
                <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>
                <div className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing">
                  <motion.div drag dragConstraints={canvasRef} className="relative w-[1200px] h-[1200px] flex items-center justify-center">
                    {packedNodes.map((node) => {
                      const pct = (node.completed / node.total) * 100 * loadProgress;
                      return (
                        <motion.div key={node.id} animate={{ y: [0, -node.floatY, 0] }} transition={{ repeat: Infinity, duration: node.floatDuration, delay: node.floatDelay }}
                          style={{ width: node.r * 2, height: node.r * 2, position: 'absolute', marginLeft: node.x - node.r, marginTop: node.y - node.r }}
                        >
                            <motion.div onMouseEnter={() => setHoveredNode(node)} onMouseLeave={() => setHoveredNode(null)} onClick={() => setActiveCheatSheet(node)} whileHover={{ scale: 1.05 }}
                                className="w-full h-full rounded-full bg-white shadow-xl border border-gray-100 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden"
                            >
                                <div className="absolute bottom-0 left-0 right-0 bg-indigo-50/50" style={{ height: `${pct}%`, transition: 'height 1s ease-out' }}></div>
                                <span className="relative z-10 text-xs font-bold text-gray-700">{node.name}</span>
                                <span className="relative z-10 text-[9px] font-black text-[#7e7df2] bg-white px-2 py-0.5 rounded-full mt-1 border border-gray-100">
                                    {Math.round(pct)}%
                                </span>
                            </motion.div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                </div>
            </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {hoveredNode && !activeCheatSheet && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="fixed pointer-events-none z-[100] bg-white/95 backdrop-blur shadow-2xl p-4 rounded-2xl border border-gray-100 flex flex-col min-w-[180px]"
            style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
          >
            <h3 className="text-[#1a1b2f] font-bold text-sm mb-2">{hoveredNode.name} Mastery</h3>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
               <div className={`${accentGradient} h-full transition-all duration-1000`} style={{ width: `${(hoveredNode.completed/hoveredNode.total)*100}%` }}></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeCheatSheet && (
            <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                className="fixed inset-0 z-[200] flex flex-col bg-white"
            >
                <header className="flex items-center justify-between px-8 py-4 border-b border-gray-50">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl ${accentGradient} flex items-center justify-center text-white shadow-lg shadow-indigo-200`}>
                            {activeCheatSheet.icon}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">{activeCheatSheet.name} Notes</h2>
                            <p className="text-[10px] font-bold text-[#7e7df2] uppercase tracking-widest">Progress: {Math.round((activeCheatSheet.completed/activeCheatSheet.total)*100)}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {currentContent?.pdfUrl && (
                            <a href={currentContent.pdfUrl} download className="flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all">
                                <DownloadCloud size={16} /> Download PDF
                            </a>
                        )}
                        <button onClick={() => setActiveCheatSheet(null)} className="w-12 h-12 rounded-xl bg-gray-50 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-all flex items-center justify-center">
                            <X size={20} />
                        </button>
                    </div>
                </header>

                <div className="flex-1 bg-[#f3f4f9] p-4">
                    {currentContent?.pdfUrl ? (
                        <iframe src={`${currentContent.pdfUrl}#toolbar=0`} className="w-full h-full rounded-2xl shadow-inner border-none bg-white" title={activeCheatSheet.name} />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-300">
                            <Sparkles size={48} className="mb-4 opacity-20"/>
                            <p className="text-sm font-bold uppercase tracking-widest">Module Generating...</p>
                        </div>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheatSheets;