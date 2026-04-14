import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "👋 Hello! I'm your AI Coding Mentor. I can help you with programming concepts, debug your code, or conduct a mock interview. What would you like to work on today?",
  },
];

export default function AIMentor() {
  const [mode, setMode] = useState<"mentor" | "interview">("mentor");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("Step-by-Step");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: Message = { id: Date.now(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiReply: Message = {
        id: Date.now() + 1,
        role: "ai",
        content: mode === "mentor"
          ? `Great question! Let me explain that using a **${style}** approach.\n\nHere's a quick example:\n\`\`\`python\ndef solve(n):\n    # Your solution here\n    return result\n\`\`\`\n\nWould you like me to elaborate further?`
          : `That's a solid answer! For a real interview, I'd suggest also mentioning **time complexity**. Let's try another question:\n\n*"How would you design a URL shortener service?"*`,
      };
      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="clay-card p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex bg-muted/50 rounded-xl p-0.5">
            <button
              onClick={() => setMode("mentor")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mode === "mentor" ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Coding Mentor
            </button>
            <button
              onClick={() => setMode("interview")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
                mode === "interview" ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
              }`}
            >
              Mock Interviewer
            </button>
          </div>
        </div>
        {mode === "interview" && (
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-sm hover:bg-muted/50 transition-colors">
            <Upload className="w-4 h-4" /> Upload Resume
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="clay-card flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "ai" && (
                  <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-br-md"
                      : "bg-muted/50 text-foreground rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-accent-foreground" />
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="bg-muted/50 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-border/50 p-3">
          <div className="flex items-end gap-2">
            <button className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="Ask me anything..."
                rows={1}
                className="w-full px-4 py-2.5 rounded-xl bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-2 py-2 rounded-xl bg-muted/30 text-xs border-0 focus:ring-2 focus:ring-primary/30 hidden sm:block"
            >
              <option>Step-by-Step</option>
              <option>Visual</option>
              <option>Analogy</option>
            </select>
            <button
              onClick={handleSend}
              className="p-2.5 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
