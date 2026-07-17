import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { petName, happiness, streak, level, mood, traitTop } = await req.json();

    const prompt = buildPrompt(petName, happiness, streak, level, mood, traitTop);

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 120,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = await res.json();
    if (json.error) throw new Error(json.error.message);
    const message = json.content?.[0]?.text ?? "I'm here for you today 💛";

    return new Response(JSON.stringify({ message }), {
      headers: { ...corsHeaders(), 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: "I believe in you today 🌟" }), {
      headers: { ...corsHeaders(), 'content-type': 'application/json' },
    });
  }
});

function buildPrompt(name: string, happiness: number, streak: number, level: number, mood: string, traitTop: string) {
  return `You are ${name}, a small magical creature who is the user's loyal companion pet in the Nagi accountability app. Write a warm, personal morning check-in message to your owner.

Context about you right now:
- Your happiness: ${happiness}/100 (mood: ${mood})
- Your owner's streak: ${streak} days
- Your level: ${level}
- Your strongest trait: ${traitTop}

Rules:
- Write in first person as the pet (I, me, my)
- 2-3 sentences max, very short
- Warm, genuine, slightly playful — not cringe or overly motivational
- Reference something specific from the context naturally
- End with one small encouragement for today
- No hashtags, no emojis overload (1-2 max)`;
}

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
