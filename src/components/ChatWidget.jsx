import React, { useState, useEffect, useRef, useContext } from "react";
import client from "../api/client";
import { Button } from "@/components/UI/button";
import { cn } from "../lib/utils";
import { ThemeContext } from "../context/ThemeContext";
import { DataContext } from "../context/DataContext";

export default function ChatWidget() {
  const { theme } = useContext(ThemeContext);
  const {
    autoUpdateMood,
    currentMood,
    addSessionSentiment,
    addSessionMessage,
  } = useContext(DataContext);
  const isDark = theme === "dark";

  // Debug theme values
  console.log(`🎨 ChatWidget Theme: ${theme}, isDark: ${isDark}`);

  const [messages, setMessages] = useState(() => {
    try {
      // Load from sessionStorage if available
      const stored = sessionStorage.getItem("zenpulse_chat_messages");
      const parsedMessages = stored ? JSON.parse(stored) : [
        {
          sender: "ai",
          text: "👋 Hi! I'm your ZenPulse AI assistant. How are you feeling today? I can help with mood tracking, productivity tips, or just chat about your habits.",
          sentiment: "neutral",
          timestamp: new Date(),
          id: "initial-message",
        },
      ];

      // Convert timestamp strings back to Date objects safely
      return parsedMessages.map(msg => ({
        ...msg,
        timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date()
      }));
    } catch (error) {
      console.warn('Error loading messages from sessionStorage:', error);
      return [
        {
          sender: "ai",
          text: "👋 Hi! I'm your ZenPulse AI assistant. How are you feeling today?",
          sentiment: "neutral",
          timestamp: new Date(),
          id: "initial-message",
        },
      ];
    }
  });

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [moodUpdated, setMoodUpdated] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Save messages to sessionStorage (with proper serialization)
  useEffect(() => {
    const messagesToStore = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp.toISOString() // Convert to string for storage
    }));
    sessionStorage.setItem("zenpulse_chat_messages", JSON.stringify(messagesToStore));
  }, [messages]);

  // Auto-update mood based on sentiment analysis
  const updateMoodFromSentiment = async (sentiment) => {
    console.log(`🤖 Starting mood update for sentiment: ${sentiment}`);

    // Map sentiment to mood levels with some randomness
    let moodLevel;
    switch (sentiment) {
      case "positive":
        // Positive: mood 4 or 5 (70% chance 4, 30% chance 5)
        moodLevel = Math.random() < 0.7 ? 4 : 5;
        break;
      case "negative":
        // Negative: mood 1 or 2 (70% chance 1, 30% chance 2)
        moodLevel = Math.random() < 0.7 ? 1 : 2;
        break;
      case "neutral":
      default:
        moodLevel = 3;
        break;
    }

    console.log(`🎲 Mapped ${sentiment} to mood level: ${moodLevel}`);

    // AI can override ANY mood - both upgrade and downgrade!
    try {
      console.log(`🚀 Calling autoUpdateMood with mood: ${moodLevel}`);
      const result = await autoUpdateMood(moodLevel);
      console.log(`✅ Auto-update successful:`, result);

      // Add to session sentiment counter
      addSessionSentiment(sentiment);
      console.log(`📊 Added ${sentiment} to session counter`);

      setMoodUpdated(true);
      setTimeout(() => setMoodUpdated(false), 3000);
      console.log(
        `🤖 AI Override: Changed mood to ${moodLevel} based on ${sentiment} sentiment`
      );
    } catch (error) {
      console.error("❌ Failed to auto-update mood:", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [isTyping]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const messageId = Date.now() + Math.random();
    const userMessage = {
      sender: "user",
      text: input.trim(),
      sentiment: "neutral",
      timestamp: new Date(), // Ensure it's a Date object
      id: messageId,
      processed: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    addSessionMessage(userMessage); // Save to session
    setInput("");
    setLoading(true);
    setIsTyping(true);

    try {
      const res = await client.post("/chat", { message: input.trim() });
      console.log(`📡 Chat API Response:`, res.data);
      console.log(`📊 Response sentiment: "${res.data.sentiment}"`);

      setTimeout(() => {
        const aiMessage = {
          sender: "ai",
          text: res.data.response,
          sentiment: res.data.sentiment || "neutral",
          timestamp: new Date(), // Ensure it's a Date object
          id: Date.now() + Math.random(),
        };

        console.log(
          `🤖 AI Message created with sentiment: "${aiMessage.sentiment}"`
        );

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, processed: true } : msg
          )
        );

        setMessages((prev) => [...prev, aiMessage]);
        addSessionMessage(aiMessage); // Save AI response to session
        setIsTyping(false);

        // Auto-update mood based on AI's sentiment analysis
        console.log(
          `🎯 AI Sentiment: ${aiMessage.sentiment}, Message: "${input}"`
        );
        updateMoodFromSentiment(aiMessage.sentiment);
      }, 800);
    } catch (err) {
      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, processed: true } : msg
          )
        );

        const errorMessage = {
          sender: "ai",
          text: "🤖 I'm having trouble connecting right now. Let's try again in a moment.",
          sentiment: "neutral",
          timestamp: new Date(), // Ensure it's a Date object
          id: Date.now() + Math.random(),
        };
        setMessages((prev) => [...prev, errorMessage]);
        addSessionMessage(errorMessage); // Save error message to session
        setIsTyping(false);
      }, 500);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (timestamp) => {
    try {
      // Handle various timestamp formats safely
      let date;
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        date = new Date(); // Fallback to now
      }

      // Ensure it's a valid date
      if (isNaN(date.getTime())) {
        date = new Date(); // Fallback if invalid
      }

      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.warn('Error formatting timestamp:', error);
      return new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto border rounded-3xl shadow-lg overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Enhanced Header */}
      <div className="flex items-center justify-center p-5 bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 rounded-t-3xl relative">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-transparent bg-gradient-to-br from-cyan-400 to-blue-500 bg-clip-text font-black text-lg">
                Z
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div>
            <h2 className="text-white font-black text-xl">ZenPulse AI</h2>
            <p className="text-white/80 text-sm">Your Personal Assistant</p>
          </div>
        </div>

        {/* Mood Update Indicator */}
        {moodUpdated && (
          <div className="absolute top-2 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium animate-bounce shadow-lg">
            Mood Updated! 🌟
          </div>
        )}
      </div>

      {/* Chat Messages - Fixed Scrolling */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar bg-white dark:bg-gray-900 min-h-0"
        style={{ maxHeight: "calc(100vh - 300px)" }}
      >
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex space-x-3 animate-fadeIn",
              msg.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.sender === "ai" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
                Z
              </div>
            )}

            <div
              className={cn(
                "px-4 py-3 rounded-xl max-w-[70%] shadow-sm transition-all duration-300",
                msg.sender === "user"
                  ? msg.processed
                    ? "bg-cyan-500 text-white rounded-br-md shadow-cyan-200"
                    : "bg-white dark:bg-gray-700 text-black dark:text-white rounded-br-md border-2 border-cyan-400 shadow-cyan-100"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md"
              )}
            >
              <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex justify-between items-center">
                <span>{formatTime(msg.timestamp)}</span>
                <div className="flex items-center space-x-2">
                  {msg.sentiment && msg.sentiment !== "neutral" && (
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-xs font-medium",
                        msg.sentiment === "positive"
                          ? "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                          : "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300"
                      )}
                    >
                      {msg.sentiment}
                    </span>
                  )}
                  {msg.sender === "user" && !msg.processed && (
                    <span className="text-cyan-500 font-medium animate-pulse text-xs">
                      Sending...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {msg.sender === "user" && (
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-400 flex items-center justify-center text-white font-bold shadow-sm">
                U
              </div>
            )}
          </div>
        ))}

        {/* Enhanced Typing Indicator */}
        {isTyping && (
          <div className="flex space-x-3 animate-fadeIn">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-white font-bold shadow-md">
              Z
              </div>
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl rounded-bl-md shadow-sm">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                ZenPulse is typing...
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

            {/* Enhanced Input */}
            <div className="p-4 border-t bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <div className="flex space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // Auto-resize textarea with better handling
                const textarea = e.target;
                textarea.style.height = "auto";
                const newHeight = Math.min(textarea.scrollHeight, 120);
                textarea.style.height = newHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-cyan-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 overflow-hidden min-h-[44px] max-h-[120px]"
              placeholder="Share your thoughts, ask questions, or just say hi..."
              rows={1}
              disabled={loading}
              style={{
                height: 'auto',
                minHeight: '44px',
                maxHeight: '120px'
              }}
            />
            <div className="absolute right-3 top-3 text-xs text-gray-400 dark:text-gray-500">
              {input.length}/500
            </div>
          </div>

          <Button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <span>Send</span>
            )}
          </Button>
        </div>

        <div className="flex justify-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Press Enter to send • AI responses are personalized to your mood
          </span>
        </div>
      </div>
    </div>
  );
}