// import { useState, useEffect } from "react";
// import { 
//   ChevronRight, BookOpen, AlertCircle, PlayCircle, 
//   ExternalLink, CheckCircle, XCircle, FileText, 
//   GraduationCap, HelpCircle, Award, Code, Trophy, Check, Play
// } from "lucide-react";
// import { useLanguage } from "@/hooks/useLanguage";
// import { motion, AnimatePresence } from "framer-motion";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
// import Editor from "@monaco-editor/react";
// import { toast } from "sonner"; // Assuming you have sonner installed based on your App.tsx

// // Expanded Catalog
// const SUBJECT_CATALOG: Record<string, string[]> = {
//   "C++": ["Introduction", "Syntax", "Variables", "Data Types", "Operators", "Strings", "Math", "Booleans", "Conditions", "Switch", "While Loop", "For Loop", "Break/Continue", "Arrays", "References", "Pointers", "Functions", "OOP Basics"],
//   "Python": ["Introduction", "Syntax", "Comments", "Variables", "Data Types", "Numbers", "Strings", "Booleans", "Operators", "Lists", "Tuples", "Sets", "Dictionaries", "If...Else", "Loops", "Functions", "Classes"],
//   "Artificial Intelligence": ["Introduction to AI", "Search Algorithms", "Knowledge Representation", "Fuzzy Logic", "Expert Systems", "Natural Language Processing (NLP)", "Computer Vision"],
//   "Machine Learning": ["Introduction to ML", "Supervised vs Unsupervised", "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "Support Vector Machines", "K-Means Clustering", "Neural Networks"],
//   "Data Structures": ["Introduction", "Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables", "Trees", "Binary Search Tree", "Heaps", "Graphs", "Trie"],
//   "Algorithms": ["Introduction", "Big O Notation", "Linear Search", "Binary Search", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "BFS", "DFS", "Dijkstra"],
//   "React": ["Introduction", "Components", "JSX", "Props", "State", "Events", "Hooks (useState)", "Hooks (useEffect)", "Context API", "React Router"],
//   "Node.js": ["Introduction", "Modules", "HTTP Module", "File System", "Express Intro", "Async Programming"],
//   "SQL": ["Introduction", "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "Joins", "GROUP BY"]
// };

// const SUBJECTS = Object.keys(SUBJECT_CATALOG);

// // Piston API Configuration for Sandbox
// const PISTON_CONFIG: Record<string, { lang: string, version: string, defaultCode: string }> = {
//   "C++": { lang: "c++", version: "10.2.0", defaultCode: "#include <iostream>\nusing namespace std;\n\nint main() {\n    // Try out what you just learned!\n    cout << \"Hello Growtix!\";\n    return 0;\n}" },
//   "Python": { lang: "python", version: "3.10.0", defaultCode: "def main():\n    # Try out what you just learned!\n    print(\"Hello Growtix!\")\n\nif __name__ == \"__main__\":\n    main()" },
//   "JavaScript": { lang: "javascript", version: "18.15.0", defaultCode: "function main() {\n    // Try out what you just learned!\n    console.log(\"Hello Growtix!\");\n}\n\nmain();" },
// };

// interface QuizQuestion {
//   question: string;
//   options: string[];
//   correctAnswerIndex: number;
//   explanation: string;
// }

// interface Course {
//   title: string;
//   platform: string;
//   url: string;
//   type: "Video" | "Course" | "Documentation";
// }

// interface Certification {
//   title: string;
//   issuer: string;
//   url: string;
// }

// interface StructuredContent {
//   content: string;
//   quiz: QuizQuestion[];
//   resources: Course[];
//   certifications: Certification[];
// }

// export default function LearningHub() {
//   const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]); 
//   const [activeTopic, setActiveTopic] = useState(SUBJECT_CATALOG[SUBJECTS[0]][0]);
//   const [activeTab, setActiveTab] = useState<"tutorial" | "quiz" | "courses" | "certifications" | "sandbox">("tutorial");
  
//   const { language: learningLanguage, t } = useLanguage();
  
//   const [data, setData] = useState<StructuredContent | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");
  
//   const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  
//   // Progress Tracking State
//   const [completedTopics, setCompletedTopics] = useState<Record<string, string[]>>(() => {
//     const saved = localStorage.getItem("growtix_learning_progress");
//     return saved ? JSON.parse(saved) : {};
//   });

//   // Sandbox State
//   const [sandboxCode, setSandboxCode] = useState("");
//   const [sandboxOutput, setSandboxOutput] = useState("");
//   const [isExecuting, setIsExecuting] = useState(false);

//   const topics = SUBJECT_CATALOG[selectedSubject];

