// context/ThemeContext.jsx
import { createContext, useEffect, useState } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light"); // default = light

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

    // Apply theme to body and html for Tailwind dark mode
    useEffect(() => {
      const html = document.documentElement;
      const body = document.body;
      
      // Set data-theme attribute (for custom theming)
      body.setAttribute("data-theme", theme);
      
      // Set/remove dark class on html for Tailwind
      if (theme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }, [theme]);
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
