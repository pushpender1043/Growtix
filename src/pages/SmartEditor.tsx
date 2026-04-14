import { useState } from "react";
import { Play, Lightbulb, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

const problemStatement = {
  title: "Two Sum",
  difficulty: "Easy",
  description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.`,
  constraints: [
    "2 ≤ nums.length ≤ 10⁴",
    "-10⁹ ≤ nums[i] ≤ 10⁹",
    "-10⁹ ≤ target ≤ 10⁹",
    "Only one valid answer exists.",
  ],
  examples: [
    { input: "nums = [2,7,11,15], target = 9", output: "[0,1]", explanation: "nums[0] + nums[1] = 2 + 7 = 9" },
  ],
};

const defaultCode: Record<string, string> = {
  "C++": `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your code here\n        return {};\n    }\n};`,
  Python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Your code here\n        pass`,
  JavaScript: `var twoSum = function(nums, target) {\n    // Your code here\n};`,
};

export default function SmartEditor() {
  const [language, setLanguage] = useState("C++");
  const [code, setCode] = useState(defaultCode["C++"]);
  const [output, setOutput] = useState("");

  const handleRun = () => {
    setOutput("Running...\n");
    setTimeout(() => {
      setOutput("✅ Test Case 1 Passed: [0, 1]\n⏱ Runtime: 4ms | Memory: 10.2 MB");
    }, 1000);
  };

  const difficultyColor: Record<string, string> = {
    Easy: "bg-green-100 text-green-700",
    Medium: "bg-amber-100 text-amber-700",
    Hard: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[calc(100vh-8rem)]">
        {/* Left: Problem */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="clay-card p-5 overflow-y-auto"
        >
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-xl font-heading font-bold">{problemStatement.title}</h1>
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${difficultyColor[problemStatement.difficulty]}`}>
              {problemStatement.difficulty}
            </span>
          </div>

          <div className="space-y-4 text-sm text-foreground/80 leading-relaxed">
            {problemStatement.description.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}

            <div>
              <h3 className="font-heading font-semibold text-foreground mb-2">Constraints:</h3>
              <ul className="space-y-1">
                {problemStatement.constraints.map((c, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                    <code className="text-xs bg-muted/50 px-1.5 py-0.5 rounded">{c}</code>
                  </li>
                ))}
              </ul>
            </div>

            {problemStatement.examples.map((ex, i) => (
              <div key={i} className="bg-muted/30 rounded-xl p-4">
                <h4 className="font-semibold text-foreground text-xs mb-2">Example {i + 1}:</h4>
                <p className="font-mono text-xs"><strong>Input:</strong> {ex.input}</p>
                <p className="font-mono text-xs"><strong>Output:</strong> {ex.output}</p>
                <p className="font-mono text-xs text-muted-foreground"><strong>Explanation:</strong> {ex.explanation}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Right: Editor */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-4"
        >
          {/* Editor toolbar */}
          <div className="clay-card p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(defaultCode[e.target.value] || "");
                }}
                className="px-3 py-1.5 rounded-xl bg-muted/50 text-sm border-0 focus:ring-2 focus:ring-primary/30"
              >
                <option>C++</option>
                <option>Python</option>
                <option>JavaScript</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-secondary text-secondary text-sm font-medium hover:bg-secondary/10 transition-colors">
                <Lightbulb className="w-4 h-4" /> AI Hint
              </button>
              <button
                onClick={handleRun}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Play className="w-4 h-4" /> Run Code
              </button>
            </div>
          </div>

          {/* Code area */}
          <div className="clay-card flex-1 overflow-hidden flex flex-col">
            <div className="bg-gray-950 flex-1 p-4 overflow-auto rounded-t-2xl">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-green-400 font-mono text-sm resize-none focus:outline-none leading-relaxed"
              />
            </div>

            {/* Console output */}
            <div className="border-t border-border/50">
              <div className="px-4 py-2 bg-gray-900 flex items-center gap-2 rounded-b-2xl">
                <ChevronDown className="w-4 h-4 text-gray-400" />
                <span className="text-xs text-gray-400 font-mono">Console</span>
              </div>
              {output && (
                <div className="bg-gray-950 px-4 py-3 rounded-b-2xl">
                  <pre className="text-xs font-mono text-gray-300 whitespace-pre-wrap">{output}</pre>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
