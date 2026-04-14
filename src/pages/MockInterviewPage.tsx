import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase"; // Import your Supabase client
import { UploadCloud, Play, BookOpen, Clock, Settings, Briefcase, FileText, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";

const MockInterviewPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState<string>("React JS");
  const [level, setLevel] = useState<string>("Fresher");
  const [mode, setMode] = useState<"practice" | "mock">("practice"); 
  const [totalQuestions, setTotalQuestions] = useState<number>(5); 
  const [resume, setResume] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return; 
    
    setResume(file);
    setUploading(true);
    
    try {
      // Create a unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (error) throw error;

      // Get the public URL to pass to your AI logic
      const { data: publicUrlData } = supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setResumeUrl(publicUrlData.publicUrl);

      // Light theme success toast
      toast.success("Resume uploaded successfully!", {
        position: "bottom-right",
        style: {
          background: "#fff",
          color: "#1f2937",
          border: "1px solid #f3f4f6",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          fontSize: "14px",
          fontWeight: "600"
        },
        icon: <CheckCircle2 className="text-green-500" size={20} />
      });
    } catch (error) {
      toast.error("Resume upload failed.", { position: "bottom-right" });
      console.error("Supabase upload error:", error);
      setResume(null); 
    } finally {
      setUploading(false);
      e.target.value = ''; // Reset input
    }
  };

  const startInterview = () => {
    localStorage.setItem("interviewConfig", JSON.stringify({ 
        topic, 
        level, 
        mode, 
        totalQuestions,
        resumeUrl 
    }));
    navigate("/interview-room");
  };

  // Light Theme styling constants
  const cardStyle = "bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100";
  const inputStyle = "w-full bg-[#F4F7FE] rounded-2xl px-5 py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white border border-transparent focus:border-indigo-500 transition-all font-medium appearance-none";
  const labelStyle = "flex items-center gap-2 text-[12px] font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1";

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 font-sans relative overflow-x-hidden flex flex-col">
      <Toaster /> 
      
      {/* 👇 Changed pt-[140px] to pt-10 and removed the Navbar wrapper entirely */}
      <div className="relative z-10 flex-1 max-w-5xl mx-auto w-full px-6 pt-10 pb-16">
        
        <div className="mb-12 text-center md:text-left">
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-xs font-bold uppercase tracking-widest text-indigo-600 mb-4 shadow-sm">
               <Settings size={14} /> Configuration
           </motion.div>
           <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
               Setup Your Interview
           </motion.h1>
           <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-gray-500 font-medium text-sm md:text-base">
               Calibrate the AI mock session to match your specific career goals and experience level.
           </motion.p>
        </div>

        <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`p-6 md:p-10 ${cardStyle} grid md:grid-cols-2 gap-10 md:gap-16`}
        >
          
          <div className="space-y-8">
            <div>
              <label className={labelStyle}>
                 <Briefcase size={14} className="text-indigo-500"/> Target Role / Topic
              </label>
              <div className="relative group">
                  <input 
                    type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                    className={`${inputStyle} pl-12`}
                    placeholder="e.g. React JS, Data Science..."
                  />
                  <Briefcase size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
            </div>

            <div>
              <label className={labelStyle}>
                 <Star size={14} className="text-amber-500"/> Difficulty Level
              </label>
              <div className="relative group">
                  <select 
                    value={level} onChange={(e) => setLevel(e.target.value)}
                    className={`${inputStyle} cursor-pointer`}
                  >
                    <option value="Intern">Intern (Student)</option>
                    <option value="Fresher">Fresher (0-1 yr)</option>
                    <option value="Experienced">Experienced (2+ yrs)</option>
                    <option value="Managerial">Managerial</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors text-xs">▼</div>
              </div>
            </div>

            <div>
              <label className={labelStyle}>
                  <FileText size={14} className="text-emerald-500"/> Context Injection
              </label>
              <div className={`relative overflow-hidden group border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${resume ? 'border-emerald-300 bg-emerald-50' : 'border-gray-200 bg-[#F4F7FE] hover:border-indigo-300 hover:bg-indigo-50'}`}>
                <input type="file" accept=".pdf" onChange={handleFileUpload} disabled={uploading} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                
                <div className="relative z-0 flex flex-col items-center">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition-transform duration-300 shadow-sm ${resume ? 'bg-emerald-100' : 'bg-white group-hover:scale-110'}`}>
                       {uploading ? (
                         <UploadCloud className="text-indigo-500 animate-bounce" size={24} />
                       ) : resume ? (
                         <CheckCircle2 className="text-emerald-500" size={24} />
                       ) : (
                         <UploadCloud className="text-gray-400 group-hover:text-indigo-500 transition-colors" size={24} />
                       )}
                    </div>
                    <p className="text-sm text-gray-800 font-bold tracking-wide">
                        {uploading ? "Uploading document..." : (resume ? resume.name : "Upload PDF Resume")}
                    </p>
                    <p className="text-[11px] text-gray-500 mt-2 font-medium uppercase tracking-widest">
                        {resume ? "Ready for tailored questions" : "Optional: For personalized questions"}
                    </p>
                </div>
              </div>
            </div>

          </div>

          <div className="space-y-8">
            <div>
              <label className={labelStyle}>
                 <Clock size={14} className="text-blue-500"/> Duration Parameters
              </label>
              <div className="relative group">
                  <select 
                    value={totalQuestions} 
                    onChange={(e) => setTotalQuestions(Number(e.target.value))}
                    className={`${inputStyle} cursor-pointer`}
                  >
                    <option value={3}>3 Questions (Quick - 5 Mins)</option>
                    <option value={5}>5 Questions (Standard - 10 Mins)</option>
                    <option value={10}>10 Questions (Deep Dive - 20 Mins)</option>
                    <option value={15}>15 Questions (Full Mock)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors text-xs">▼</div>
              </div>
            </div>

            <div>
                <label className={labelStyle}>
                    Select Mode
                </label>
                <div className="grid grid-cols-1 gap-4">
                    
                    <div 
                        onClick={() => setMode("practice")}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 overflow-hidden group border-2
                        ${mode === "practice" 
                            ? "bg-indigo-50/50 border-indigo-500 shadow-sm" 
                            : "bg-white border-gray-100 shadow-sm hover:border-indigo-200"}`}
                    >
                        <div className={`p-3.5 rounded-xl transition-colors duration-300 relative z-10
                            ${mode === "practice" ? "bg-indigo-600 text-white shadow-md" : "bg-[#F4F7FE] text-gray-400 group-hover:text-indigo-500"}`}>
                            <BookOpen size={20}/>
                        </div>
                        <div className="relative z-10">
                            <h3 className={`font-bold tracking-tight mb-0.5 transition-colors ${mode === "practice" ? "text-gray-900 text-lg" : "text-gray-600 text-base"}`}>Training Mode</h3>
                            <p className="text-gray-500 text-[12px] font-medium leading-relaxed max-w-[250px]">Real-time feedback after every answer. Best for skill building.</p>
                        </div>
                    </div>

                    <div 
                        onClick={() => setMode("mock")}
                        className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 flex items-center gap-5 overflow-hidden group border-2
                        ${mode === "mock" 
                            ? "bg-indigo-50/50 border-indigo-500 shadow-sm" 
                            : "bg-white border-gray-100 shadow-sm hover:border-indigo-200"}`}
                    >
                        <div className={`p-3.5 rounded-xl transition-colors duration-300 relative z-10
                            ${mode === "mock" ? "bg-indigo-600 text-white shadow-md" : "bg-[#F4F7FE] text-gray-400 group-hover:text-indigo-500"}`}>
                            <Play size={20} className="ml-0.5"/>
                        </div>
                        <div className="relative z-10">
                            <h3 className={`font-bold tracking-tight mb-0.5 transition-colors ${mode === "mock" ? "text-gray-900 text-lg" : "text-gray-600 text-base"}`}>Simulation Mode</h3>
                            <p className="text-gray-500 text-[12px] font-medium leading-relaxed max-w-[250px]">No interruptions. Continuous flow with a final scorecard at the end.</p>
                        </div>
                    </div>

                </div>
            </div>

          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10 flex justify-end">
            <button 
                onClick={startInterview}
                className="w-full md:w-auto bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 flex items-center justify-center gap-3 group"
            >
                Start Session
                <Play size={16} className="group-hover:translate-x-1 transition-transform" fill="currentColor"/>
            </button>
        </motion.div>

      </div>
    </div>
  );
};

export default MockInterviewPage;