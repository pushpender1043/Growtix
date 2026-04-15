import { Flame, Trophy, Zap, BookOpen, Clock, ChevronRight, CalendarDays, ChevronLeft, Trash2, CheckCircle2, Circle, Plus, Terminal, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const mockCourses = [
  { id: 1, title: "Advanced C++", progress: 72, lessons: 24, color: "gradient-primary" },
  { id: 2, title: "React Mastery", progress: 45, lessons: 32, color: "gradient-accent" },
  { id: 3, title: "Python for ML", progress: 88, lessons: 18, color: "gradient-warm" },
  { id: 4, title: "System Design", progress: 30, lessons: 20, color: "gradient-primary" },
];

const mockLessons = [
  { name: "OOP Fundamentals", instructor: "Dr. Smith", date: "Apr 12", status: "Done" },
  { name: "React Hooks Deep Dive", instructor: "Jane Doe", date: "Apr 13", status: "Done" },
  { name: "Binary Trees", instructor: "Prof. Kumar", date: "Apr 14", status: "Pending" },
  { name: "REST API Design", instructor: "Alex Chen", date: "Apr 15", status: "Pending" },
];

function StatCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="clay-card p-5 flex items-center gap-4"
    >
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-primary-foreground" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-heading font-bold">{value}</p>
      </div>
    </motion.div>
  );
}

const formatDateString = (date: Date) => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 🗓️ BULLETPROOF CALENDAR
interface MiniCalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

function MiniCalendar({ selectedDate, setSelectedDate }: MiniCalendarProps) {
  const [viewDate, setViewDate] = useState(new Date()); 
  const [streakDays, setStreakDays] = useState<string[]>([]);

  useEffect(() => {
    let stored: string[] = [];
    try {
      const data = localStorage.getItem("growtix_streak_dates");
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          stored = parsed;
        }
      }
    } catch (error) {
      console.error("Failed to parse streak dates, resetting...");
    }

    const todayStr = formatDateString(new Date());
    
    if (!stored.includes(todayStr)) {
      stored.push(todayStr);
      localStorage.setItem("growtix_streak_dates", JSON.stringify(stored));
    }
    setStreakDays(stored);
  }, []);

  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
  const firstDay = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();

  return (
    <div className="clay-card p-4 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-4 h-4 text-primary" />
          <h3 className="font-heading font-semibold text-sm">
            {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
        </div>
        <div className="flex gap-1">
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} className="p-1 hover:bg-muted rounded-md transition-colors"><ChevronLeft className="w-4 h-4" /></button>
          <button onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} className="p-1 hover:bg-muted rounded-md transition-colors"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <span key={d} className="text-muted-foreground font-medium py-1">{d}</span>)}
        {Array.from({ length: firstDay }).map((_, i) => <span key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const currentLoopDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const dateStr = formatDateString(currentLoopDate);
          const isToday = new Date().toDateString() === currentLoopDate.toDateString();
          const isSelected = selectedDate.toDateString() === currentLoopDate.toDateString();
          const isStreakDay = streakDays.includes(dateStr);

          let styles = "hover:bg-muted/50 cursor-pointer";
          if (isSelected) styles = "bg-primary text-primary-foreground font-bold shadow-md";
          else if (isToday) styles = "bg-primary/10 text-primary font-bold";

          return (
            <span key={day} onClick={() => setSelectedDate(currentLoopDate)} className={`py-1 rounded-lg relative transition-all flex flex-col items-center ${styles}`}>
              {day}
              {isStreakDay && <span className={`w-1.5 h-1.5 rounded-full mt-0.5 shadow-[0_0_5px_rgba(34,197,94,0.5)] ${isSelected ? 'bg-white' : 'bg-green-500'}`} />}
            </span>
          );
        })}
      </div>
    </div>
  );
}

