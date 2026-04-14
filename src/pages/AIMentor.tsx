// import { useState, useRef, useEffect } from "react";
// import { Send, Paperclip, Bot, User, Upload } from "lucide-react";
// import { motion, AnimatePresence } from "framer-motion";

// interface Message {
//   id: number;
//   role: "user" | "ai";
//   content: string;
// }

// const initialMessages: Message[] = [
//   {
//     id: 1,
//     role: "ai",
//     content: "👋 Hello! I'm your AI Coding Mentor. I can help you with programming concepts, debug your code, or conduct a mock interview. What would you like to work on today?",
//   },
// ];

// export default function AIMentor() {
//   const [mode, setMode] = useState<"mentor" | "interview">("mentor");
//   const [messages, setMessages] = useState<Message[]>(initialMessages);
//   const [input, setInput] = useState("");
//   const [style, setStyle] = useState("Step-by-Step");
//   const [isTyping, setIsTyping] = useState(false);
//   const bottomRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   const handleSend = () => {
//     if (!input.trim()) return;
//     const userMsg: Message = { id: Date.now(), role: "user", content: input };
//     setMessages((prev) => [...prev, userMsg]);
//     setInput("");
//     setIsTyping(true);

//     setTimeout(() => {
//       const aiReply: Message = {
//         id: Date.now() + 1,
//         role: "ai",
//         content: mode === "mentor"
//           ? `Great question! Let me explain that using a **${style}** approach.\n\nHere's a quick example:\n\`\`\`python\ndef solve(n):\n    # Your solution here\n    return result\n\`\`\`\n\nWould you like me to elaborate further?`
//           : `That's a solid answer! For a real interview, I'd suggest also mentioning **time complexity**. Let's try another question:\n\n*"How would you design a URL shortener service?"*`,
//       };
//       setMessages((prev) => [...prev, aiReply]);
//       setIsTyping(false);
//     }, 1200);
//   };

//   return (
//     <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
//       {/* Header */}
//       <div className="clay-card p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
//         <div className="flex items-center gap-3">
//           <div className="flex bg-muted/50 rounded-xl p-0.5">
//             <button
//               onClick={() => setMode("mentor")}
//               className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                 mode === "mentor" ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
//               }`}
//             >
//               Coding Mentor
//             </button>
//             <button
//               onClick={() => setMode("interview")}
//               className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${
//                 mode === "interview" ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
//               }`}
//             >
//               Mock Interviewer
//             </button>
//           </div>
//         </div>
//         {mode === "interview" && (
//           <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border text-sm hover:bg-muted/50 transition-colors">
//             <Upload className="w-4 h-4" /> Upload Resume
//           </button>
//         )}
//       </div>

//       {/* Chat area */}
//       <div className="clay-card flex-1 flex flex-col overflow-hidden">
//         <div className="flex-1 overflow-y-auto p-4 space-y-4">
//           <AnimatePresence>
//             {messages.map((msg) => (
//               <motion.div
//                 key={msg.id}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
//               >
//                 {msg.role === "ai" && (
//                   <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
//                     <Bot className="w-4 h-4 text-primary-foreground" />
//                   </div>
//                 )}
//                 <div
//                   className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
//                     msg.role === "user"
//                       ? "gradient-primary text-primary-foreground rounded-br-md"
//                       : "bg-muted/50 text-foreground rounded-bl-md"
//                   }`}
//                 >
//                   <p className="whitespace-pre-wrap">{msg.content}</p>
//                 </div>
//                 {msg.role === "user" && (
//                   <div className="w-8 h-8 rounded-xl bg-accent flex items-center justify-center flex-shrink-0">
//                     <User className="w-4 h-4 text-accent-foreground" />
//                   </div>
//                 )}
//               </motion.div>
//             ))}
//           </AnimatePresence>
//           {isTyping && (
//             <div className="flex gap-3 items-center">
//               <div className="w-8 h-8 rounded-xl gradient-primary flex items-center justify-center">
//                 <Bot className="w-4 h-4 text-primary-foreground" />
//               </div>
//               <div className="bg-muted/50 rounded-2xl px-4 py-3">
//                 <div className="flex gap-1">
//                   <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
//                   <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
//                   <span className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
//                 </div>
//               </div>
//             </div>
//           )}
//           <div ref={bottomRef} />
//         </div>

