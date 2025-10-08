import { useContext, useMemo } from "react";
import { DataContext } from "../context/DataContext";
import { ThemeContext } from "../context/ThemeContext";
import { Button } from "../components/UI/button";

export default function History() {
  const { entries, loading, allMessages, sentimentStats, sessionMessages, currentMood } = useContext(DataContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort((a, b) =>
    new Date(b.entry_date) - new Date(a.entry_date)
  );

  // Get recent session activity (last 10 messages)
  const recentSessionActivity = useMemo(() => {
    const aiMessages = sessionMessages
      .filter(msg => msg.sender === 'ai')
      .sort((a, b) => new Date(b.timestamp || b.sessionTimestamp) - new Date(a.timestamp || a.sessionTimestamp))
      .slice(0, 10);

    return aiMessages.map((msg, index) => ({
      id: `session-${index}`,
      type: 'session',
      timestamp: msg.timestamp || msg.sessionTimestamp,
      content: msg.text,
      sentiment: msg.sentiment,
      mood: currentMood || 3 // Use current mood for session items
    }));
  }, [sessionMessages, currentMood]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMoodEmoji = (mood) => {
    const emojis = {
      1: "😢", // Very Low
      2: "😔", // Low
      3: "😐", // Neutral
      4: "😊", // Good
      5: "😁"  // Great
    };
    return emojis[mood] || "😐";
  };

  const getMoodLabel = (mood) => {
    const labels = {
      1: "Very Low",
      2: "Low",
      3: "Neutral",
      4: "Good",
      5: "Excellent"
    };
    return labels[mood] || "Neutral";
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive": return "text-green-600 dark:text-green-400";
      case "negative": return "text-red-600 dark:text-red-400";
      case "neutral": return "text-yellow-600 dark:text-yellow-400";
      default: return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-2">
            📚 Your Wellness Journey
          </h1>
          <p className="text-muted-foreground">
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} saved • {recentSessionActivity.length} recent interactions
          </p>
        </div>

        {/* Current Session Section */}
        {recentSessionActivity.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">🔴</span>
              </div>
              <h2 className="text-xl font-semibold">Live Session Activity</h2>
              <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                Active Now
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {recentSessionActivity.map((activity, index) => (
                <div key={activity.id} className={`p-4 rounded-xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                  isDark ? "bg-gray-800/60 border-gray-700" : "bg-white/80 border-gray-200"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">🤖</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          AI Response #{recentSessionActivity.length - index}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(activity.timestamp)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(activity.sentiment)} bg-current/10`}>
                        {activity.sentiment}
                      </span>
                      <span className="text-lg">{getMoodEmoji(activity.mood)}</span>
                    </div>
                  </div>
                  <div className="mt-3 text-sm text-muted-foreground line-clamp-2">
                    {activity.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Entries */}
        {entries.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl">📝</span>
            </div>
            <h2 className="text-2xl font-bold mb-4">No History Yet</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start your wellness journey by tracking your mood and journaling your thoughts.
              Your history will appear here as you build your personal wellness timeline.
            </p>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
              Start Tracking →
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Timeline Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-3">
                <span>📅</span>
                <span>Historical Timeline</span>
              </h2>
              <div className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleDateString()}
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400 via-pink-400 to-blue-500 opacity-30"></div>

              {sortedEntries.map((entry, index) => (
                <div key={`${entry.entry_date}-${index}`} className="relative flex items-start space-x-6 mb-8">
                  {/* Timeline dot */}
                  <div className="relative z-10 flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-4 ${
                      isDark ? 'border-gray-800 bg-gray-700' : 'border-white bg-gray-100'
                    }`}>
                      <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 shadow-xl rounded-2xl p-6 backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl ${
                    isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
                  }`}>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-foreground dark:text-white">
                          {formatDate(entry.entry_date)}
                        </h3>
                        <div className="flex items-center space-x-3 mt-2">
                          <span className="px-3 py-1 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-full text-sm font-medium">
                            {getMoodLabel(entry.mood)}
                          </span>
                          {entry.sentiment && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(entry.sentiment)} bg-current/10`}>
                              {entry.sentiment}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground">
                        <div>Mood: {entry.mood}/5</div>
                        {entry.tasks_completed !== undefined && (
                          <div>Tasks: {entry.tasks_completed}</div>
                        )}
                      </div>
                    </div>

                    {/* Journal Entry */}
                    {entry.journal && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-foreground dark:text-white mb-2">Journal Entry</h4>
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <p className="text-foreground dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {entry.journal}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* AI Pep Talk */}
                    {entry.ai_pep_talk && (
                      <div>
                        <h4 className="font-semibold text-foreground dark:text-white mb-2 flex items-center">
                          🤖 AI Pep Talk
                        </h4>
                        <div className={`p-4 rounded-xl border-2 ${
                          isDark ? 'bg-gradient-to-r from-green-900/20 to-teal-900/20 border-green-700/50' : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
                        }`}>
                          <p className="text-foreground dark:text-gray-200 leading-relaxed italic">
                            "{entry.ai_pep_talk}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {entry.notes && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-foreground dark:text-white mb-2">Additional Notes</h4>
                        <div className={`p-4 rounded-xl ${
                          isDark ? 'bg-gray-700/50' : 'bg-gray-50'
                        }`}>
                          <p className="text-foreground dark:text-gray-200 leading-relaxed whitespace-pre-wrap">
                            {entry.notes}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Summary */}
            <div className={`shadow-xl rounded-2xl p-6 backdrop-blur-sm border mt-8 ${
              isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
            }`}>
              <h3 className="text-xl font-bold mb-4">📊 Your Journey Stats</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-500">{entries.length}</div>
                  <div className="text-sm text-muted-foreground">Total Entries</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">
                    {entries.filter(e => e.sentiment === 'positive').length}
                  </div>
                  <div className="text-sm text-muted-foreground">Positive Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-500">
                    {entries.filter(e => e.mood >= 4).length}
                  </div>
                  <div className="text-sm text-muted-foreground">Great Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-500">
                    {Math.round(entries.reduce((sum, e) => sum + (e.tasks_completed || 0), 0) / Math.max(entries.length, 1))}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Tasks/Day</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}