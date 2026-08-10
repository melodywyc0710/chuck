import { useState, useEffect, useRef } from 'react';
import { X, ChevronRight, Flame } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';

type Mood = 'great' | 'good' | 'okay' | 'low' | 'rough';

interface DiaryEntry {
  id: string;
  user_id: string;
  date_key: string;
  content: string;
  mood: Mood | null;
  word_count: number;
  created_at: string;
  updated_at: string;
}

interface Props {
  onClose: () => void;
}

const MOODS: { key: Mood; label: string }[] = [
  { key: 'great', label: 'Great' },
  { key: 'good',  label: 'Good'  },
  { key: 'okay',  label: 'Okay'  },
  { key: 'low',   label: 'Low'   },
  { key: 'rough', label: 'Rough' },
];

function MoodFace({ mood, active, size = 36 }: { mood: Mood; active: boolean; size?: number }) {
  const stroke = active ? '#FF4D4D' : 'rgba(255,255,255,0.3)';
  const fill = active ? '#FF4D4D' : 'rgba(255,255,255,0.3)';
  const blush = active ? 'rgba(255,77,77,0.15)' : 'transparent';
  const s = size;
  const cx = s / 2, cy = s / 2, r = s / 2 - 1;
  const le = cx - 5, re = cx + 5, ey = cy - 4;

  return (
    <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx={cx} cy={cy} r={r} stroke={stroke} strokeWidth="1.4" />
      {mood === 'great' && (
        <>
          <circle cx={le} cy={ey} r="1.5" fill={fill} />
          <circle cx={re} cy={ey} r="1.5" fill={fill} />
          <path d={`M${cx-7} ${cy+3}C${cx-7} ${cy+3} ${cx-3} ${cy+7} ${cx} ${cy+7}C${cx+3} ${cy+7} ${cx+7} ${cy+3} ${cx+7} ${cy+3}`} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
          <circle cx={cx - 9} cy={cy + 2} r="2.5" fill={blush} />
          <circle cx={cx + 9} cy={cy + 2} r="2.5" fill={blush} />
        </>
      )}
      {mood === 'good' && (
        <>
          <circle cx={le} cy={ey + 0.5} r="1.3" fill={fill} />
          <circle cx={re} cy={ey + 0.5} r="1.3" fill={fill} />
          <path d={`M${cx-6} ${cy+3}C${cx-6} ${cy+3} ${cx-2} ${cy+6.5} ${cx} ${cy+6.5}C${cx+2} ${cy+6.5} ${cx+6} ${cy+3} ${cx+6} ${cy+3}`} stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {mood === 'okay' && (
        <>
          <circle cx={le} cy={ey + 1} r="1.3" fill={fill} />
          <circle cx={re} cy={ey + 1} r="1.3" fill={fill} />
          <line x1={cx - 6} y1={cy + 5} x2={cx + 6} y2={cy + 5} stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {mood === 'low' && (
        <>
          <circle cx={le} cy={ey + 1} r="1.3" fill={fill} />
          <circle cx={re} cy={ey + 1} r="1.3" fill={fill} />
          <path d={`M${cx-6} ${cy+7}C${cx-6} ${cy+7} ${cx-2} ${cy+4} ${cx} ${cy+4}C${cx+2} ${cy+4} ${cx+6} ${cy+7} ${cx+6} ${cy+7}`} stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
      {mood === 'rough' && (
        <>
          <path d={`M${cx-7.5} ${cy-5}C${cx-7.5} ${cy-5} ${cx-4.5} ${cy-6.5} ${cx-2.5} ${cy-5}`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d={`M${cx+7.5} ${cy-5}C${cx+7.5} ${cy-5} ${cx+4.5} ${cy-6.5} ${cx+2.5} ${cy-5}`} stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
          <circle cx={le} cy={ey + 2} r="1.3" fill={fill} />
          <circle cx={re} cy={ey + 2} r="1.3" fill={fill} />
          <path d={`M${cx-7} ${cy+8}C${cx-7} ${cy+8} ${cx-3} ${cy+4.5} ${cx} ${cy+4.5}C${cx+3} ${cy+4.5} ${cx+7} ${cy+8} ${cx+7} ${cy+8}`} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function DiaryIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="1.5" width="11" height="15" rx="1.5" stroke="#FF4D4D" strokeWidth="1.3" />
      <line x1="5.5" y1="6" x2="11.5" y2="6" stroke="#FF4D4D" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5.5" y1="9" x2="11.5" y2="9" stroke="#FF4D4D" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="5.5" y1="12" x2="9" y2="12" stroke="#FF4D4D" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="3" y1="1.5" x2="3" y2="16.5" stroke="#FF4D4D" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function wordCount(text: string) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function formatDateKey(dateKey: string) {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatDateShort(dateKey: string) {
  const d = new Date(dateKey + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function DiaryScreen({ onClose }: Props) {
  const user = useAuthStore(s => s.user);
  const today = new Date().toISOString().slice(0, 10);

  const [content, setContent] = useState('');
  const [mood, setMood] = useState<Mood | null>(null);
  const [todayEntry, setTodayEntry] = useState<DiaryEntry | null>(null);
  const [past, setPast] = useState<DiaryEntry[]>([]);
  const [reading, setReading] = useState<DiaryEntry | null>(null);
  const [saving, setSaving] = useState(false);
  const [streak, setStreak] = useState(0);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    if (!user) return;
    const { data } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('date_key', { ascending: false })
      .limit(60);
    if (!data) return;

    const todays = data.find((e: DiaryEntry) => e.date_key === today) ?? null;
    setTodayEntry(todays);
    if (todays) { setContent(todays.content); setMood(todays.mood); }
    setPast(data.filter((e: DiaryEntry) => e.date_key !== today));

    // Streak: consecutive days with an entry ending today or yesterday
    const keys = new Set(data.map((e: DiaryEntry) => e.date_key));
    let s = 0;
    const cursor = new Date(today);
    while (keys.has(cursor.toISOString().slice(0, 10))) {
      s++;
      cursor.setDate(cursor.getDate() - 1);
    }
    setStreak(s);
  }

  function scheduleAutosave(newContent: string, newMood: Mood | null) {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => save(newContent, newMood), 1200);
  }

  function handleContentChange(val: string) {
    setContent(val);
    scheduleAutosave(val, mood);
  }

  function handleMoodChange(m: Mood) {
    setMood(m);
    scheduleAutosave(content, m);
  }

  async function save(c: string, m: Mood | null) {
    if (!user || !c.trim()) return;
    setSaving(true);
    const payload = {
      user_id: user.id,
      date_key: today,
      content: c,
      mood: m,
      word_count: wordCount(c),
    };
    if (todayEntry) {
      await supabase.from('diary_entries').update(payload).eq('id', todayEntry.id);
    } else {
      const { data } = await supabase.from('diary_entries').insert(payload).select().single();
      if (data) setTodayEntry(data as DiaryEntry);
    }
    setSaving(false);
  }

  // Reading a past entry
  if (reading) {
    return (
      <>
        <div className="scene-bg" />
        <div className="scene-overlay" />
        <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
          <div className="flex items-center justify-between px-5 pt-safe pt-6 pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={() => setReading(null)} className="flex items-center gap-1.5 text-white/40 hover:text-white/70 transition-colors text-sm">
              <ChevronRight size={14} className="rotate-180" />
              Back
            </button>
            <span className="text-white/30 text-xs">{formatDateShort(reading.date_key)}</span>
            <div className="w-14" />
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-6">
            <div className="flex items-center gap-3 mb-6">
              {reading.mood && <MoodFace mood={reading.mood} active={false} size={32} />}
              <p className="text-white/60 text-xs">{reading.word_count} words</p>
            </div>
            <p className="text-white/80 leading-relaxed" style={{ fontFamily: 'Georgia, serif', fontSize: 15, lineHeight: 1.75 }}>
              {reading.content}
            </p>
          </div>
        </div>
      </>
    );
  }

  const wc = wordCount(content);

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />

      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-safe pt-6 pb-4">
          <div className="flex items-center gap-2">
            <DiaryIcon />
            <h1 className="text-white font-semibold text-lg" style={{ letterSpacing: '-0.03em' }}>Diary</h1>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 pb-10 space-y-6">
          {/* Streak + date */}
          <div className="flex items-center justify-between">
            <p className="text-white/25 text-xs">{formatDateKey(today)}</p>
            {streak > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.15)' }}>
                <Flame size={10} style={{ color: '#FF4D4D' }} />
                <span className="text-xs font-semibold" style={{ color: '#FF4D4D' }}>{streak} day streak</span>
              </div>
            )}
          </div>

          {/* Mood picker */}
          <div>
            <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">How are you feeling?</p>
            <div className="flex gap-2">
              {MOODS.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleMoodChange(key)}
                  className="flex-1 flex flex-col items-center gap-1.5 py-2.5 rounded-[16px] transition-all"
                  style={mood === key
                    ? { background: 'rgba(255,77,77,0.08)', border: '1px solid rgba(255,77,77,0.4)' }
                    : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <MoodFace mood={key} active={mood === key} size={36} />
                  <span className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: mood === key ? '#FF4D4D' : 'rgba(255,255,255,0.25)' }}>
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Writing area */}
          <div className="rounded-[20px] overflow-hidden" style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-4 pt-4 pb-2" style={{ background: 'rgba(196,168,130,0.04)' }}>
              <textarea
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="What's on your mind today…"
                rows={8}
                className="w-full bg-transparent outline-none resize-none text-white/80"
                style={{ fontFamily: 'Georgia, "Times New Roman", serif', fontSize: 15, lineHeight: 1.75, caretColor: '#FF4D4D' }}
              />
            </div>
            <div className="flex items-center justify-between px-4 py-2.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span className="text-white/20 text-[10px] font-variant-numeric tabular-nums">
                {wc} {wc === 1 ? 'word' : 'words'}
                {saving && <span className="ml-2 text-white/15">saving…</span>}
                {!saving && todayEntry && <span className="ml-2 text-white/15">saved</span>}
              </span>
              <button
                onClick={() => { if (saveTimeout.current) clearTimeout(saveTimeout.current); save(content, mood); }}
                disabled={!content.trim()}
                className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white disabled:opacity-30 transition-all active:scale-95"
                style={{ background: '#FF4D4D' }}
              >
                Save
              </button>
            </div>
          </div>

          {/* Past entries */}
          {past.length > 0 && (
            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-widest mb-3">Earlier</p>
              <div className="space-y-2">
                {past.map(e => (
                  <button
                    key={e.id}
                    onClick={() => setReading(e)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-[18px] text-left transition-colors"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.05)' }}
                  >
                    {e.mood
                      ? <div className="shrink-0"><MoodFace mood={e.mood} active={false} size={28} /></div>
                      : <div className="w-7 h-7 shrink-0" />
                    }
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-white/70 text-xs font-semibold">{formatDateShort(e.date_key)}</span>
                        <span className="text-white/20 text-[10px]">{e.word_count} words</span>
                      </div>
                      <p className="text-white/30 text-xs truncate" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                        {e.content.slice(0, 80)}
                      </p>
                    </div>
                    <ChevronRight size={13} className="text-white/15 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