//   useEffect(() => {
//     setActiveTopic(SUBJECT_CATALOG[selectedSubject][0]);
//   }, [selectedSubject]);

//   useEffect(() => {
//     fetchTutorial(selectedSubject, activeTopic, learningLanguage);
//     setActiveTab("tutorial");
//     setSelectedAnswers({});
    
//     // Auto-set sandbox language based on subject
//     const subjectMap: Record<string, string> = {
//       "C++": "C++", "Python": "Python", "Artificial Intelligence": "Python", 
//       "Machine Learning": "Python", "React": "JavaScript", "Node.js": "JavaScript"
//     };
//     const mappedLang = subjectMap[selectedSubject] || "JavaScript";
//     setSandboxCode(PISTON_CONFIG[mappedLang].defaultCode);
//     setSandboxOutput("");
//   }, [selectedSubject, activeTopic, learningLanguage]);

//   const markTopicAsMastered = () => {
//     const updated = { ...completedTopics };
//     if (!updated[selectedSubject]) updated[selectedSubject] = [];
    
//     if (!updated[selectedSubject].includes(activeTopic)) {
//       updated[selectedSubject].push(activeTopic);
//       setCompletedTopics(updated);
//       localStorage.setItem("growtix_learning_progress", JSON.stringify(updated));
//       toast.success(`${activeTopic} Mastered!`, {
//         description: "Great job! Your progress has been saved. Keep going! 🚀",
//       });
//     }
//   };

//   const handleRunSandbox = async () => {
//     setIsExecuting(true);
//     setSandboxOutput("Running code...\n");

//     const subjectMap: Record<string, string> = {
//       "C++": "C++", "Python": "Python", "Artificial Intelligence": "Python", 
//       "Machine Learning": "Python", "React": "JavaScript", "Node.js": "JavaScript"
//     };
//     const mappedLang = subjectMap[selectedSubject] || "JavaScript";
//     const config = PISTON_CONFIG[mappedLang];

//     try {
//       const response = await fetch("https://emkc.org/api/v2/piston/execute", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           language: config.lang,
//           version: config.version,
//           files: [{ content: sandboxCode }],
//         }),
//       });

//       if (!response.ok) throw new Error("Execution failed");
//       const result = await response.json();
      
//       if (result.run.stderr) {
//         setSandboxOutput(`❌ Error:\n${result.run.stderr}`);
//       } else {
//         setSandboxOutput(`✅ Output:\n${result.run.stdout}`);
//       }
//     } catch (error) {
//       setSandboxOutput("⚠️ Failed to execute code. The Sandbox API might be rate-limited.");
//     } finally {
//       setIsExecuting(false);
//     }
//   };

//   const generateWithGroq = async (prompt: string) => {
//     const apiKey = import.meta.env.VITE_GROQ_API_KEY;
//     if (!apiKey) throw new Error("Missing API Key. Please add VITE_GROQ_API_KEY to your .env file.");

//     const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
//       method: "POST",
//       headers: {
//         "Authorization": `Bearer ${apiKey}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//           {
//             role: "system",
//             content: "You are an expert technical mentor. You must ALWAYS respond with purely raw, valid JSON."
//           },
//           { role: "user", content: prompt }
//         ],
//         response_format: { type: "json_object" },
//         temperature: 0.7
//       }),
//     });

//     if (!response.ok) throw new Error(`Groq API Error: ${response.statusText}`);
//     const jsonResponse = await response.json();
//     return jsonResponse.choices[0].message.content;
//   };

//   const fetchTutorial = async (subject: string, topic: string, lang: string) => {
//     setErrorMsg("");
//     setData(null);
//     setLoading(true);
    
//     const cacheKey = `growtix_groq_v2_${subject}_${topic}_${lang}`;
//     const cachedData = localStorage.getItem(cacheKey);
    
//     if (cachedData) {
//       try {
//         setData(JSON.parse(cachedData));
//         setLoading(false);
//         return; 
//       } catch (e) {
//         console.warn("Corrupted cache, refetching...", e);
//       }
//     }

//     try {
//       const prompt = `The user is learning '${subject} - ${topic}'.
//       Create a highly detailed, educational JSON object following this exact structure:
//       {
//         "content": "A detailed W3Schools-style tutorial in Markdown. Use analogies, detailed code examples with comments, and a cheat sheet table. MUST BE IN ${lang}.",
//         "quiz": [
//           {
//             "question": "A multiple choice question testing the concept (in ${lang})",
//             "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
//             "correctAnswerIndex": 0,
//             "explanation": "Detailed explanation of why this answer is correct (in ${lang})"
//           }
//         ],
//         "resources": [
//           {
//             "title": "Search YouTube for ${topic} in ${subject}",
//             "platform": "YouTube",
//             "url": "https://www.youtube.com/results?search_query=${encodeURIComponent(subject + ' ' + topic + ' tutorial')}",
//             "type": "Video"
//           }
//         ],
//         "certifications": [
//           {
//             "title": "Name of an official, recognized certification related to ${subject}",
//             "issuer": "Issuing organization (e.g., Microsoft, AWS, Python Institute, CompTIA)",
//             "url": "https://www.google.com/search?q=${encodeURIComponent('official certification ' + subject)}"
//           }
//         ]
//       }`;
      
