import { useState } from 'react';
import {
  // Body / health
  Heart, Dumbbell, Apple, Pill, Activity, Zap, Moon, Sun, Wind, Droplets,
  Flame, Thermometer, Eye, Ear, Brain, Bone, Stethoscope, Baby, PersonStanding,
  // Mind / focus
  BookOpen, BookMarked, Book, GraduationCap, Lightbulb, Microscope, Telescope,
  PenLine, Pencil, NotebookPen, FileText, ClipboardList, Target, Crosshair,
  // Time / productivity
  Timer, Clock, AlarmClock, Calendar, CalendarCheck, CheckSquare, ListTodo,
  Inbox, Archive, Layers, Layout, Grid, LayoutGrid, BarChart2, TrendingUp,
  // Nature / outdoor
  Tree, Leaf, Flower, Flower2, Mountain, Waves, Umbrella, Cloud, CloudRain,
  Snowflake, Sunrise, Sunset, Bird, Fish, Cat, Dog,
  // Social / life
  Users, User, Heart as HeartIcon, Home, Coffee, Utensils, Wine, ShoppingBag,
  Smile, Star, Gift, Music, Headphones, Camera, Film, Tv, Gamepad2,
  // Finance / work
  DollarSign, CreditCard, PiggyBank, Briefcase, Building, Laptop, Code,
  Globe, Mail, MessageCircle, Phone, Send, Share2,
  // Sport / movement
  Bike, Footprints, Trophy, Medal, Swords, Shield,
  // Misc
  Sparkles, Rocket, Diamond, Crown, Key, Lock, Compass, Map,
} from 'lucide-react';

export const ICON_LIST: { id: string; Icon: React.ElementType }[] = [
  // Body / health
  { id: 'heart', Icon: Heart }, { id: 'dumbbell', Icon: Dumbbell }, { id: 'apple', Icon: Apple },
  { id: 'pill', Icon: Pill }, { id: 'activity', Icon: Activity }, { id: 'zap', Icon: Zap },
  { id: 'moon', Icon: Moon }, { id: 'sun', Icon: Sun }, { id: 'wind', Icon: Wind },
  { id: 'droplets', Icon: Droplets }, { id: 'flame', Icon: Flame }, { id: 'thermometer', Icon: Thermometer },
  { id: 'eye', Icon: Eye }, { id: 'ear', Icon: Ear }, { id: 'brain', Icon: Brain },
  { id: 'bone', Icon: Bone }, { id: 'stethoscope', Icon: Stethoscope }, { id: 'baby', Icon: Baby },
  { id: 'personstanding', Icon: PersonStanding },
  // Mind / focus
  { id: 'bookopen', Icon: BookOpen }, { id: 'bookmarked', Icon: BookMarked }, { id: 'book', Icon: Book },
  { id: 'graduationcap', Icon: GraduationCap }, { id: 'lightbulb', Icon: Lightbulb },
  { id: 'microscope', Icon: Microscope }, { id: 'telescope', Icon: Telescope },
  { id: 'penline', Icon: PenLine }, { id: 'pencil', Icon: Pencil }, { id: 'notebookpen', Icon: NotebookPen },
  { id: 'filetext', Icon: FileText }, { id: 'clipboardlist', Icon: ClipboardList },
  { id: 'target', Icon: Target }, { id: 'crosshair', Icon: Crosshair },
  // Time / productivity
  { id: 'timer', Icon: Timer }, { id: 'clock', Icon: Clock }, { id: 'alarmclock', Icon: AlarmClock },
  { id: 'calendar', Icon: Calendar }, { id: 'calendarcheck', Icon: CalendarCheck },
  { id: 'checksquare', Icon: CheckSquare }, { id: 'listtodo', Icon: ListTodo },
  { id: 'inbox', Icon: Inbox }, { id: 'archive', Icon: Archive }, { id: 'layers', Icon: Layers },
  { id: 'layout', Icon: Layout }, { id: 'grid', Icon: Grid }, { id: 'layoutgrid', Icon: LayoutGrid },
  { id: 'barchart2', Icon: BarChart2 }, { id: 'trendingup', Icon: TrendingUp },
  // Nature / outdoor
  { id: 'tree', Icon: Tree }, { id: 'leaf', Icon: Leaf }, { id: 'flower', Icon: Flower },
  { id: 'flower2', Icon: Flower2 }, { id: 'mountain', Icon: Mountain }, { id: 'waves', Icon: Waves },
  { id: 'umbrella', Icon: Umbrella }, { id: 'cloud', Icon: Cloud }, { id: 'cloudrain', Icon: CloudRain },
  { id: 'snowflake', Icon: Snowflake }, { id: 'sunrise', Icon: Sunrise }, { id: 'sunset', Icon: Sunset },
  { id: 'bird', Icon: Bird }, { id: 'fish', Icon: Fish }, { id: 'cat', Icon: Cat }, { id: 'dog', Icon: Dog },
  // Social / life
  { id: 'users', Icon: Users }, { id: 'user', Icon: User },
  { id: 'home', Icon: Home }, { id: 'coffee', Icon: Coffee }, { id: 'utensils', Icon: Utensils },
  { id: 'wine', Icon: Wine }, { id: 'shoppingbag', Icon: ShoppingBag },
  { id: 'smile', Icon: Smile }, { id: 'star', Icon: Star }, { id: 'gift', Icon: Gift },
  { id: 'music', Icon: Music }, { id: 'headphones', Icon: Headphones }, { id: 'camera', Icon: Camera },
  { id: 'film', Icon: Film }, { id: 'tv', Icon: Tv }, { id: 'gamepad2', Icon: Gamepad2 },
  // Finance / work
  { id: 'dollar', Icon: DollarSign }, { id: 'creditcard', Icon: CreditCard }, { id: 'piggybank', Icon: PiggyBank },
  { id: 'briefcase', Icon: Briefcase }, { id: 'building', Icon: Building }, { id: 'laptop', Icon: Laptop },
  { id: 'code', Icon: Code }, { id: 'globe', Icon: Globe }, { id: 'mail', Icon: Mail },
  { id: 'message', Icon: MessageCircle }, { id: 'phone', Icon: Phone }, { id: 'send', Icon: Send },
  { id: 'share', Icon: Share2 },
  // Sport / movement
  { id: 'bike', Icon: Bike }, { id: 'footprints', Icon: Footprints }, { id: 'trophy', Icon: Trophy },
  { id: 'medal', Icon: Medal }, { id: 'swords', Icon: Swords }, { id: 'shield', Icon: Shield },
  // Misc
  { id: 'sparkles', Icon: Sparkles }, { id: 'rocket', Icon: Rocket }, { id: 'diamond', Icon: Diamond },
  { id: 'crown', Icon: Crown }, { id: 'key', Icon: Key }, { id: 'lock', Icon: Lock },
  { id: 'compass', Icon: Compass }, { id: 'map', Icon: Map },
];