//         {/* Input */}
//         <div className="border-t border-border/50 p-3">
//           <div className="flex items-end gap-2">
//             <button className="p-2 rounded-xl hover:bg-muted/50 text-muted-foreground transition-colors">
//               <Paperclip className="w-5 h-5" />
//             </button>
//             <div className="flex-1 relative">
//               <textarea
//                 value={input}
//                 onChange={(e) => setInput(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter" && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSend();
//                   }
//                 }}
//                 placeholder="Ask me anything..."
//                 rows={1}
//                 className="w-full px-4 py-2.5 rounded-xl bg-muted/30 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
//               />
//             </div>
//             <select
//               value={style}
//               onChange={(e) => setStyle(e.target.value)}
//               className="px-2 py-2 rounded-xl bg-muted/30 text-xs border-0 focus:ring-2 focus:ring-primary/30 hidden sm:block"
//             >
//               <option>Step-by-Step</option>
//               <option>Visual</option>
//               <option>Analogy</option>
//             </select>
//             <button
//               onClick={handleSend}
//               className="p-2.5 rounded-xl gradient-primary text-primary-foreground hover:opacity-90 transition-opacity"
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { getGeminiResponse } from "../lib/gemini"; // Adjust path if needed
import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "../lib/supabase"; // Adjust this path if needed

// Update these import paths based on exactly where you saved them!
import { MentorChatBox } from "../features/ai-mentor/components/MentorChatBox";
import { QuickActionChips } from "../features/ai-mentor/components/QuickActionChips";

export interface Message {
  id: number;
  role: "user" | "ai";
  content: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    role: "ai",
    content: "👋 Hello! I'm your AI Coding Mentor. I can help you with programming concepts, debug your code, or explain algorithms. What would you like to work on today?",
  },
];

export default function AIMentor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [style, setStyle] = useState("Step-by-Step");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);


  const handleSend = async (overrideText?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim()) return;

    // 0. Check if the user is actually logged in first!
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      alert("Please log in to use the AI Mentor!");
      return;
    }

    // 1. Update UI immediately so it feels fast
    const userMsg: Message = { id: Date.now(), role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput(""); 
    setIsTyping(true);

    // 2. Save the User's message to Supabase (in the background)
    await supabase.from('mentor_chats' as any).insert({
      role: 'user',
      content: textToSend,
      user_id: user.id
    });

    // 3. Call the real Gemini API
    const aiResponseText = await getGeminiResponse(textToSend, messages, style);

    // 4. Update UI with AI's response
    const aiReply: Message = {
      id: Date.now() + 1,
      role: "ai",
      content: aiResponseText,
    };
    setMessages((prev) => [...prev, aiReply]);
    setIsTyping(false);

    // 5. Save the AI's message to Supabase
    await supabase.from('mentor_chats' as any).insert({
      role: 'ai',
      content: aiResponseText,
      user_id: user.id
    });
  };

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header - Simplified for Mentor Mode Only */}
      <div className="clay-card p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground">AI Coding Mentor</h1>
            <p className="text-xs text-muted-foreground">Powered by Gemini</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="clay-card flex-1 flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Our newly created Markdown Chat Box */}
                <MentorChatBox message={msg} />
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex justify-start w-full mb-6"
            >
              <div className="bg-muted/50 border border-border rounded-2xl px-4 py-4 flex gap-1">
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background border-t border-border/50">
          {/* Our newly created Quick Action Chips */}
          <QuickActionChips onSelect={(prompt) => handleSend(prompt)} />

          <div className="flex items-end gap-2">
            <button className="p-3 rounded-xl hover:bg-muted text-muted-foreground transition-colors">
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
                placeholder="Ask for hints, code explanations, or debugging help..."
                rows={1}
                className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            
            {/* Context Selector */}
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="px-3 py-3 rounded-xl bg-muted/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 hidden sm:block cursor-pointer text-muted-foreground"
            >
              <option>Step-by-Step</option>
              <option>Visual</option>
              <option>Analogy</option>
            </select>
            
            {/* Send Button */}
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() && !isTyping}
              className="p-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}