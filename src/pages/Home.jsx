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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-accent/5">
      <div className="container mx-auto px-6 py-12 text-center max-w-4xl">
        {/* Hero Content */}
        <div className="space-y-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-calmBlue to-softPurple rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-3xl">Z</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-calmBlue via-softPurple to-sereneLavender bg-clip-text text-transparent leading-tight">
              ZenPulse
            </h1>
            <div className="flex justify-center">
              <p className="text-xl md:text-2xl font-medium text-muted-foreground max-w-2xl text-center">
                Your AI-Powered Wellness Companion
              </p>
            </div>
          </div>

          {/* Description */}
          <p className="max-w-3xl mx-auto text-lg md:text-xl leading-relaxed text-muted-foreground">
            Experience mindful mental wellness with AI-driven mood tracking,
            personalized insights, sentiment analysis, and gentle guidance
            to help you stay balanced and serene.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            {user ? (
              <Button
                onClick={() => navigate("/dashboard")}
                size="lg"
                className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-calmBlue to-softPurple hover:from-calmBlue/90 hover:to-softPurple/90 text-white shadow-lg hover:shadow-calmBlue/25 transform hover:scale-105 transition-all duration-300"
              >
                🌸 Enter Your Dashboard
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/login")}
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold bg-gradient-to-r from-softPurple to-sereneLavender hover:from-softPurple/90 hover:to-sereneLavender/90 text-white shadow-lg hover:shadow-softPurple/25 transform hover:scale-105 transition-all duration-300"
                >
                  🌿 Get Started Free
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/about")}
                  className="px-8 py-6 text-lg font-semibold border-2 border-calmBlue text-calmBlue hover:bg-calmBlue hover:text-white transition-all duration-300"
                >
                  Learn More
                </Button>
              </>
            )}
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16 max-w-5xl mx-auto">
            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-card/80 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-calmBlue to-softPurple rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Insights</h3>
              <p className="text-sm text-muted-foreground">Gentle sentiment analysis and personalized recommendations</p>
            </div>

            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-card/80 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-softPurple to-sereneLavender rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mood Tracking</h3>
              <p className="text-sm text-muted-foreground">Calm charts and trend analysis for your mental wellness</p>
            </div>

            <div className="p-6 rounded-2xl shadow-lg backdrop-blur-sm bg-card/80 border border-border">
              <div className="w-12 h-12 bg-gradient-to-br from-mutedGreen to-tranquilTeal rounded-xl flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Mindful Conversations</h3>
              <p className="text-sm text-muted-foreground">Empathetic AI chat that understands your emotional state</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}