//       const rawJsonString = await generateWithGroq(prompt);
//       const parsedData: StructuredContent = JSON.parse(rawJsonString);
      
//       localStorage.setItem(cacheKey, JSON.stringify(parsedData));
//       setData(parsedData);

//     } catch (error: any) {
//       if (error.message.includes("Missing API Key")) setErrorMsg(error.message);
//       else setErrorMsg("Our servers are experiencing an issue. Please try clicking the topic again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const isTopicCompleted = completedTopics[selectedSubject]?.includes(activeTopic);

//   return (
//     <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      
//       {/* Sidebar Navigation */}
//       <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
//         <div className="clay-card p-5 space-y-5 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-6rem)] bg-card border border-border/50 rounded-2xl">
//           <div className="space-y-3 flex-shrink-0 border-b border-border/50 pb-4">
//             <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
//               {t("Learning Path")}
//             </label>
//             <div className="relative">
//               <select
//                 value={selectedSubject}
//                 onChange={(e) => setSelectedSubject(e.target.value)}
//                 className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all cursor-pointer"
//               >
//                 {SUBJECTS.map((subject) => (
//                   <option key={subject} value={subject}>{subject}</option>
//                 ))}
//               </select>
//               <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
//             </div>
            
//             {/* Progress Bar */}
//             <div className="pt-2">
//               <div className="flex justify-between text-xs mb-1 font-medium text-muted-foreground">
//                 <span>Progress</span>
//                 <span>{completedTopics[selectedSubject]?.length || 0} / {topics.length}</span>
//               </div>
//               <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
//                 <div 
//                   className="h-full bg-primary transition-all duration-500" 
//                   style={{ width: `${((completedTopics[selectedSubject]?.length || 0) / topics.length) * 100}%` }}
//                 />
//               </div>
//             </div>
//           </div>
          
//           <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
//             {topics.map((topic) => {
//               const isCompleted = completedTopics[selectedSubject]?.includes(topic);
//               return (
//                 <button
//                   key={topic}
//                   onClick={() => { if (topic !== activeTopic) setActiveTopic(topic); }}
//                   className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between transition-all duration-200 border ${
//                     activeTopic === topic
//                       ? "bg-primary text-primary-foreground border-primary font-semibold shadow-md"
//                       : "bg-transparent border-transparent text-foreground hover:bg-muted hover:border-border/50"
//                   }`}
//                 >
//                   <span className="flex items-center gap-2">
//                     {isCompleted && <Check className={`w-4 h-4 ${activeTopic === topic ? "text-primary-foreground" : "text-green-500"}`} />}
//                     {topic}
//                   </span>
//                   {activeTopic === topic && <ChevronRight className="w-4 h-4" />}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0">
        
//         {/* Header & Tabs */}
//         <div className="mb-6 space-y-6">
//           <div>
//             <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-2">
//               <span>{selectedSubject}</span>
//               <ChevronRight className="w-4 h-4" />
//               <span className="text-foreground flex items-center gap-2">
//                 {activeTopic}
//                 {isTopicCompleted && <span className="bg-green-500/10 text-green-500 text-xs px-2 py-0.5 rounded-full border border-green-500/20 flex items-center gap-1"><Trophy className="w-3 h-3"/> Mastered</span>}
//               </span>
//             </div>
//             <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
//               {activeTopic}
//             </h1>
//           </div>

//           <div className="flex gap-2 border-b border-border/50 pb-px overflow-x-auto custom-scrollbar">
//             <TabButton active={activeTab === "tutorial"} onClick={() => setActiveTab("tutorial")} icon={FileText} label="Tutorial" />
//             <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Knowledge Check" disabled={!data} />
//             <TabButton active={activeTab === "sandbox"} onClick={() => setActiveTab("sandbox")} icon={Code} label="Code Sandbox" />
//             <TabButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")} icon={GraduationCap} label="Related Courses" disabled={!data} />
//             <TabButton active={activeTab === "certifications"} onClick={() => setActiveTab("certifications")} icon={Award} label="Certifications" disabled={!data} />
//           </div>
//         </div>

