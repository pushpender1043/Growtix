import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Network, Mic, Volume2, Square } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useLanguage } from "@/hooks/useLanguage"; // Language hook import kiya

export default function AIMentor() {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi Preet! I'm your Growtix AI Mentor. Ask me about coding, AI, or career paths. I can also speak to you in multiple languages!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage(); // Current app language

  // BCP 47 Language Codes for Voice
  const getLanguageCode = (lang: string) => {
    const map: Record<string, string> = {
      "Hindi": "hi-IN",
      "Marathi": "mr-IN",
      "Tamil": "ta-IN",
      "Telugu": "te-IN",
      "Punjabi": "pa-IN",
      "Hinglish (Hindi+English)": "hi-IN",
      "English": "en-GB", // Preet, UK master's ki vibe ke liye British English!
    };
    return map[lang] || "en-US";
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // --- TEXT TO SPEECH (AI Speaking) ---
  const handleSpeak = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      alert("Your browser doesn't support text-to-speech.");
      return;
    }

    // Stop if already speaking
    if (speakingIndex === index) {
      window.speechSynthesis.cancel();
      setSpeakingIndex(null);
      return;
    }

    window.speechSynthesis.cancel(); // Stop any other speech
    
    // Clean text: Remove Markdown characters and Image/Diagram tags so AI doesn't read them aloud
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

  // --- SPEECH TO TEXT (Mic Input) ---
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

    window.speechSynthesis.cancel(); // Stop speaking when new message is sent
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
            <div className="relative border border-border/50 rounded-2xl overflow-hidden shadow-sm bg-white">
              <div className="bg-slate-50 px-3 py-2 border-b border-border/50 flex items-center gap-2">
                <Network className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-700">AI Generated Flowchart</span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[150px]">
                <img src={graphUrl} alt="AI Diagram" className="max-w-full h-auto object-contain" />
              </div>
            </div>
          </div>
        );
      }
      return (
        <div key={index} className="prose prose-sm dark:prose-invert max-w-none prose-pre:bg-zinc-900 prose-pre:rounded-xl prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded">
          <ReactMarkdown>{part}</ReactMarkdown>
        </div>
      );
    });
  };

  return (
    <div className="flex flex-col h-[650px] bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
      <div className="p-5 border-b bg-primary/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Bot className="text-primary w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base tracking-tight">AI Mentor</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest leading-none">Voice & Visual Engine Active</p>
            </div>
          </div>
        </div>
        <Sparkles className="w-5 h-5 text-primary/30" />
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl shadow-sm relative group ${
              m.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted/50 rounded-tl-none border border-border/50 text-foreground"
            }`}>
              
              {/* Voice Readout Button for AI Messages */}
              {m.role === "assistant" && (
                <button 
                  onClick={() => handleSpeak(m.content, i)}
                  className="absolute -right-10 top-2 p-2 rounded-full bg-background border border-border shadow-sm text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
                  title={speakingIndex === i ? "Stop speaking" : "Listen to response"}
                >
                  {speakingIndex === i ? <Square className="w-4 h-4 fill-current" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              {renderMessage(m.content)}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-muted/50 p-4 rounded-3xl animate-pulse text-xs italic">Mentor is thinking...</div>
          </div>
        )}
      </div>

      <div className="p-5 border-t bg-background">
        <div className="relative flex items-center gap-2">
          
          {/* Voice Input (Mic) Button */}
          <button 
            onClick={handleListen}
            className={`p-3.5 rounded-2xl transition-all shadow-sm ${
              isListening ? "bg-red-500 text-white animate-pulse shadow-red-500/30" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
            title="Voice Typing"
          >
            <Mic className="w-5 h-5" />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder={isListening ? "Listening..." : "Type or speak your question..."}
            className="flex-1 pl-5 pr-14 py-4 rounded-2xl bg-muted/30 border-border focus:bg-background transition-all outline-none text-sm"
          />
          
          <button 
            onClick={handleSend} 
            disabled={isTyping || !input.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}