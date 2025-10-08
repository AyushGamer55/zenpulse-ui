import { useContext, useState, useEffect } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useEntries } from "../../hooks/useEntries";
import { Button } from "../UI/button";

const pepTalks = [
  "🌟 Every expert was once a beginner. Your journey matters.",
  "💪 Small consistent actions create remarkable results.",
  "🧠 Your mind is your greatest ally - treat it with kindness.",
  "🎯 Progress over perfection. You're exactly where you need to be.",
  "🌱 Growth happens in the uncomfortable spaces between comfort zones.",
  "✨ You are the author of your story. Choose the plot wisely.",
  "🔮 The best time to start was yesterday. The next best time is now.",
  "💝 Self-compassion is not selfish. It's necessary for sustainable growth."
];

export default function PepTalkCard() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const { entries, fetchWeeklySummary } = useEntries();
  const [aiPepTalk, setAiPepTalk] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadAIPepTalk = async () => {
      setLoading(true);
      try {
        // Check if we have entries to generate personalized pep talk
        if (entries && entries.length > 0) {
          // Try to get AI-generated pep talk from recent entry
          const recentEntry = entries[0]; // Most recent entry
          if (recentEntry.ai_pep_talk) {
            setAiPepTalk(recentEntry.ai_pep_talk);
            return;
          }
        }

        // Fallback to random pep talk
        const randomTalk = pepTalks[Math.floor(Math.random() * pepTalks.length)];
        setAiPepTalk(randomTalk);
      } catch (error) {
        console.error("❌ Failed to load pep talk:", error);
        setAiPepTalk(pepTalks[0]); // fallback
      } finally {
        setLoading(false);
      }
    };

    loadAIPepTalk();
  }, [entries]);

  const refreshPepTalk = () => {
    const randomTalk = pepTalks[Math.floor(Math.random() * pepTalks.length)];
    setAiPepTalk(randomTalk);
  };

  return (
    <div className={`
      relative overflow-hidden rounded-2xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl
      ${isDark
        ? "bg-gradient-to-br from-yellow-900/20 via-orange-900/20 to-red-900/20 border border-yellow-500/20"
        : "bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border border-yellow-200/50"
      }
      shadow-lg backdrop-blur-sm
    `}>

      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-4 right-4 w-16 h-16 bg-yellow-500 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-orange-500 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="relative z-10">
        <div className="flex items-center space-x-3 mb-4">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
            <span className="text-2xl">✨</span>
          </div>
          <div>
            <h2 className={`text-lg font-bold ${isDark ? "text-yellow-300" : "text-yellow-800"}`}>
              AI Pep Talk
            </h2>
            <p className="text-xs text-muted-foreground">Personalized encouragement</p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground">Crafting your message...</span>
            </div>
          ) : (
            <p className={`text-sm leading-relaxed ${isDark ? "text-yellow-200" : "text-yellow-900"}`}>
              {aiPepTalk}
            </p>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-yellow-200/30">
            <span className="text-xs text-muted-foreground">Updated daily</span>
            <Button
              onClick={refreshPepTalk}
              size="sm"
              variant="ghost"
              className="text-xs text-yellow-600 hover:text-yellow-700 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              🔄 Refresh
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}