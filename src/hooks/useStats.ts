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
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function computeStreak(history: HistoryEntry[]): number {
  if (history.length === 0) return 0;

  const completedDates = history
    .filter((h) => h.completed)
    .map((h) => {
      const d = new Date(h.date);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    });

  const uniqueDates = [...new Set(completedDates)].sort((a, b) => b - a);

  if (uniqueDates.length === 0) return 0;

  let streak = 1;
  const DAY = 86400000;

  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const diff = uniqueDates[i] - uniqueDates[i + 1];

    if (diff === DAY) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

function weeklyProgress(history: HistoryEntry[]) {
  try {
    const raw = localStorage.getItem('sthairya_onboarding');
    const parsed = raw ? JSON.parse(raw) : null;

    const target = Number(parsed?.weekly_target) || 4;

    const now = new Date();

    const startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);

    const day = startOfWeek.getDay();
    startOfWeek.setDate(
      startOfWeek.getDate() - (day === 0 ? 6 : day - 1)
    );

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

    rescued: history.filter(
      (h) => h.is_rescue && h.completed
    ).length,

    totalCompleted: history.filter(
      (h) => h.completed
    ).length,

    totalMinutes: history.reduce(
      (acc, h) => acc + (h.completed ? h.duration : 0),
      0
    ),

    weeklyDone: done,

    weeklyTarget: target,
  };
}

export function saveCompletedWorkout(entry: HistoryEntry) {
  try {
    const existing = readHistory();

    existing.unshift(entry);

    localStorage.setItem(
      'sthairya_history',
      JSON.stringify(existing)
    );

    window.dispatchEvent(new Event('storage'));
  } catch (err) {
    console.error('Failed to save workout history', err);
  }
}

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>(computeStats);

  const refresh = useCallback(() => {
    setStats(computeStats());
  }, []);

  useEffect(() => {
    window.addEventListener('storage', refresh);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);

    refresh();

    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [refresh]);

  return stats;
}
