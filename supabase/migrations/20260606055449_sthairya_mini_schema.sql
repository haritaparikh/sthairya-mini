/*
# Sthairya Mini — Initial Schema

## Summary
Creates the core tables for the Sthairya Mini habit rescue app.

## New Tables

### checkins
Stores each user check-in session capturing mood, time available, and goal.
- id (uuid, pk)
- user_id (uuid, fk → auth.users, not null, defaults to auth.uid())
- mood (text) — e.g. "Low energy", "Stressed"
- time_available (text) — e.g. "5 minutes"
- rescue_goal (text) — e.g. "Fitness", "Meditation"
- created_at (timestamptz)

### rescue_plans
Stores generated rescue plans linked to a check-in.
- id (uuid, pk)
- user_id (uuid, fk → auth.users, not null, defaults to auth.uid())
- checkin_id (uuid, fk → checkins)
- title (text)
- motivational_message (text)
- steps (jsonb) — array of step strings
- duration_minutes (integer)
- completed (boolean, default false)
- completed_at (timestamptz)
- post_feeling (text) — how user felt after
- created_at (timestamptz)

## Security
- RLS enabled on all tables.
- 4 separate per-verb policies per table (select/insert/update/delete) scoped to authenticated users by user_id.
*/

-- checkins
CREATE TABLE IF NOT EXISTS checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  mood text NOT NULL,
  time_available text NOT NULL,
  rescue_goal text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_checkins" ON checkins;
CREATE POLICY "select_own_checkins" ON checkins FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_checkins" ON checkins;
CREATE POLICY "insert_own_checkins" ON checkins FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_checkins" ON checkins;
CREATE POLICY "update_own_checkins" ON checkins FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_checkins" ON checkins;
CREATE POLICY "delete_own_checkins" ON checkins FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- rescue_plans
CREATE TABLE IF NOT EXISTS rescue_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  checkin_id uuid REFERENCES checkins(id) ON DELETE SET NULL,
  title text NOT NULL,
  motivational_message text NOT NULL,
  steps jsonb NOT NULL DEFAULT '[]',
  duration_minutes integer NOT NULL DEFAULT 5,
  completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  post_feeling text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE rescue_plans ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_plans" ON rescue_plans;
CREATE POLICY "select_own_plans" ON rescue_plans FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_plans" ON rescue_plans;
CREATE POLICY "insert_own_plans" ON rescue_plans FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_plans" ON rescue_plans;
CREATE POLICY "update_own_plans" ON rescue_plans FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_plans" ON rescue_plans;
CREATE POLICY "delete_own_plans" ON rescue_plans FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- index for fast dashboard queries
CREATE INDEX IF NOT EXISTS idx_checkins_user_created ON checkins(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plans_user_created ON rescue_plans(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_plans_user_completed ON rescue_plans(user_id, completed);
