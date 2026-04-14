import { Flame, Trophy, Zap, BookOpen, Clock, ChevronRight, CalendarDays } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

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

const mockReminders = [
  { text: "DSA Vocabulary Test", time: "Tomorrow, 10 AM", type: "test" },
  { text: "1v1 Arena Match", time: "Today, 8 PM", type: "arena" },
  { text: "Hackathon Registration", time: "Apr 18", type: "event" },
  { text: "Mock Interview Session", time: "Apr 19, 3 PM", type: "interview" },
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

function MiniCalendar() {
  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const eventDays = [5, 12, 18, 22, 28];

  return (
    <div className="clay-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-sm">
          {today.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </h3>
        <CalendarDays className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <span key={d} className="text-muted-foreground font-medium py-1">{d}</span>
        ))}
        {Array.from({ length: firstDay }).map((_, i) => (
          <span key={`e${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const isToday = day === today.getDate();
          const hasEvent = eventDays.includes(day);
          return (
            <span
              key={day}
              className={`py-1 rounded-lg relative cursor-pointer transition-colors
                ${isToday ? "gradient-primary text-primary-foreground font-bold" : "hover:bg-muted/50"}
              `}
            >
              {day}
              {hasEvent && !isToday && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-strong p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold mb-1">
            Welcome back, <span className="gradient-text">Developer</span>! 🚀
          </h1>
          <p className="text-muted-foreground">
            Gold II Rank • 12,450 XP — Keep pushing to Platinum!
          </p>
        </div>
        <div className="text-6xl animate-float">📚</div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={Zap} label="Total XP" value="12,450" color="gradient-primary" />
        <StatCard icon={Flame} label="Day Streak" value="14 🔥" color="gradient-warm" />
        <StatCard icon={Trophy} label="Global Rank" value="#342" color="gradient-accent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Courses + Lessons */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Courses */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-lg">My Courses</h2>
              <button className="text-sm text-primary flex items-center gap-1 hover:underline">
                View all <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
              {mockCourses.map((course, i) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="clay-card p-4 min-w-[220px] flex-shrink-0"
                >
                  <div className={`w-full h-2 rounded-full bg-muted mb-3 overflow-hidden`}>
                    <div className={`h-full rounded-full ${course.color}`} style={{ width: `${course.progress}%` }} />
                  </div>
                  <h3 className="font-heading font-semibold text-sm">{course.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{course.lessons} lessons • {course.progress}%</p>
                  <button className="mt-3 text-xs font-medium text-primary hover:underline">Continue →</button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Recent Lessons */}
          <div className="clay-card overflow-hidden">
            <div className="p-4 border-b border-border/50">
              <h2 className="font-heading font-semibold text-lg">Recent Lessons</h2>
            </div>
            <div className="divide-y divide-border/50">
              {mockLessons.map((lesson, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">{lesson.name}</p>
                      <p className="text-xs text-muted-foreground">{lesson.instructor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground hidden sm:block">{lesson.date}</span>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      lesson.status === "Done"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {lesson.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <MiniCalendar />

          <div className="clay-card p-4">
            <h3 className="font-heading font-semibold text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Reminders
            </h3>
            <div className="space-y-3">
              {mockReminders.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full gradient-accent mt-1.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">{r.text}</p>
                    <p className="text-xs text-muted-foreground">{r.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