//         {/* Dynamic Content Panel */}
//         <motion.div
//           key={`${selectedSubject}-${activeTopic}-${activeTab}`}
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 min-h-[500px] shadow-sm relative overflow-hidden flex flex-col"
//         >
//           {errorMsg ? (
//             <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-destructive/5">
//               <AlertCircle className="w-12 h-12 text-destructive mb-4" />
//               <h3 className="text-xl font-bold text-destructive mb-2">Oops! Something went wrong</h3>
//               <p className="text-muted-foreground max-w-md mb-6">{errorMsg}</p>
//               <button 
//                 onClick={() => fetchTutorial(selectedSubject, activeTopic, learningLanguage)}
//                 className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
//               >
//                 Retry Request
//               </button>
//             </div>
//           ) : loading ? (
//             <div className="space-y-8 animate-pulse">
//               <div className="h-8 bg-muted rounded-lg w-1/3"></div>
//               <div className="space-y-4">
//                 <div className="h-4 bg-muted/60 rounded flex w-full"></div>
//                 <div className="h-4 bg-muted/60 rounded flex w-full"></div>
//                 <div className="h-4 bg-muted/60 rounded flex w-5/6"></div>
//               </div>
//               <div className="h-64 bg-muted/30 border border-muted rounded-xl w-full"></div>
//             </div>
//           ) : activeTab === "sandbox" ? (
//              <AnimatePresence mode="wait">
//                <motion.div key="sandbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-[600px]">
//                  <div className="flex items-center justify-between mb-4">
//                    <h2 className="text-xl font-bold font-heading">Try it Yourself</h2>
//                    <button
//                      onClick={handleRunSandbox}
//                      disabled={isExecuting}
//                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-opacity"
//                    >
//                      <Play className="w-4 h-4" /> {isExecuting ? "Executing..." : "Run Code"}
//                    </button>
//                  </div>
                 
//                  <div className="flex-1 border border-border/50 rounded-xl overflow-hidden mb-4 bg-[#1e1e1e]">
//                    <Editor
//                      height="100%"
//                      language={["React", "Node.js"].includes(selectedSubject) ? "javascript" : (selectedSubject === "C++" ? "cpp" : "python")}
//                      theme="vs-dark"
//                      value={sandboxCode}
//                      onChange={(value) => setSandboxCode(value || "")}
//                      options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }}
//                    />
//                  </div>
                 
//                  <div className="h-40 bg-gray-950 border border-border/50 rounded-xl overflow-hidden flex flex-col">
//                    <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
//                      <span className="text-xs text-gray-400 font-mono font-semibold uppercase tracking-wider">Console Output</span>
//                    </div>
//                    <div className="flex-1 p-4 overflow-y-auto">
//                      <pre className={`text-sm font-mono whitespace-pre-wrap ${sandboxOutput.includes("❌") ? "text-red-400" : "text-green-400"}`}>
//                        {sandboxOutput || <span className="text-gray-600 italic">Click 'Run Code' to see the output here...</span>}
//                      </pre>
//                    </div>
//                  </div>
//                </motion.div>
//              </AnimatePresence>
//           ) : data ? (
//             <AnimatePresence mode="wait">
//               {activeTab === "tutorial" && (
//                 <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                   <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary">
//                     <ReactMarkdown 
//                       remarkPlugins={[remarkGfm]}
//                       components={{
//                         code(props) {
//                           const {children, className, ...rest} = props;
//                           const match = /language-(\w+)/.exec(className || '');
//                           return match ? (
//                             <div className="rounded-xl overflow-hidden shadow-md my-6 border border-border/50">
//                               <SyntaxHighlighter
//                                 {...rest as any}
//                                 PreTag="div"
//                                 children={String(children).replace(/\n$/, '')}
//                                 language={match[1]}
//                                 style={vscDarkPlus}
//                                 customStyle={{ margin: 0, padding: '1.5rem', background: '#1e1e1e', fontSize: '0.9em' }}
//                               />
//                             </div>
//                           ) : (
//                             <code {...rest} className="bg-muted text-primary font-mono text-[0.85em] px-1.5 py-0.5 rounded-md">
//                               {children}
//                             </code>
//                           );
//                         }
//                       }}
//                     >
//                       {data.content}
//                     </ReactMarkdown>
//                   </div>
                  
//                   {/* Mark as Mastered Button */}
//                   <div className="mt-12 pt-8 border-t border-border/50 flex justify-center">
//                     <button
//                       onClick={markTopicAsMastered}
//                       disabled={isTopicCompleted}
//                       className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
//                         isTopicCompleted 
//                           ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" 
//                           : "bg-primary text-primary-foreground hover:scale-105 shadow-md shadow-primary/20"
//                       }`}
//                     >
//                       <Trophy className="w-5 h-5" /> 
//                       {isTopicCompleted ? "Topic Mastered!" : "Mark as Mastered"}
//                     </button>
//                   </div>
//                 </motion.div>
//               )}

