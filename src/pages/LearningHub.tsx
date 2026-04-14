import { useState } from "react";
import { ChevronRight, Languages, Play } from "lucide-react";
import { motion } from "framer-motion";

const topics = [
  { id: "intro", title: "Introduction" },
  { id: "syntax", title: "Syntax" },
  { id: "variables", title: "Variables" },
  { id: "data-types", title: "Data Types" },
  { id: "functions", title: "Functions" },
  { id: "arrays", title: "Arrays" },
  { id: "pointers", title: "Pointers" },
  { id: "classes", title: "Classes & OOP" },
];

const topicContent: Record<string, { title: string; body: string; code: string }> = {
  intro: {
    title: "Introduction to C++",
    body: `C++ is a powerful general-purpose programming language created by Bjarne Stroustrup as an extension of the C programming language. It supports object-oriented, procedural, and generic programming paradigms.\n\nC++ is widely used in systems programming, game development, embedded systems, and high-performance applications. Its combination of high-level and low-level language features makes it uniquely versatile.`,
    code: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, DevElevate!" << endl;\n    return 0;\n}`,
  },
  syntax: {
    title: "C++ Syntax Basics",
    body: `Every C++ program must have a main() function. Statements end with semicolons. Code blocks are enclosed in curly braces {}.\n\nC++ is case-sensitive and supports both single-line (//) and multi-line (/* */) comments.`,
    code: `// Single line comment\n/* Multi-line\n   comment */\n\nint main() {\n    int x = 10;  // variable declaration\n    return 0;\n}`,
  },
  variables: {
    title: "Variables in C++",
    body: `Variables are containers for storing data values. In C++, you must declare a variable's type before using it.\n\nCommon types: int, double, char, string, bool.`,
    code: `int age = 25;\ndouble gpa = 3.95;\nchar grade = 'A';\nstring name = "DevElevate";\nbool isActive = true;`,
  },
};

export default function LearningHub() {
  const [activeTopic, setActiveTopic] = useState("intro");
  const content = topicContent[activeTopic] || topicContent.intro;
  const [language, setLanguage] = useState("English");

  return (
    <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
      {/* Topics sidebar */}
      <div className="lg:w-56 flex-shrink-0">
        <div className="clay-card p-3">
          <h3 className="font-heading font-semibold text-sm px-3 py-2 text-muted-foreground">C++ Course</h3>
          <nav className="space-y-0.5">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTopic(t.id)}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm flex items-center justify-between transition-all ${
                  activeTopic === t.id
                    ? "gradient-primary text-primary-foreground font-medium"
                    : "text-foreground hover:bg-muted/50"
                }`}
              >
                {t.title}
                {activeTopic === t.id && <ChevronRight className="w-4 h-4" />}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <motion.div
        key={activeTopic}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 space-y-6"
      >
        <div className="clay-card p-6 md:p-8">
          <h1 className="text-2xl font-heading font-bold mb-4">{content.title}</h1>
          <div className="prose prose-sm max-w-none">
            {content.body.split("\n\n").map((p, i) => (
              <p key={i} className="text-foreground/80 leading-relaxed mb-3">{p}</p>
            ))}
          </div>

          {/* Code block */}
          <div className="mt-6 rounded-xl overflow-hidden">
            <div className="bg-gray-900 px-4 py-2 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-mono">C++</span>
              <button className="text-xs text-primary hover:underline">Copy</button>
            </div>
            <pre className="bg-gray-950 p-4 overflow-x-auto">
              <code className="text-sm font-mono text-green-400 whitespace-pre">{content.code}</code>
            </pre>
          </div>
        </div>

        {/* Translate & Explain */}
        <div className="clay-card p-5">
          <div className="flex flex-wrap items-center gap-3">
            <Languages className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">Translate & Explain in:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-muted/50 text-sm border-0 focus:ring-2 focus:ring-primary/30"
            >
              <option>English</option>
              <option>Hindi</option>
              <option>Punjabi</option>
              <option>Telugu</option>
            </select>
            <button className="px-4 py-1.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
              Translate
            </button>
          </div>
        </div>

        {/* Video placeholder */}
        <div className="clay-card p-5">
          <h3 className="font-heading font-semibold mb-3 flex items-center gap-2">
            <Play className="w-4 h-4 text-accent" /> Video Tutorial
          </h3>
          <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full gradient-accent flex items-center justify-center mx-auto mb-3">
                <Play className="w-8 h-8 text-primary-foreground ml-1" />
              </div>
              <p className="text-gray-400 text-sm">Click to play tutorial video</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
