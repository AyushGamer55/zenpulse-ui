import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { Button } from "../components/UI/button";

export default function Home() {
  const { user } = useContext(AuthContext);
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-6 py-12 text-center max-w-4xl">
        {/* Hero Content */}
        <div className="space-y-8 animate-fadeIn">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-white font-black text-3xl">Z</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent leading-tight">
              ZenPulse
            </h1>
            <div className="flex justify-center">
              <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl text-center">
                Your AI-Powered Good Companion
              </p>
            </div>
          </div>

          {/* Description */}
          <p className={`max-w-3xl mx-auto text-lg md:text-xl leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}>
            Experience the future of mental wellness with AI-driven mood tracking,
            personalized pep talks, sentiment analysis, and intelligent insights
            to help you stay balanced and productive.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
              >
                🚀 Enter Your Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300"
                >
                  ✨ Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/about")}
                  className="px-8 py-6 text-lg font-semibold border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-400 dark:hover:text-gray-900 transition-all duration-300"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
            <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
              isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white/80 border border-gray-200"
            }`}>
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">Real-time sentiment analysis and personalized recommendations</p>
            </div>

            <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
              isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white/80 border border-gray-200"
            }`}>
              <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mood Tracking</h3>
              <p className="text-sm text-muted-foreground">Interactive charts and trend analysis for your mental wellness</p>
            </div>

            <div className={`p-6 rounded-2xl shadow-xl backdrop-blur-sm ${
              isDark ? "bg-gray-800/60 border border-gray-700" : "bg-white/80 border border-gray-200"
            }`}>
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Conversations</h3>
              <p className="text-sm text-muted-foreground">Context-aware AI chat that understands your emotional state</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}