//               {activeTab === "quiz" && (
//                 <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
//                   <h2 className="text-2xl font-bold font-heading mb-6">Test Your Understanding</h2>
//                   {data.quiz.map((q, qIndex) => (
//                     <div key={qIndex} className="bg-muted/20 border border-border/50 rounded-xl p-6">
//                       <p className="font-semibold text-lg mb-4">{qIndex + 1}. {q.question}</p>
//                       <div className="space-y-3">
//                         {q.options.map((opt, oIndex) => {
//                           const isSelected = selectedAnswers[qIndex] === oIndex;
//                           const isCorrect = oIndex === q.correctAnswerIndex;
//                           const hasAnswered = selectedAnswers[qIndex] !== undefined;
                          
//                           let btnClass = "bg-card border-border hover:bg-muted";
//                           if (hasAnswered) {
//                             if (isCorrect) btnClass = "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400";
//                             else if (isSelected) btnClass = "bg-destructive/10 border-destructive/50 text-destructive";
//                             else btnClass = "bg-card border-border opacity-50";
//                           }

//                           return (
//                             <button
//                               key={oIndex}
//                               disabled={hasAnswered}
//                               onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
//                               className={`w-full text-left px-5 py-3 rounded-lg border flex items-center justify-between transition-all ${btnClass}`}
//                             >
//                               <span>{opt}</span>
//                               {hasAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
//                               {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
//                             </button>
//                           );
//                         })}
//                       </div>
//                       {selectedAnswers[qIndex] !== undefined && (
//                         <div className="mt-4 p-4 bg-muted rounded-lg text-sm border border-border/50">
//                           <strong>Explanation:</strong> {q.explanation}
//                         </div>
//                       )}
//                     </div>
//                   ))}
                  
//                   {Object.keys(selectedAnswers).length === data.quiz.length && (
//                     <div className="pt-6 border-t border-border/50 flex justify-center">
//                       <button
//                         onClick={markTopicAsMastered}
//                         disabled={isTopicCompleted}
//                         className={`flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold transition-all ${
//                           isTopicCompleted 
//                             ? "bg-green-500/10 text-green-500 border border-green-500/20 cursor-default" 
//                             : "bg-primary text-primary-foreground hover:scale-105 shadow-md shadow-primary/20"
//                         }`}
//                       >
//                         <Trophy className="w-5 h-5" /> 
//                         {isTopicCompleted ? "Topic Mastered!" : "Mark as Mastered"}
//                       </button>
//                     </div>
//                   )}
//                 </motion.div>
//               )}

//               {activeTab === "courses" && (
//                 <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                   <h2 className="text-2xl font-bold font-heading mb-6">Recommended Learning Path</h2>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     {data.resources.map((res, idx) => (
//                       <a 
//                         key={idx} 
//                         href={res.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="group flex flex-col justify-between bg-card border border-border/50 hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
//                       >
//                         <div>
//                           <div className="flex items-center gap-2 mb-3">
//                             {res.type === "Video" ? <PlayCircle className="w-5 h-5 text-red-500" /> : <BookOpen className="w-5 h-5 text-blue-500" />}
//                             <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{res.platform}</span>
//                           </div>
//                           <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
//                             {res.title}
//                           </h3>
//                         </div>
//                         <div className="mt-6 flex items-center text-sm font-medium text-primary">
//                           View Resource <ExternalLink className="w-4 h-4 ml-1.5" />
//                         </div>
//                       </a>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}

//               {activeTab === "certifications" && (
//                 <motion.div key="certifications" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
//                   <h2 className="text-2xl font-bold font-heading mb-2">Industry Certifications</h2>
//                   <p className="text-muted-foreground mb-8">Boost your resume with these globally recognized certifications related to {selectedSubject}.</p>
                  
