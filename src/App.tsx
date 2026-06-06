import { useState, useCallback } from 'react';
import { useAuth } from './contexts/AuthContext';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CheckinPage from './pages/CheckinPage';
import RescuePlanPage from './pages/RescuePlanPage';
import CompletionPage from './pages/CompletionPage';
import DashboardPage from './pages/DashboardPage';

import BottomNav from './components/BottomNav';

import { supabase } from './lib/supabase';
import { generateRescuePlan } from './lib/rescuePlans';

import type { RescuePlan } from './lib/supabase';

type Page = 'home' | 'rescue' | 'dashboard';
type Flow = 'checkin' | 'plan' | 'completion' | null;

export default function App() {
  const { user, loading } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [page, setPage] = useState<Page>('home');
  const [flow, setFlow] = useState<Flow>(null);

  const [currentPlan, setCurrentPlan] = useState<RescuePlan | null>(null);
  const [postFeeling, setPostFeeling] = useState('');
  const [totalRescued, setTotalRescued] = useState(0);

  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [planError, setPlanError] = useState('');

  const startRescue = useCallback(() => {
    setCurrentPlan(null);
    setPlanError('');
    setFlow('checkin');
    setPage('rescue');
  }, []);

  const handleNavChange = useCallback((p: Page) => {
    setPage(p);

    if (p === 'rescue') {
      setCurrentPlan(null);
      setPlanError('');
      setFlow('checkin');
    } else {
      setFlow(null);
    }
  }, []);

  const handleGeneratePlan = useCallback(
    async (data: {
      mood: string;
      timeAvailable: string;
      rescueGoal: string;
    }) => {
      setGeneratingPlan(true);
      setPlanError('');

      try {
        // Create check-in
        const { data: checkin, error: checkinErr } = await supabase
          .from('check_ins')
          .insert({
            mood: data.mood,
            time_available: data.timeAvailable,
            rescue_goal: data.rescueGoal,
          })
          .select()
          .single();

        if (checkinErr) {
          console.log('CHECKIN ERROR:', checkinErr);
          throw checkinErr;
        }

        // Generate plan locally
        const planData = generateRescuePlan(data);

        // Save rescue plan
        const { data: plan, error: planErr } = await supabase
          .from('rescue_plans')
          .insert({
            ...planData,
            checkin_id: checkin.id,
          })
          .select()
          .single();

        if (planErr) {
          console.log('PLAN ERROR:', planErr);
          throw planErr;
        }

        setCurrentPlan(plan);
        setFlow('plan');
      } catch (err) {
        console.error(err);

        setPlanError(
          err instanceof Error
            ? err.message
            : 'Failed to generate plan. Please try again.'
        );
      } finally {
        setGeneratingPlan(false);
      }
    },
    []
  );

  const handlePlanComplete = useCallback(
    async (feeling: string) => {
      if (!currentPlan) return;

      try {
        const { error } = await supabase
          .from('rescue_plans')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
            post_feeling: feeling,
          })
          .eq('id', currentPlan.id);

        if (error) {
          console.log('UPDATE ERROR:', error);
          throw error;
        }

        const { count } = await supabase
          .from('rescue_plans')
          .select('id', { count: 'exact', head: true })
          .eq('completed', true);

        setPostFeeling(feeling);
        setTotalRescued(count ?? 0);
      } catch (err) {
        console.error(err);

        setPostFeeling(feeling);
        setTotalRescued(0);
      }

      setFlow('completion');
    },
    [currentPlan]
  );

  const handleGoHome = useCallback(() => {
    setPage('home');
    setFlow(null);
    setCurrentPlan(null);
    setPlanError('');
  }, []);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-charcoal-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-charcoal-800 border-t-gold-500 rounded-full animate-spin" />
      </div>
    );
  }

  // Logged out
  if (!user) {
    if (showAuth) {
      return (
        <AuthPage
          onBack={() => setShowAuth(false)}
          onSuccess={() => setShowAuth(false)}
        />
      );
    }

    return <LandingPage onGetStarted={() => setShowAuth(true)} />;
  }

  // Completion page
  if (flow === 'completion') {
    return (
      <CompletionPage
        postFeeling={postFeeling}
        streakCount={totalRescued}
        onGoHome={handleGoHome}
      />
    );
  }

  // Rescue check-in flow
  if (page === 'rescue' && flow === 'checkin') {
    return (
      <>
        {planError && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4">
            <div className="bg-red-900/90 border border-red-700/50 text-red-200 text-sm rounded-2xl px-4 py-3 text-center backdrop-blur-sm">
              {planError}
            </div>
          </div>
        )}

        <CheckinPage
          loading={generatingPlan}
          onGenerate={handleGeneratePlan}
        />

        <BottomNav current={page} onChange={handleNavChange} />
      </>
    );
  }

  // Rescue plan page
  if (page === 'rescue' && flow === 'plan' && currentPlan) {
    return (
      <>
        <RescuePlanPage
          plan={currentPlan}
          onComplete={handlePlanComplete}
        />

        <BottomNav current={page} onChange={handleNavChange} />
      </>
    );
  }

  // Main app pages
  return (
    <>
      {page === 'home' && (
        <HomePage onRescue={startRescue} />
      )}

      {page === 'rescue' && (
        <CheckinPage
          loading={generatingPlan}
          onGenerate={handleGeneratePlan}
        />
      )}

      {page === 'dashboard' && (
        <DashboardPage onRescue={startRescue} />
      )}

      <BottomNav current={page} onChange={handleNavChange} />
    </>
  );
}
