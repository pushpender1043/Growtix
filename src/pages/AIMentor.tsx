import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Network, Mic, Volume2, Square, BrainCircuit, AudioLines } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";

export default function AIMentor() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm your Growtix AI Mentor. 🚀\n\nAsk me about coding, system design, or career paths. I can also speak to you in multiple languages. How can I help you level up today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const getLanguageCode = (lang: string) => {
    const map: Record<string, string> = {
      "Hindi": "hi-IN",
      "Marathi": "mr-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Punjabi": "pa-IN",
      "Hinglish (Hindi+English)": "hi-IN",
      "English": "en-GB", 
    };
    return map[lang] || "en-US";
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- TEXT TO SPEECH ---
  const handleSpeak = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser doesn't support text-to-speech.");
      return;
    }

    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel(); 
    
    const cleanText = text
      .replace(/===DIAGRAM:[\s\S]*?===/g, "I have generated a diagram for you below.")
      .replace(/===IMAGE:[\s\S]*?===/g, "I have attached a visual reference below.")
      .replace(/[*#`_]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = getLanguageCode(language);
    utterance.rate = 1.0;
    
    utterance.onend = () => setSpeakingIndex(null);
    utterance.onerror = () => setSpeakingIndex(null);
    
    setSpeakingIndex(index);
    window.speechSynthesis.speak(utterance);
  };

  // --- SPEECH TO TEXT ---
  const handleListen = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = getLanguageCode(language);
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => prev + (prev ? " " : "") + transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.start();
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    window.speechSynthesis.cancel();
    setSpeakingIndex(null);

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_GROQ_API_KEY_MENTOR;
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant", 
          messages: [
            {
              role: "system",
              content: `You are Growtix AI Mentor. The user is asking in ${language}. Try to respond in ${language} if possible, or simple English.
              1. Use Markdown for text.
              2. For Code: Use triple backticks.
              3. For Diagrams: Use ===DIAGRAM: (Graphviz DOT code) ===`
            },
            ...messages.map(m => ({ role: m.role, content: m.content })),
            userMessage
          ],
        }),
      });

      const data = await response.json();
      if (data.choices && data.choices.length > 0) {
        setMessages(prev => [...prev, { role: "assistant", content: data.choices[0].message.content }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: "assistant", content: "Network issue. Please try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  const renderMessage = (content: string) => {
    const parts = content.split(/===DIAGRAM:\s*(.*?)===/gs);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        const encodedGraph = encodeURIComponent(part.trim());
        const graphUrl = `https://quickchart.io/graphviz?graph=${encodedGraph}`;

        return (
          <div key={index} className="my-5 group relative">
            <div className="relative border border-border/50 rounded-2xl overflow-hidden shadow-sm bg-background">
              <div className="bg-secondary/50 px-4 py-2.5 border-b border-border/50 flex items-center gap-2">
                <Network className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-foreground">AI Generated Diagram</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[150px] bg-white">
                <img src={graphUrl} alt="AI Diagram" className="max-w-full h-auto object-contain rounded-lg" />
              </div>
            </div>
          </div>
        );
      }
      return (
        <div key={index} className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-[#1e1e2e] prose-pre:rounded-xl prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-p:leading-relaxed">
          <ReactMarkdown>{part}</ReactMarkdown>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[650px] bg-card/60 backdrop-blur-xl rounded-[2rem] border border-border/60 shadow-2xl overflow-hidden relative">
      
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-primary/10 blur-[80px] pointer-events-none rounded-full" />

      {/* Modern Header */}
      <div className="p-5 border-b border-border/50 bg-background/50 backdrop-blur-md flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-[#5b6ec4] via-[#a37bb0] to-[#df7d64] shadow-lg shadow-primary/20">
            <BrainCircuit className="text-white w-6 h-6" />
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 border-2 border-background rounded-full" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-lg tracking-tight text-foreground">Growtix Core</h3>
            <div className="flex items-center gap-1.5 opacity-80">
              <Sparkles className="w-3 h-3 text-primary" />
              <p className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">AI Mentor Active</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {speakingIndex !== null && (
            <div className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full border border-primary/20">
              <AudioLines className="w-4 h-4 text-primary animate-pulse" />
              <span className="text-[10px] font-bold text-primary uppercase">Speaking</span>
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-8 scroll-smooth custom-scrollbar z-10 relative">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={`flex gap-3 ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {/* AI Avatar next to message */}
              {m.role === "assistant" && (
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5b6ec4] to-[#df7d64] flex-shrink-0 flex items-center justify-center shadow-sm mt-1">
                  <BrainCircuit className="w-4 h-4 text-white" />
                </div>
              )}

              <div className={`max-w-[80%] p-4 rounded-3xl relative group shadow-sm ${
                m.role === "user" 
                  ? "bg-foreground text-background rounded-tr-sm" 
                  : "bg-secondary/50 backdrop-blur-sm rounded-tl-sm border border-border/50 text-foreground"
              }`}>
                
                {/* Voice Readout Button for AI Messages */}
                {m.role === "assistant" && (
                  <button 
                    onClick={() => handleSpeak(m.content, i)}
                    className="absolute -right-12 top-2 p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95"
                    title={speakingIndex === i ? "Stop speaking" : "Listen to response"}
                  >
                    {speakingIndex === i ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}

                {renderMessage(m.content)}
              </div>
            </motion.div>
          ))}

          {/* Premium Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#5b6ec4] to-[#df7d64] flex-shrink-0 flex items-center justify-center shadow-sm mt-1 opacity-70">
                <BrainCircuit className="w-4 h-4 text-white" />
              </div>
              <div className="bg-secondary/50 backdrop-blur-sm p-4 rounded-3xl rounded-tl-sm border border-border/50 flex items-center gap-1.5 h-[52px]">
                <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} />
                <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} />
                <motion.div className="w-2 h-2 bg-primary/60 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Sleek Input Area */}
      <div className="p-4 bg-background/80 backdrop-blur-xl border-t border-border/50 z-10 relative">
        <div className={`relative flex items-end gap-2 p-2 rounded-3xl border transition-all duration-300 ${isListening ? 'border-red-500/50 bg-red-500/5 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-border/60 bg-secondary/30 focus-within:border-primary/50 focus-within:bg-background shadow-inner'}`}>
          
          <button 
            onClick={handleListen}
            className={`p-3 rounded-full flex-shrink-0 transition-all duration-300 ${
              isListening 
                ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
                : "bg-background border border-border/50 text-muted-foreground hover:text-foreground hover:bg-secondary"
            }`}
            title="Voice Typing"
          >
            {isListening ? <AudioLines className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={isListening ? "Listening intently..." : "Ask me anything..."}
            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm text-foreground outline-none max-h-[120px] min-h-[44px] scrollbar-none"
            rows={1}
          />
          
          <button 
            onClick={handleSend} 
            disabled={isTyping || !input.trim()}
            className="p-3 bg-foreground text-background rounded-full shadow-md flex-shrink-0 transition-all duration-300 disabled:opacity-40 disabled:scale-100 hover:scale-105 active:scale-95"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-[10px] text-muted-foreground/60 font-medium tracking-wide">Growtix AI can make mistakes. Consider verifying important information.</p>
        </div>
      </div>
    </div>
  );
}