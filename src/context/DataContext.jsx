import { createContext, useState, useEffect, useContext, useMemo } from "react";
import { useEntries } from "../hooks/useEntries";
import { AuthContext } from "./AuthContext";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const {
    entries,
    loading,
    error,
    addOrUpdateEntry,
    autoUpdateMood,
    fetchStats,
    fetchWeeklySummary,
    fetchEntries,
  } = useEntries();
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [sessionSentiments, setSessionSentiments] = useState(() => {
    // Load from sessionStorage
    const stored = sessionStorage.getItem("zenpulse_session_sentiments");
    return stored
      ? JSON.parse(stored)
      : { positive: 0, neutral: 0, negative: 0 };
  });
  const [sessionMessages, setSessionMessages] = useState(() => {
    // Load from sessionStorage
    const stored = sessionStorage.getItem("zenpulse_session_messages");
    return stored ? JSON.parse(stored) : [];
  });

  // Save to sessionStorage when data changes
  useEffect(() => {
    sessionStorage.setItem(
      "zenpulse_session_sentiments",
      JSON.stringify(sessionSentiments)
    );
  }, [sessionSentiments]);

  useEffect(() => {
    sessionStorage.setItem(
      "zenpulse_session_messages",
      JSON.stringify(sessionMessages)
    );
  }, [sessionMessages]);

  // Simple enhanced functions
  const enhancedAddOrUpdateEntry = async (entryData) => {
    const result = await addOrUpdateEntry(entryData);
    setLastUpdate(Date.now());
    return result;
  };

  const enhancedAutoUpdateMood = async (mood) => {
    const result = await autoUpdateMood(mood);
    setLastUpdate(Date.now());
    return result;
  };

  // Add sentiment to session counter
  const addSessionSentiment = (sentiment) => {
    setSessionSentiments((prev) => ({
      ...prev,
      [sentiment]: prev[sentiment] + 1,
    }));
  };

  // Add message to session storage
  const addSessionMessage = (message) => {
    setSessionMessages((prev) => [
      ...prev,
      { ...message, sessionTimestamp: Date.now() },
    ]);
  };

  // Clear session data (optional)
  const clearSessionData = () => {
    setSessionSentiments({ positive: 0, neutral: 0, negative: 0 });
    setSessionMessages([]);
    sessionStorage.removeItem("zenpulse_session_sentiments");
    sessionStorage.removeItem("zenpulse_session_messages");
  };

  // Get today's entry
  const todayEntry = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return entries.find((e) => e.entry_date === today);
  }, [entries]);

  // Get current mood (from today's entry)
  const currentMood = useMemo(() => {
    return todayEntry?.mood || 3;
  }, [todayEntry]);

  // Get mood history (last 7 days)
  const moodHistory = useMemo(() => {
    return entries
      .sort((a, b) => new Date(b.entry_date) - new Date(a.entry_date))
      .slice(0, 7)
      .reverse(); // Oldest first for charts
  }, [entries]);

  // Get sentiment stats (combine database + session data)
  const sentimentStats = useMemo(() => {
    const dbStats = entries.reduce(
      (acc, e) => {
        const sentiment = e.sentiment || "neutral";
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
      },
      { positive: 0, neutral: 0, negative: 0 }
    );

    // Add session sentiments
    return {
      positive: dbStats.positive + sessionSentiments.positive,
      neutral: dbStats.neutral + sessionSentiments.neutral,
      negative: dbStats.negative + sessionSentiments.negative,
    };
  }, [entries, sessionSentiments]);

  // Get all messages (database + session)
  const allMessages = useMemo(() => {
    return [...entries, ...sessionMessages].sort(
      (a, b) =>
        new Date(a.entry_date || a.timestamp || a.sessionTimestamp) -
        new Date(b.entry_date || b.timestamp || b.sessionTimestamp)
    );
  }, [entries, sessionMessages]);

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      console.log(`🔄 DataContext: User logged in, fetching entries`);
      fetchEntries();
    } else {
      // Clear data when user logs out
      setLastUpdate(Date.now());
    }
  }, [user]);

  // Auto-refresh data periodically (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      console.log(`🔄 DataContext: Auto-refreshing data`);
      fetchEntries();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [user, fetchEntries]);

  // Update lastUpdate when entries change
  useEffect(() => {
    setLastUpdate(Date.now());
  }, [entries]);

  const value = {
    // Data from useEntries hook
    entries,
    loading,
    error,

    // Enhanced tracking
    lastUpdate,

    // Today's data
    todayEntry,
    currentMood,

    // Computed data
    moodHistory,
    sentimentStats,
    allMessages,
    sessionSentiments,
    sessionMessages,

    // Session management
    addSessionSentiment,
    addSessionMessage,
    clearSessionData,

    // Enhanced actions
    addOrUpdateEntry: enhancedAddOrUpdateEntry,
    autoUpdateMood: enhancedAutoUpdateMood,
    fetchStats,
    fetchWeeklySummary,
    fetchEntries,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
