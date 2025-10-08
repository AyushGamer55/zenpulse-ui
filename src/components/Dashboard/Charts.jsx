import { useEffect, useState, useContext, useMemo } from "react";
import { DataContext } from "../../context/DataContext";
import { ThemeContext } from "../../context/ThemeContext";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function Charts() {
  const {
    entries,
    loading,
    moodHistory,
    sentimentStats,
    currentMood,
    todayEntry,
    allMessages,
  } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const [error, setError] = useState(null);

  const isDark = theme === "dark";
  const accentPurple = isDark ? "#a855f7" : "#6b21a8";
  const accentCyan = isDark ? "#00ffff" : "#0891b2";
  const accentGreen = isDark ? "#00ff88" : "#10b981";
  const accentRed = isDark ? "#ff4444" : "#dc2626";
  const accentYellow = isDark ? "#ffaa00" : "#d97706";
  const bgTooltip = isDark ? "#1f1f1f" : "#ffffff";
  const textTooltip = isDark ? "#fff" : "#1a202c";
  const strokeGrid = isDark ? "#333" : "#d1d5db";

  // 🎯 DYNAMIC MOOD: Calculate current mood from latest chat sentiment
  const currentSessionMood = useMemo(() => {
    // Get the most recent AI message with sentiment
    const recentMessages = allMessages
      .filter((msg) => msg.sender === "ai" && msg.sentiment)
      .sort(
        (a, b) =>
          new Date(b.timestamp || b.sessionTimestamp) -
          new Date(a.timestamp || a.sessionTimestamp)
      );

    if (recentMessages.length > 0) {
      const latestSentiment = recentMessages[0].sentiment;
      console.log(`🎭 Charts - Latest sentiment: ${latestSentiment}`);

      // Map sentiment to mood level (same as other components)
      switch (latestSentiment) {
        case "positive":
          return Math.random() < 0.7 ? 4 : 5;
        case "negative":
          return Math.random() < 0.7 ? 1 : 2;
        case "neutral":
        default:
          return 3;
      }
    }

    // Fallback to database mood
    return currentMood || 3;
  }, [allMessages, currentMood]);

  // 🎯 SESSION-ONLY CHART DATA: Show mood changes during current chat session
  const chartData = useMemo(() => {
    try {
      // Get only AI messages with sentiment from current session
      const sessionMessages = allMessages
        .filter((msg) => msg.sender === "ai" && msg.sentiment)
        .sort(
          (a, b) =>
            new Date(a.timestamp || a.sessionTimestamp) -
            new Date(b.timestamp || b.sessionTimestamp)
        );

      if (sessionMessages.length === 0) {
        // No session data yet, show current mood as starting point
        return [
          {
            time: "Start",
            mood: currentMood || 3,
            sentiment: 2,
          },
        ];
      }

      // Create session timeline based on AI responses
      const sessionData = sessionMessages.map((msg, index) => {
        let moodLevel;

        // Map sentiment to mood (same logic as ChatWidget)
        switch (msg.sentiment) {
          case "positive":
            moodLevel = Math.random() < 0.7 ? 4 : 5;
            break;
          case "negative":
            moodLevel = Math.random() < 0.7 ? 1 : 2;
            break;
          case "neutral":
          default:
            moodLevel = 3;
            break;
        }

        return {
          time: `Msg ${index + 1}`,
          mood: moodLevel,
          sentiment:
            msg.sentiment === "positive"
              ? 3
              : msg.sentiment === "negative"
              ? 1
              : 2,
        };
      });

      // Add current/latest mood as the final point
      const latestMood = currentSessionMood;
      sessionData.push({
        time: "Current",
        mood: latestMood,
        sentiment: latestMood >= 4 ? 3 : latestMood <= 2 ? 1 : 2,
      });

      console.log(`📊 Session Chart Data:`, sessionData);
      return sessionData;
    } catch (err) {
      console.error("Session chart data processing error:", err);
      setError("Failed to process session chart data");
      return [];
    }
  }, [allMessages, currentMood, currentSessionMood]);

  // Use shared sentiment stats
  const pieData = useMemo(() => {
    try {
      return [
        {
          name: "Positive",
          value: sentimentStats.positive || 0,
          color: accentGreen,
        },
        {
          name: "Neutral",
          value: sentimentStats.neutral || 0,
          color: accentYellow,
        },
        {
          name: "Negative",
          value: sentimentStats.negative || 0,
          color: accentRed,
        },
      ].filter((item) => item.value > 0);
    } catch (err) {
      console.error("Sentiment stats error:", err);
      setError("Failed to process sentiment stats");
      return [];
    }
  }, [sentimentStats, accentGreen, accentYellow, accentRed]);

  // Show loading state
  if (loading) {
    return (
      <div
        className={`p-6 rounded-2xl shadow-lg ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-500">Loading charts...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div
        className={`p-6 rounded-2xl shadow-lg ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-center py-8">
          <p className="text-red-500">⚠️ {error}</p>
          <button
            onClick={() => setError(null)}
            className="mt-2 px-4 py-2 bg-cyan-500 text-white rounded-lg text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Show empty state
  if (!entries || entries.length === 0) {
    return (
      <div
        className={`p-6 rounded-2xl shadow-lg ${
          isDark ? "bg-gray-900" : "bg-white"
        }`}
      >
        <div className="text-center py-8">
          <p className="text-gray-500">📊 No data available yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start tracking your mood to see charts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 text-center ${
          isDark
            ? "text-purple-400 drop-shadow-[0_0_6px_#a855f7]"
            : "text-purple-600"
        }`}
      >
        🤖 AI Sentiment Analysis
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MOOD TREND CHART */}
        <div
          className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className="text-lg font-semibold mb-3 text-center"
            style={{ color: accentCyan }}
          >
            📊 Mood Trends
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={strokeGrid} />
              <XAxis dataKey="time" stroke={accentPurple} />
              <YAxis stroke={accentPurple} domain={[1, 5]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: bgTooltip,
                  border: `1px solid ${accentPurple}`,
                  borderRadius: "8px",
                }}
                labelStyle={{ color: textTooltip }}
              />
              <Line
                type="monotone"
                dataKey="mood"
                stroke={accentCyan}
                strokeWidth={3}
                dot={{ r: 4, fill: accentCyan }}
                name="Your Mood"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* SENTIMENT DISTRIBUTION */}
        <div
          className={`p-4 rounded-xl ${isDark ? "bg-gray-800" : "bg-gray-50"}`}
        >
          <h3
            className="text-lg font-semibold mb-3 text-center"
            style={{ color: accentGreen }}
          >
            🎭 Sentiment Analysis
          </h3>
          {sentimentStats &&
          Object.values(sentimentStats).some((v) => v > 0) ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label={({ name, percent }) =>
                    percent > 0 ? `${name}: ${(percent * 100).toFixed(0)}%` : ""
                  }
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: bgTooltip,
                    border: `1px solid ${accentPurple}`,
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No sentiment data yet</p>
            </div>
          )}

          {/* Simple stats */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {pieData.map((stat, index) => (
              <div key={index} className="text-sm">
                <div className="font-medium" style={{ color: stat.color }}>
                  {stat.name}
                </div>
                <div
                  className="text-lg font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Simple insights */}
      <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-purple-50 to-cyan-50 dark:from-purple-900/20 dark:to-cyan-900/20">
        <div className="text-sm text-center">
          <strong>💡 Tip:</strong> Chat with AI to generate sentiment analysis
          data!
        </div>
      </div>
    </div>
  );
}
