import React, { useContext, useMemo } from "react";
import MoodTracker from "../components/Dashboard/MoodTracker";
import Journal from "../components/Dashboard/Journal";
import PepTalkCard from "../components/Dashboard/PepTalkCard";
import Charts from "../components/Dashboard/Charts";
import ChatWidget from "../components/ChatWidget";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";

import "../styles/theme.css";
import "../styles/animation.css";

export default function Dashboard() {
  const { currentMood, sentimentStats, allMessages } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // 🎯 DYNAMIC MOOD: Calculate mood from latest chat sentiment (same as MoodTracker)
  const displayMood = useMemo(() => {
    // Get the most recent AI message with sentiment
    const recentMessages = allMessages
      .filter(msg => msg.sender === 'ai' && msg.sentiment)
      .sort((a, b) => 
        new Date(b.timestamp || b.sessionTimestamp) - new Date(a.timestamp || a.sessionTimestamp)
      );

    if (recentMessages.length > 0) {
      const latestSentiment = recentMessages[0].sentiment;
      console.log(`🎭 Dashboard - Latest sentiment: ${latestSentiment}`);

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

  // Get mood emoji and sentiment info
  const getMoodEmoji = (mood) => {
    const emojis = { 1: "😢", 2: "😔", 3: "😐", 4: "😊", 5: "😁" };
    return emojis[mood] || "😐";
  };

  const getMoodLabel = (mood) => {
    const labels = {
      1: "Low",
      2: "Down",
      3: "Neutral",
      4: "Good",
      5: "Excellent",
    };
    return labels[mood] || "Neutral";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 🎯 HERO DASHBOARD HEADER */}
      <div className="relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 via-pink-400/10 to-purple-400/10 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-cyan-500/5"></div>

        {/* Main Header */}
        <div className="relative container mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            {/* Logo & Title */}
            <div className="flex items-center justify-center space-x-4 mb-8">
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                  ZenPulse Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Your AI-Powered Sentiment Analysis Intelligence
                </p>
              </div>
            </div>

            {/* Live Status Bar */}
            <div
              className={`inline-flex items-center space-x-6 px-8 py-4 rounded-2xl shadow-2xl backdrop-blur-sm border transition-all duration-300 ${
                isDark
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              {/* Current Mood - NOW DYNAMIC! */}
              <div className="text-center">
                <div className="text-3xl mb-1">{getMoodEmoji(displayMood)}</div>
                <div className="text-sm font-medium text-muted-foreground">
                  Current Mood
                </div>
                <div className="text-xs text-cyan-500 font-semibold">
                  {getMoodLabel(displayMood)}
                </div>
              </div>

              {/* Sentiment Stats - SESSION ACCUMULATED */}
              <div className="h-12 w-px bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>

              {/* Positive */}
              <div className="text-center">
                <div className="text-2xl mb-1">😊</div>
                <div className="text-xs font-medium text-muted-foreground">
                  Positive
                </div>
                <div className="text-sm font-bold text-green-500">
                  {sentimentStats?.positive || 0}
                </div>
              </div>

              {/* Neutral */}
              <div className="text-center">
                <div className="text-2xl mb-1">😐</div>
                <div className="text-xs font-medium text-muted-foreground">
                  Neutral
                </div>
                <div className="text-sm font-bold text-yellow-500">
                  {sentimentStats?.neutral || 0}
                </div>
              </div>

              {/* Negative */}
              <div className="text-center">
                <div className="text-2xl mb-1">😔</div>
                <div className="text-xs font-medium text-muted-foreground">
                  Negative
                </div>
                <div className="text-sm font-bold text-red-500">
                  {sentimentStats?.negative || 0}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 🚀 MAIN DASHBOARD LAYOUT */}
      <div className="max-w-8xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* 📊 LEFT SIDEBAR - Tools & Controls */}
          <div className="xl:col-span-4 space-y-6">
            {/* Welcome Card */}
            <div
              className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl ${
                isDark
                  ? "bg-gray-800/80 border-gray-700"
                  : "bg-white/90 border-gray-200"
              }`}
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">🤖</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">AI Assistant Active</h3>
                  <p className="text-sm text-muted-foreground">
                    Session sentiment analysis
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 bg-cyan-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-cyan-500">
                    {sentimentStats?.positive +
                      sentimentStats?.neutral +
                      sentimentStats?.negative || 0}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Session Analyses
                  </div>
                </div>
                <div className="p-3 bg-pink-500/10 rounded-xl">
                  <div className="text-2xl font-bold text-pink-500">
                    {sentimentStats?.positive &&
                    sentimentStats?.neutral + sentimentStats?.negative > 0
                      ? Math.round(
                          (sentimentStats.positive /
                            (sentimentStats.positive +
                              sentimentStats.neutral +
                              sentimentStats.negative)) *
                            100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Positive Rate
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Tools */}
            <div className="space-y-6">
              <MoodTracker />
              <Journal />
              <PepTalkCard />
            </div>
          </div>

          {/* 💬 RIGHT MAIN AREA - Chat & Analytics */}
          <div className="xl:col-span-8 space-y-8">
            {/* Chat Section */}
            <div
              className={`rounded-3xl shadow-2xl backdrop-blur-sm border overflow-hidden transition-all duration-300 hover:shadow-cyan-500/10 ${
                isDark
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              <div className="bg-gradient-to-r from-cyan-500/10 to-pink-500/10 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      AI Conversation
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Real-time sentiment analysis & mood tracking
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-500">
                      Live
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="h-[500px] lg:h-[600px]">
                  <ChatWidget />
                </div>
              </div>
            </div>

            {/* Analytics Section */}
            <div
              className={`rounded-3xl shadow-2xl backdrop-blur-sm border overflow-hidden transition-all duration-300 hover:shadow-purple-500/10 ${
                isDark
                  ? "bg-gray-800/90 border-gray-700"
                  : "bg-white/95 border-gray-200"
              }`}
            >
              <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-8 py-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                      AI Analytics Dashboard
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Sentiment trends & emotional insights
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-purple-500">
                      AI Powered
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <Charts />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🎨 BOTTOM STATS BAR */}
      <div
        className={`border-t ${
          isDark
            ? "border-gray-700 bg-gray-900/50"
            : "border-gray-200 bg-gray-50/50"
        }`}
      >
        <div className="max-w-8xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-cyan-500 mb-1">🤖</div>
              <div className="text-lg font-semibold">AI Analysis</div>
              <div className="text-sm text-muted-foreground">
                Real-time processing
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-500 mb-1">📊</div>
              <div className="text-lg font-semibold">Live Charts</div>
              <div className="text-sm text-muted-foreground">
                Interactive insights
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-500 mb-1">💬</div>
              <div className="text-lg font-semibold">Smart Chat</div>
              <div className="text-sm text-muted-foreground">
                Context-aware AI
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-500 mb-1">🔒</div>
              <div className="text-lg font-semibold">Secure</div>
              <div className="text-sm text-muted-foreground">Privacy first</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
