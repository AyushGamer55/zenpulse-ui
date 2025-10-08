import { NavLink, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { AuthContext } from "../../context/AuthContext";
import { Button } from "../UI/button";

export default function Navbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isDark = theme === "dark";

  return (
    <nav
      className={`sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDark
          ? "bg-gray-900/90 border-gray-700/50"
          : "bg-white/90 border-gray-200/50"
      } shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Enhanced Spacing */}
          <div
            className="flex items-center space-x-4 cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 animate-pulse">
              <span className="text-white font-black text-xl">Z</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
                ZenPulse
              </h1>
              <p className="text-xs text-muted-foreground group-hover:text-cyan-400 transition-colors duration-300">
                AI Wellness Assistant
              </p>
            </div>
          </div>

          {/* Navigation Links - Better Spacing */}
          <div className="hidden md:flex items-center space-x-4">
            {[
              { to: "/", label: "Home", icon: "🏠" },
              { to: "/dashboard", label: "Dashboard", icon: "📊" },
              { to: "/settings", label: "Settings", icon: "⚙️" },
              { to: "/about", label: "About", icon: "ℹ️" },
            ].map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-6 py-3 rounded-2xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-xl transform scale-105"
                      : `hover:bg-gray-100/80 dark:hover:bg-gray-800/80 backdrop-blur-sm ${
                          isDark
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-700 hover:text-gray-900"
                        }`
                  }`
                }
              >
                <span className="text-lg">{icon}</span>
                <span className="hidden lg:block">{label}</span>
              </NavLink>
            ))}
          </div>

          {/* Right Actions - Enhanced Spacing */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle - Improved */}
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="sm"
              className="w-12 h-12 p-0 border-2 hover:bg-cyan-500 hover:text-white hover:border-cyan-500 transition-all duration-300 hover:scale-110 hover:shadow-lg"
            >
              <span className="text-xl">{theme === "dark" ? "☀️" : "🌙"}</span>
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden w-12 h-12 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="text-xl">☰</span>
            </Button>

            {/* User Actions - Better Spacing */}
            {user && (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {user?.username?.charAt(0).toUpperCase() ||
                        user?.email?.charAt(0).toUpperCase() ||
                        "U"}
                    </span>
                  </div>
                  <span
                    className={`font-medium ${
                      isDark ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {user?.username || "User"}
                  </span>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  size="sm"
                  className="px-6 py-3 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Logout
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
