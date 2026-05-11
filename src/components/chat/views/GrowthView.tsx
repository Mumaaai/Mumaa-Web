import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ComposedChart
} from 'recharts';
import {
  Scale, Ruler, Activity, Plus, X, TrendingUp, TrendingDown,
  Minus, Info, BookOpen, ChevronRight, Calendar, Baby,
  AlertCircle, Sparkles, HeartPulse, BarChart3
} from 'lucide-react';
import { api } from '../../../api';

// ─── WHO Reference Data (0–24 months) ─────────────────────────────────────────
// Source: WHO Child Growth Standards (approximate p3, p50, p97 per month)
const WHO_WEIGHT: Record<string, { p3: number; p50: number; p97: number }[]> = {
  boy: [
    { p3: 2.5, p50: 3.3, p97: 4.3 }, { p3: 3.4, p50: 4.5, p97: 5.8 },
    { p3: 4.3, p50: 5.6, p97: 7.1 }, { p3: 4.9, p50: 6.4, p97: 8.0 },
    { p3: 5.4, p50: 7.0, p97: 8.7 }, { p3: 5.8, p50: 7.5, p97: 9.3 },
    { p3: 6.1, p50: 7.9, p97: 9.8 }, { p3: 6.4, p50: 8.3, p97: 10.2 },
    { p3: 6.7, p50: 8.6, p97: 10.5 }, { p3: 6.9, p50: 8.9, p97: 10.8 },
    { p3: 7.1, p50: 9.2, p97: 11.0 }, { p3: 7.3, p50: 9.4, p97: 11.3 },
    { p3: 7.5, p50: 9.6, p97: 11.5 }, { p3: 7.7, p50: 9.9, p97: 11.8 },
    { p3: 7.8, p50: 10.1, p97: 12.0 }, { p3: 7.9, p50: 10.3, p97: 12.2 },
    { p3: 8.1, p50: 10.5, p97: 12.5 }, { p3: 8.2, p50: 10.7, p97: 12.7 },
    { p3: 8.4, p50: 10.9, p97: 12.9 }, { p3: 8.5, p50: 11.1, p97: 13.1 },
    { p3: 8.6, p50: 11.3, p97: 13.3 }, { p3: 8.8, p50: 11.5, p97: 13.6 },
    { p3: 8.9, p50: 11.6, p97: 13.8 }, { p3: 9.0, p50: 11.8, p97: 14.0 },
    { p3: 9.1, p50: 12.0, p97: 14.2 },
  ],
  girl: [
    { p3: 2.4, p50: 3.2, p97: 4.2 }, { p3: 3.2, p50: 4.2, p97: 5.5 },
    { p3: 3.9, p50: 5.1, p97: 6.6 }, { p3: 4.5, p50: 5.8, p97: 7.5 },
    { p3: 4.9, p50: 6.4, p97: 8.1 }, { p3: 5.3, p50: 6.9, p97: 8.8 },
    { p3: 5.7, p50: 7.3, p97: 9.3 }, { p3: 6.0, p50: 7.6, p97: 9.8 },
    { p3: 6.3, p50: 7.9, p97: 10.2 }, { p3: 6.5, p50: 8.2, p97: 10.5 },
    { p3: 6.7, p50: 8.5, p97: 10.9 }, { p3: 6.9, p50: 8.7, p97: 11.2 },
    { p3: 7.1, p50: 8.9, p97: 11.5 }, { p3: 7.2, p50: 9.2, p97: 11.7 },
    { p3: 7.4, p50: 9.4, p97: 12.0 }, { p3: 7.6, p50: 9.6, p97: 12.2 },
    { p3: 7.7, p50: 9.8, p97: 12.5 }, { p3: 7.9, p50: 10.0, p97: 12.7 },
    { p3: 8.1, p50: 10.2, p97: 13.0 }, { p3: 8.2, p50: 10.4, p97: 13.2 },
    { p3: 8.4, p50: 10.6, p97: 13.4 }, { p3: 8.6, p50: 10.9, p97: 13.7 },
    { p3: 8.7, p50: 11.1, p97: 13.9 }, { p3: 8.9, p50: 11.3, p97: 14.2 },
    { p3: 9.0, p50: 11.5, p97: 14.5 },
  ],
};

