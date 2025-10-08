import { NavLink } from "react-router-dom";
import { useContext, useState, useCallback } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { Button } from "../UI/button";

export default function Sidebar() {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Optimize toggle function
  const toggleSidebar = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: "📊", desc: "Your analytics hub" },
    { to: "/settings", label: "Settings", icon: "⚙️", desc: "Customize experience" },
    { to: "/history", label: "History", icon: "📚", desc: "Past insights" },
    { to: "/about", label: "About", icon: "ℹ️", desc: "Learn more" }
  ];

  return (
    <aside className={`hidden lg:flex flex-col h-screen sticky top-0 backdrop-blur-md border-r transition-all duration-500 ease-in-out ${
      isCollapsed
        ? "w-20"
        : "w-80"
    } ${
      isDark ? "bg-gray-900/95 border-gray-700" : "bg-white/95 border-gray-200"
    }`}>
      {/* Header - Optimized */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className={`flex items-center justify-between ${isCollapsed ? "flex-col space-y-4" : "space-x-3"}`}>
          <div className={`flex items-center ${isCollapsed ? "flex-col space-y-2" : "space-x-3"}`}>
            <div className={`${isCollapsed ? "w-8 h-8" : "w-12 h-12"} bg-gradient-to-br from-cyan-400 via-pink-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse transition-all duration-300`}>
              <span className={`text-white font-black ${isCollapsed ? "text-sm" : "text-xl"} transition-all duration-300`}>Z</span>
            </div>
            {!isCollapsed && (
              <div className="transition-opacity duration-300">
                <h2 className="text-xl font-black bg-gradient-to-r from-cyan-400 via-pink-400 to-blue-500 bg-clip-text text-transparent">
                  ZenPulse
                </h2>
                <p className="text-xs text-muted-foreground">AI Wellness Assistant</p>
              </div>
            )}
          </div>

          {/* Toggle Button - Optimized */}
          <Button
            onClick={toggleSidebar}
            variant="outline"
            size="sm"
            className={`w-8 h-8 p-0 border-2 transition-all duration-300 ${
              isDark 
                ? "border-gray-600 hover:border-cyan-400 hover:bg-cyan-500/20" 
                : "border-gray-300 hover:border-cyan-500 hover:bg-cyan-500/20"
            }`}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <span className={`text-sm transition-transform duration-300 ${
              isCollapsed ? "rotate-180" : ""
            }`}>
              ‹
            </span>
          </Button>
        </div>
      </div>

      {/* Navigation - Optimized */}
      <nav className="flex-1 p-6 space-y-3">
        {navItems.map(({ to, label, icon, desc }) => (
          <NavLink
            key={to}
            to={to}
            title={isCollapsed ? label : ""}
            className={({ isActive }) =>
              `group flex items-center ${isCollapsed ? "justify-center" : "space-x-4"} p-4 rounded-2xl transition-all duration-300 ease-out hover:scale-[1.02] ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg"
                  : `hover:bg-gray-100 dark:hover:bg-gray-800 border border-transparent hover:border-gray-200 dark:hover:border-gray-700`
              }`
            }
          >
            <div className={`text-2xl transition-transform duration-300 ${
              ({ isActive }) => isActive ? "scale-110" : "group-hover:scale-110"
            }`}>
              {icon}
            </div>
            {!isCollapsed && (
              <div className="flex-1 transition-opacity duration-300">
                <div className={`font-semibold transition-colors duration-300 ${
                  ({ isActive }) => isActive
                    ? "text-cyan-500 dark:text-cyan-400"
                    : isDark ? "text-gray-300" : "text-gray-700"
                }`}>
                  {label}
                </div>
                <div className="text-xs text-muted-foreground">{desc}</div>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer - Optimized */}
      <div className="p-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className={`text-center ${isCollapsed ? "px-0" : ""}`}>
          <div className={`bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
            isCollapsed ? "w-8 h-8" : "w-16 h-16"
          }`}>
            <span className={`${isCollapsed ? "text-lg" : "text-2xl"} transition-all duration-300`}>🤖</span>
          </div>
          {!isCollapsed && (
            <div className="transition-opacity duration-300">
              <p className="text-sm font-medium text-muted-foreground">AI-Powered Wellness</p>
              <p className="text-xs text-muted-foreground mt-1">Real-time insights</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}