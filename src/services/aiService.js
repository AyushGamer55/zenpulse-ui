// src/services/aiService.js
export const detectBurnout = (entries) => {
  let streak = 0;
  let burnoutDays = [];

  // sort entries by date ascending
  const sorted = [...entries].sort((a, b) => new Date(a.entry_date) - new Date(b.entry_date));

  for (let e of sorted) {
    if (e.mood <= 2) {
      streak++;
      burnoutDays.push(e.entry_date);
    } else {
      streak = 0;
      burnoutDays = [];
    }
    if (streak >= 3) return { risk: true, streakDays: burnoutDays };
  }
  return { risk: false, streakDays: [] };
};
 
