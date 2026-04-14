import { useState, useEffect } from "react";
import { ChevronRight, BookOpen, AlertCircle, Globe } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

const SUBJECT_CATALOG: Record<string, string[]> = {
  "C": ["Introduction", "Syntax", "Variables", "Data Types", "Input/Output", "Operators", "If...Else", "Switch", "While Loop", "For Loop", "Arrays", "Strings", "Pointers", "Functions", "File Handling"],
  "C++": ["Introduction", "Syntax", "Variables", "Data Types", "Operators", "Strings", "Math", "Booleans", "Conditions", "Switch", "While Loop", "For Loop", "Break/Continue", "Arrays", "References", "Pointers", "Functions", "OOP Basics"],
  "Java": ["Introduction", "Syntax", "Main method", "Variables", "Data Types", "Operators", "Strings", "Math", "Booleans", "If...Else", "Switch", "Loops", "Arrays", "Methods", "OOP", "Exception Handling"],
  "Python": ["Introduction", "Syntax", "Comments", "Variables", "Data Types", "Numbers", "Strings", "Booleans", "Operators", "Lists", "Tuples", "Sets", "Dictionaries", "If...Else", "Loops", "Functions", "Classes"],
  "JavaScript": ["Introduction", "Syntax", "Variables", "Let & Const", "Operators", "Data Types", "Functions", "Objects", "Events", "Strings", "Arrays", "Dates", "Math", "Conditions", "Arrow Functions", "Promises", "Async/Await"],
  "TypeScript": ["Introduction", "Types", "Interfaces", "Classes", "Functions", "Generics", "Enums", "Type Inference", "Type Assertions", "Union Types", "Intersection Types", "Tuples", "Decorators"],
  "React": ["Introduction", "Components", "JSX", "Props", "State", "Events", "Hooks (useState)", "Hooks (useEffect)", "Hooks (useMemo)", "Context API", "React Router", "Memo", "Refs"],
  "Node.js": ["Introduction", "Modules", "HTTP Module", "File System", "URL Module", "NPM", "Express Intro", "Callbacks", "Async Programming", "Events"],
  "Next.js": ["Introduction", "Pages Router", "App Router", "SSR vs SSG", "Routing", "API Routes", "Image Optimization", "Layouts", "Middleware", "Data Fetching"],
  "SQL": ["Introduction", "Database basics", "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "AND/OR", "ORDER BY", "Joins", "GROUP BY", "HAVING", "Constraints", "Indexes"],
  "MongoDB": ["Introduction", "NoSQL vs SQL", "Databases", "Collections", "Documents", "Insert", "Find", "Query", "Sort", "Update", "Delete", "Limit", "Indexes", "Aggregation"],
  "Cyber Security": ["Introduction", "Network Security", "Malware", "Phishing", "Passwords", "Encryption", "Firewalls", "VPNs", "Social Engineering", "DDoS", "SQL Injection", "XSS"],
  "Data Structures": ["Introduction", "Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables", "Trees", "Binary Search Tree", "Heaps", "Graphs", "Trie"],
  "Algorithms": ["Introduction", "Big O Notation", "Linear Search", "Binary Search", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "BFS", "DFS", "Dijkstra"],
  "Docker": ["Introduction", "Containers vs VMs", "Images", "Dockerfile", "Docker Compose", "Volumes", "Network", "Docker Hub", "Port Mapping", "Environment Variables"]
};

const SUBJECTS = Object.keys(SUBJECT_CATALOG);

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDGsLYnapfZsWGMBeOatgQg7BhtmobULlY";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function LearningHub() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[1]); 
  const [activeTopic, setActiveTopic] = useState(SUBJECT_CATALOG[SUBJECTS[1]][0]);
  const { language: learningLanguage, t } = useLanguage();
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const topics = SUBJECT_CATALOG[selectedSubject];

  useEffect(() => {
    setActiveTopic(SUBJECT_CATALOG[selectedSubject][0]);
  }, [selectedSubject]);

  useEffect(() => {
    fetchTutorial(selectedSubject, activeTopic, learningLanguage);
  }, [selectedSubject, activeTopic, learningLanguage]); // Re-fetch if language changes

  const generateWithFallback = async (prompt: string) => {
    const modelsToTry = ["gemini-1.5-pro", "gemini-1.5-flash", "gemini-2.5-flash"];
    
    for (let i = 0; i < modelsToTry.length; i++) {
      try {
        const model = genAI.getGenerativeModel({ model: modelsToTry[i] });
        const result = await model.generateContent(prompt);
        return await result.response.text();
      } catch (error: any) {
        console.warn(`Model ${modelsToTry[i]} failed:`, error.message);
        if (i === modelsToTry.length - 1) throw error;
        await new Promise(res => setTimeout(res, 1000));
      }
    }
    return "";
  };

  const fetchTutorial = async (subject: string, topic: string, lang: string) => {
    setErrorMsg("");
    setContent("");
    setLoading(true);
    
    try {
      const prompt = `You are an expert tech mentor. The user is learning '${subject} - ${topic}'. Provide a W3Schools-style tutorial in Markdown formatted text.
      CRITICAL INSTRUCTION: The entire explanation, analogies, and descriptions MUST be in ${lang} language. (Code snippets and variable names should remain in standard English).
      
      Structure it exactly like this:
      # ${topic} in ${subject}
      1. Introduction & Real-world analogy (in ${lang}).
      2. Code Examples with detailed comments (comments in ${lang}).
      3. Cheat Sheet summary table (in ${lang}).
      4. Related Video: Provide a YouTube search link formatted as a markdown link: [Watch Video Tutorials on YouTube](https://www.youtube.com/results?search_query=${encodeURIComponent(subject)}+${encodeURIComponent(topic)}+tutorial+in+${encodeURIComponent(lang)})
      5. Self-Test Quiz: Provide exactly 2 multiple-choice questions (in ${lang}) to test their knowledge on this specific topic. Put the answers at the very bottom.`;
      
      const text = await generateWithFallback(prompt);
      setContent(text);
    } catch (error: any) {
      console.error("All Gemini Models Failed:", error);
      setErrorMsg("Growtix AI servers are currently experiencing massive traffic. Please wait a few seconds and try clicking the topic again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Topics sidebar */}
      <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="clay-card p-4 space-y-4 shadow-clay sticky top-20 flex flex-col max-h-[calc(100vh-6rem)]">
          <div className="space-y-2 flex-shrink-0">
            <h3 className="font-heading font-semibold text-sm px-2 text-muted-foreground uppercase tracking-wider">{t("Select Subject")}</h3>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border/50 text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none transition-all"
            >
              {SUBJECTS.map((subject) => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  if (topic !== activeTopic) {
                    setActiveTopic(topic);
                  } else {
                    fetchTutorial(selectedSubject, topic, learningLanguage);
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-all ${
                  activeTopic === topic
                    ? "gradient-primary text-primary-foreground font-medium shadow-clay-sm"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                {topic}
                {activeTopic === topic && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        key={`${selectedSubject}-${activeTopic}-${learningLanguage}`}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1"
      >
        <div className="glass-card-strong p-6 md:p-10 min-h-[500px]">
          {/* Header Area with new UI changes */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-border/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0 shadow-clay-sm">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold">{selectedSubject} Learning Hub</h1>
                <p className="text-xs text-muted-foreground font-medium">{t("Generated instantly by Growtix AI")}</p>
              </div>
            </div>
          </div>
          
          {errorMsg ? (
            <div className="p-6 bg-destructive/10 border border-destructive/20 text-destructive rounded-2xl flex flex-col items-center justify-center text-center space-y-4 my-8">
              <AlertCircle className="w-12 h-12 mb-2" />
              <h3 className="text-lg font-bold">Server Overloaded</h3>
              <p className="text-sm opacity-80 max-w-md">{errorMsg}</p>
              <button 
                onClick={() => fetchTutorial(selectedSubject, activeTopic, learningLanguage)}
                className="mt-4 px-6 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-bold hover:opacity-90"
              >
                Retry Now
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-6 animate-pulse mt-8">
              <div className="h-10 bg-muted/60 rounded-xl w-2/3"></div>
              <div className="space-y-3 pt-4">
                <div className="h-4 bg-muted/50 rounded-xl flex w-full"></div>
                <div className="h-4 bg-muted/50 rounded-xl flex w-full"></div>
                <div className="h-4 bg-muted/50 rounded-xl flex w-5/6"></div>
                <div className="h-4 bg-muted/50 rounded-xl flex w-4/6"></div>
              </div>
              <div className="h-56 bg-gray-950/40 rounded-xl w-full border border-white/10 mt-8 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]"></div>
            </div>
          ) : (
            <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-p:text-foreground/80 prose-li:text-foreground/80 prose-a:text-primary">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  code(props) {
                    const {children, className, ...rest} = props
                    const match = /language-(\w+)/.exec(className || '')
                    return match ? (
                      <div className="rounded-2xl overflow-hidden shadow-clay-sm my-6 border border-white/10 bg-[#1e1e1e]">
                        <SyntaxHighlighter
                          {...rest as any}
                          PreTag="div"
                          children={String(children).replace(/\n$/, '')}
                          language={match[1]}
                          style={vscDarkPlus}
                          customStyle={{ margin: 0, padding: '1.5rem', borderRadius: '1rem', background: 'transparent' }}
                        />
                      </div>
                    ) : (
                      <code {...rest} className="bg-muted/60 text-primary font-mono text-[0.85em] px-1.5 py-0.5 rounded-md">
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}