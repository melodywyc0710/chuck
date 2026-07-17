import { useEffect, useState } from 'react';
import { UserPlus, Check, X, Eye, ChevronLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../store/authStore';
import type { Friendship, Pet, Profile } from '../lib/supabase';

function petColor(hue: number) {
  return `hsl(${hue}, 50%, 65%)`;
}

const MOOD_EMOJI: Record<string, string> = {
  excited: '🤩', happy: '😊', neutral: '😐', sad: '😢',
};

function mood(h: number) {
  if (h >= 80) return 'excited';
  if (h >= 60) return 'happy';
  if (h >= 40) return 'neutral';
  return 'sad';
}

interface FriendEntry {
  friendship: Friendship;
  profile: Profile;
  pet: Pet | null;
}

interface WitnessRequest {
  id: string;
  completion_id: string;
  requester_id: string;
  status: 'pending' | 'confirmed' | 'denied';
  created_at: string;
  requester?: Profile;
  promise_title?: string;
}

export default function FriendsScreen({ onBack }: { onBack: () => void }) {
  const [tab, setTab] = useState<'friends' | 'witness'>('friends');
  const [friends, setFriends] = useState<FriendEntry[]>([]);
  const [pending, setPending] = useState<FriendEntry[]>([]);
  const [witnessReqs, setWitnessReqs] = useState<WitnessRequest[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<Profile | 'not-found' | null>(null);
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = useAuthStore(s => s.user);

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    setLoading(true);
    await Promise.all([loadFriends(), loadWitnessRequests()]);
    setLoading(false);
  }

  async function loadFriends() {
    if (!user) return;

    // Get all friendships involving me
    const { data: rows } = await supabase
      .from('friendships')
      .select('*')
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    if (!rows) return;

    const accepted: FriendEntry[] = [];
    const pendingIn: FriendEntry[] = [];

    for (const f of rows) {
      const otherId = f.requester_id === user.id ? f.addressee_id : f.requester_id;
      const [{ data: profile }, { data: pet }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', otherId).single(),
        supabase.from('pets').select('*').eq('user_id', otherId).single(),
      ]);
      if (!profile) continue;
      const entry: FriendEntry = { friendship: f, profile, pet: pet ?? null };
      if (f.status === 'accepted') accepted.push(entry);
      else if (f.status === 'pending' && f.addressee_id === user.id) pendingIn.push(entry);
    }

    setFriends(accepted);
    setPending(pendingIn);
  }

  async function loadWitnessRequests() {
    if (!user) return;
    const { data: rows } = await supabase
      .from('witness_requests')
      .select('*')
      .eq('witness_id', user.id)
      .eq('status', 'pending');
    if (!rows) return;

    const enriched: WitnessRequest[] = [];
    for (const r of rows) {
      const [{ data: requester }, { data: completion }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', r.requester_id).single(),
        supabase.from('completions').select('promise_id').eq('id', r.completion_id).single(),
      ]);
      let promise_title = 'a promise';
      if (completion?.promise_id) {
        const { data: p } = await supabase.from('promises').select('title').eq('id', completion.promise_id).single();
        if (p) promise_title = p.title;
      }
      enriched.push({ ...r, requester: requester ?? undefined, promise_title });
    }
    setWitnessReqs(enriched);
  }

  async function searchUser() {
    if (!searchUsername.trim()) return;
    setSearching(true);
    setSearchResult(null);
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', searchUsername.trim())
      .single();
    setSearchResult(data ?? 'not-found');
    setSearching(false);
  }

  async function sendRequest(addresseeId: string) {
    if (!user) return;
    await supabase.from('friendships').insert({ requester_id: user.id, addressee_id: addresseeId });
    setSearchResult(null);
    setSearchUsername('');
  }

  async function respondToRequest(friendshipId: string, accept: boolean) {
    await supabase
      .from('friendships')
      .update({ status: accept ? 'accepted' : 'pending' })
      .eq('id', friendshipId);
    if (!accept) {
      await supabase.from('friendships').delete().eq('id', friendshipId);
    }
    loadFriends();
  }

  async function respondToWitness(reqId: string, confirm: boolean) {
    await supabase
      .from('witness_requests')
      .update({ status: confirm ? 'confirmed' : 'denied' })
      .eq('id', reqId);
    if (confirm) {
      const req = witnessReqs.find(r => r.id === reqId);
      if (req) {
        await supabase
          .from('completions')
          .update({ verified_by: user!.id })
          .eq('id', req.completion_id);
      }
    }
    setWitnessReqs(prev => prev.filter(r => r.id !== reqId));
  }

  return (
    <>
      <div className="scene-bg" />
      <div className="scene-overlay" />
      <div className="relative z-10 min-h-screen flex flex-col max-w-md mx-auto px-6 pt-14 pb-6" style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8 fade-up" style={{ animationDelay: '0.05s' }}>
          <button onClick={onBack} className="liquid-glass w-9 h-9 flex items-center justify-center rounded-full text-white/60 hover:text-white/90 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <div>
            <p className="text-white/40 text-xs">your circle</p>
            <h1 className="font-playfair italic text-white text-2xl leading-tight" style={{ letterSpacing: '-0.03em' }}>Friends</h1>
          </div>
          <div className="ml-auto">
            {witnessReqs.length > 0 && (
              <span className="bg-orange-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {witnessReqs.length}
              </span>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="liquid-glass rounded-full p-1 flex mb-6 fade-up" style={{ animationDelay: '0.15s' }}>
          {(['friends', 'witness'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-full text-sm font-medium transition-all duration-300 ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-white/50 hover:text-white/80'}`}
            >
              {t === 'friends' ? 'Friends' : `Witness ${witnessReqs.length > 0 ? `(${witnessReqs.length})` : ''}`}
            </button>
          ))}
        </div>

        {tab === 'friends' && (
          <div className="space-y-4 fade-up" style={{ animationDelay: '0.25s' }}>

            {/* Search */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add by username…"
                  value={searchUsername}
                  onChange={e => setSearchUsername(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && searchUser()}
                  className="flex-1 px-4 py-3 rounded-2xl text-white placeholder-white/30 text-sm outline-none liquid-glass"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                />
                <button
                  onClick={searchUser}
                  disabled={searching}
                  className="liquid-glass w-12 flex items-center justify-center rounded-2xl text-white/70 hover:text-white transition-colors"
                >
                  <UserPlus size={16} />
                </button>
              </div>

              {/* Search result */}
              {searchResult === 'not-found' && (
                <p className="text-white/40 text-xs text-center py-2">No user found with that username.</p>
              )}
              {searchResult && searchResult !== 'not-found' && (
                <div className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white text-sm font-medium">{searchResult.username}</p>
                    <p className="text-white/40 text-xs">joined {new Date(searchResult.created_at).toLocaleDateString()}</p>
                  </div>
                  {searchResult.id !== user?.id && (
                    <button
                      onClick={() => sendRequest(searchResult.id)}
                      className="px-4 py-1.5 bg-orange-500/80 hover:bg-orange-500 text-white rounded-full text-xs font-medium transition-colors"
                    >
                      Add
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pending incoming requests */}
            {pending.length > 0 && (
              <div>
                <p className="text-white/40 text-xs mb-2 tracking-wide uppercase">Requests</p>
                <div className="space-y-2">
                  {pending.map(entry => (
                    <div key={entry.friendship.id} className="liquid-glass rounded-2xl p-4 flex items-center justify-between">
                      <p className="text-white text-sm font-medium">{entry.profile.username}</p>
                      <div className="flex gap-2">
                        <button onClick={() => respondToRequest(entry.friendship.id, true)} className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors">
                          <Check size={14} />
                        </button>
                        <button onClick={() => respondToRequest(entry.friendship.id, false)} className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center text-red-400/70 hover:bg-red-500/20 transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Friends list */}
            <div>
              {friends.length === 0 && !loading && (
                <div className="text-center py-10">
                  <p className="text-white/20 text-sm">No friends yet.</p>
                  <p className="text-white/20 text-sm mt-1">Add someone by username above.</p>
                </div>
              )}
              <div className="space-y-3">
                {friends.map(entry => (
                  <FriendCard key={entry.friendship.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'witness' && (
          <div className="space-y-3 fade-up" style={{ animationDelay: '0.25s' }}>
            {witnessReqs.length === 0 && (
              <div className="text-center py-10">
                <p className="text-white/20 text-sm">No pending witness requests.</p>
              </div>
            )}
            {witnessReqs.map(req => (
              <div key={req.id} className="liquid-glass rounded-2xl p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white text-sm font-medium">{req.requester?.username ?? 'Someone'}</p>
                    <p className="text-white/40 text-xs mt-0.5">wants you to witness:</p>
                    <p className="text-white/70 text-sm mt-1 font-medium">"{req.promise_title}"</p>
                  </div>
                  <Eye size={16} className="text-white/30 mt-1" />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => respondToWitness(req.id, true)}
                    className="flex-1 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-full text-xs font-semibold transition-colors"
                  >
                    ✓ Confirm
                  </button>
                  <button
                    onClick={() => respondToWitness(req.id, false)}
                    className="flex-1 py-2 bg-white/6 hover:bg-white/10 text-white/40 rounded-full text-xs font-semibold transition-colors"
                  >
                    Deny
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function FriendCard({ entry }: { entry: FriendEntry }) {
  const { profile, pet } = entry;
  const color = pet ? petColor(pet.color_seed) : '#888';
  const petMood = pet ? mood(pet.happiness) : 'neutral';

  return (
    <div className="liquid-glass rounded-[28px] p-4 flex items-center gap-4">
      {/* Pet avatar */}
      <div className="relative flex-shrink-0">
        <div className="absolute inset-0 rounded-full blur-xl opacity-40" style={{ backgroundColor: color }} />
        <div
          className="relative w-14 h-14 rounded-full flex items-center justify-center text-2xl liquid-glass"
          style={{ background: color + '22' }}
        >
          {pet ? MOOD_EMOJI[petMood] : '🥚'}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{profile.username}</p>
        {pet ? (
          <>
            <p className="text-white/40 text-xs mt-0.5">{pet.name} · Lv.{pet.level}</p>
            {/* Mini happiness bar */}
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mt-2 w-24">
              <div className="h-full rounded-full transition-all" style={{ width: `${pet.happiness}%`, backgroundColor: color }} />
            </div>
          </>
        ) : (
          <p className="text-white/30 text-xs mt-0.5">no pet yet</p>
        )}
      </div>

      {/* Streak badge */}
      {pet && pet.streak > 0 && (
        <div className="flex items-center gap-1 liquid-glass px-2 py-1 rounded-full">
          <span className="text-xs">🔥</span>
          <span className="text-white/70 text-xs font-medium">{pet.streak}</span>
        </div>
      )}
    </div>
  );
}