//                   <div className="grid grid-cols-1 gap-4">
//                     {data.certifications.map((cert, idx) => (
//                       <a 
//                         key={idx} 
//                         href={cert.url} 
//                         target="_blank" 
//                         rel="noopener noreferrer"
//                         className="group relative overflow-hidden bg-gradient-to-br from-card to-muted border border-border/50 hover:border-amber-500/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all"
//                       >
//                         <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full -mr-10 -mt-10 blur-2xl group-hover:bg-amber-500/20 transition-all"></div>
//                         <div className="relative z-10 flex items-start gap-4">
//                           <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-500/20">
//                             <Award className="w-6 h-6 text-amber-500" />
//                           </div>
//                           <div className="flex-1">
//                             <h3 className="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors">
//                               {cert.title}
//                             </h3>
//                             <p className="text-sm font-medium text-muted-foreground mt-1 mb-4">
//                               Issued by: <span className="text-foreground">{cert.issuer}</span>
//                             </p>
//                             <div className="inline-flex items-center text-sm font-bold text-amber-600 dark:text-amber-400">
//                               Explore Certification Exam <ChevronRight className="w-4 h-4 ml-1" />
//                             </div>
//                           </div>
//                         </div>
//                       </a>
//                     ))}
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           ) : null}
//         </motion.div>
//       </div>
//     </div>
//   );
// }

// function TabButton({ active, onClick, icon: Icon, label, disabled = false }: any) {
//   return (
//     <button
//       onClick={onClick}
//       disabled={disabled}
//       className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
//         active 
//           ? "border-primary text-primary" 
//           : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
//       } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
//     >
//       <Icon className="w-4 h-4" />
//       {label}
//     </button>
//   );
// }