// 📝 FUNCTIONAL TO-DO LIST
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
    if (saved) setTodos(JSON.parse(saved));
  }, []);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const task = { id: Date.now(), text: newTask, done: false, dateString: selectedDateStr };
    const updated = [task, ...todos];
    setTodos(updated);
    localStorage.setItem("growtix_todos_v2", JSON.stringify(updated));
    setNewTask("");
  };

  const toggleTodo = (id: number) => {
    const updated = todos.map(t => t.id === id ? { ...t, done: !t.done } : t);
    setTodos(updated);
    localStorage.setItem("growtix_todos_v2", JSON.stringify(updated));
  };

  const deleteTodo = (id: number) => {
    const updated = todos.filter(t => t.id !== id);
    setTodos(updated);
    localStorage.setItem("growtix_todos_v2", JSON.stringify(updated));
  };

  const filteredTodos = todos.filter(t => t.dateString === selectedDateStr);

  return (
    <div className="clay-card p-4 flex flex-col h-[300px]">
      <h3 className="font-heading font-semibold text-sm mb-3 flex items-center justify-between">
        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Tasks For</span>
        <span className="text-xs px-2 py-1 bg-muted rounded-md text-muted-foreground">{displayDateText}</span>
      </h3>
      <form onSubmit={addTodo} className="flex gap-2 mb-3">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder={`Add task...`} className="flex-1 bg-muted/50 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-primary/50" />
        <button type="submit" className="bg-primary text-primary-foreground p-1.5 rounded-lg hover:opacity-90"><Plus className="w-4 h-4" /></button>
      </form>
      <div className="space-y-2 overflow-y-auto pr-1 flex-1 scrollbar-none">
        {filteredTodos.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-6">No tasks scheduled! 🎉</p>
        ) : (
          filteredTodos.map((todo) => (
            <motion.div layout key={todo.id} className={`flex items-start gap-3 p-2 rounded-lg transition-colors hover:bg-muted/30 group ${todo.done ? 'opacity-50' : ''}`}>
              <button onClick={() => toggleTodo(todo.id)} className="mt-0.5 text-muted-foreground hover:text-primary">
                {todo.done ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Circle className="w-4 h-4" />}
              </button>
              <span className={`text-sm flex-1 break-words ${todo.done ? 'line-through text-muted-foreground' : 'font-medium'}`}>{todo.text}</span>
              <button onClick={() => deleteTodo(todo.id)} className="text-muted-foreground/50 hover:text-destructive opacity-0 group-hover:opacity-100"><Trash2 className="w-4 h-4" /></button>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card-strong p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">Welcome back, <span className="gradient-text">Developer</span>! 🚀</h1>
          <p className="text-muted-foreground">Gold II Rank • 12,450 XP — Keep pushing to Platinum!</p>
        </div>
        <div className="text-6xl animate-float">📚</div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Zap} label="Total XP" value="12,450" color="gradient-primary" />
        <StatCard icon={Flame} label="Day Streak" value="14 🔥" color="gradient-warm" />
        <StatCard icon={Trophy} label="Global Rank" value="#342" color="gradient-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">My Courses</h2>
              <button className="text-sm text-primary flex items-center gap-1 hover:underline">View all <ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {mockCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="clay-card p-4 min-w-[220px] flex-shrink-0">
                  <div className={`w-full h-2 rounded-full bg-muted mb-3 overflow-hidden`}>
                    <div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{course.lessons} lessons • {course.progress}%</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="clay-card overflow-hidden">
            <div className="p-4 border-b border-border/50"><h2 className="font-heading font-semibold text-lg">Recent Lessons</h2></div>
            <div className="divide-y divide-border/50">
              {mockLessons.map((lesson, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <div><p className="text-sm font-medium">{lesson.name}</p><p className="text-xs text-muted-foreground">{lesson.instructor}</p></div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${lesson.status === "Done" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>{lesson.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <MiniCalendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
          <TodoList selectedDate={selectedDate} />
        </div>
      </div>
    </div>
  );
}