const WHO_HEIGHT: Record<string, { p3: number; p50: number; p97: number }[]> = {
  boy: [
    { p3: 46.1, p50: 49.9, p97: 53.7 }, { p3: 50.8, p50: 54.7, p97: 58.6 },
    { p3: 54.4, p50: 58.4, p97: 62.4 }, { p3: 57.3, p50: 61.4, p97: 65.5 },
    { p3: 59.7, p50: 63.9, p97: 68.0 }, { p3: 61.7, p50: 65.9, p97: 70.1 },
    { p3: 63.3, p50: 67.6, p97: 71.9 }, { p3: 64.8, p50: 69.2, p97: 73.5 },
    { p3: 66.2, p50: 70.6, p97: 75.0 }, { p3: 67.5, p50: 72.0, p97: 76.5 },
    { p3: 68.7, p50: 73.3, p97: 77.9 }, { p3: 69.9, p50: 74.5, p97: 79.2 },
    { p3: 71.0, p50: 75.7, p97: 80.5 }, { p3: 72.1, p50: 76.9, p97: 81.8 },
    { p3: 73.1, p50: 78.0, p97: 83.0 }, { p3: 74.1, p50: 79.1, p97: 84.2 },
    { p3: 75.0, p50: 80.2, p97: 85.4 }, { p3: 76.0, p50: 81.2, p97: 86.5 },
    { p3: 76.9, p50: 82.3, p97: 87.7 }, { p3: 77.7, p50: 83.2, p97: 88.8 },
    { p3: 78.6, p50: 84.2, p97: 89.8 }, { p3: 79.4, p50: 85.1, p97: 90.9 },
    { p3: 80.2, p50: 86.0, p97: 91.9 }, { p3: 81.0, p50: 86.9, p97: 92.9 },
    { p3: 81.7, p50: 87.8, p97: 93.9 },
  ],
  girl: [
    { p3: 45.4, p50: 49.1, p97: 52.9 }, { p3: 49.8, p50: 53.7, p97: 57.6 },
    { p3: 53.0, p50: 57.1, p97: 61.1 }, { p3: 55.6, p50: 59.8, p97: 64.0 },
    { p3: 57.8, p50: 62.1, p97: 66.4 }, { p3: 59.6, p50: 64.0, p97: 68.5 },
    { p3: 61.2, p50: 65.7, p97: 70.3 }, { p3: 62.7, p50: 67.3, p97: 72.0 },
    { p3: 64.0, p50: 68.7, p97: 73.5 }, { p3: 65.3, p50: 70.1, p97: 75.0 },
    { p3: 66.5, p50: 71.5, p97: 76.4 }, { p3: 67.7, p50: 72.8, p97: 77.8 },
    { p3: 68.9, p50: 74.0, p97: 79.2 }, { p3: 70.0, p50: 75.2, p97: 80.5 },
    { p3: 71.0, p50: 76.4, p97: 81.7 }, { p3: 72.0, p50: 77.5, p97: 83.0 },
    { p3: 73.0, p50: 78.6, p97: 84.2 }, { p3: 74.0, p50: 79.7, p97: 85.4 },
    { p3: 74.9, p50: 80.7, p97: 86.5 }, { p3: 75.8, p50: 81.7, p97: 87.6 },
    { p3: 76.7, p50: 82.7, p97: 88.7 }, { p3: 77.5, p50: 83.7, p97: 89.8 },
    { p3: 78.4, p50: 84.6, p97: 90.8 }, { p3: 79.2, p50: 85.5, p97: 91.9 },
    { p3: 80.0, p50: 86.4, p97: 92.9 },
  ],
};

