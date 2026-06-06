import { useState, useEffect, useCallback } from 'react';

export interface HistoryEntry {
  date: string;
  goal: string;
  plan_title: string;
  completed: boolean;
  duration: number;
  mood: string;
  is_rescue: boolean;
  note: string;
}

function readHistory(): HistoryEntry[] {
  try {
    const raw = localStorage.getItem('sthairya_history');
    return raw ? (JSON.parse(raw) as HistoryEntry[]) : [];
  } catch {
    return [];
  }
}

function computeStreak(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Collect unique completed workout dates as day timestamps
  const completedDays = new Set(
    history
      .filter((h) => h.completed)
      .map((h) => {
        const d = new Date(h.date);
        d.setHours(0, 0, 0, 0);
        return d.getTime();
      })
  );

  let streak = 0;
  let cursor = today.getTime();
  const DAY = 86400000;

  while (completedDays.has(cursor) || completedDays.has(cursor - DAY)) {
    if (completedDays.has(cursor)) {
      streak++;
      cursor -= DAY;
    } else {
      // allow one uncounted day for "today not yet done"
      cursor -= DAY;
    }
    if (!completedDays.has(cursor) && !completedDays.has(cursor - DAY)) break;
  }

  return streak;
}

function weeklyProgress(history: HistoryEntry[]): { done: number; target: number } {
  try {
    const raw = localStorage.getItem('sthairya_onboarding');
    const parsed = raw ? JSON.parse(raw) : null;
    const target = Number(parsed?.weekly_target) || 4;

    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    const day = startOfWeek.getDay();
    startOfWeek.setDate(startOfWeek.getDate() - (day === 0 ? 6 : day - 1)); // Monday start

    const done = history.filter((h) => {
      const d = new Date(h.date);
      return h.completed && d >= startOfWeek;
    }).length;

    return { done, target };
  } catch {
    return { done: 0, target: 4 };
  }
}

export interface Stats {
  history: HistoryEntry[];
  streak: number;
  rescued: number;
  totalCompleted: number;
  totalMinutes: number;
  weeklyDone: number;
  weeklyTarget: number;
}

function computeStats(): Stats {
  const history = readHistory();
  const { done, target } = weeklyProgress(history);
  return {
    history,
    streak: computeStreak(history),
    rescued: history.filter((h) => h.is_rescue && h.completed).length,
    totalCompleted: history.filter((h) => h.completed).length,
    totalMinutes: history.reduce((acc, h) => acc + (h.completed ? h.duration : 0), 0),
    weeklyDone: done,
    weeklyTarget: target,
  };
}

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>(computeStats);

  const refresh = useCallback(() => setStats(computeStats()), []);

  useEffect(() => {
    // Re-compute when another tab writes to localStorage
    window.addEventListener('storage', refresh);
    // Re-compute when user returns to this tab
    window.addEventListener('focus', refresh);
    // Re-compute when tab becomes visible (e.g. back from /plan)
    document.addEventListener('visibilitychange', refresh);

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refresh]);

  return stats;
}
