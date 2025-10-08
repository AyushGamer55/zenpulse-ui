import { useContext, useState, useEffect, useMemo } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { DataContext } from "../context/DataContext";
import { Button } from "../components/UI/button";
import WeeklySummaryCard from "../components/Dashboard/WeeklySummaryCard";

export default function Settings() {
  const { user } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { allMessages, sentimentStats, sessionMessages } = useContext(DataContext);
  const isDark = theme === "dark";
  const [weeklyReport, setWeeklyReport] = useState(true);

  // 🎯 SESSION DATA CHECK (for status indicator)
  const hasSessionData = useMemo(() => {
    return sessionMessages.length > 0 && sessionMessages.some(msg => msg.sender === 'ai');
  }, [sessionMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-2">
            ⚙️ Settings
          </h1>
          <p className="text-muted-foreground">Customize your ZenPulse experience</p>
        </div>

        <div className="grid gap-6">
          {/* User Profile Card */}
          <div className={`shadow-2xl rounded-2xl p-8 backdrop-blur-sm border ${
            isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
          }`}>
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-2xl">
                  {user?.username?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground dark:text-white">
                  {user?.username || "User"}
                </h2>
                <p className="text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Account Type</h3>
                <p className="text-lg font-medium">Free Plan</p>
              </div>
              <div className={`p-4 rounded-xl ${
                isDark ? "bg-gray-700/50" : "bg-gray-50"
              }`}>
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Member Since</h3>
                <p className="text-lg font-medium">Today</p>
              </div>
            </div>
          </div>

          {/* Preferences Card */}
          <div className={`shadow-2xl rounded-2xl p-8 backdrop-blur-sm border ${
            isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
          }`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              🎨 Preferences
            </h2>

            <div className="space-y-6">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-6 rounded-xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
                    {theme === "dark" ? "🌙" : "☀️"}
                  </div>
                  <div>
                    <h3 className="font-semibold">Theme Mode</h3>
                    <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
                  </div>
                </div>
                <Button
                  onClick={toggleTheme}
                  variant="outline"
                  className="px-6 py-2 border-2 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300"
                >
                  {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
                </Button>
              </div>

              {/* Weekly Reports Toggle */}
              <div className="flex items-center justify-between p-6 rounded-xl border-2 border-dashed border-pink-500/30 hover:border-pink-500/60 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center">
                    📧
                  </div>
                  <div>
                    <h3 className="font-semibold">Weekly Reports</h3>
                    <p className="text-sm text-muted-foreground">Receive AI-powered weekly summaries</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={weeklyReport}
                    onChange={() => setWeeklyReport(!weeklyReport)}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-pink-500/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all dark:bg-gray-700 peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* AI Session Insights Card - USING WEEKLYSUMMARYCARD COMPONENT */}
          <WeeklySummaryCard />

          {/* Data Management */}
          <div className={`shadow-2xl rounded-2xl p-8 backdrop-blur-sm border ${
            isDark ? "bg-gray-800/80 border-gray-700" : "bg-white/90 border-gray-200"
          }`}>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              🗂️ Data Management
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 border-2 border-blue-500/30 hover:border-blue-500 hover:bg-blue-500/10"
              >
                <span className="text-2xl">📤</span>
                <span className="font-semibold">Export Data</span>
                <span className="text-xs text-muted-foreground">Download your mood history</span>
              </Button>

              <Button
                variant="outline"
                className="p-6 h-auto flex flex-col items-center space-y-2 border-2 border-red-500/30 hover:border-red-500 hover:bg-red-500/10"
              >
                <span className="text-2xl">🗑️</span>
                <span className="font-semibold">Clear Data</span>
                <span className="text-xs text-muted-foreground">Reset all your data</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}