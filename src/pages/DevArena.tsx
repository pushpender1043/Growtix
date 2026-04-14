import { useState } from "react";
import { Swords, Crown, Medal, Trophy, Zap } from "lucide-react";
import { motion } from "framer-motion";

const leaderboard = [
  { rank: 1, name: "AlgoKing_99", xp: 45200, badge: "Grandmaster", avatar: "🏆" },
  { rank: 2, name: "CodeNinja_X", xp: 42100, badge: "Master", avatar: "⚔️" },
  { rank: 3, name: "ByteQueen", xp: 39800, badge: "Master", avatar: "👑" },
  { rank: 4, name: "StackOverflow_Fan", xp: 37500, badge: "Diamond", avatar: "💎" },
  { rank: 5, name: "DevElevateUser", xp: 12450, badge: "Gold II", avatar: "🥇" },
];

const rankColors: Record<string, string> = {
  Grandmaster: "from-amber-400 to-amber-600",
  Master: "from-purple-400 to-purple-600",
  Diamond: "from-cyan-400 to-blue-500",
  "Gold II": "from-yellow-400 to-orange-500",
};

export default function DevArena() {
  const [searching, setSearching] = useState(false);

  const handleFindMatch = () => {
    setSearching(true);
    setTimeout(() => setSearching(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card-strong p-8 text-center"
      >
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-4xl mx-auto animate-glow-pulse">
            🥇
          </div>
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-xs font-bold text-foreground">
            Gold II
          </div>
        </div>
        <h1 className="text-2xl font-heading font-bold mt-4">Dev Arena</h1>
        <p className="text-muted-foreground text-sm mt-1 mb-6">Challenge developers. Climb the ranks. Prove your skills.</p>

        <motion.button
          onClick={handleFindMatch}
          disabled={searching}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-8 py-3 rounded-2xl gradient-primary text-primary-foreground font-heading font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-70 inline-flex items-center gap-2"
        >
          {searching ? (
            <>
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Finding Match...
            </>
          ) : (
            <>
              <Swords className="w-5 h-5" /> Find 1v1 Match
            </>
          )}
        </motion.button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Matches Won", value: "47", icon: Trophy },
          { label: "Win Rate", value: "68%", icon: Zap },
          { label: "Current Streak", value: "5", icon: Medal },
          { label: "Arena Points", value: "2,340", icon: Crown },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="clay-card p-4 text-center"
          >
            <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xl font-heading font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="clay-card overflow-hidden">
        <div className="p-4 border-b border-border/50 flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <h2 className="font-heading font-semibold text-lg">Global Leaderboard</h2>
        </div>
        <div className="divide-y divide-border/50">
          {leaderboard.map((player, i) => (
            <motion.div
              key={player.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`flex items-center justify-between p-4 hover:bg-muted/30 transition-colors ${
                player.name === "DevElevateUser" ? "bg-primary/5" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                  i < 3 ? `bg-gradient-to-br ${rankColors[player.badge] || "from-gray-400 to-gray-500"} text-primary-foreground` : "bg-muted text-muted-foreground"
                }`}>
                  {player.rank}
                </span>
                <span className="text-xl">{player.avatar}</span>
                <div>
                  <p className="text-sm font-medium">{player.name}</p>
                  <p className="text-xs text-muted-foreground">{player.badge}</p>
                </div>
              </div>
              <span className="text-sm font-heading font-semibold">{player.xp.toLocaleString()} XP</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