// ─── Reading materials ────────────────────────────────────────────────────────
const READING_MATERIALS = [
  {
    id: 1,
    tag: 'Growth 101',
    gradient: 'from-orange-50 to-amber-50',
    tagColor: 'text-orange-600 bg-orange-100',
    icon: '📈',
    title: 'Understanding Your Baby\'s Growth Curve',
    summary: 'Babies don\'t grow at the same rate — and that\'s completely normal. Learn how to read growth percentiles without panic.',
    readTime: '4 min',
    keyPoints: ['Percentiles show relative position, not a grade', 'Consistent curve matters more than the number', 'Brief plateaus are normal during illness or teething'],
  },
  {
    id: 2,
    tag: 'Nutrition',
    gradient: 'from-emerald-50 to-teal-50',
    tagColor: 'text-emerald-700 bg-emerald-100',
    icon: '🥛',
    title: 'Feeding for Optimal Growth',
    summary: 'How much is enough? Breast milk, formula, and first foods — a practical guide for the first year.',
    readTime: '5 min',
    keyPoints: ['Newborns feed 8–12 times per day', 'Growth spurts increase hunger temporarily', 'Solids complement — not replace — milk before 12 months'],
  },
  {
    id: 3,
    tag: 'WHO Standards',
    gradient: 'from-sky-50 to-blue-50',
    tagColor: 'text-sky-700 bg-sky-100',
    icon: '🌍',
    title: 'What the WHO Growth Charts Really Mean',
    summary: 'WHO standards were built on exclusively breastfed babies across 6 countries. Here\'s how they apply to your child.',
    readTime: '3 min',
    keyPoints: ['Built on 8,000+ healthy breastfed children', 'Show how children SHOULD grow, not just averages', 'Weight-for-length is the gold standard'],
  },
  {
    id: 4,
    tag: 'Sleep & Growth',
    gradient: 'from-violet-50 to-purple-50',
    tagColor: 'text-violet-700 bg-violet-100',
    icon: '🌙',
    title: 'Why Sleep Is Your Baby\'s Growth Hormone',
    summary: '80% of growth hormone is released during deep sleep. Healthy sleep habits are literally growing your baby.',
    readTime: '4 min',
    keyPoints: ['Newborns need 14–17 hours of sleep', 'Growth hormone peaks 1 hour after sleep onset', 'Consistent bedtime routines improve sleep quality'],
  },
  {
    id: 5,
    tag: 'When to Call',
    gradient: 'from-rose-50 to-pink-50',
    tagColor: 'text-rose-700 bg-rose-100',
    icon: '🩺',
    title: 'Signs That Warrant a Pediatrician Visit',
    summary: 'Most growth variation is normal. But a few specific patterns deserve professional attention — here\'s what to watch for.',
    readTime: '3 min',
    keyPoints: ['Weight loss beyond 10% in first week', 'Not regaining birth weight by 2 weeks', 'Dropping 2+ percentile channels over time'],
  },
  {
    id: 6,
    tag: 'Mama\'s Role',
    gradient: 'from-amber-50 to-yellow-50',
    tagColor: 'text-amber-700 bg-amber-100',
    icon: '💛',
    title: 'Your Stress Affects Baby\'s Growth',
    summary: 'Cortisol passes through breast milk and affects the hormonal environment. A calm mother is truly the best growth supplement.',
    readTime: '5 min',
    keyPoints: ['Skin-to-skin boosts oxytocin and growth hormones', 'Postpartum anxiety is common — seek support freely', 'Tracking is a tool, not a test of parenting'],
  },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface GrowthRecord {
  id: string;
  baby_id: string;
  weight_kg: number | null;
  height_cm: number | null;
  recorded_at: string;
}

interface Props {
  user?: any;
  babyProfile?: any;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ageInMonths = (dob: string, at: string) => {
  const birth = new Date(dob);
  const check = new Date(at);
  return Math.max(0, Math.round((check.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24 * 30.44)));
};

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

const getTrend = (values: number[]) => {
  if (values.length < 2) return 'stable';
  return values[values.length - 1] > values[values.length - 2] ? 'up' : values[values.length - 1] < values[values.length - 2] ? 'down' : 'stable';
};

const getPercentile = (
  value: number,
  month: number,
  type: 'weight' | 'height',
  gender: 'boy' | 'girl'
) => {
  const ref = (type === 'weight' ? WHO_WEIGHT : WHO_HEIGHT)[gender];
  const idx = Math.min(Math.max(month, 0), 24);
  const entry = ref[idx];
  if (!entry) return null;
  if (value < entry.p3) return 'Below 3rd';
  if (value > entry.p97) return 'Above 97th';
  if (value < entry.p50) {
    const pct = Math.round(3 + ((value - entry.p3) / (entry.p50 - entry.p3)) * 47);
    return `~${pct}th`;
  }
  const pct = Math.round(50 + ((value - entry.p50) / (entry.p97 - entry.p50)) * 47);
  return `~${pct}th`;
};

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white rounded-2xl border border-stone-100 shadow-xl p-3 min-w-[160px]">
      <p className="text-[11px] font-black uppercase tracking-widest text-stone-400 mb-2">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 text-sm">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="font-bold text-stone-700">{p.name}:</span>
          <span className="font-black text-stone-900">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Trend icon ──────────────────────────────────────────────────────────────
const TrendIcon = ({ trend }: { trend: string }) =>
  trend === 'up' ? <TrendingUp className="w-4 h-4 text-emerald-500" /> :
  trend === 'down' ? <TrendingDown className="w-4 h-4 text-rose-500" /> :
  <Minus className="w-4 h-4 text-stone-400" />;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function GrowthView({ user, babyProfile }: Props) {
  const [records, setRecords] = useState<GrowthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const [formData, setFormData] = useState({ weight_kg: '', height_cm: '', recorded_at: new Date().toISOString().split('T')[0] });
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const gender: 'boy' | 'girl' = babyProfile?.gender === 'female' ? 'girl' : 'boy';

  // ─── Fetch records ──────────────────────────────────────────────────────────
  const fetchRecords = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    try {
      const data = await api.get(`/growth/${user.id}`);
      if (Array.isArray(data)) {
        const sorted = [...data].sort((a, b) => new Date(a.recorded_at).getTime() - new Date(b.recorded_at).getTime());
        setRecords(sorted);
      }
    } catch (e) {
      console.error('Failed to fetch growth records', e);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  // ─── Computed stats ─────────────────────────────────────────────────────────
  const weights = records.filter(r => r.weight_kg != null).map(r => r.weight_kg as number);
  const heights = records.filter(r => r.height_cm != null).map(r => r.height_cm as number);

  const latestWeight = weights[weights.length - 1] ?? null;
  const latestHeight = heights[heights.length - 1] ?? null;

  const last7 = records.filter(r => {
    const d = new Date(r.recorded_at);
    const now = new Date();
    return (now.getTime() - d.getTime()) / 86400000 <= 7;
  });
  const weeklyWeights = last7.filter(r => r.weight_kg != null).map(r => r.weight_kg as number);
  const weeklyAvgWeight = weeklyWeights.length ? +(weeklyWeights.reduce((a, b) => a + b, 0) / weeklyWeights.length).toFixed(2) : null;

  const ageMonths = babyProfile?.date_of_birth
    ? ageInMonths(babyProfile.date_of_birth, new Date().toISOString())
    : 0;

  const weightPercentile = latestWeight ? getPercentile(latestWeight, ageMonths, 'weight', gender) : null;
  const heightPercentile = latestHeight ? getPercentile(latestHeight, ageMonths, 'height', gender) : null;

  const weightTrend = getTrend(weights.slice(-5));
  const heightTrend = getTrend(heights.slice(-5));

  // Growth velocity (g/day over last 2 records)
  const lastTwoWeights = records.filter(r => r.weight_kg != null).slice(-2);
  let growthVelocity: string | null = null;
  if (lastTwoWeights.length === 2) {
    const days = (new Date(lastTwoWeights[1].recorded_at).getTime() - new Date(lastTwoWeights[0].recorded_at).getTime()) / 86400000;
    const gPerDay = days > 0 ? ((lastTwoWeights[1].weight_kg! - lastTwoWeights[0].weight_kg!) * 1000 / days).toFixed(0) : null;
    if (gPerDay) growthVelocity = `${gPerDay} g/day`;
  }

  // ─── Chart data ─────────────────────────────────────────────────────────────
  const chartData = records.map(r => {
    const month = babyProfile?.date_of_birth ? ageInMonths(babyProfile.date_of_birth, r.recorded_at) : 0;
    const wRef = WHO_WEIGHT[gender][Math.min(month, 24)];
    const hRef = WHO_HEIGHT[gender][Math.min(month, 24)];
    return {
      date: formatDate(r.recorded_at),
      month,
      weight: r.weight_kg,
      height: r.height_cm,
      wP3: wRef?.p3,
      wP50: wRef?.p50,
      wP97: wRef?.p97,
      hP3: hRef?.p3,
      hP50: hRef?.p50,
      hP97: hRef?.p97,
    };
  });

  // WHO reference line data (0–ageMonths+3 scope)
  const whoRange = Array.from({ length: Math.min(ageMonths + 4, 25) }, (_, i) => ({
    month: `${i}m`,
    wP3: WHO_WEIGHT[gender][i]?.p3,
    wP50: WHO_WEIGHT[gender][i]?.p50,
    wP97: WHO_WEIGHT[gender][i]?.p97,
    hP3: WHO_HEIGHT[gender][i]?.p3,
    hP50: WHO_HEIGHT[gender][i]?.p50,
    hP97: WHO_HEIGHT[gender][i]?.p97,
    myWeight: null as number | null,
    myHeight: null as number | null,
  }));
  // Overlay baby data onto WHO range chart
  records.forEach(r => {
    const month = babyProfile?.date_of_birth ? ageInMonths(babyProfile.date_of_birth, r.recorded_at) : 0;
    if (whoRange[month]) {
      if (r.weight_kg) whoRange[month].myWeight = r.weight_kg;
      if (r.height_cm) whoRange[month].myHeight = r.height_cm;
    }
  });

  // ─── Save record ─────────────────────────────────────────────────────────────
  const handleSave = async () => {
    console.log('handleSave called', { user, formData });
    if (!user?.id) {
      console.warn('Cannot save: user.id is missing');
      return;
    }
    if (!formData.weight_kg && !formData.height_cm) {
      console.warn('Cannot save: weight and height are both empty');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        userId: user.id,
        weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
        height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
        recorded_at: new Date(formData.recorded_at).toISOString(),
      };
      console.log('Sending POST /growth', payload);
      const res = await api.post('/growth', payload);
      console.log('POST /growth response', res);
      setSaveSuccess(true);
      await fetchRecords();
      setTimeout(() => {
        setSaveSuccess(false);
        setIsModalOpen(false);
        setFormData({ weight_kg: '', height_cm: '', recorded_at: new Date().toISOString().split('T')[0] });
      }, 1200);
    } catch (e) {
      console.error('Failed to save record', e);
    } finally {
      setSaving(false);
    }
  };


  // ─── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-full overflow-y-auto bg-[#FFF8F3]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-24">

        {/* ── Page Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-7"
        >
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-black text-stone-800 tracking-tight">Growth Tracker</h1>
            </div>
            <p className="text-stone-500 text-sm font-semibold pl-11">
              {babyProfile?.name ? `Tracking ${babyProfile.name}'s journey` : 'Set up a baby profile to get started'}
              {ageMonths > 0 && <span className="text-orange-500"> · {ageMonths} months old</span>}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-orange-100 transition-all btn-press"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Log Today</span>
          </button>
        </motion.div>

        {/* ── Summary Stat Cards ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-3 gap-3 mb-7"
        >
          {/* Weekly Avg Weight */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <TrendIcon trend={weightTrend} />
            </div>
            <div className="text-2xl font-black text-stone-800 leading-none mb-1">
              {weeklyAvgWeight != null ? `${weeklyAvgWeight}` : '—'}
              <span className="text-sm font-bold text-stone-400 ml-1">kg</span>
            </div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Weekly Avg Weight</div>
            {weightPercentile && (
              <div className="mt-2 text-[11px] font-black text-emerald-600 bg-emerald-50 rounded-lg px-2 py-1 inline-block">
                {weightPercentile} %ile
              </div>
            )}
          </div>

          {/* Last Height */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                <Ruler className="w-4 h-4 text-sky-600" />
              </div>
              <TrendIcon trend={heightTrend} />
            </div>
            <div className="text-2xl font-black text-stone-800 leading-none mb-1">
              {latestHeight != null ? `${latestHeight}` : '—'}
              <span className="text-sm font-bold text-stone-400 ml-1">cm</span>
            </div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Last Height</div>
            {heightPercentile && (
              <div className="mt-2 text-[11px] font-black text-sky-600 bg-sky-50 rounded-lg px-2 py-1 inline-block">
                {heightPercentile} %ile
              </div>
            )}
          </div>

          {/* Growth Velocity / Combined */}
          <div className="bg-white rounded-2xl border border-stone-100 p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                <Activity className="w-4 h-4 text-violet-600" />
              </div>
              <HeartPulse className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-black text-stone-800 leading-none mb-1">
              {growthVelocity ? growthVelocity.split(' ')[0] : '—'}
              {growthVelocity && <span className="text-sm font-bold text-stone-400 ml-1">g/day</span>}
            </div>
            <div className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Growth Velocity</div>
            {growthVelocity ? (
              <div className="mt-2 text-[11px] font-black text-violet-600 bg-violet-50 rounded-lg px-2 py-1 inline-block">
                {parseFloat(growthVelocity) >= 15 ? 'On track ✓' : parseFloat(growthVelocity) >= 0 ? 'Moderate' : 'Check in'}
              </div>
            ) : (
              <div className="mt-2 text-[11px] font-bold text-stone-400 bg-stone-50 rounded-lg px-2 py-1 inline-block">
                Log 2+ entries
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Empty State ── */}
        {!loading && records.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-stone-100 p-10 text-center shadow-sm mb-7"
          >
            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Baby className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="font-black text-stone-800 text-lg mb-2">No measurements yet</h3>
            <p className="text-stone-500 text-sm font-semibold mb-5 max-w-xs mx-auto">
              Start logging {babyProfile?.name || "your baby"}'s weight and height to see beautiful growth charts here.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-sm font-black shadow-lg shadow-orange-100 transition-all btn-press"
            >
              Log First Measurement
            </button>
          </motion.div>
        )}

        {records.length > 0 && (
          <>
            {/* ── Chart 1: Weight Over Time ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-5"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <Scale className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <h2 className="font-black text-stone-800 text-base">Weight Progress</h2>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Kilograms over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="wRefGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FED7AA" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#FED7AA" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area dataKey="wP97" name="WHO 97th" stroke="#FDBA74" strokeWidth={1} strokeDasharray="4 3" fill="transparent" dot={false} />
                  <Area dataKey="wP50" name="WHO 50th" stroke="#FB923C" strokeWidth={1.5} strokeDasharray="5 4" fill="transparent" dot={false} />
                  <Area dataKey="wP3" name="WHO 3rd" stroke="#FDBA74" strokeWidth={1} strokeDasharray="4 3" fill="transparent" dot={false} />
                  <Area dataKey="weight" name="Weight (kg)" stroke="#10B981" strokeWidth={2.5} fill="url(#wGrad)" dot={{ r: 4, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 pl-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
                  <div className="w-3 h-0.5 bg-emerald-500 rounded-full" /> Baby's weight
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
                  <div className="w-3 h-0.5 bg-orange-400 rounded-full" style={{ borderTop: '2px dashed #fb923c', background: 'transparent' }} /> WHO 50th %ile
                </div>
              </div>
            </motion.div>

            {/* ── Chart 2: Height Over Time ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-5"
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 flex items-center justify-center">
                  <Ruler className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <h2 className="font-black text-stone-800 text-base">Height / Length Progress</h2>
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Centimeters over time</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="hGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area dataKey="hP97" name="WHO 97th" stroke="#BAE6FD" strokeWidth={1} strokeDasharray="4 3" fill="transparent" dot={false} />
                  <Area dataKey="hP50" name="WHO 50th" stroke="#38BDF8" strokeWidth={1.5} strokeDasharray="5 4" fill="transparent" dot={false} />
                  <Area dataKey="hP3" name="WHO 3rd" stroke="#BAE6FD" strokeWidth={1} strokeDasharray="4 3" fill="transparent" dot={false} />
                  <Area dataKey="height" name="Height (cm)" stroke="#0EA5E9" strokeWidth={2.5} fill="url(#hGrad)" dot={{ r: 4, fill: '#0EA5E9', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex items-center gap-4 mt-3 pl-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
                  <div className="w-3 h-0.5 bg-sky-500 rounded-full" /> Baby's height
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-stone-400">
                  <div className="w-3 h-0.5 bg-sky-300 rounded-full" /> WHO 50th %ile
                </div>
              </div>
            </motion.div>

            {/* ── Chart 3: Combined WHO Analysis ── */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl border border-stone-100 shadow-sm p-6 mb-7"
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-100 flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-violet-600" />
                  </div>
                  <div>
                    <h2 className="font-black text-stone-800 text-base">Combined WHO Analysis</h2>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                      Baby vs WHO reference bands · By month
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 bg-violet-50 rounded-xl px-3 py-1.5">
                  <Info className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-[11px] font-black text-violet-600 uppercase tracking-wider">
                    {gender === 'girl' ? 'Girls' : 'Boys'} Chart
                  </span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={260}>
                <ComposedChart data={whoRange} margin={{ top: 4, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F4" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="w" tick={{ fontSize: 10, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} domain={[0, 16]} label={{ value: 'kg', angle: -90, position: 'insideLeft', offset: 14, style: { fontSize: 10, fill: '#A8A29E' } }} />
                  <YAxis yAxisId="h" orientation="right" tick={{ fontSize: 10, fill: '#A8A29E', fontWeight: 700 }} axisLine={false} tickLine={false} domain={[40, 100]} label={{ value: 'cm', angle: 90, position: 'insideRight', offset: 14, style: { fontSize: 10, fill: '#A8A29E' } }} />
                  <Tooltip content={<CustomTooltip />} />
                  {/* Weight bands */}
                  <Area yAxisId="w" dataKey="wP97" name="W.97th" stroke="#FDE68A" strokeWidth={0} fill="#FEF9C3" fillOpacity={0.6} dot={false} />
                  <Area yAxisId="w" dataKey="wP3" name="W.3rd" stroke="#FDE68A" strokeWidth={0} fill="#FFF8F3" fillOpacity={1} dot={false} />
                  <Line yAxisId="w" type="monotone" dataKey="wP50" name="W.50th" stroke="#F97316" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                  <Line yAxisId="w" type="monotone" dataKey="myWeight" name="Baby Weight (kg)" stroke="#10B981" strokeWidth={3} dot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} connectNulls={false} />
                  {/* Height bands */}
                  <Line yAxisId="h" type="monotone" dataKey="hP50" name="H.50th" stroke="#38BDF8" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
                  <Line yAxisId="h" type="monotone" dataKey="myHeight" name="Baby Height (cm)" stroke="#8B5CF6" strokeWidth={3} dot={{ r: 5, fill: '#8B5CF6', stroke: '#fff', strokeWidth: 2 }} connectNulls={false} />
                </ComposedChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap items-center gap-4 mt-3 pl-1">
                {[
                  { color: '#10B981', label: 'Baby weight (kg)' },
                  { color: '#8B5CF6', label: 'Baby height (cm)' },
                  { color: '#F97316', label: 'WHO 50th weight', dashed: true },
                  { color: '#38BDF8', label: 'WHO 50th height', dashed: true },
                ].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5 text-[11px] font-bold text-stone-500">
                    <div className={`w-3 h-0.5 rounded-full`} style={{ background: l.color }} />
                    {l.label}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}

        {/* ── Reading Materials ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <h2 className="font-black text-stone-800 text-base">For You to Read</h2>
              <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">Evidence-based guidance for parents</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {READING_MATERIALS.map((article, i) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28 + i * 0.04 }}
                className={`bg-gradient-to-br ${article.gradient} rounded-3xl border border-white/80 p-5 cursor-pointer card-hover`}
                onClick={() => setExpandedArticle(expandedArticle === article.id ? null : article.id)}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="text-2xl leading-none mt-0.5">{article.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${article.tagColor}`}>
                        {article.tag}
                      </span>
                      <span className="text-[10px] font-bold text-stone-400">{article.readTime} read</span>
                    </div>
                    <h3 className="font-black text-stone-800 text-sm leading-snug">{article.title}</h3>
                  </div>
                </div>
                <p className="text-stone-600 text-xs font-semibold leading-relaxed mb-3">{article.summary}</p>

                <AnimatePresence>
                  {expandedArticle === article.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/60 pt-3 mt-1 space-y-2">
                        {article.keyPoints.map((point, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                            <p className="text-xs font-semibold text-stone-600">{point}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-end">
                  <div className="flex items-center gap-1 text-[11px] font-black text-stone-500">
                    {expandedArticle === article.id ? 'Show less' : 'Read more'}
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${expandedArticle === article.id ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Reassurance footer */}
          <div className="mt-6 bg-white rounded-3xl border border-amber-100 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-stone-800 text-sm mb-1">Remember, growth is a journey 💛</h3>
              <p className="text-stone-500 text-xs font-semibold leading-relaxed">
                Every baby grows at their own pace. Charts and percentiles are tools for your pediatrician — not a report card for you or your baby. 
                You're doing great just by tracking and caring. When in doubt, always reach out to your doctor.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Log Measurement Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-stone-900 z-40"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="fixed inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-[420px] bg-white rounded-[2rem] shadow-2xl z-50 p-6"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
                    <Scale className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-black text-stone-800 text-base">Log Measurement</h3>
                    <p className="text-[11px] font-bold text-stone-400 uppercase tracking-widest">
                      {babyProfile?.name || 'Baby'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Date Field */}
              <div className="mb-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2 block flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> Date
                </label>
                <input
                  type="date"
                  value={formData.recorded_at}
                  onChange={e => setFormData(p => ({ ...p, recorded_at: e.target.value }))}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-stone-800 font-semibold text-sm focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              {/* Weight Field */}
              <div className="mb-4">
                <label className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2 block flex items-center gap-1.5">
                  <Scale className="w-3.5 h-3.5" /> Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0.5"
                    max="30"
                    placeholder="e.g. 5.32"
                    value={formData.weight_kg}
                    onChange={e => setFormData(p => ({ ...p, weight_kg: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-stone-800 font-semibold text-sm focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 transition pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">kg</span>
                </div>
              </div>

              {/* Height Field */}
              <div className="mb-6">
                <label className="text-[11px] font-black uppercase tracking-widest text-stone-500 mb-2 block flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5" /> Height / Length (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    min="30"
                    max="130"
                    placeholder="e.g. 58.5"
                    value={formData.height_cm}
                    onChange={e => setFormData(p => ({ ...p, height_cm: e.target.value }))}
                    className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-4 py-3 text-stone-800 font-semibold text-sm focus:outline-none focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition pr-12"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-stone-400">cm</span>
                </div>
              </div>

              {/* Info tip */}
              {!formData.weight_kg && !formData.height_cm && (
                <div className="flex items-start gap-2 bg-amber-50 rounded-2xl p-3 mb-4">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-amber-700">Fill in at least one measurement. You can track weight or height independently.</p>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saving || (!formData.weight_kg && !formData.height_cm)}
                className={`w-full py-3.5 rounded-2xl text-sm font-black tracking-wide transition-all shadow-lg btn-press
                  ${saveSuccess
                    ? 'bg-emerald-500 shadow-emerald-100 text-white'
                    : 'bg-orange-500 hover:bg-orange-600 shadow-orange-100 text-white disabled:opacity-40 disabled:cursor-not-allowed'
                  }`}
              >
                {saveSuccess ? '✓ Saved!' : saving ? 'Saving...' : 'Save Measurement'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}