import { useState, useEffect } from "react";
import { 
  ChevronRight, BookOpen, AlertCircle, PlayCircle, 
  ExternalLink, CheckCircle, XCircle, FileText, 
  GraduationCap, HelpCircle 
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Expanded Catalog
const SUBJECT_CATALOG: Record<string, string[]> = {
  "C++": ["Introduction", "Syntax", "Variables", "Data Types", "Operators", "Strings", "Math", "Booleans", "Conditions", "Switch", "While Loop", "For Loop", "Break/Continue", "Arrays", "References", "Pointers", "Functions", "OOP Basics"],
  "Python": ["Introduction", "Syntax", "Comments", "Variables", "Data Types", "Numbers", "Strings", "Booleans", "Operators", "Lists", "Tuples", "Sets", "Dictionaries", "If...Else", "Loops", "Functions", "Classes"],
  "Artificial Intelligence": ["Introduction to AI", "Search Algorithms", "Knowledge Representation", "Fuzzy Logic", "Expert Systems", "Natural Language Processing (NLP)", "Computer Vision"],
  "Machine Learning": ["Introduction to ML", "Supervised vs Unsupervised", "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "Support Vector Machines", "K-Means Clustering", "Neural Networks"],
  "Data Structures": ["Introduction", "Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables", "Trees", "Binary Search Tree", "Heaps", "Graphs", "Trie"],
  "Algorithms": ["Introduction", "Big O Notation", "Linear Search", "Binary Search", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "BFS", "DFS", "Dijkstra"],
  "React": ["Introduction", "Components", "JSX", "Props", "State", "Events", "Hooks (useState)", "Hooks (useEffect)", "Context API", "React Router"],
  "Node.js": ["Introduction", "Modules", "HTTP Module", "File System", "Express Intro", "Async Programming"],
  "SQL": ["Introduction", "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "Joins", "GROUP BY"]
};

const SUBJECTS = Object.keys(SUBJECT_CATALOG);

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

interface Course {
  title: string;
  platform: string;
  url: string;
  type: "Video" | "Course" | "Documentation";
}

interface StructuredContent {
  content: string;
  quiz: QuizQuestion[];
  resources: Course[];
}

export default function LearningHub() {
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0]); 
  const [activeTopic, setActiveTopic] = useState(SUBJECT_CATALOG[SUBJECTS[0]][0]);
  const [activeTab, setActiveTab] = useState<"tutorial" | "quiz" | "courses">("tutorial");
  
  const { language: learningLanguage, t } = useLanguage();
  
  const [data, setData] = useState<StructuredContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});

  const topics = SUBJECT_CATALOG[selectedSubject];

  useEffect(() => {
    setActiveTopic(SUBJECT_CATALOG[selectedSubject][0]);
  }, [selectedSubject]);

  useEffect(() => {
    fetchTutorial(selectedSubject, activeTopic, learningLanguage);
    setActiveTab("tutorial");
    setSelectedAnswers({});
  }, [selectedSubject, activeTopic, learningLanguage]);

  // Secure Groq Native Fetch Implementation
  const generateWithGroq = async (prompt: string) => {
    // Dynamically fetch from env vars at runtime
    const apiKey = import.meta.env.VITE_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("Missing API Key. Please add VITE_GROQ_API_KEY to your .env file and restart the development server.");
    }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: "You are an expert technical mentor. You must ALWAYS respond with purely raw, valid JSON. Never include markdown code blocks (like ```json), introductions, or concluding remarks. Just the JSON object."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" }, // Forces strict JSON output
          temperature: 0.7
        }),
      });

      if (!response.ok) {
        throw new Error(`Groq API Error: ${response.statusText}`);
      }

      const jsonResponse = await response.json();
      return jsonResponse.choices[0].message.content;
    } catch (error) {
      console.error("Groq Fetch Error:", error);
      throw error; // Re-throw to be handled by the parent function
    }
  };

  const fetchTutorial = async (subject: string, topic: string, lang: string) => {
    setErrorMsg("");
    setData(null);
    setLoading(true);
    
    // Check Cache First to save API calls
    const cacheKey = `growtix_groq_${subject}_${topic}_${lang}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      try {
        setData(JSON.parse(cachedData));
        setLoading(false);
        return; 
      } catch (e) {
        console.warn("Corrupted cache, refetching...", e);
      }
    }

    try {
      const prompt = `The user is learning '${subject} - ${topic}'.
      
      Create a highly detailed, educational JSON object following this exact structure:
      {
        "content": "A detailed W3Schools-style tutorial in Markdown. Use analogies, detailed code examples with comments, and a cheat sheet table. MUST BE IN ${lang}.",
        "quiz": [
          {
            "question": "A multiple choice question testing the concept (in ${lang})",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswerIndex": 0,
            "explanation": "Detailed explanation of why this answer is correct (in ${lang})"
          },
          {
            "question": "Another multiple choice question testing a different aspect (in ${lang})",
            "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
            "correctAnswerIndex": 1,
            "explanation": "Detailed explanation (in ${lang})"
          }
        ],
        "resources": [
          {
            "title": "Search YouTube for ${topic} in ${subject}",
            "platform": "YouTube",
            "url": "[https://www.youtube.com/results?search_query=$](https://www.youtube.com/results?search_query=$){encodeURIComponent(subject + ' ' + topic + ' tutorial')}",
            "type": "Video"
          },
          {
            "title": "Official Documentation or Course",
            "platform": "Documentation",
            "url": "[https://www.google.com/search?q=$](https://www.google.com/search?q=$){encodeURIComponent(subject + ' ' + topic + ' documentation')}",
            "type": "Documentation"
          }
        ]
      }`;
      
      const rawJsonString = await generateWithGroq(prompt);
      const parsedData: StructuredContent = JSON.parse(rawJsonString);
      
      localStorage.setItem(cacheKey, JSON.stringify(parsedData));
      setData(parsedData);

    } catch (error: any) {
      console.error("Failed to parse or fetch:", error);
      // Display the specific error if it's the missing key error
      if (error.message.includes("Missing API Key")) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg("Our servers are experiencing an issue. Please try clicking the topic again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-8rem)]">
      
      {/* Sidebar Navigation */}
      <div className="lg:w-72 flex-shrink-0 flex flex-col gap-4">
        <div className="clay-card p-5 space-y-5 shadow-sm sticky top-20 flex flex-col max-h-[calc(100vh-6rem)] bg-card border border-border/50 rounded-2xl">
          <div className="space-y-3 flex-shrink-0 border-b border-border/50 pb-4">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider pl-1">
              {t("Learning Path")}
            </label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-muted/30 border border-border text-foreground text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none transition-all cursor-pointer"
              >
                {SUBJECTS.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground rotate-90 pointer-events-none" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-1.5 custom-scrollbar">
            {topics.map((topic) => (
              <button
                key={topic}
                onClick={() => {
                  if (topic !== activeTopic) setActiveTopic(topic);
                }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm flex items-center justify-between transition-all duration-200 border ${
                  activeTopic === topic
                    ? "bg-primary text-primary-foreground border-primary font-semibold shadow-md"
                    : "bg-transparent border-transparent text-foreground hover:bg-muted hover:border-border/50"
                }`}
              >
                {topic}
                {activeTopic === topic && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header & Tabs */}
        <div className="mb-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium mb-2">
              <span>{selectedSubject}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-foreground">{activeTopic}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
              {activeTopic}
            </h1>
          </div>

          <div className="flex gap-2 border-b border-border/50 pb-px overflow-x-auto custom-scrollbar">
            <TabButton active={activeTab === "tutorial"} onClick={() => setActiveTab("tutorial")} icon={FileText} label="Tutorial" />
            <TabButton active={activeTab === "quiz"} onClick={() => setActiveTab("quiz")} icon={HelpCircle} label="Knowledge Check" disabled={!data} />
            <TabButton active={activeTab === "courses"} onClick={() => setActiveTab("courses")} icon={GraduationCap} label="Related Courses" disabled={!data} />
          </div>
        </div>

        {/* Dynamic Content Panel */}
        <motion.div
          key={`${selectedSubject}-${activeTopic}-${activeTab}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 min-h-[500px] shadow-sm relative overflow-hidden"
        >
          {errorMsg ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-destructive/5">
              <AlertCircle className="w-12 h-12 text-destructive mb-4" />
              <h3 className="text-xl font-bold text-destructive mb-2">Oops! Something went wrong</h3>
              <p className="text-muted-foreground max-w-md mb-6">{errorMsg}</p>
              <button 
                onClick={() => fetchTutorial(selectedSubject, activeTopic, learningLanguage)}
                className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Retry Request
              </button>
            </div>
          ) : loading ? (
            <div className="space-y-8 animate-pulse">
              <div className="h-8 bg-muted rounded-lg w-1/3"></div>
              <div className="space-y-4">
                <div className="h-4 bg-muted/60 rounded flex w-full"></div>
                <div className="h-4 bg-muted/60 rounded flex w-full"></div>
                <div className="h-4 bg-muted/60 rounded flex w-5/6"></div>
              </div>
              <div className="h-64 bg-muted/30 border border-muted rounded-xl w-full"></div>
            </div>
          ) : data ? (
            <AnimatePresence mode="wait">
              {activeTab === "tutorial" && (
                <motion.div key="tutorial" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none prose-headings:font-heading prose-headings:font-bold prose-a:text-primary">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code(props) {
                          const {children, className, ...rest} = props;
                          const match = /language-(\w+)/.exec(className || '');
                          return match ? (
                            <div className="rounded-xl overflow-hidden shadow-md my-6 border border-border/50">
                              <SyntaxHighlighter
                                {...rest as any}
                                PreTag="div"
                                children={String(children).replace(/\n$/, '')}
                                language={match[1]}
                                style={vscDarkPlus}
                                customStyle={{ margin: 0, padding: '1.5rem', background: '#1e1e1e', fontSize: '0.9em' }}
                              />
                            </div>
                          ) : (
                            <code {...rest} className="bg-muted text-primary font-mono text-[0.85em] px-1.5 py-0.5 rounded-md">
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {data.content}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              )}

              {activeTab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
                  <h2 className="text-2xl font-bold font-heading mb-6">Test Your Understanding</h2>
                  {data.quiz.map((q, qIndex) => (
                    <div key={qIndex} className="bg-muted/20 border border-border/50 rounded-xl p-6">
                      <p className="font-semibold text-lg mb-4">{qIndex + 1}. {q.question}</p>
                      <div className="space-y-3">
                        {q.options.map((opt, oIndex) => {
                          const isSelected = selectedAnswers[qIndex] === oIndex;
                          const isCorrect = oIndex === q.correctAnswerIndex;
                          const hasAnswered = selectedAnswers[qIndex] !== undefined;
                          
                          let btnClass = "bg-card border-border hover:bg-muted";
                          if (hasAnswered) {
                            if (isCorrect) btnClass = "bg-green-500/10 border-green-500/50 text-green-700 dark:text-green-400";
                            else if (isSelected) btnClass = "bg-destructive/10 border-destructive/50 text-destructive";
                            else btnClass = "bg-card border-border opacity-50";
                          }

                          return (
                            <button
                              key={oIndex}
                              disabled={hasAnswered}
                              onClick={() => setSelectedAnswers(prev => ({ ...prev, [qIndex]: oIndex }))}
                              className={`w-full text-left px-5 py-3 rounded-lg border flex items-center justify-between transition-all ${btnClass}`}
                            >
                              <span>{opt}</span>
                              {hasAnswered && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                              {hasAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-destructive" />}
                            </button>
                          );
                        })}
                      </div>
                      {selectedAnswers[qIndex] !== undefined && (
                        <div className="mt-4 p-4 bg-muted rounded-lg text-sm border border-border/50">
                          <strong>Explanation:</strong> {q.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}

              {activeTab === "courses" && (
                <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <h2 className="text-2xl font-bold font-heading mb-6">Recommended Learning Path</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {data.resources.map((res, idx) => (
                      <a 
                        key={idx} 
                        href={res.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group flex flex-col justify-between bg-card border border-border/50 hover:border-primary/50 rounded-xl p-5 shadow-sm hover:shadow-md transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            {res.type === "Video" ? <PlayCircle className="w-5 h-5 text-red-500" /> : <BookOpen className="w-5 h-5 text-blue-500" />}
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{res.platform}</span>
                          </div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                            {res.title}
                          </h3>
                        </div>
                        <div className="mt-6 flex items-center text-sm font-medium text-primary">
                          View Resource <ExternalLink className="w-4 h-4 ml-1.5" />
                        </div>
                      </a>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon: Icon, label, disabled = false }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
        active 
          ? "border-primary text-primary" 
          : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}