import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  History,
  Trash2,
  Code2,
  Terminal,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  Clock,
  X,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import axios from "axios";

// ─── Language Config ────────────────────────────────────────────────────────

const LANGUAGE_VERSIONS: Record<string, string> = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python:     "3.10.0",
  java:       "15.0.2",
  c:          "10.2.0",
  cpp:        "10.2.0",
  rust:       "1.68.2",
  go:         "1.16.2",
  php:        "8.2.3",
  ruby:       "3.0.1",
};

const LANGUAGE_LABELS: Record<string, string> = {
  javascript: "JavaScript (Node)",
  typescript: "TypeScript",
  python:     "Python 3",
  java:       "Java",
  c:          "C",
  cpp:        "C++",
  rust:       "Rust",
  go:         "Go",
  php:        "PHP",
  ruby:       "Ruby",
};

const LANGUAGE_TEMPLATES: Record<string, string> = {
  javascript: `// Welcome to Growtix Smart Editor 🚀\nfunction greet(name) {\n  return \`Hello, \${name}! Happy coding from Growtix 🎓\`;\n}\nconsole.log(greet("Developer"));\nconsole.log("XP Earned: +50 🔥");`,
  typescript: `// TypeScript – Type Safe 🛡️\nfunction greet(name: string): string {\n  return \`Hello, \${name}! Happy coding from Growtix 🎓\`;\n}\nconsole.log(greet("Developer"));`,
  python: `# Welcome to Growtix Smart Editor 🚀\ndef greet(name: str) -> str:\n    return f"Hello, {name}! Happy coding from Growtix 🎓"\n\nprint(greet("Developer"))\nprint("XP Earned: +50 🔥")`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Growtix! 🎓");\n        System.out.println("Java Power Activated! ☕");\n    }\n}`,
  c: `#include <stdio.h>\nint main() {\n    printf("Hello from Growtix!\\n");\n    printf("C Programming Unlocked!\\n");\n    return 0;\n}`,
  cpp: `#include <iostream>\nusing namespace std;\nint main() {\n    cout << "Hello from Growtix! 🎓" << endl;\n    cout << "C++ Power Unlocked! 💪" << endl;\n    return 0;\n}`,
  rust: `fn main() {\n    println!("Hello from Growtix! 🎓");\n    println!("Rust Safety Engaged! 🦀");\n}`,
  go: `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello from Growtix! 🎓")\n    fmt.Println("Go Speed Unlocked! 🏃")\n}`,
  php: `<?php\necho "Hello from Growtix! 🎓\\n";\necho "PHP Power! 🐘\\n";\n?>`,
  ruby: `puts "Hello from Growtix! 🎓"\nputs "Ruby Magic! 💎"`,
};

const MONACO_LANG: Record<string, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python:     "python",
  java:       "java",
  c:          "cpp",
  cpp:        "cpp",
  rust:       "rust",
  go:         "go",
  php:        "php",
  ruby:       "ruby",
};

type Lang = keyof typeof LANGUAGE_VERSIONS;

interface HistoryItem {
  id: string;
  language: string;
  code: string;
  timestamp: string;
  status: "success" | "error";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const HistoryPanel = React.memo(function HistoryPanel({
  history,
  onLoad,
  onClear,
}: {
  history: HistoryItem[];
  onLoad: (item: HistoryItem) => void;
  onClear: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="w-full md:w-72 flex flex-col gap-3 shrink-0"
    >
      <div className="glass-card-strong px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-primary" />
          <span className="font-heading font-semibold text-sm">Run History</span>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClear}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Clear History"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="clay-card flex-1 p-2 overflow-y-auto scrollbar-none max-h-[calc(100vh-14rem)] space-y-1.5">
        <AnimatePresence>
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground/40 gap-2">
              <Code2 className="w-7 h-7" />
              <p className="text-xs">No runs yet</p>
            </div>
          ) : (
            history.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onLoad(item)}
                className="p-3 rounded-xl border border-border/40 hover:bg-muted/40 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {item.language}
                  </span>
                  {item.status === "success" ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate font-mono leading-relaxed">
                  {item.code.split("\n").find((l) => l.trim() && !l.trim().startsWith("//") && !l.trim().startsWith("#")) ||
                    item.code.split("\n")[0]}
                </p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Clock className="w-3 h-3 text-muted-foreground/40" />
                  <span className="text-[10px] text-muted-foreground/40">{item.timestamp}</span>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SmartEditor() {
  const [language, setLanguage] = useState<Lang>("javascript");
  const [output, setOutput]     = useState<string>("");
  const [isCompiling, setIsCompiling] = useState(false);
  const [isError, setIsError]   = useState(false);
  const [execTime, setExecTime] = useState<string | null>(null);
  const [history, setHistory]   = useState<HistoryItem[]>([]);
  const [langOpen, setLangOpen] = useState(false);

  const editorRef = useRef<any>(null);
  const startRef  = useRef<number>(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("growtix_editor_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch (_) {}
  }, []);

  const persistHistory = useCallback((items: HistoryItem[]) => {
    setHistory(items);
    try { localStorage.setItem("growtix_editor_history", JSON.stringify(items)); } catch (_) {}
  }, []);

  const saveToHistory = useCallback(
    (codeToSave: string, lang: string, status: "success" | "error") => {
      const item: HistoryItem = {
        id:        Date.now().toString(),
        language:  lang,
        code:      codeToSave,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        status,
      };
      persistHistory([item, ...history].slice(0, 20));
    },
    [history, persistHistory]
  );

  const handleEditorMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLangChange = (lang: Lang) => {
    setLanguage(lang);
    setLangOpen(false);
    const newTemplate = LANGUAGE_TEMPLATES[lang] ?? "";
    
    // Inject the template directly into the robust uncontrolled editor instance
    if (editorRef.current) {
      editorRef.current.setValue(newTemplate);
    }
  };

  const loadFromHistory = useCallback((item: HistoryItem) => {
    setLanguage(item.language as Lang);
    
    if (editorRef.current) {
      editorRef.current.setValue(item.code);
    }
    
    setOutput("Loaded from history — click Run to execute again.");
    setIsError(false);
    setExecTime(null);
  }, []);

  const clearHistory = useCallback(() => persistHistory([]), [persistHistory]);

  const handleCompile = async () => {
    // Read the pure value directly from editor, no React state middlemen locking inputs
    const currentCode = editorRef.current?.getValue() || "";
    if (!currentCode.trim()) return;

    setIsCompiling(true);
    setOutput("Compiling and executing…");
    setIsError(false);
    setExecTime(null);
    startRef.current = Date.now();

    try {
      const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
        language: language,
        version:  LANGUAGE_VERSIONS[language] ?? "latest",
        files:    [{ content: currentCode }],
      });

      const elapsed = ((Date.now() - startRef.current) / 1000).toFixed(2);
      setExecTime(`${elapsed}s`);

      const result = response.data.run as { stderr?: string; output?: string; code?: number };
      const hasError = !!(result.stderr || (result.code !== undefined && result.code !== 0));

      if (hasError) {
        setOutput(result.stderr || result.output || "Execution Error");
        setIsError(true);
        saveToHistory(currentCode, language, "error");
      } else {
        setOutput(result.output || "Program finished with no output.");
        setIsError(false);
        saveToHistory(currentCode, language, "success");
      }
    } catch {
      setOutput("❌ Could not reach the compilation server. Check your internet connection.");
      setIsError(true);
      setExecTime(null);
    } finally {
      setIsCompiling(false);
    }
  };

  useEffect(() => {
    if (!langOpen) return;
    const handler = () => setLangOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [langOpen]);

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-5rem)] flex flex-col md:flex-row gap-4 p-1">
      <HistoryPanel history={history} onLoad={loadFromHistory} onClear={clearHistory} />

