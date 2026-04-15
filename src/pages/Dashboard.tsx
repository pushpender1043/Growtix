import { Flame, Trophy, Zap, Clock, ChevronRight, CalendarDays, ChevronLeft, Trash2, CheckCircle2, Circle, Plus, Terminal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

// Updated StatCard with Permanent Subtle Gradient & Clean Hover
function StatCard({ icon: Icon, label, value, iconColor, bgGradient }: { icon: any; label: string; value: string; iconColor: string; bgGradient: string; }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-6 flex items-center gap-5 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-md group cursor-pointer"
    >
      {/* Permanent, ultra-subtle gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} pointer-events-none`}></div>
      
      <div className="relative z-10 w-14 h-14 rounded-2xl flex items-center justify-center bg-background/80 shadow-inner border border-border/50 group-hover:scale-110 transition-transform duration-300">
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      
      <div className="relative z-10">
        <p className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">{label}</p>
        <p className="text-3xl font-heading font-extrabold text-foreground mt-0.5">{value}</p>
      </div>
    </motion.div>
  );
}

// 🗓️ HELPER: Date formatter
const formatDateString = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 🗓️ CLEAN MINIMAL CALENDAR
interface MiniCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

function MiniCalendar({ selectedDate, setSelectedDate }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [streakDays, setStreakDays] = useState<string[]>([]);

  useEffect(() => {
    const storedCalendarDays = localStorage.getItem("growtix_streak_calendar");
    let stored = storedCalendarDays ? JSON.parse(storedCalendarDays) : [];
    
    const todayStr = formatDateString(new Date());
    const lastSolved = localStorage.getItem("growtix_last_solved_date");
    
    if (lastSolved === todayStr && !stored.includes(todayStr)) {
      stored.push(todayStr);
      localStorage.setItem("growtix_streak_calendar", JSON.stringify(stored));
    }
    setStreakDays(stored);
  }, []);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  return (
    <div className="bg-background/50 border border-border/50 backdrop-blur-md rounded-2xl p-5 shadow-sm select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4.5 h-4.5 text-primary" />
          <h3 className="font-heading font-semibold text-[15px] text-foreground">
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={nextMonth} className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-y-2 gap-x-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-muted-foreground/70 font-medium py-1">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const currentLoopDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const dateStr = formatDateString(currentLoopDate);
          
          const isToday = new Date().toDateString() === currentLoopDate.toDateString();
          const isSelected = selectedDate.toDateString() === currentLoopDate.toDateString();
          const isStreakDay = streakDays.includes(dateStr);

          let styles = "hover:bg-secondary/80 text-foreground cursor-pointer";
          if (isSelected) styles = "bg-primary text-primary-foreground font-semibold shadow-sm";
          else if (isToday) styles = "bg-primary/10 text-primary font-semibold";

          return (
            <div key={day} className="flex justify-center">
              <span
                onClick={() => setSelectedDate(currentLoopDate)}
                className={`w-8 h-8 flex flex-col items-center justify-center rounded-full relative transition-all ${styles}`}
              >
                {day}
                {isStreakDay && (
                  <span className={`absolute bottom-1 w-1 h-1 rounded-full ${isSelected ? 'bg-primary-foreground/80' : 'bg-green-500'}`} />
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 📝 CLEAN MINIMAL TO-DO LIST (UPDATED VERSION)
interface TodoListProps {
  selectedDate: Date;
}

function TodoList({ selectedDate }: TodoListProps) {
  const [todos, setTodos] = useState<{id: number, text: string, done: boolean, dateString: string}[]>([]);
  const [newTask, setNewTask] = useState("");

  const selectedDateStr = formatDateString(selectedDate);
  const displayDateText = selectedDate.toDateString() === new Date().toDateString() ? "Today" : selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  useEffect(() => {
    const saved = localStorage.getItem("growtix_todos_v2");
    if (saved) {
      setTodos(JSON.parse(saved));
    } else {
      const todayStr = formatDateString(new Date());
      setTodos([
        { id: 1, text: "DSA Vocabulary Test", done: false, dateString: todayStr },
        { id: 2, text: "1v1 Arena Match", done: false, dateString: todayStr },
      ]);
    }
  }, []);

  useEffect(() => {
    if(todos.length > 0) {
      localStorage.setItem("growtix_todos_v2", JSON.stringify(todos));
    }
  }, [todos]);

  const requestNotification = () => {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      Notification.requestPermission();
    }
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    
    const task = { id: Date.now(), text: newTask, done: false, dateString: selectedDateStr };
    setTodos([task, ...todos]);
    setNewTask("");

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(`Task added for ${displayDateText} 🚀`, { body: task.text });
    } else {
      requestNotification();
    }
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const filteredTodos = todos.filter(t => t.dateString === selectedDateStr);

  return (
    <div className="bg-background/50 border border-border/50 backdrop-blur-md rounded-2xl p-5 flex flex-col h-[320px] shadow-sm">
      <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-3">
        <h3 className="font-heading font-semibold text-sm flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" /> Tasks For
        </h3>
        <span className="text-xs font-medium px-2.5 py-1 bg-secondary rounded-full text-muted-foreground">{displayDateText}</span>
      </div>
      
      <form onSubmit={addTodo} className="flex gap-2 mb-4">
        <input 
          type="text" 
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onClick={requestNotification}
          placeholder={`Add task...`} 
          className="flex-1 bg-muted/50 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary/50"
        />
        <button type="submit" className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90 transition-opacity flex-shrink-0">
          <Plus className="w-4 h-4" />
        </button>
      </form>

      <div className="space-y-1 overflow-y-auto pr-1 flex-1 scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {filteredTodos.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <CheckCircle2 className="w-8 h-8 mb-2 text-muted-foreground" />
            <p className="text-xs text-muted-foreground text-center">All caught up for {displayDateText}!</p>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={todo.id} 
              className={`flex items-start gap-3 p-2.5 rounded-xl transition-all group ${todo.done ? 'bg-transparent' : 'hover:bg-muted/40'}`}
            >
              <button onClick={() => toggleTodo(todo.id)} className="mt-0.5 text-muted-foreground hover:text-primary transition-colors flex-shrink-0">
                {todo.done ? <CheckCircle2 className="w-4.5 h-4.5 text-green-500" /> : <Circle className="w-4.5 h-4.5" />}
              </button>
              <span className={`text-sm flex-1 break-words transition-all ${todo.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="text-muted-foreground/50 hover:text-destructive transition-colors opacity-0 group-hover:opacity-100 p-0.5">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXp, setTotalXp] = useState(0);

  useEffect(() => {
    setCurrentStreak(Number(localStorage.getItem("growtix_streak")) || 0);
    setTotalXp(Number(localStorage.getItem("growtix_xp")) || 0);

    const fetchRealStats = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('streak, xp')
            .eq('id', user.id)
            .single();

          if (data && !error) {
            setCurrentStreak(data.streak || 0);
            setTotalXp(data.xp || 0);
            localStorage.setItem("growtix_streak", data.streak?.toString() || "0");
            localStorage.setItem("growtix_xp", data.xp?.toString() || "0");
          }
        } catch (err) {
          console.error("Failed to sync dashboard stats:", err);
        }
      }
    };

    fetchRealStats();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      {/* Redesigned Premium Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-card border border-border/60 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
      >
        {/* Soft Glowing Orbs in Background */}
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute -right-10 -bottom-20 w-80 h-80 bg-accent/10 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 flex-1">
          <h1 className="text-3xl md:text-4xl font-heading font-extrabold mb-3 tracking-tight text-foreground">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Developer</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-lg mb-6">
            Ready to crush some code today? Keep up the momentum and reach that Platinum rank.
          </p>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-primary/10 text-sm font-bold uppercase tracking-wider text-primary border border-primary/20 shadow-inner">
              Gold II Rank
            </span>
            <span className="text-muted-foreground font-medium text-sm">
              • {totalXp.toLocaleString()} XP
            </span>
          </div>
        </div>

        {/* Enhanced Tech Visual */}
        <div className="relative z-10 hidden md:flex items-center justify-center w-24 h-24 rounded-3xl bg-background/40 border border-border/50 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <Terminal className="w-10 h-10 text-primary" />
          <div className="absolute -bottom-3 -right-3 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-bounce shadow-lg">
            <Sparkles className="w-5 h-5 text-primary-foreground" />
          </div>
        </div>
      </motion.div>

      {/* Clean & Subtle Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard 
          icon={Zap} 
          label="Total XP" 
          value={totalXp.toLocaleString()} 
          iconColor="text-blue-500"
          bgGradient="from-blue-500/10 via-transparent to-transparent"
        />
        <StatCard 
          icon={Flame} 
          label="Day Streak" 
          value={`${currentStreak} 🔥`} 
          iconColor="text-orange-500"
          bgGradient="from-orange-500/10 via-transparent to-transparent"
        />
        <StatCard 
          icon={Trophy} 
          label="Global Rank" 
          value="#342" 
          iconColor="text-yellow-500"
          bgGradient="from-yellow-500/10 via-transparent to-transparent"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: EMPTY SPACE AS REQUESTED */}
        <div className="lg:col-span-2 rounded-[2rem] border-2 border-dashed border-border/40 bg-secondary/5 flex items-center justify-center min-h-[350px]">
           <p className="text-sm font-medium text-muted-foreground/60 flex items-center gap-2">
              <Terminal className="w-4 h-4 opacity-50" />
              <span>Space reserved for future modules</span>
           </p>
        </div>

        {/* Right sidebar: Calendar & Todo */}
        <div className="space-y-8">
          <MiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <TodoList selectedDate={selectedDate} />
        </div>
      </div>
      
    </div>
  );
}