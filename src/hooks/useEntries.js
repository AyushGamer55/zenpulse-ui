import { useState, useEffect } from "react";
import client from "../api/client";

export const useEntries = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await client.get("/entries");
      setEntries(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const addOrUpdateEntry = async (entryData) => {
    try {
      const res = await client.post("/entries", entryData);
      // replace today's entry
      const updated = entries.filter(
        (e) => e.entry_date !== res.data.entry_date
      );
      setEntries([res.data, ...updated]);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // ⭐ NEW: Auto-update mood function
  const autoUpdateMood = async (mood) => {
    try {
      const res = await client.post("/entries/auto-mood", { mood });
      // Update local entries state
      const updated = entries.filter(e => e.entry_date !== res.data.entry_date);
      setEntries([res.data, ...updated]);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const fetchStats = async () => {
    try {
      const res = await client.get("/entries/stats");
      return res.data; // { burnoutRisk, entries }
    } catch (err) {
      setError(err);
    }
  };

  const fetchWeeklySummary = async () => {
    try {
      const res = await client.get("/entries/summary");
      return res.data.summary; // string
    } catch (err) {
      setError(err);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  return {
    entries,
    addOrUpdateEntry,
    autoUpdateMood,  // ⭐ NEW: Auto-update function
    fetchEntries,
    fetchStats,
    fetchWeeklySummary,
    loading,
    error,
  };
};
