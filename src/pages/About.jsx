import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { Button } from "../components/UI/button";
import { useNavigate } from "react-router-dom";

export default function About() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent-cyan/5 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section - Perfectly Centered */}
      <div className="flex items-center justify-center min-h-screen px-6 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
              <span className="text-white font-black text-4xl">Z</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
            ZenPulse
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl font-medium text-muted-foreground">
            AI Sentiment Analysis Dashboard
          </p>

          {/* Description */}
          <div
            className={`space-y-4 ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            <p className="text-lg md:text-xl leading-relaxed font-medium">
              An intelligent chatbot that analyzes your conversations in
              real-time to understand your emotional state and provide
              personalized insights.
            </p>
            <p className="text-lg leading-relaxed">
              Track your mood, get AI-powered recommendations, and maintain
              emotional balance through advanced sentiment analysis.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              onClick={() => navigate("/register")}
              size="lg"
              className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-pink-500/25 transform hover:scale-105 transition-all duration-300"
            >
              🚀 Try ZenPulse
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
              className="px-8 py-4 text-lg font-semibold border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-500 hover:text-white dark:text-cyan-400 dark:border-cyan-400 dark:hover:bg-cyan-400 dark:hover:text-gray-900 transition-all duration-300"
            >
              ← Back to Home
            </Button>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              🛠️ Powered by Advanced Technology
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built with modern web technologies and AI to deliver exceptional
              user experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚛️",
                title: "React & Modern UI",
                description:
                  "Built with React 18, Tailwind CSS, and shadcn/ui for a beautiful, responsive interface",
                color: "from-cyan-400 to-blue-500",
              },
              {
                icon: "🚀",
                title: "Node.js Backend",
                description:
                  "Scalable Express.js server with PostgreSQL database for reliable data management",
                color: "from-green-400 to-teal-500",
              },
              {
                icon: "🤖",
                title: "AI Integration",
                description:
                  "Powered by OpenAI GPT-4 and Mistral AI for intelligent sentiment analysis and conversations",
                color: "from-purple-400 to-pink-500",
              },
              {
                icon: "📊",
                title: "Real-time Analytics",
                description:
                  "Interactive charts with Recharts library showing mood trends and AI insights",
                color: "from-orange-400 to-red-500",
              },
              {
                icon: "🔒",
                title: "Secure Authentication",
                description:
                  "JWT-based authentication with bcrypt password hashing for maximum security",
                color: "from-indigo-400 to-purple-500",
              },
              {
                icon: "🎨",
                title: "Dark Mode Support",
                description:
                  "Beautiful dark and light themes with smooth transitions and accessibility",
                color: "from-gray-400 to-gray-600",
              },
            ].map((tech, index) => (
              <div
                key={index}
                className={`group p-6 rounded-2xl shadow-xl backdrop-blur-sm border transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  isDark
                    ? "bg-gray-800/60 border-gray-700 hover:border-gray-600"
                    : "bg-white/80 border-gray-200 hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${tech.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300`}
                >
                  <span className="text-2xl">{tech.icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground dark:text-white">
                  {tech.title}
                </h3>
                <p
                  className={`text-muted-foreground leading-relaxed ${
                    isDark ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div
        className={`py-16 px-6 ${isDark ? "bg-gray-800/30" : "bg-gray-50/50"}`}
      >
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
            🎯 Our Mission
          </h2>
          <p
            className={`text-lg leading-relaxed mb-12 max-w-3xl mx-auto text-center ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}
          >
            At ZenPulse, we believe that mental wellness should be accessible,
            understandable, and actionable. By combining the power of artificial
            intelligence with thoughtful design, we create tools that not only
            track your emotional journey but actively help you navigate it with
            confidence and clarity.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Personalized</h3>
              <p className="text-sm text-muted-foreground">
                AI adapts to your unique emotional patterns
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Private</h3>
              <p className="text-sm text-muted-foreground">
                Your data stays secure and confidential
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Empowering</h3>
              <p className="text-sm text-muted-foreground">
                Tools that help you take control of your wellness
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="py-16 px-6">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Wellness Journey?
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of users who have discovered a healthier, more
            balanced way of life with ZenPulse.
          </p>
          <Button
            onClick={() => navigate("/register")}
            size="lg"
            className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300"
          >
            ✨ Begin Your Journey Today
          </Button>
        </div>
      </div>
    </div>
  );
}