      <div className="flex-1 flex flex-col gap-4 min-w-0 min-h-0">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="clay-card flex-1 flex flex-col overflow-hidden min-h-0"
        >
          <div className="px-4 py-3 border-b border-border/40 flex items-center justify-between gap-3 bg-muted/5 shrink-0">
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setLangOpen((v) => !v)}
                className="flex items-center gap-2 bg-background border border-border rounded-xl px-3 py-2 text-sm font-medium hover:border-primary/50 transition-colors"
              >
                <Code2 className="w-4 h-4 text-primary" />
                {LANGUAGE_LABELS[language]}
                <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {langOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 z-50 clay-card p-1 shadow-xl"
                  >
                    {(Object.entries(LANGUAGE_LABELS) as [Lang, string][]).map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => handleLangChange(key as Lang)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          language === key
                            ? "gradient-primary text-primary-foreground font-medium"
                            : "hover:bg-muted/60 text-foreground"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handleCompile}
              disabled={isCompiling}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm transition-all shadow-md
                ${isCompiling
                  ? "bg-muted text-muted-foreground cursor-not-allowed"
                  : "gradient-primary text-primary-foreground hover:opacity-90 hover:scale-[1.02] active:scale-100"
                }`}
            >
              {isCompiling ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Running…
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  Run Code
                </>
              )}
            </button>
          </div>

          <div className="flex-1 min-h-0 relative flex flex-col w-full h-full" style={{ pointerEvents: "auto", userSelect: "auto" }}>
            <Editor
              height="100%"
              language={MONACO_LANG[language] ?? language}
              theme="vs-dark"
              defaultValue={LANGUAGE_TEMPLATES["javascript"]}
              onMount={handleEditorMount}
              options={{
                readOnly: false,
                domReadOnly: false,
                automaticLayout: true, // CRITICAL FIX: Forces editor to recalculate size preventing unclickable areas
                minimap:        { enabled: false },
                fontSize:       14,
                fontFamily:     "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                fontLigatures:  true,
                padding:        { top: 16, bottom: 16 },
                smoothScrolling: true,
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                glyphMargin:    false,
                folding:        true,
                renderLineHighlight: "gutter",
                bracketPairColorization: { enabled: true },
                cursorBlinking: "phase",
                cursorSmoothCaretAnimation: "on",
              }}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass-card-strong shrink-0 h-44 flex flex-col overflow-hidden"
        >
          <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border/30 bg-black/30 shrink-0">
            <div className="flex gap-1.5 mr-1">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
            </div>
            <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
              Output
            </span>

            {execTime && !isCompiling && (
              <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${
                isError
                  ? "bg-red-500/15 text-red-400"
                  : "bg-green-500/15 text-green-400"
              }`}>
                {isError ? "Error" : "Success"} · {execTime}
              </span>
            )}
            {isCompiling && (
              <span className="ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary animate-pulse">
                Running…
              </span>
            )}
            {output && !isCompiling && (
              <button
                onClick={() => { setOutput(""); setExecTime(null); setIsError(false); }}
                className={`${execTime ? "ml-2" : "ml-auto"} p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors`}
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-black/50 font-mono text-sm scrollbar-none">
            {output ? (
              <pre className={`whitespace-pre-wrap leading-relaxed ${isError ? "text-red-400" : "text-green-400"}`}>
                {output}
              </pre>
            ) : (
              <span className="text-muted-foreground/30 text-xs">
                // Run your code to see output here…
              </span>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}