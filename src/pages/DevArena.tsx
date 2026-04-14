import React, { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { createClient } from "@supabase/supabase-js";
import { Swords, Trophy, Zap, Clock, Shield, Target, Flame, CheckCircle2, XCircle, Play, TerminalSquare } from "lucide-react";

// --- SUPABASE SETUP ---
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder";
const supabase = createClient(supabaseUrl, supabaseKey);

// --- CONSTANTS & DATA ---
const ROUND_TIME = 5 * 60; // 5 minutes
type Level = "easy" | "medium" | "hard";
type Language = "javascript" | "python" | "cpp";

const LANGUAGES = [
  { id: "javascript", label: "JS", monaco: "javascript" },
  { id: "python", label: "Python", monaco: "python" },
  { id: "cpp", label: "C++", monaco: "cpp" },
];

const EASY_QUESTIONS = [
  {
    id: "e1", title: "Two Sum",
    description: "Given an array `nums` and integer `target`, return indices of two numbers that add up to target.\n\nAssume exactly one solution exists.",
    examples: [{ input: "nums=[2,7,11,15], target=9", output: "[0,1]" }, { input: "nums=[3,2,4], target=6", output: "[1,2]" }],
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
    ],
    starter: {
      javascript: `function twoSum(nums, target) {\n  // Your solution here\n  \n}`,
      python: `def twoSum(nums, target):\n    # Your solution here\n    pass`,
      cpp: `class Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Your solution here\n    }\n};`
    },
    call: (i: any) => `twoSum(${JSON.stringify(i.nums)}, ${i.target})`,
    validate: (out: any, exp: any) => JSON.stringify(out) === JSON.stringify(exp),
    aiTime: 12000,
  },
  {
    id: "e2", title: "Valid Parentheses",
    description: "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
    examples: [{ input: 's="()"', output: "true" }, { input: 's="()[]{}"', output: "true" }],
    testCases: [
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false }
    ],
    starter: {
      javascript: `function isValid(s) {\n  \n}`,
      python: `def isValid(s):\n    pass`,
      cpp: `class Solution {\npublic:\n    bool isValid(string s) {\n        \n    }\n};`
    },
    call: (i: any) => `isValid(${JSON.stringify(i.s)})`,
    validate: (out: any, exp: any) => out === exp,
    aiTime: 15000,
  },
  {
    id: "e3", title: "Reverse String",
    description: "Write a function that reverses a string. The input string is given as an array of characters s.",
    examples: [{ input: 's=["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    testCases: [{ input: { s: ["h", "e", "l", "l", "o"] }, expected: ["o", "l", "l", "e", "h"] }],
    starter: {
      javascript: `function reverseString(s) {\n  \n}`,
      python: `def reverseString(s):\n    pass`,
      cpp: `class Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        \n    }\n};`
    },
    call: (i: any) => `(function(){ let arr = ${JSON.stringify(i.s)}; let res = reverseString(arr); return res !== undefined ? res : arr; })()`,
    validate: (out: any, exp: any) => JSON.stringify(out) === JSON.stringify(exp),
    aiTime: 10000,
  }
];

const QUESTIONS = {
  easy: EASY_QUESTIONS,
  // Medium/Hard ko dynamically populate kiya hai taaki crash na ho aur inme bot thoda time zyada le
  medium: EASY_QUESTIONS.map(q => ({ ...q, id: "m" + q.id, aiTime: q.aiTime * 1.5 })),
  hard: EASY_QUESTIONS.map(q => ({ ...q, id: "h" + q.id, aiTime: q.aiTime * 2.5 }))
};

const Confetti = () => {
  const pieces = Array.from({ length: 50 }).map((_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 0.5, dur: 1 + Math.random(),
    color: ["#8b5cf6", "#10b981", "#f59e0b"][i % 3]
  }));
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((p, i) => (
        <div key={i} className="absolute top-[-10%] w-3 h-3 rounded-sm"
          style={{ left: `${p.left}%`, background: p.color, animation: `fall ${p.dur}s linear ${p.delay}s forwards` }} />
      ))}
      <style>{`@keyframes fall { to { transform: translateY(110vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  );
};

const SkipNotif = ({ opponentName }: { opponentName: string }) => (
  <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
    <div className="bg-white border-2 border-rose-400 rounded-2xl p-8 text-center shadow-2xl animate-bounce-in">
      <div className="text-5xl mb-2">🤖💨</div>
      <div className="text-rose-600 font-black text-xl">{opponentName} Solved It First!</div>
      <div className="text-slate-500 text-sm mt-2 font-medium">Moving to next question…</div>
    </div>
  </div>
);

const PointPopup = ({ player, isMe }: { player: string, isMe: boolean }) => (
  <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce-in pointer-events-none">
    <div className={`${isMe ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-6 py-3 rounded-full font-black text-xl shadow-2xl flex items-center gap-2 border-4 border-white/20`}>
      <Zap className="fill-white" size={24} /> +100 Points ({player})!
    </div>
  </div>
);

export default function DevArena() {
  const [screen, setScreen] = useState<"lobby" | "searching" | "battle" | "result">("lobby");
  const [username, setUsername] = useState("Developer");
  const [level, setLevel] = useState<Level>("easy");
  const [opponentName, setOpponentName] = useState("");
  const [isBotMode, setIsBotMode] = useState(false);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [qIdx, setQIdx] = useState(0);
  const [highestUnlocked, setHighestUnlocked] = useState(0);
  const [language, setLanguage] = useState<Language>("javascript");
  const [code, setCode] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [myScore, setMyScore] = useState(0);
  const [oppScore, setOppScore] = useState(0);
  const [myHP, setMyHP] = useState(100);
  const [oppHP, setOppHP] = useState(100);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [showSkip, setShowSkip] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [solvedBy, setSolvedBy] = useState<Record<number, "me" | "opponent">>({});

  const [syncEvent, setSyncEvent] = useState<{ index: number, ts: number } | null>(null);
  const [searchTimer, setSearchTimer] = useState(10);
  const [pointWinner, setPointWinner] = useState<string | null>(null);

  const timerRef = useRef<any>(null);
  const gameChannelRef = useRef<any>(null);
  const matchChannelRef = useRef<any>(null);

  const qIdxRef = useRef(qIdx);
  useEffect(() => {
    qIdxRef.current = qIdx;
  }, [qIdx]);

  const activeQuestions = QUESTIONS[level] || QUESTIONS.easy;
  const currentQ = activeQuestions[qIdx];

  // REALTIME MATCHMAKING LOGIC
  const searchForMatch = async () => {
    setScreen("searching");
    setIsBotMode(false);
    setOpponentName("");
    setSearchTimer(10);

    const { data: waitingMatches } = await supabase
      .from('matches')
      .select('*')
      .eq('level', level)
      .eq('status', 'waiting')
      .limit(1);

    if (waitingMatches && waitingMatches.length > 0) {
      const match = waitingMatches[0];
      await supabase
        .from('matches')
        .update({ player2: username, status: 'playing' })
        .eq('id', match.id);

      setMatchId(match.id);
      setOpponentName(match.player1);
      setupGameChannel(match.id);
      setTimeout(() => setScreen("battle"), 1500);
    } else {
      const { data: newMatch } = await supabase
        .from('matches')
        .insert({ level, player1: username, status: 'waiting' })
        .select()
        .single();

      if (newMatch) {
        setMatchId(newMatch.id);

        matchChannelRef.current = supabase.channel(`match-${newMatch.id}`)
          .on('postgres_changes', {
            event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${newMatch.id}`
          }, (payload) => {
            if (payload.new.status === 'playing') {
              setOpponentName(payload.new.player2);
              supabase.removeChannel(matchChannelRef.current);
              setupGameChannel(newMatch.id);
              setTimeout(() => setScreen("battle"), 1500);
            }
          })
          .subscribe();
      }
    }
  };

  // 10 SECONDS BOT FALLBACK & POLLING TIMER
  useEffect(() => {
    let interval: any;
    if (screen === "searching" && !opponentName && !isBotMode) {
      interval = setInterval(async () => {
        setSearchTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            if (matchChannelRef.current) supabase.removeChannel(matchChannelRef.current);
            setIsBotMode(true);
            setOpponentName("AlgoBot");
            setTimeout(() => setScreen("battle"), 1500);
            return 0;
          }
          return prev - 1;
        });

        // Background polling just in case channel misses the update
        if (matchId) {
          const { data } = await supabase
            .from("matches")
            .select("status, player2")
            .eq("id", matchId)
            .single();

          if (data && data.status === "playing" && data.player2) {
            clearInterval(interval);
            setOpponentName(data.player2);
            setupGameChannel(matchId);
            setTimeout(() => setScreen("battle"), 1500);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [screen, matchId, isBotMode, opponentName]);

  const setupGameChannel = (id: string) => {
    const channel = supabase.channel(`game-${id}`, {
      config: { broadcast: { self: false } }
    });

    channel.on('broadcast', { event: 'question_solved' }, ({ payload }) => {
      setSyncEvent({ index: payload.questionIndex, ts: Date.now() });
    }).subscribe();

    gameChannelRef.current = channel;
  };

  useEffect(() => {
    if (syncEvent) {
      handleOpponentRealSolve(syncEvent.index);
    }
  }, [syncEvent]);

  useEffect(() => {
    if (currentQ?.starter?.[language]) {
      setCode(currentQ.starter[language]);
      setTestResults([]);
    }
  }, [qIdx, language, currentQ]);

  useEffect(() => {
    if (screen === "battle") {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current); setScreen("result"); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  // BOT LOGIC
  useEffect(() => {
    if (screen === "battle" && isBotMode && currentQ) {
      const delay = currentQ.aiTime * (level === "easy" ? 1.5 : level === "medium" ? 1 : 0.6);
      const aiTimer = setTimeout(() => {
        handleOpponentRealSolve(qIdxRef.current);
      }, delay);
      return () => clearTimeout(aiTimer);
    }
  }, [screen, isBotMode, qIdx, level]);

  // Unified solve logic
  const handleOpponentRealSolve = (solvedIndex: number) => {
    setSolvedBy(prev => ({ ...prev, [solvedIndex]: "opponent" }));
    setOppScore(s => s + 100);
    setMyHP(h => Math.max(0, h - 34));
    // Yahan se setPointWinner(opponentName) hata diya gaya hai

    if (solvedIndex >= qIdxRef.current) {
      setShowSkip(true);
      setTimeout(() => {
        setShowSkip(false);
        setPointWinner(null);
        if (solvedIndex < activeQuestions.length - 1) {
          const nextIdx = solvedIndex + 1;
          setHighestUnlocked(prev => Math.max(prev, nextIdx));
          setQIdx(nextIdx);
        } else {
          setScreen("result");
        }
      }, 2000);
    }
  };

  const runCode = async () => {
    if (isExecuting) return;
    setIsExecuting(true);
    setTestResults([]);

    if (language === "javascript") {
      const results = [];
      let allPassed = true;
      for (const tc of currentQ.testCases) {
        try {
          const executionScript = `${code}\nreturn ${currentQ.call(tc.input)};`;
          const runner = new Function(executionScript);
          const output = runner();
          const passed = currentQ.validate(output, tc.expected);
          if (!passed) allPassed = false;
          results.push({ ...tc, actual: output, passed, error: null });
        } catch (err: any) {
          allPassed = false;
          results.push({ ...tc, actual: null, passed: false, error: err.message });
        }
      }
      setTestResults(results);
      if (allPassed) handleWin();
    } else {
      alert("Real execution for Python & C++ requires a backend. Switch to JS!");
    }
    setIsExecuting(false);
  };

  const handleWin = () => {
    const currentIdx = qIdxRef.current;
    setSolvedBy(prev => ({ ...prev, [currentIdx]: "me" }));
    setMyScore(s => s + 100);
    setOppHP(h => Math.max(0, h - 34));
    setShowConfetti(true);
    setPointWinner("You"); // Show Point Toast only for you

    if (!isBotMode && gameChannelRef.current) {
      gameChannelRef.current.send({
        type: 'broadcast',
        event: 'question_solved',
        payload: { questionIndex: currentIdx }
      });
    }

    setTimeout(() => {
      setShowConfetti(false);
      setPointWinner(null);
      if (currentIdx < activeQuestions.length - 1) {
        const nextIdx = currentIdx + 1;
        setHighestUnlocked(prev => Math.max(prev, nextIdx));
        setQIdx(nextIdx);
      } else {
        setScreen("result");
      }
    }, 2000);
  };

  if (screen === "lobby") return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 mb-4 text-3xl">⚔️</div>
          <h1 className="text-3xl font-black text-slate-800">Dev<span className="text-violet-600">Arena</span></h1>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="mb-5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Your Username</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all" />
          </div>
          <div className="mb-8">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Select Difficulty</label>
            <div className="flex gap-2">
              {(["easy", "medium", "hard"] as Level[]).map((lvl) => (
                <button key={lvl} onClick={() => setLevel(lvl)}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all border ${level === lvl ? "bg-violet-50 border-violet-500 text-violet-700 shadow-sm" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                    }`}>{lvl}</button>
              ))}
            </div>
          </div>
          <button onClick={searchForMatch} disabled={!username}
            className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-violet-600/20 transition-all active:scale-95 flex justify-center items-center gap-2">
            Find Match <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );

  if (screen === "searching") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
        <div className="text-center mb-8">
          <div className="text-5xl mb-2">⚔️</div>
          <h1 className="text-2xl font-black text-slate-800">Dev<span className="text-violet-600">Arena</span></h1>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm w-full max-w-sm text-center mb-6">
          <div className="flex justify-between items-center px-4 mb-6">
            <div className="flex flex-col items-center gap-2">
              <div className="w-16 h-16 bg-violet-100 border-2 border-violet-500 rounded-full flex items-center justify-center text-2xl">👤</div>
              <span className="text-sm font-bold text-slate-700">{username}</span>
            </div>
            <span className="text-slate-300 font-black text-xl italic">VS</span>

            {/* UPDATED UI FOR SEARCHING / FOUND OPPONENT WITH TIMER */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${opponentName ? 'bg-rose-100 border-rose-500' : 'bg-slate-100 border-slate-200 animate-pulse'
                }`}>
                {opponentName ? (isBotMode ? '🤖' : '👤') : '?'}
              </div>
              <span className={`text-sm font-bold ${opponentName ? 'text-rose-600' : 'text-slate-500'}`}>
                {opponentName ? opponentName : "Searching..."}
              </span>
            </div>
          </div>

          {!opponentName && (
            <div className="text-slate-400 text-xs mt-4 font-bold bg-slate-50 py-2 rounded-lg border border-slate-100">
              Auto-connecting to Bot in <span className="text-violet-600 text-base">{searchTimer}s</span>...
            </div>
          )}
        </div>
      </div>
    );
  }

  if (screen === "battle") return (
    <div className="h-screen flex flex-col bg-slate-50 font-sans text-slate-800 overflow-hidden relative">
      {showConfetti && <Confetti />}
      {showSkip && <SkipNotif opponentName={opponentName} />}

      {/* 100 POINTS TOAST POPUP */}
      {pointWinner && <PointPopup player={pointWinner} isMe={pointWinner === "You"} />}

      <div className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between z-10 shadow-sm">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs font-bold text-slate-500">👤 {username}</span>
          <div className="flex items-center gap-2">
            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${myHP}%` }} />
            </div>
            <span className="text-xs font-bold text-emerald-600">{myHP}HP</span>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4">
            <div className="text-center"><span className="text-2xl font-black text-slate-800">{myScore}</span><div className="text-[9px] text-slate-400 font-bold uppercase">You</div></div>
            <div className="text-2xl font-black font-mono text-slate-800 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
              {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
            </div>
            <div className="text-center"><span className="text-2xl font-black text-slate-800">{oppScore}</span><div className="text-[9px] text-slate-400 font-bold uppercase">Opponent</div></div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold text-slate-500">{isBotMode ? '🤖' : '⚔️'} {opponentName}</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-rose-500">{oppHP}HP</span>
            <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${oppHP}%` }} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex min-h-0">
        <div className="w-[35%] bg-white border-r border-slate-200 flex flex-col min-h-0">
          <div className="flex w-full overflow-x-auto border-b border-slate-200 bg-white scrollbar-hide">
            {activeQuestions.map((q, i) => {
              const isUnlocked = i <= highestUnlocked;
              const isActive = qIdx === i;
              const status = solvedBy[i];

              return (
                <div
                  key={i}
                  onClick={() => isUnlocked && setQIdx(i)}
                  className={`px-6 py-4 text-sm font-bold flex items-center gap-3 border-b-2 whitespace-nowrap transition-all ${isActive ? "border-violet-600 text-slate-800 bg-slate-50/50"
                      : status === "opponent" ? "border-rose-600 text-rose-500"
                        : "border-transparent text-slate-500"
                    } ${!isUnlocked ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-slate-50"}`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] transition-all ${isActive ? "bg-violet-600 text-white"
                      : status === "me" ? "bg-emerald-100 text-emerald-600"
                        : status === "opponent" ? "bg-rose-700 text-white"
                          : "bg-slate-200 text-slate-500"
                    }`}>
                    {status === "me" && !isActive ? (
                      <CheckCircle2 size={14} strokeWidth={3} />
                    ) : status === "opponent" && !isActive ? (
                      <span className="text-[12px] font-black">X</span>
                    ) : (
                      i + 1
                    )}
                  </span>
                  {q.title.length > 20 ? q.title.slice(0, 20) + "..." : q.title}
                </div>
              );
            })}
          </div>

          <div className="p-6 overflow-y-auto flex-1">
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 rounded-md text-xs font-black uppercase tracking-wider ${level === 'easy' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{level}</span>
              <h2 className="text-xl font-black text-slate-800">{currentQ?.title}</h2>
            </div>
            <p className="text-slate-600 text-[15px] leading-relaxed mb-6 whitespace-pre-wrap">{currentQ?.description}</p>
            <div className="space-y-4">
              {currentQ?.examples.map((ex, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Example {i + 1}</div>
                  <div className="font-mono text-[13px] text-slate-700 space-y-1">
                    <div><span className="text-slate-400 select-none">Input: </span>{ex.input}</div>
                    <div><span className="text-slate-400 select-none">Output: </span>{ex.output}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col bg-[#0f111a]">
          <div className="bg-[#1a1d27] flex justify-between items-center px-4 py-2 border-b border-[#2d313f]">
            <span className="text-slate-400 text-xs font-semibold uppercase flex items-center gap-2"><TerminalSquare size={14} /> Code Workspace</span>
            <select value={language} onChange={e => setLanguage(e.target.value as Language)} className="bg-[#2d313f] text-slate-200 border-none text-xs rounded-md px-3 py-1.5 outline-none font-semibold cursor-pointer">
              {LANGUAGES.map(l => <option key={l.id} value={l.id}>{l.label}</option>)}
            </select>
          </div>
          <div className="flex-[3] min-h-0">
            <Editor height="100%" language={LANGUAGES.find(l => l.id === language)?.monaco || "javascript"} theme="vs-dark" value={code} onChange={v => setCode(v || "")} options={{ minimap: { enabled: false }, fontSize: 14, padding: { top: 16 } }} />
          </div>
          <div className="flex-[2] min-h-0 bg-[#151822] border-t border-[#2d313f] flex flex-col">
            <div className="px-5 py-3 border-b border-[#2d313f] flex justify-between items-center bg-[#151822]">
              <h3 className="text-[#64748b] text-xs font-bold uppercase tracking-widest">Test Cases ({currentQ?.testCases.length})</h3>
              <button onClick={runCode} disabled={isExecuting} className="bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white px-5 py-1.5 rounded-md text-sm font-bold flex items-center gap-2 transition-all">
                <Play size={14} className={isExecuting ? "animate-pulse" : ""} /> {isExecuting ? "Running..." : "Run & Submit"}
              </button>
            </div>
            <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-[#151822]">
              {testResults.length === 0 ? (
                currentQ?.testCases.map((tc, i) => (
                  <div key={i} className="font-mono text-[13px] border-b border-[#2d313f] pb-3 last:border-0 mb-3 last:mb-0 flex items-center gap-3">
                    <span className="text-[#64748b] font-bold">#{i + 1}</span>
                    <span className="text-slate-300">{JSON.stringify(tc.input).replace(/[{}]/g, '')}</span>
                    <span className="text-[#64748b] font-bold">→</span>
                    <span className="text-emerald-400 font-bold">{JSON.stringify(tc.expected)}</span>
                  </div>
                ))
              ) : (
                testResults.map((res, i) => (
                  <div key={i} className="font-mono text-[13px] border-b border-[#2d313f] pb-3 last:border-0 mb-3 last:mb-0">
                    <div className="flex items-center gap-3">
                      <span className="text-[#64748b] font-bold">#{i + 1}</span>
                      <span className="text-slate-300">{JSON.stringify(res.input).replace(/[{}]/g, '')}</span>
                      <span className="text-[#64748b] font-bold">→</span>
                      {res.error ? <span className="text-rose-500 font-bold">Error</span> : <span className={`font-bold ${res.passed ? "text-emerald-400" : "text-rose-400"}`}>{JSON.stringify(res.actual)}</span>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (screen === "result") {
    const iWon = myScore > oppScore;
    const tie = myScore === oppScore;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        {iWon && <Confetti />}
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl max-w-sm w-full text-center">
          <div className="text-6xl mb-4">{tie ? "🤝" : iWon ? "🏆" : "💀"}</div>
          <h1 className="text-3xl font-black text-slate-800 mb-2">{tie ? "It's a Tie!" : iWon ? "Victory!" : "Defeat"}</h1>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
            <div className="flex justify-between items-center px-4">
              <div className="text-center"><div className="text-4xl font-black text-emerald-500">{myScore}</div><div className="text-xs font-bold text-slate-500 mt-1">YOU</div></div>
              <div className="text-slate-300 font-black text-xl">—</div>
              <div className="text-center"><div className="text-4xl font-black text-rose-500">{oppScore}</div><div className="text-xs font-bold text-slate-500 mt-1">OPPONENT</div></div>
            </div>
          </div>
          <button onClick={() => {
            setScreen("lobby"); setQIdx(0); setMyScore(0); setOppScore(0); setMyHP(100); setOppHP(100); setHighestUnlocked(0); setSolvedBy({});
            if (gameChannelRef.current) supabase.removeChannel(gameChannelRef.current);
            if (matchChannelRef.current) supabase.removeChannel(matchChannelRef.current);
          }} className="w-full py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all">Play Again</button>
        </div>
      </div>
    );
  }

  return null;
}