const ICON_MAP = new Map(ICON_LIST.map(i => [i.id, i.Icon]));

export function getCatIcon(catName: string): React.ElementType | null {
  const stored = localStorage.getItem(`cat-icon-${catName}`);
  if (stored) return ICON_MAP.get(stored) ?? null;
  return null;
}

export function setCatIcon(catName: string, iconId: string) {
  localStorage.setItem(`cat-icon-${catName}`, iconId);
}

export default function CategoryIconPicker({
  catName, color, onClose,
}: { catName: string; color: string; onClose: () => void }) {
  const [query, setQuery] = useState('');
  const current = localStorage.getItem(`cat-icon-${catName}`);

  const filtered = query.trim()
    ? ICON_LIST.filter(i => i.id.includes(query.toLowerCase().replace(/\s/g, '')))
    : ICON_LIST;

  function pick(id: string) {
    setCatIcon(catName, id);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed bottom-0 left-0 right-0 z-50 max-w-md mx-auto rounded-t-[28px]"
        style={{ background: '#111111', border: '1px solid #1e1e1e', maxHeight: '70vh', display: 'flex', flexDirection: 'column' }}>
        <div className="px-4 pt-4 pb-2 shrink-0">
          <div className="w-8 h-1 rounded-full bg-white/15 mx-auto mb-3" />
          <p className="text-white/50 text-xs font-medium mb-2">Choose icon for {catName}</p>
          <input
            autoFocus
            placeholder="Search icons…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-white text-sm outline-none"
            style={{ background: '#1e1e1e' }}
          />
        </div>
        <div className="overflow-y-auto px-4 pb-8">
          <div className="grid grid-cols-8 gap-2 pt-2">
            {filtered.map(({ id, Icon }) => (
              <button key={id} onClick={() => pick(id)}
                className="aspect-square rounded-xl flex items-center justify-center transition-all active:scale-90"
                style={{ background: current === id ? color : '#1e1e1e', border: current === id ? `2px solid ${color}` : '2px solid transparent' }}>
                <Icon size={18} color={current === id ? 'white' : 'rgba(255,255,255,0.5)'} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
