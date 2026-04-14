import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, Home, RefreshCw, Download, AlertTriangle, 
  Award, MessageSquare, Sparkles, FileText, Bot, Zap, Target, TrendingUp 
} from "lucide-react";

interface ChatMessage {
  role: string;
  message: string;
}

const ResultPage: React.FC = () => {
  const feedbackRaw = localStorage.getItem("interviewResult") || "No feedback generated.";
  const storedScore = localStorage.getItem("interviewScore"); 
  const historyRaw = localStorage.getItem("interviewHistory");

  let parsedScore = 0;
  const scoreMatch = feedbackRaw.match(/SCORE[^\d]*(\d+)/i); 
  if (scoreMatch) {
    parsedScore = parseInt(scoreMatch[1], 10);
  } else if (storedScore) {
    parsedScore = parseInt(storedScore, 10);
  }

  // Fallback to 0 if parsing fails
  if (isNaN(parsedScore)) parsedScore = 0;

  const [feedback, setFeedback] = useState<string>(feedbackRaw);
  const [targetScore, setTargetScore] = useState<number>(parsedScore);
  const [displayScore, setDisplayScore] = useState<number>(0); 
  const [conversation, setConversation] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (historyRaw) {
      try {
        setConversation(JSON.parse(historyRaw));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, [historyRaw]);

  // Score animation
  useEffect(() => {
    let start = 0;
    const duration = 2000; 
    if (targetScore === 0) return; 
    const increment = targetScore / (duration / 16); 
    const timer = setInterval(() => {
      start += increment;
      if (start >= targetScore) {
        setDisplayScore(targetScore);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.ceil(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [targetScore]);

  // Light Mode Theme Logic based on score
  let themeConfig = {
    color: "text-rose-500",
    stroke: "stroke-rose-500",
    bgLight: "bg-rose-50",
    message: "Needs Improvement",
    icon: AlertTriangle,
    accent: "bg-rose-500"
  };

  if (targetScore >= 80) {
    themeConfig = {
      color: "text-emerald-500", 
      stroke: "stroke-emerald-500",
      bgLight: "bg-emerald-50",
      message: "Exceptional Performance",
      icon: Award,
      accent: "bg-emerald-500"
    };
  } else if (targetScore >= 50) {
    themeConfig = {
      color: "text-amber-500", 
      stroke: "stroke-amber-500",
      bgLight: "bg-amber-50",
      message: "Strong Foundation",
      icon: CheckCircle,
      accent: "bg-amber-500"
    };
  }

  const handleDownload = () => {
    const cleanText = feedback.replace(/\*/g, '');
    const fileContent = `MOCKMATE PROFESSIONAL EVALUATION\nScore: ${targetScore}/100\n\n${cleanText}`;
    const element = document.createElement("a");
    const file = new Blob([fileContent], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "MockMate_Evaluation.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const renderCleanFeedback = (rawText: string) => {
    if (!rawText) return null;
    const clean = rawText.replace(/\*/g, '').replace(/---/g, '').trim();
    
    // Split into logical blocks
    const parts = clean.split(/(Feedback:|Tip:|SCORE:)/i).filter(p => p.trim().length > 0);
    
    return (
      <div className="space-y-8">
        {parts.map((item, i) => {
          if (/SCORE:/i.test(item) || (parts[i-1] && /SCORE:/i.test(parts[i-1]))) return null;

          const isHeader = /Feedback:|Tip:/i.test(item);
          if (isHeader) return null;

          const label = /Feedback:/i.test(parts[i-1]) ? "Technical Analysis" : "Growth Strategy";
          const icon = label === "Technical Analysis" ? <Target size={18}/> : <TrendingUp size={18}/>;
          const accentColor = label === "Technical Analysis" ? "text-indigo-600" : "text-purple-600";
          const bgAccent = label === "Technical Analysis" ? "bg-indigo-50 border-indigo-100" : "bg-purple-50 border-purple-100";

          const bullets = item.split(/\.\s+/).filter(s => s.trim().length > 10);

          return (
            <div key={i} className="group relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg border ${bgAccent} ${accentColor}`}>
                  {icon}
                </div>
                <h4 className="text-sm font-bold uppercase tracking-widest text-gray-800">
                  {label}
                </h4>
                <div className="flex-1 h-[1px] bg-gray-100"></div>
              </div>
              
              <div className="grid grid-cols-1 gap-3 ml-2">
                {bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-[#F8F9FA] hover:bg-white transition-colors border border-transparent hover:border-gray-200 hover:shadow-sm">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${themeConfig.accent}`}></div>
                    <p className="text-gray-600 text-sm leading-relaxed font-medium">
                      {bullet.trim()}{!bullet.trim().endsWith('.') && '.'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // Light Theme styling constants
  const cardStyle = "bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100";

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans relative overflow-hidden pb-20">
      
      <motion.div initial={{opacity:0}} animate={{opacity:1}} className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-indigo-50 border border-indigo-100 text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-600 mb-4 shadow-sm">
                    <Zap size={12} className="text-indigo-500" /> Evaluation Report
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
                    Interview <span className="text-gray-400 font-light">Insights</span>
                </h1>
            </div>
            <div className="flex gap-3">
               <button onClick={handleDownload} className="p-4 rounded-2xl bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50 transition-all text-gray-600 hover:text-indigo-600 shadow-sm">
                  <Download size={20} />
               </button>
               <Link to="/mock-interview" className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 text-white font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5 transition-all active:scale-95">
                  <RefreshCw size={16} /> Retake session
               </Link>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Score & AI Status Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`${cardStyle} p-10 flex flex-col items-center text-center relative overflow-hidden`}>
              <div className={`absolute top-0 inset-x-0 h-1.5 ${themeConfig.accent}`}></div>
              
              {/* Score SVG Circle */}
              <div className={`relative w-44 h-44 mb-8 rounded-full flex items-center justify-center ${themeConfig.bgLight}`}>
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                  <circle cx="70" cy="70" r="62" fill="transparent" stroke="#F3F4F6" strokeWidth="6" />
                  <motion.circle 
                    cx="70" cy="70" r="62" fill="transparent" 
                    className={themeConfig.stroke} strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 62}
                    initial={{ strokeDashoffset: 2 * Math.PI * 62 }}
                    animate={{ strokeDashoffset: (2 * Math.PI * 62) - (displayScore/100) * (2 * Math.PI * 62) }}
                    transition={{ duration: 2, ease: "circOut" }}
                  />
                </svg>
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-gray-900 tracking-tighter">{displayScore}</span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">out of 100</span>
                </div>
              </div>

              <div className="space-y-2">
                <h2 className={`text-lg font-black uppercase tracking-tight ${themeConfig.color}`}>
                    {themeConfig.message}
                </h2>
                <p className="text-gray-500 text-xs font-medium px-4">
                    Based on your technical accuracy and communication flow.
                </p>
              </div>
            </div>

            <div className={`${cardStyle} p-6 flex items-center justify-between group cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all`}>
               <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100"><Bot size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">AI Assistant</p>
                    <p className="text-sm font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">Full Report Ready</p>
                  </div>
               </div>
               <FileText size={18} className="text-gray-400 group-hover:text-indigo-500 transition-colors"/>
            </div>
          </div>

          {/* Right Column: Main Feedback Content & Transcript */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Feedback Section */}
            <div className={`${cardStyle} p-8 md:p-12`}>
              <div className="flex items-center gap-4 mb-10">
                 <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Sparkles size={20} />
                 </div>
                 <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Performance Breakdown</h3>
                 <div className="flex-1 h-[1px] bg-gray-100 ml-4"></div>
              </div>
              {renderCleanFeedback(feedback)}
            </div>

            {/* Transcript Section */}
            <div className={`${cardStyle} p-8 md:p-12`}>
               <div className="flex items-center gap-4 mb-8">
                  <div className="p-2 bg-gray-50 border border-gray-100 rounded-lg text-gray-500">
                     <MessageSquare size={20} />
                  </div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Session Transcript</h3>
                  <div className="flex-1 h-[1px] bg-gray-100 ml-4"></div>
               </div>
               
               <div className="space-y-6">
                  {conversation.length === 0 ? (
                    <div className="bg-[#F8F9FA] rounded-2xl p-8 text-center border border-gray-100">
                        <MessageSquare size={32} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium text-sm">No transcript available for this session.</p>
                    </div>
                  ) : (
                    conversation.map((msg, index) => (
                      <div key={index} className={`flex flex-col ${msg.role === "User" ? "items-end" : "items-start"}`}>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1.5 px-2">
                            {msg.role === "User" ? "You" : "Interviewer"}
                        </span>
                        <div className={`max-w-[85%] p-5 rounded-2xl text-sm font-medium leading-relaxed ${
                            msg.role === "User" 
                            ? "bg-indigo-600 text-white rounded-tr-sm shadow-md" 
                            : "bg-[#F4F7FE] text-gray-800 border border-indigo-50/50 rounded-tl-sm"
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    ))
                  )}
               </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-16 flex justify-center pt-8">
          <Link to="/dashboard" className="text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest bg-white border border-gray-200 hover:border-indigo-200 px-6 py-3 rounded-full shadow-sm">
            <Home size={14} /> Back to Dashboard
          </Link>
        </div>
        
      </motion.div>
    </div>
  );
};

export default ResultPage;