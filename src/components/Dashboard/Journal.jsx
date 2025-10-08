import { useState, useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { useEntries } from "../../hooks/useEntries";
import { Button } from "../UI/button";

export default function Journal() {
  const [text, setText] = useState("");
  const { theme } = useContext(ThemeContext);
  const { addOrUpdateEntry } = useEntries();
  const isDark = theme === "dark";

  const handleSave = async () => {
    if (!text.trim()) return;
    
    try {
      // Save journal entry with current mood (or default to 3)
      await addOrUpdateEntry({ 
        journal: text.trim(),
        mood: 3 // Default neutral mood for journal-only entries
      });
      setText("");
      console.log("📝 Journal entry saved successfully");
    } catch (error) {
      console.error("❌ Failed to save journal entry:", error);
      alert("Failed to save journal entry. Please try again.");
    }
  };

  return (
    <div
      className={`p-6 rounded-2xl shadow-lg text-center ${
        isDark ? "bg-gray-900" : "bg-white"
      }`}
    >
      <h2
        className={`text-xl font-semibold mb-4 ${
          isDark
            ? "text-pink-400 drop-shadow-[0_0_6px_#ff00ff]"
            : "text-pink-600"
        }`}
      >
        📝 Journal Your Thoughts
      </h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your thoughts, feelings, or daily reflections..."
        className={`w-full h-32 p-3 rounded-lg border focus:ring-2 transition resize-none ${
          isDark
            ? "bg-gray-800 text-white border-pink-500 focus:ring-pink-400 placeholder-gray-400"
            : "bg-gray-50 text-black border-pink-300 focus:ring-pink-500 placeholder-gray-500"
        }`}
      />
      
      <Button
        onClick={handleSave}
        disabled={!text.trim()}
        className="mt-3 px-6 py-2 font-bold"
        variant={isDark ? "secondary" : "default"}
      >
        💾 Save Journal Entry
      </Button>
    </div>
  );
}