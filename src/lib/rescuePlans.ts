import type { RescuePlan } from '../lib/supabase';

type CheckinInput = {
  mood: string;
  timeAvailable: string;
  rescueGoal: string;
};

type PlanTemplate = {
  title: string;
  motivational_message: string;
  steps: string[];
};

const PLANS: Record<string, Record<string, PlanTemplate[]>> = {
  Fitness: {
    '2 minutes': [
      {
        title: '2-Minute Body Activation',
        motivational_message: 'Two minutes is enough. Your body remembers what to do.',
        steps: ['Stand up and take 5 deep breaths', '20 jumping jacks to wake up', '10 bodyweight squats'],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Movement Reset',
        motivational_message: 'Five minutes of movement beats zero. This is your win.',
        steps: ['1 min: gentle neck and shoulder rolls', '1 min: 20 jumping jacks', '1 min: 10 push-ups (knees ok)', '1 min: 15 squats', '1 min: slow walking and deep breathing'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute Full Body Rescue',
        motivational_message: "You came back. That's the hardest part.",
        steps: ['2 min: warm up — arm circles & hip rolls', '2 min: 20 squats + 10 lunges', '2 min: 15 push-ups + 20 mountain climbers', '2 min: plank hold — 3 × 30 seconds', '2 min: cool down stretches'],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Strength Rescue',
        motivational_message: "This session proves you haven't quit. Powerful.",
        steps: ['3 min: warm up jog in place + dynamic stretches', '4 min: 3 rounds of 15 squats + 10 push-ups', '4 min: 3 rounds of lunges × 12 + plank 30s', '4 min: 20 burpees at your own pace', '3 min: ab work — crunches, leg raises', '2 min: full cool-down stretch'],
      },
    ],
  },
  Meditation: {
    '2 minutes': [
      {
        title: '2-Minute Breath Reset',
        motivational_message: 'Two conscious breaths change everything.',
        steps: ["Sit comfortably, close your eyes", "Breathe in for 4 counts, hold for 4, out for 4", "Repeat 6 times — that's your practice"],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Calm Anchor',
        motivational_message: 'Stillness is a skill you never lose.',
        steps: ['Sit still, eyes closed, hands on knees', '1 min: breathe naturally, observe without changing', '2 min: box breathing — in 4, hold 4, out 4, hold 4', '1 min: body scan from head to feet', '1 min: set one intention for the day'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute Mindful Reset',
        motivational_message: 'Your mind is quieter than you think.',
        steps: ['1 min: settle in, gentle closed-eye focus', '3 min: follow the natural breath, no control needed', '3 min: body scan — observe each area without judgment', '2 min: loving-kindness — send goodwill to yourself', '1 min: gratitude — name 3 things silently'],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Deep Meditation',
        motivational_message: 'This is your most powerful act of self-care today.',
        steps: ['2 min: grounding — feel feet on floor, spine tall', '5 min: pranayama breathing (4-7-8 pattern)', '8 min: open awareness — thoughts as clouds passing', '3 min: visualization — imagine your best self', '2 min: slow return — wiggle fingers, open eyes gently'],
      },
    ],
  },
  'Weight loss': {
    '2 minutes': [
      {
        title: '2-Minute Metabolism Spark',
        motivational_message: 'Every movement counts on the journey.',
        steps: ['30 jumping jacks', '20 high knees', '10 burpee-lite — squat then stand fast'],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Fat Burn Ignition',
        motivational_message: "Consistency beats perfection. You're here.",
        steps: ['1 min: jumping jacks', '1 min: high knees', '1 min: butt kicks', '1 min: squat jumps (or regular squats)', '1 min: rest and mindful breathing'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute HIIT Rescue',
        motivational_message: 'Short but real. This is enough.',
        steps: ['2 min: warm up — march in place', '1 min: jumping jacks', '1 min: burpees (modify as needed)', '1 min: squat jumps', '1 min: mountain climbers', '1 min: high knees', '1 min: push-ups', '2 min: cool down walk + stretch'],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Cardio + Core Rescue',
        motivational_message: "This session closes the gap. You're back.",
        steps: ['3 min: brisk warm-up jog', '3 min: 3 rounds of 30s burpees + 30s rest', '3 min: 3 rounds of 40 high knees + 20 mountain climbers', '3 min: jump rope (or invisible rope)', '4 min: core — planks, crunches, leg raises', '4 min: cool-down walk + full stretch'],
      },
    ],
  },
  Strength: {
    '2 minutes': [
      {
        title: '2-Minute Strength Activation',
        motivational_message: 'Your muscles remember you. Wake them up.',
        steps: ['10 push-ups (knees ok)', '15 bodyweight squats', '10 tricep dips on a chair'],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Strength Rescue',
        motivational_message: "Showing up when it's hard is the real rep.",
        steps: ['1 min: 15 push-ups', '1 min: 20 squats', '1 min: 15 tricep dips', '1 min: 10 pike push-ups', '1 min: wall sit hold'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute Bodyweight Strength',
        motivational_message: "No gym needed. Your body is enough.",
        steps: ['2 min: warm up — arm circles, hip swings', '2 min: 3 sets × 10 push-ups', '2 min: 3 sets × 15 squats + 10 lunges', '2 min: 3 sets × plank 30s + 15 glute bridges', '2 min: cool-down stretch'],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Strength Builder',
        motivational_message: 'You came to build. This is your foundation.',
        steps: ['3 min: dynamic warm-up', '4 min: push circuit — push-ups, diamond, wide-grip', '4 min: pull circuit — rows with resistance/backpack', '4 min: leg circuit — squats, lunges, single-leg', '3 min: core work — plank, hollow hold, crunches', '2 min: cool-down and breathwork'],
      },
    ],
  },
  Flexibility: {
    '2 minutes': [
      {
        title: '2-Minute Tension Release',
        motivational_message: 'Release the tightness. Your body will thank you.',
        steps: ['30s: neck side stretches each side', '30s: shoulder cross-body stretch each side', '1 min: seated forward fold, breathe deeply'],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Flexibility Rescue',
        motivational_message: 'Flexibility is patience made physical.',
        steps: ['1 min: neck and shoulder rolls', '1 min: chest opener + hip circles', '1 min: seated hamstring stretch', '1 min: pigeon pose or figure-4', '1 min: spinal twist each side'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute Full Body Stretch',
        motivational_message: 'This is active recovery. Every stretch counts.',
        steps: ['1 min: neck and shoulder release', '1 min: chest + thoracic opening', '2 min: hip flexor + quad stretch', '2 min: hamstring + calf stretch', '2 min: pigeon pose or hip opener', '2 min: spinal twists + child pose'],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Yoga-Style Rescue',
        motivational_message: 'Slow is a superpower. This practice restores you.',
        steps: ['2 min: breathing + body awareness', '3 min: sun salutation × 3 slow rounds', '3 min: warrior sequence — 1, 2, triangle', '4 min: deep hip work — pigeon, frog, butterfly', '4 min: forward folds and spinal lengthening', '4 min: savasana — full body relaxation'],
      },
    ],
  },
  'Mental calm': {
    '2 minutes': [
      {
        title: '2-Minute Mind Reset',
        motivational_message: 'Two minutes of stillness can shift your entire day.',
        steps: ['Step outside or look out a window', 'Take 5 slow, deliberate breaths', 'Name 3 things you can see right now'],
      },
    ],
    '5 minutes': [
      {
        title: '5-Minute Stress Dissolve',
        motivational_message: 'Calm is not a destination. It lives right here.',
        steps: ['Sit or lie down comfortably', '1 min: breathe in calm, breathe out tension', '2 min: progressive muscle relax — tense + release each area', '1 min: visualize a peaceful place', '1 min: affirmation — "I am doing enough"'],
      },
    ],
    '10 minutes': [
      {
        title: '10-Minute Inner Calm Practice',
        motivational_message: "The mind settles when you let it. You're doing that now.",
        steps: ["2 min: walk slowly and breathe", "2 min: 4-7-8 breathing pattern", "3 min: journal — write what's on your mind (no filter)", "2 min: gratitude list — 5 small things", "1 min: close eyes, sit in quiet"],
      },
    ],
    '20 minutes': [
      {
        title: '20-Minute Mental Wellness Rescue',
        motivational_message: 'Investing in your mind is the highest return.',
        steps: ['3 min: gentle walk + conscious breathing', '4 min: stream-of-consciousness journaling', '4 min: guided self-compassion meditation', '4 min: read something uplifting or inspiring', '3 min: gratitude + positive affirmations', '2 min: breathe and set one gentle intention'],
      },
    ],
  },
};

const DURATION_MAP: Record<string, number> = {
  '2 minutes': 2,
  '5 minutes': 5,
  '10 minutes': 10,
  '20 minutes': 20,
};

export function generateRescuePlan(input: CheckinInput): Omit<RescuePlan, 'id' | 'user_id' | 'checkin_id' | 'completed' | 'completed_at' | 'post_feeling' | 'created_at'> {
  const goalPlans = PLANS[input.rescueGoal] ?? PLANS['Fitness'];
  const timePlans = goalPlans[input.timeAvailable] ?? goalPlans['5 minutes'];
  const template = timePlans[0];

  // Mood-specific motivational adjustments
  const moodPrefixes: Record<string, string> = {
    'Low energy': 'Even at low energy, you showed up. ',
    Stressed: 'Breathe first. Then move. ',
    Busy: 'Short and powerful — exactly what you need. ',
    Travelling: "You're keeping the habit alive on the road. ",
    'Sore body': 'Listen to your body. Gentle is still progress. ',
    'Missed workout': "Missing one doesn't mean failing. Today you rescue. ",
    'Feeling guilty': 'Release the guilt. This moment is your fresh start. ',
    'Good and ready': "You're ready and that energy shows. ",
  };

  const prefix = moodPrefixes[input.mood] ?? '';
  const motivational_message = prefix + template.motivational_message;

  return {
    plan_title: template.title,
    motivational_message,
    steps: template.steps,
    duration_minutes: DURATION_MAP[input.timeAvailable] ?? 5,
  };
}
