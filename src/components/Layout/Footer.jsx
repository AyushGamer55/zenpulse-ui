import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Button } from "../UI/button";

export default function Footer() {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  return (
    <footer className={`border-t transition-all duration-300 ${
      isDark ? "bg-gray-900/50 border-gray-700" : "bg-gray-50/50 border-gray-200"
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-black text-lg">Z</span>
              </div>
              <h3 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                ZenPulse
              </h3>
            </div>
            <p className={`text-sm leading-relaxed max-w-md ${
              isDark ? "text-gray-300" : "text-gray-600"
            }`}>
              Revolutionizing mental wellness with AI-powered insights and real-time emotional intelligence.
              Your journey to better mental health starts here.
            </p>
            <div className="flex space-x-4 mt-6">
              <Button
                onClick={() => navigate("/register")}
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Get Started
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/about")}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* About Me */}
          <div>
            <h4 className="font-semibold mb-4 text-foreground dark:text-white">About Me</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <div className={`font-medium text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}>
                    Ayush Kumar
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Full-Stack Developer
                  </div>
                </div>
              </div>
              <p className={`text-xs leading-relaxed ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}>
                Passionate about creating AI-powered applications that make a positive impact on mental wellness and user experience.
              </p>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-sm font-medium transition-colors hover:text-cyan-500"
              >
                <span>🐙</span>
                <span>View My GitHub</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center ${
          isDark ? "border-gray-700" : "border-gray-200"
        }`}>
          <p className={`text-sm ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}>
            © {new Date().getFullYear()} <span className="font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ZenPulse</span>. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <span className="text-xs text-muted-foreground">Made with ❤️ for mental wellness</span>
            <div className="flex items-center space-x-1">
              <span className="text-xs">Powered by</span>
              <span className="text-xs font-bold text-cyan-500">AI</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}