import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { tasks, completions, category } = await req.json();

    if (!tasks || tasks.length === 0 || !completions || completions.length < 7) {
      return new Response(JSON.stringify({
        insights: [],
        summary: null,
      }), { headers: { ...corsHeaders(), 'content-type': 'application/json' } });
    }

    // Build a compact representation of the data for the prompt
    const taskList = tasks.map((t: { id: string; title: string }) => `- [${t.id.slice(0, 8)}] ${t.title}`).join('\n');

    // Aggregate completions per task and by day-of-week
    const byTask: Record<string, string[]> = {};
    const byDow: Record<number, number> = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const totalByDay: Record<string, number> = {};
    let earliest = '';
    let latest = '';

    for (const c of completions as { promise_id: string; date_key: string }[]) {
      if (!byTask[c.promise_id]) byTask[c.promise_id] = [];
      byTask[c.promise_id].push(c.date_key);
      const dow = new Date(c.date_key + 'T00:00:00').getDay();
      byDow[dow] = (byDow[dow] ?? 0) + 1;
      totalByDay[c.date_key] = (totalByDay[c.date_key] ?? 0) + 1;
      if (!earliest || c.date_key < earliest) earliest = c.date_key;
      if (!latest || c.date_key > latest) latest = c.date_key;
    }

    const DOW_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dowSummary = Object.entries(byDow)
      .map(([d, n]) => `${DOW_NAMES[Number(d)]}: ${n}`)
      .join(', ');

    const taskStats = tasks.map((t: { id: string; title: string }) => {
      const done = byTask[t.id] ?? [];
      return `  "${t.title}": ${done.length} completions (last: ${done.sort().slice(-1)[0] ?? 'never'})`;
    }).join('\n');

    const totalDays = Object.keys(totalByDay).length;
    const avgPerDay = completions.length / Math.max(1, totalDays);

    const prompt = `You are a personal habit coach analysing a user's ${category} habit data. Give concise, actionable insights.

Data summary:
- Category: ${category}
- Tasks:\n${taskList}
- Per-task completion counts:\n${taskStats}
- Completions by day of week: ${dowSummary}
- Date range: ${earliest} to ${latest}
- Total completions: ${completions.length} over ${totalDays} active days (avg ${avgPerDay.toFixed(1)}/day)

Respond ONLY with a valid JSON object (no markdown, no extra text):
{
  "insights": [
    {
      "type": "pattern" or "recommendation" or "streak" or "drop_off",
      "title": "short headline (5 words max)",
      "body": "2 sentences max, specific to their data"
    }
  ],
  "summary": "One encouraging sentence about their overall progress, or null"
}

Rules:
- Maximum 3 insights
- Only include insights with real evidence in the data — no generic advice
- "drop_off" if a task hasn't been completed in 7+ days but was active before
- "pattern" for clear day-of-week or timing patterns
- "recommendation" for actionable suggestions
- "streak" only if there's a meaningful streak visible in the data
- Be specific: mention actual task names, numbers, and dates where relevant
- Skip obvious or trivial observations`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const json = await res.json();
    if (json.error) throw new Error(json.error.message);

    const text = json.content?.[0]?.text ?? '{}';
    const result = JSON.parse(text);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders(), 'content-type': 'application/json' },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders(), 'content-type': 'application/json' } },
    );
  }
});

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}
