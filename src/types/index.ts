export type FitnessGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'run_5km'
  | 'improve_stamina'
  | 'stay_consistent'
  | 'improve_flexibility'
  | 'restart_fitness'
  | 'general_fitness';

export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';

export type WorkoutPreference = 'strength' | 'cardio' | 'yoga' | 'mobility' | 'mixed';

export type Equipment = 'none' | 'dumbbells' | 'gym' | 'resistance_band';

export type Mood =
  | 'energized'
  | 'tired'
  | 'busy'
  | 'sore'
  | 'stressed'
  | 'travelling'
  | 'no_gym'
  | 'missed_yesterday'
  | 'low_motivation';

export type TimeAvailable = 5 | 10 | 20 | 30 | 45;

export interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  current_weight: number;
  target_weight: number;
  fitness_goal: FitnessGoal;
  fitness_level: FitnessLevel;
  weekly_workout_target: number;
  daily_time_available: number;
  equipment: Equipment;
  workout_preference: WorkoutPreference;
  motivation_reason: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  title: string;
  duration: number;
  intensity: string;
  warmup: string[];
  main_workout: string[];
  cooldown: string[];
  why_this_works: string;
  motivation: string;
  is_rescue: boolean;
  completed: boolean;
  created_at: string;
}

export interface DailyCheckIn {
  id: string;
  user_id: string;
  mood: Mood;
  time_available: TimeAvailable;
  note: string;
  is_rescue: boolean;
  created_at: string;
}

export const FITNESS_GOALS: { value: FitnessGoal; label: string; icon: string }[] = [
  { value: 'lose_weight', label: 'Lose Weight', icon: 'Flame' },
  { value: 'build_muscle', label: 'Build Muscle', icon: 'Dumbbell' },
  { value: 'run_5km', label: 'Run 5km', icon: 'Timer' },
  { value: 'improve_stamina', label: 'Improve Stamina', icon: 'Heart' },
  { value: 'stay_consistent', label: 'Stay Consistent', icon: 'CalendarCheck' },
  { value: 'improve_flexibility', label: 'Improve Flexibility', icon: 'Stretch' },
  { value: 'restart_fitness', label: 'Restart Fitness', icon: 'RotateCcw' },
  { value: 'general_fitness', label: 'General Fitness', icon: 'Activity' },
];

export const MOODS: { value: Mood; label: string; isRescue: boolean }[] = [
  { value: 'energized', label: 'Energized', isRescue: false },
  { value: 'tired', label: 'Tired', isRescue: true },
  { value: 'busy', label: 'Busy', isRescue: true },
  { value: 'sore', label: 'Sore', isRescue: true },
  { value: 'stressed', label: 'Stressed', isRescue: true },
  { value: 'travelling', label: 'Travelling', isRescue: true },
  { value: 'no_gym', label: 'No Gym Access', isRescue: true },
  { value: 'missed_yesterday', label: 'Missed Yesterday', isRescue: true },
  { value: 'low_motivation', label: 'Low Motivation', isRescue: true },
];

export const RESCUE_MOODS: Mood[] = [
  'tired', 'busy', 'sore', 'stressed', 'travelling', 'no_gym', 'missed_yesterday', 'low_motivation',
];

export const TIME_OPTIONS: TimeAvailable[] = [5, 10, 20, 30, 45];

export const FITNESS_LEVELS: { value: FitnessLevel; label: string }[] = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
];

export const WORKOUT_PREFERENCES: { value: WorkoutPreference; label: string }[] = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'yoga', label: 'Yoga' },
  { value: 'mobility', label: 'Mobility' },
  { value: 'mixed', label: 'Mixed' },
];

export const EQUIPMENT_OPTIONS: { value: Equipment; label: string }[] = [
  { value: 'none', label: 'None' },
  { value: 'dumbbells', label: 'Dumbbells' },
  { value: 'gym', label: 'Gym' },
  { value: 'resistance_band', label: 'Resistance Band' },
];

export const WEEKLY_TARGETS = [3, 4, 5, 6];
export const DAILY_TIMES = [10, 20, 30, 45];

export const GOAL_LABELS: Record<FitnessGoal, string> = {
  lose_weight: 'Lose Weight',
  build_muscle: 'Build Muscle',
  run_5km: 'Run 5km',
  improve_stamina: 'Improve Stamina',
  stay_consistent: 'Stay Consistent',
  improve_flexibility: 'Improve Flexibility',
  restart_fitness: 'Restart Fitness',
  general_fitness: 'General Fitness',
};
