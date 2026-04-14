import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Send, Play } from "lucide-react";

export default function MockInterviewPage() {
  const [code, setCode] = useState("// Write your solution here...\n\nfunction solution() {\n  \n}");

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      
      {/* LEFT PANEL: The AI Interviewer */}
      <div className="w-1/3 border-r border-border flex flex-col bg-card">
        <div className="p-4 border-b border-border bg-muted/30">
          <h2 className="font-heading font-bold text-lg">System Design & Algorithms</h2>
          <p className="text-xs text-muted-foreground">Difficulty: Medium | Time: 30:00</p>
        </div>

        {/* Chat History Area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          <div className="bg-primary/10 border border-primary/20 p-3 rounded-lg rounded-tl-none max-w-[85%]">
            <p className="text-sm text-foreground">
              <strong>Interviewer:</strong> Hello! Today we're going to write a function that finds the longest palindromic substring in a given string. Let me know when you're ready to start.
            </p>
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t border-border">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask a clarifying question..." 
              className="w-full bg-background border border-input rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: The Code Editor */}
      <div className="w-2/3 flex flex-col bg-[#1e1e1e]">
        {/* Editor Toolbar */}
        <div className="h-14 bg-[#252526] border-b border-[#333] flex items-center justify-between px-4">
          <div className="flex gap-2">
             <span className="text-xs font-mono text-gray-400 bg-[#1e1e1e] px-3 py-1 rounded">solution.js</span>
          </div>
          <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
            <Play className="w-4 h-4" />
            Submit Solution
          </button>
        </div>

        {/* Monaco Editor instance */}
        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: "on",
              padding: { top: 16 }
            }}
          />
        </div>
      </div>

    </div>
  );
}