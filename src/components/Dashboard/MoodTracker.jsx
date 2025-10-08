import { useState, useEffect, useContext, useRef, useMemo } from "react";
import { DataContext } from "../../context/DataContext";
import { ThemeContext } from "../../context/ThemeContext";

export default function MoodTracker() {
  const { todayEntry, currentMood, addOrUpdateEntry, fetchStats, allMessages } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [mood, setMood] = useState(currentMood || 3);
  const [autoUpdated, setAutoUpdated] = useState(false);
  const [forceRender, setForceRender] = useState(0);
  const prevMood = useRef(currentMood);

  // 🎯 DYNAMIC MOOD: Calculate mood from latest chat sentiment
  const displayMood = useMemo(() => {
    // Get the most recent AI message with sentiment
    const recentMessages = allMessages
      .filter(msg => msg.sender === 'ai' && msg.sentiment)
      .sort((a, b) => 
        new Date(b.timestamp || b.sessionTimestamp) - new Date(a.timestamp || a.sessionTimestamp)
      );

    if (recentMessages.length > 0) {
      const latestSentiment = recentMessages[0].sentiment;
      console.log(`🎭 Latest sentiment: ${latestSentiment}`);

      // Map sentiment to mood level (same logic as ChatWidget)
      switch (latestSentiment) {
        case "positive":
          return Math.random() < 0.7 ? 4 : 5; // 70% chance mood 4, 30% chance mood 5
        case "negative":
          return Math.random() < 0.7 ? 1 : 2; // 70% chance mood 1, 30% chance mood 2
        case "neutral":
        default:
          return 3;
      }
    }

    // Fallback to database mood if no recent chat sentiment
    return currentMood || 3;
  }, [allMessages, currentMood]);

  // Sync with shared data
  useEffect(() => {
    if (currentMood !== prevMood.current) {
      console.log(`📊 MoodTracker: Mood updated from ${prevMood.current} to ${currentMood}`);
      setMood(currentMood);
      prevMood.current = currentMood;
    }

    if (todayEntry) {
      const newAutoUpdated = todayEntry.mood_auto_updated === true;
      if (autoUpdated !== newAutoUpdated) {
        setAutoUpdated(newAutoUpdated);
        console.log(`🤖 MoodTracker: Auto-updated status changed to ${newAutoUpdated}`);
      }
    }
  }, [currentMood, todayEntry, autoUpdated]);

  // backend burnout check
  useEffect(() => {
    const checkBurnout = async () => {
      const stats = await fetchStats();
      if (stats?.burnoutRisk?.risk) {
        alert(
          `⚠️ Burnout risk! Low mood streak: ${stats.burnoutRisk.streakDays.join(
            ", "
          )}`
        );
      }
    };
    checkBurnout();
  }, [fetchStats]);

  const handleSave = () => {
    console.log(`💾 Manual save: mood=${mood}, clearing auto-update flag`);
    addOrUpdateEntry({ mood, moodAutoUpdated: false });
    setAutoUpdated(false);
  };

  // 🎯 DYNAMIC EMOJIS: Based on latest sentiment
  const moodEmojis = useMemo(() => {
    const sentiment = displayMood >= 4 ? "positive" : displayMood <= 2 ? "negative" : "neutral";
    if (autoUpdated) {
      return ["🤖", "😕", "😐", "🙂", "🤖"]; // Show robot for auto-updated
    }
    return ["😞", "😕", "😐", "🙂", "😄"];
  }, [displayMood, autoUpdated]);

  // 🎯 DYNAMIC LABELS: Based on latest sentiment
  const moodLabels = useMemo(() => {
    if (autoUpdated) {
      return [
        "AI Detected Low",
        "AI Detected Low",
        "AI Detected Neutral",
        "AI Detected Good",
        "AI Detected High",
      ];
    }
    return ["Very Low", "Low", "Neutral", "Good", "Great"];
  }, [autoUpdated]);

  // 🎯 USE displayMood instead of static mood for display
  const currentDisplayMood = displayMood;

  console.log(`🎨 MoodTracker render: mood=${mood}, displayMood=${displayMood}, autoUpdated=${autoUpdated}, forceRender=${forceRender}`);

  return (
    <div
      className={`p-4 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg ${
        isDark ? "bg-gray-800/80" : "bg-white/90"
      } backdrop-blur-sm relative`}
    >
      {/* Auto-update indicator */}
      {autoUpdated && (
        <div className="absolute -top-2 -right-2 bg-softPurple text-white px-2 py-1 rounded-full text-xs font-medium shadow-lg z-10">
          🤖 AI
        </div>
      )}

      <div className="flex items-center justify-between mb-3">
        <h3
          className={`text-sm font-semibold ${
            isDark ? "text-calmBlue" : "text-calmBlue"
          }`}
        >
          Today's Mood
          {autoUpdated && (
            <span className="ml-2 text-xs text-softPurple font-bold">(AI Detected)</span>
          )}
        </h3>
        <span className="text-xs text-muted-foreground">
          {moodLabels[currentDisplayMood - 1]}
        </span>
      </div>

      <div className="flex justify-center gap-3 mb-3">
        {[1, 2, 3, 4, 5].map((n, i) => {
          const isActive = mood === n;
          const isAiHighlighted = isActive && autoUpdated;
          
          // Build className with guaranteed AI highlighting
          let buttonClass = "text-2xl transition-all duration-300 p-3 rounded-lg border-2 ";
          
          if (isAiHighlighted) {
            // ✨ GUARANTEED AI HIGHLIGHT: Custom CSS class + inline styles
            buttonClass += "animate-ai-highlight border-softPurple";
          } else if (isActive) {
            // Normal highlighted: calmBlue ring
            buttonClass += isDark
              ? "ring-2 ring-calmBlue shadow-lg bg-calmBlue/30 border-calmBlue"
              : "ring-2 ring-calmBlue shadow-lg bg-calmBlue/10 border-calmBlue";
          } else {
            // Not active: Hover effects
            buttonClass += "hover:scale-105 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500";
          }

          console.log(
            `Button ${n}: mood=${mood}, autoUpdated=${autoUpdated}, isActive=${isActive}, isAiHighlighted=${isAiHighlighted}, class="${buttonClass}"`
          );

          return (
            <button
              key={`${n}-${forceRender}`} // Force re-render key
              onClick={() => {
                console.log(`🖱️ Clicked mood ${n}`);
                setMood(n);
              }}
              className={buttonClass}
              title={`Mood ${n}: ${moodLabels[n - 1]}${isAiHighlighted ? ' (AI Detected)' : ''}`}
              style={isAiHighlighted ? {
                boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)',
                borderColor: '#a855f7',
                backgroundColor: 'rgba(168, 85, 247, 0.1)',
              } : {}}
            >
              {moodEmojis[i]}
            </button>
          );
        })}
      </div>

      <button
        onClick={handleSave}
        className={`w-full py-2 px-4 font-medium rounded-lg shadow-sm transition-all ${
          isDark
            ? "bg-calmBlue text-white hover:bg-calmBlue/80"
            : "bg-calmBlue text-white hover:bg-calmBlue/90"
        }`}
      >
        {autoUpdated ? "Confirm Mood" : "Update Mood"}
      </button>

      {autoUpdated && (
        <p className="text-xs text-center text-softPurple font-bold mt-2">
          🤖 AI detected your mood from our conversation
        </p>
      )}
    </div>
  );
}