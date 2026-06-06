import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL  as string;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession:    true,
    autoRefreshToken:  true,
    detectSessionInUrl: true,
    storageKey:        'sthairya-auth',
    storage:           typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});

export type Checkin = {
  id: string;
  user_id: string;
  mood: string;
  time_available: string;
  rescue_goal: string;
  created_at: string;
};

export type RescuePlan = {
  id: string;
  user_id: string;
  checkin_id: string | null;
  title: string;
  motivational_message: string;
  steps: string[];
  duration_minutes: number;
  completed: boolean;
  completed_at: string | null;
  post_feeling: string | null;
  created_at: string;
};
