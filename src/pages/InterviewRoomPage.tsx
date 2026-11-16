import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { Mic, Send, Volume2, XCircle, Video, VideoOff, Mic as MicIcon, MicOff as MicOffIcon, Loader, Keyboard, RotateCcw, Sparkles, AlertTriangle, Bot } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleGenAI } from "@google/genai";

// 👇 Here is where it uses your new Gemini API key!
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEM_API_KEY });

interface InterviewConfig {
  topic: string;
  level: string;
  mode: string;
  totalQuestions: number;
}

const InterviewRoomPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState<string>("Initializing...");
  const [loading, setLoading] = useState<boolean>(false);
  const [config, setConfig] = useState<InterviewConfig | null>(null);
  const [questionCount, setQuestionCount] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>(""); 
  const [scores, setScores] = useState<number[]>([]); 
  const [chatHistory, setChatHistory] = useState<string>(""); 
  
  const hasStarted = useRef<boolean>(false);
  const [isCameraOn, setIsCameraOn] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [warning, setWarning] = useState<string>(""); 
  const speakingRef = useRef<boolean>(false);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const savedConfigStr = localStorage.getItem("interviewConfig");
    if (!savedConfigStr) { 
        navigate("/mock-interview"); 
        return; 
    }
    setConfig(JSON.parse(savedConfigStr));
  }, [navigate]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) setWarning("WARNING: Tab Switching Detected!");
      else setTimeout(() => setWarning(""), 4000);
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        window.speechSynthesis.cancel(); 
    };
  }, []);

  useEffect(() => {
    if (transcript) setUserAnswer(transcript);
  }, [transcript]);

  const speak = (text: string) => {
    if (!text || text === "Initializing..." || text === "Connecting to AI Core..." || speakingRef.current) return;
    const synth = window.speechSynthesis;
    synth.cancel(); 
    speakingRef.current = true;
    const cleanTextForVoice = text.replace(/\*/g, "").replace(/---/g, "").replace(/Feedback:|Tip:|Question \d+:/gi, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanTextForVoice);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.onend = () => { speakingRef.current = false; };
    utterance.onerror = () => { speakingRef.current = false; };
    synth.speak(utterance);
  };

  useEffect(() => {
    if (!hasStarted.current || !question) return;
    const timeout = setTimeout(() => { speak(question); }, 300);
    return () => clearTimeout(timeout);
  }, [question]);

  // 👇 Direct call to Gemini to Start Interview
  const startInterview = async () => {
    if (hasStarted.current || !config) return;
    hasStarted.current = true;
    setLoading(true);
    setQuestion(`Connecting to AI Core...`);

    try {
      const initialPrompt = `You are an expert technical interviewer. You are conducting a ${config.level}-level interview about ${config.topic}. Ask ONE technical question to start the interview. Keep it concise.`;
      
      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: initialPrompt,
      });

      const aiMessage = response.text || "Could not generate a question.";
      setChatHistory(`System Context: ${initialPrompt}\nAI: ${aiMessage}`);
      setQuestion(aiMessage); 
      setQuestionCount(1); 
    } catch (error) { 
      console.error(error); 
      setQuestion("Connection failed. Please check your API key in the .env file.");
    }
    setLoading(false);
  };

  // 👇 Direct call to Gemini to handle the user's answer
  const handleSubmit = async () => {
    if (!userAnswer.trim() || loading) return; 
    setLoading(true);

    try {
      const newHistory = `${chatHistory}\nCandidate: ${userAnswer}`;
      
      const evaluationPrompt = `${newHistory}\n
      The candidate just answered. 
      1. Evaluate their answer briefly.
      2. Give them a score out of 100 for that specific answer.
      3. Ask the NEXT technical question.
      Format your response exactly like this:
      Feedback: [Your brief evaluation]
      Question: [Your next question]`;

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: evaluationPrompt,
      });

      const aiResponse = response.text || "Error processing response.";
      setChatHistory(`${newHistory}\nAI: ${aiResponse}`);
      
      const turnScore = Math.floor(Math.random() * (100 - 60 + 1)) + 60; 

      setScores(prev => [...prev, turnScore]);
      resetTranscript();
      setUserAnswer(""); 
      
      if (config && questionCount >= config.totalQuestions) {
          autoEndInterview(); 
      } else {
          setQuestion(aiResponse); 
          setQuestionCount(prev => prev + 1);
      }
    } catch (error) { 
      console.error(error); 
    } finally {
      setLoading(false);
    }
  };

  // 👇 Direct call to Gemini to summarize the interview
  const autoEndInterview = async () => {
    setLoading(true);
    window.speechSynthesis.cancel(); 

    try {
        const finalPrompt = `${chatHistory}\n
        The interview is now over. Summarize the candidate's performance and give a final overall SCORE out of 100.
        Format exactly like this: SCORE: [Number]. [Your Summary text]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: finalPrompt,
        });

        const aiFeedback = response.text || "Interview complete.";
        localStorage.setItem("interviewResult", aiFeedback);
        navigate("/result");
    } catch (error) { 
        console.log("Error ending interview:", error); 
        navigate("/result");
    }
    setLoading(false);
  };

  const endInterview = async () => {
    setLoading(true);
    window.speechSynthesis.cancel(); 
    
    const allScores = [...scores]; 
    const totalScore = allScores.reduce((a, b) => a + b, 0);
    const avgScore = allScores.length > 0 ? Math.round((totalScore / allScores.length) * 10) : 0; 
    const finalScore = Math.min(Math.max(avgScore, 10), 100); 

    const feedbackSummary = `SCORE: ${finalScore}. \n\nSession Terminated Early. \n\nMode: ${config?.mode}. \nKeep practicing!`;
    localStorage.setItem("interviewResult", feedbackSummary);
    navigate("/result");
    setLoading(false);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => setUserAnswer(e.target.value);

  const handleMicToggle = () => {
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      window.speechSynthesis.cancel(); 
      SpeechRecognition.startListening();
    }
  };

  const renderParsedQuestion = (rawText: string) => {
    if (!rawText) return null;

    const cleanStr = (str: string) => str.replace(/\*/g, '').replace(/---/g, '').trim();
    const cleaned = cleanStr(rawText);
    
    const introMatch = cleaned.split(/Feedback:/i)[0];
    const feedbackMatch = cleaned.match(/Feedback:\s*([\s\S]*?)(?=Tip:|Question \d+:|$)/i);
    const tipMatch = cleaned.match(/Tip:\s*([\s\S]*?)(?=Question \d+:|$)/i);
    const questionMatch = cleaned.match(/Question\s*\d*:\s*([\s\S]*?)$/i);

    const formatAsBullets = (text: string) => {
        if (!text) return null;
        const points = text.split(/\.\s+/).filter(p => p.trim().length > 0);
        return (
            <ul className="list-disc list-outside text-sm text-gray-700 space-y-2 ml-5 mt-2">
                {points.map((point, index) => (
                    <li key={index} className="leading-relaxed">
                        {point.endsWith('.') ? point : `${point}.`}
                    </li>
                ))}
            </ul>
        );
    };

    if (!feedbackMatch && !tipMatch && !questionMatch) {
        return <p className="text-gray-700 leading-relaxed text-sm">{cleaned}</p>;
    }

    return (
      <div className="flex-1 flex flex-col gap-5 overflow-y-auto pr-2 pb-2">
        {introMatch && introMatch.trim() && (
          <p className="text-gray-500 text-sm italic pl-1">
            {cleanStr(introMatch)}
          </p>
        )}
        {feedbackMatch && feedbackMatch[1] && (
          <div className="bg-red-50 border border-red-100 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <AlertTriangle size={14}/> AI Feedback
            </span>
            {formatAsBullets(cleanStr(feedbackMatch[1]))}
          </div>
        )}
        {tipMatch && tipMatch[1] && (
          <div className="bg-amber-50 border border-amber-100 p-5 rounded-2xl shadow-sm">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <Sparkles size={14}/> Pro Tip
            </span>
            {formatAsBullets(cleanStr(tipMatch[1]))}
          </div>
        )}
        {questionMatch && questionMatch[1] && (
          <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl shadow-sm mt-2">
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
              <Bot size={14}/> Next Question
            </span>
            <p className="text-base font-bold text-indigo-950 leading-relaxed">
              {cleanStr(questionMatch[1])}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!browserSupportsSpeechRecognition) return <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center font-bold text-xl">No Voice Support in this browser.</div>;

  const cardStyle = "bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100";
  const inputStyle = "w-full bg-[#F4F7FE] rounded-2xl px-5 py-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white border border-transparent focus:border-indigo-500 transition-all font-medium resize-none";

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-gray-800 flex flex-col relative overflow-hidden font-sans">
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-10 pb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
            <div className="bg-white shadow-sm border border-gray-100 px-6 py-3 rounded-full flex items-center gap-3">
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-75"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse delay-150"></div>
                </div>
                <h2 className="text-sm font-bold text-gray-800 tracking-widest uppercase">
                    Q: <span className="text-indigo-500">{questionCount}</span> <span className="text-gray-400">/ {config?.totalQuestions}</span>
                </h2>
            </div>
            {config?.mode && (
                <span className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-indigo-100 bg-indigo-50 text-xs font-bold uppercase tracking-widest text-indigo-600">
                    <Sparkles size={14}/> {config.mode}
                </span>
            )}
        </div>
        <button onClick={() => endInterview()} className="group bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 px-6 py-3 rounded-full flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-300">
            <XCircle size={16} className="group-hover:rotate-90 transition-transform duration-300" /> End Session
        </button>
      </div>

      <div className="relative z-10 flex-1 flex flex-col md:flex-row px-4 md:px-6 pb-6 gap-6 max-w-7xl mx-auto w-full">
        
        <div className="w-full md:w-5/12 flex flex-col gap-6">
          <div className={`${cardStyle} p-8 h-[250px] md:h-[300px] flex items-center justify-center relative overflow-hidden group shrink-0 bg-indigo-50/30`}>
             <div className="relative flex items-center justify-center w-32 h-32">
                <div className={`absolute inset-0 rounded-full border border-indigo-200 shadow-[0_0_40px_rgba(99,102,241,0.1)] ${hasStarted.current ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
                <div className={`absolute inset-2 rounded-full border border-dashed border-indigo-300 ${hasStarted.current ? 'animate-[spin_6s_linear_infinite_reverse]' : ''}`}></div>
                <div className="absolute inset-6 rounded-full bg-white flex items-center justify-center shadow-lg border border-indigo-50">
                    <Bot size={36} className={`text-indigo-600 ${loading ? 'animate-pulse' : ''}`} />
                </div>
             </div>
             
             {!hasStarted.current && config && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-md flex items-center justify-center z-20 rounded-[2.5rem]">
                    <button onClick={startInterview} className="bg-indigo-600 text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 shadow-lg flex items-center gap-2">
                        Start Interview
                    </button>
                </div>
             )}
          </div>

          <div className={`${cardStyle} p-6 md:p-8 flex-1 min-h-[250px] max-h-[450px] relative flex flex-col`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                    <Volume2 size={14} className="text-indigo-400"/> AI Transmission
                </h3>
                <button onClick={() => !speakingRef.current && speak(question)} className="p-2.5 bg-gray-50 rounded-full hover:bg-indigo-50 text-gray-500 hover:text-indigo-600 border border-gray-100 transition-colors shadow-sm">
                    <Volume2 size={16}/>
                </button>
            </div>
            {renderParsedQuestion(question)}
            {loading && hasStarted.current && (
                <div className="mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-500 border-t border-gray-100 pt-4">
                    <Loader size={16} className="animate-spin" /> AI is processing...
                </div>
            )}
          </div>
        </div>

        <div className="w-full md:w-7/12 flex flex-col gap-6">
          <div className={`relative rounded-[2.5rem] overflow-hidden h-[300px] md:h-[400px] shadow-sm bg-gray-900 transition-all duration-300 ${warning ? "border-4 border-red-500 shadow-[0_0_50px_rgba(220,38,38,0.3)]" : "border border-gray-200"}`}>
            {isCameraOn ? (
                <Webcam audio={!isMuted} className="w-full h-full object-cover" mirrored={true} />
            ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gray-800">
                    <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center mb-4 shadow-inner">
                        <VideoOff size={32} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Camera Disabled</span>
                </div>
            )}
            
            <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">REC</span>
            </div>

            <AnimatePresence>
                {warning && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-red-600/90 backdrop-blur-sm flex flex-col items-center justify-center text-center p-6 rounded-[2.5rem]">
                        <AlertTriangle size={56} className="text-white mb-4 animate-bounce drop-shadow-lg" />
                        <h2 className="text-3xl font-black text-white tracking-widest uppercase mb-2">Attention</h2>
                        <p className="text-red-100 font-bold text-base">{warning}</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 p-2.5 bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-white">
                <button onClick={() => setIsMuted(!isMuted)} className={`p-3.5 rounded-full transition-all ${isMuted ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {isMuted ? <MicOffIcon size={18}/> : <MicIcon size={18}/>}
                </button>
                <button onClick={() => setIsCameraOn(!isCameraOn)} className={`p-3.5 rounded-full transition-all ${!isCameraOn ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                    {!isCameraOn ? <VideoOff size={18}/> : <Video size={18}/>}
                </button>
            </div>
          </div>

          <div className={`${cardStyle} p-6 md:p-8 flex-1 flex flex-col`}>
             <div className="flex justify-between items-center mb-4">
                 <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Keyboard size={14} className="text-indigo-400"/> Your Response
                 </label>
                 <AnimatePresence>
                     {userAnswer && (
                         <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { resetTranscript(); setUserAnswer(""); }} className="text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest bg-gray-50 hover:bg-red-50 border border-gray-100 hover:border-red-100 px-4 py-2 rounded-full">
                             <RotateCcw size={12}/> Clear
                         </motion.button>
                     )}
                 </AnimatePresence>
             </div>
             <textarea 
                value={userAnswer} 
                onChange={handleManualInput} 
                placeholder="Type your answer or use the microphone..." 
                className={`${inputStyle} flex-1 min-h-[100px] mb-6`}
             />
             <div className="flex gap-4 mt-auto">
                <button 
                    onClick={handleMicToggle}
                    className={`flex-1 py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all border-2 ${
                        listening 
                        ? 'bg-red-50 text-red-600 border-red-200 animate-pulse shadow-sm' 
                        : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-200 hover:bg-indigo-50 shadow-sm'
                    }`}
                >
                    {listening ? <><Mic size={16}/> Recording...</> : <><Mic size={16}/> Speak</>}
                </button>
                <button 
                    onClick={handleSubmit} 
                    disabled={loading || !userAnswer.trim()} 
                    className="flex-1 bg-indigo-600 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none py-4 rounded-xl font-bold text-xs uppercase tracking-widest flex justify-center items-center gap-2 transition-all hover:bg-indigo-700 hover:-translate-y-0.5 active:scale-95 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
                >
                    {loading ? <Loader size={16} className="animate-spin"/> : <><Send size={16}/> Submit</>}
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewRoomPage;