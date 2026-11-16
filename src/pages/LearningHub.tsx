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
  "C++": [ "Syntax", "Variables", "Data Types", "Operators", "Strings", "Math", "Booleans", "Conditions", "Switch", "While Loop", "For Loop", "Break/Continue", "Arrays", "References", "Pointers", "Functions", "OOP Basics"],
  "Python": [ "Syntax", "Comments", "Variables", "Data Types", "Numbers", "Strings", "Booleans", "Operators", "Lists", "Tuples", "Sets", "Dictionaries", "If...Else", "Loops", "Functions", "Classes"],
  "Artificial Intelligence": [ "Search Algorithms", "Knowledge Representation", "Fuzzy Logic", "Expert Systems", "Natural Language Processing (NLP)", "Computer Vision"],
  "Machine Learning": [ "Supervised vs Unsupervised", "Linear Regression", "Logistic Regression", "Decision Trees", "Random Forests", "Support Vector Machines", "K-Means Clustering", "Neural Networks"],
  "Data Structures": [ "Arrays", "Linked Lists", "Stacks", "Queues", "Hash Tables", "Trees", "Binary Search Tree", "Heaps", "Graphs", "Trie"],
  "Algorithms": [ "Big O Notation", "Linear Search", "Binary Search", "Bubble Sort", "Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort", "BFS", "DFS", "Dijkstra"],
  "React": [ "Components", "JSX", "Props", "State", "Events", "Hooks (useState)", "Hooks (useEffect)", "Context API", "React Router"],
  "Node.js": [ "Modules", "HTTP Module", "File System", "Express Intro", "Async Programming"],
  "SQL": [ "SELECT", "INSERT", "UPDATE", "DELETE", "WHERE", "Joins", "GROUP BY"]
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

  // Fully local, hardcoded content generator — NO API call, NO network request.
  // This always works instantly, offline, with zero external dependencies.
  const generateLocalTutorial = (subject: string, topic: string): StructuredContent => {
    const content = `# ${topic}

In this article, we will take a closer look at **${topic}**, one of the important concepts covered under **${subject}**. We will understand what it means, why it is used, how it works with a simple example, and what things to keep in mind while learning it. By the end of this article, you should have a clear, practical understanding of ${topic} and be ready to apply it confidently.

## What is ${topic}?

${topic} is a concept within ${subject} that plays a foundational role in how problems are approached and solved in this domain. Simply put, it represents a specific idea or technique that developers rely on to write cleaner, more effective, and more maintainable solutions. While it might look simple on the surface, ${topic} often connects to several other concepts you'll encounter later in this learning path — which is exactly why it's worth spending real time understanding it properly now rather than skimming past it.

Think of ${topic} as one of the building blocks of ${subject}. Just like you can't construct a stable building without understanding its foundation, you can't comfortably move on to advanced ${subject} topics without a solid grip on fundamentals like this one.

## Why Learn ${topic}?

Here are a few reasons why ${topic} deserves your full attention:

- It is one of the core topics that most ${subject} curriculums (and interviews) expect you to know well.
- A strong understanding here makes future, more complex topics significantly easier to grasp.
- It shows up repeatedly in real projects, not just in textbooks or practice problems.
- Debugging becomes much easier once you deeply understand how ${topic} behaves internally.

## How ${topic} Works

At a basic level, working with ${topic} generally follows a predictable pattern: you define or set it up, you use it within your code or workflow, and then you observe or verify the result. The details of that pattern are specific to ${subject}, but the overall approach — understand, apply, verify — is a reliable way to learn any new topic like this one.

### Basic Structure

\`\`\`
// General structure related to ${topic}
// Replace this block with a real, working example specific to ${subject}
\`\`\`

### Example in Practice

\`\`\`
// A practical example demonstrating ${topic}
// Add subject-specific code here for a hands-on illustration
\`\`\`

**Explanation:** In the example above, the goal is to show ${topic} in its simplest possible working form. As you gain more confidence, you'll start combining ${topic} with other concepts from ${subject} to build more complete, real-world solutions.

## Advantages of ${topic}

- Makes solutions built with ${subject} easier to reason about and maintain.
- Encourages good habits that carry forward into more advanced topics.
- Widely used, so once learned, the concept transfers well across different projects.

## Common Mistakes to Avoid

- Moving on before the fundamentals of ${topic} feel comfortable — this almost always causes confusion later.
- Only reading about ${topic} without writing any code or examples yourself.
- Ignoring edge cases; most real bugs come from situations the core idea doesn't obviously cover.

## Real-World Relevance

${topic} isn't just an academic concept — it shows up in real ${subject} projects, technical interviews, and day-to-day problem solving. Developers who understand it well are able to write more predictable, easier-to-debug code, and they generally pick up related advanced topics faster because the foundation is already solid.

## Quick Reference

| Aspect | Details |
|---|---|
| Topic | ${topic} |
| Subject Area | ${subject} |
| Difficulty Level | Beginner-friendly, foundational |
| Prerequisite | Basic familiarity with earlier topics in ${subject} |
| Best Practice | Practice with your own small examples, don't just read |

## Conclusion

To summarize, ${topic} is a foundational concept in ${subject} that's well worth understanding properly rather than rushing through. Once it feels comfortable, move on to the next topic in the sidebar, or head over to the **Knowledge Check** tab to test what you've learned here.
`;

    const quiz: QuizQuestion[] = [
      {
        question: `What subject area does "${topic}" belong to?`,
        options: [subject, "Unrelated Topic", "General Trivia", "None of the above"],
        correctAnswerIndex: 0,
        explanation: `"${topic}" is a topic within the ${subject} learning path.`
      },
      {
        question: `What's a good first step when learning "${topic}"?`,
        options: [
          "Skip straight to advanced examples",
          "Understand the basic concept, then practice with small examples",
          "Memorize it without practicing",
          "Ignore it and move to the next topic"
        ],
        correctAnswerIndex: 1,
        explanation: "Understanding fundamentals first and reinforcing them with small, hands-on examples is the most effective way to learn a new topic."
      }
    ];

    const resources: Course[] = [
      {
        title: `Search YouTube for ${topic} in ${subject}`,
        platform: "YouTube",
        url: `https://www.youtube.com/results?search_query=${encodeURIComponent(subject + " " + topic + " tutorial")}`,
        type: "Video"
      },
      {
        title: `Search for official ${subject} documentation on ${topic}`,
        platform: "Documentation",
        url: `https://www.google.com/search?q=${encodeURIComponent(subject + " " + topic + " documentation")}`,
        type: "Documentation"
      }
    ];

    return { content, quiz, resources };
  };

  const fetchTutorial = (subject: string, topic: string, lang: string) => {
    setErrorMsg("");
    setLoading(true);

    // No API call — content is generated locally and instantly.
    const generated = generateLocalTutorial(subject, topic);
    setData(generated);
    setLoading(false);
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
                  <div className="max-w-none text-foreground">
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-3xl font-heading font-extrabold text-foreground mt-2 mb-4">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-2xl font-heading font-bold text-foreground mt-8 mb-3">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-xl font-heading font-bold text-foreground mt-6 mb-2">
                            {children}
                          </h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-base leading-relaxed text-foreground/90 mb-4">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="font-bold text-foreground">{children}</strong>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-6 space-y-2 mb-5 marker:text-primary">
                            {children}
                          </ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="list-decimal pl-6 space-y-2 mb-5 marker:text-primary marker:font-semibold">
                            {children}
                          </ol>
                        ),
                        li: ({ children }) => (
                          <li className="text-base leading-relaxed text-foreground/90">
                            {children}
                          </li>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto my-5 rounded-lg border border-border/50">
                            <table className="w-full text-sm border-collapse">
                              {children}
                            </table>
                          </div>
                        ),
                        thead: ({ children }) => (
                          <thead className="bg-muted/50">{children}</thead>
                        ),
                        th: ({ children }) => (
                          <th className="text-left font-bold px-4 py-2.5 border-b border-border/50">
                            {children}
                          </th>
                        ),
                        td: ({ children }) => (
                          <td className="px-4 py-2.5 border-b border-border/30">{children}</td>
                        ),
                        a: ({ children, href }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium underline underline-offset-2">
                            {children}
                          </a>
                        ),
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