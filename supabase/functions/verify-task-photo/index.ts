import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { imageBase64, mediaType = 'image/jpeg', taskTitle, taskNotes } = await req.json();
    if (!imageBase64 || !taskTitle) throw new Error('imageBase64 and taskTitle required');

    const taskDesc = taskNotes ? `"${taskTitle}" — ${taskNotes}` : `"${taskTitle}"`;

    const prompt = `You are a neutral, honest habit verification assistant. The user claims to have completed this task: ${taskDesc}

Look at the photo they submitted as evidence. Assess how well it supports their claim.

Respond ONLY with a valid JSON object matching this exact schema (no markdown, no extra text):
{
  "status": "verified" or "likely_verified" or "uncertain" or "insufficient_evidence",
  "confidence": number from 0 to 100,
  "reasoning": "1–2 sentence honest explanation of your assessment"
}

Status definitions:
- "verified": Photo clearly shows the task was completed (confidence ≥ 85)
- "likely_verified": Strong visual indicators support completion (confidence 65–84)
- "uncertain": Photo is related but doesn't conclusively prove completion (confidence 35–64)
- "insufficient_evidence": Photo is unrelated, blank, unclear, or shows nothing relevant (confidence < 35)

Important rules:
- NEVER claim something is definitively proven — humans can stage photos
- Be honest and specific in the reasoning
- Do not accuse the user of cheating — use neutral, factual language
- A blank/dark/unrelated photo must always be "insufficient_evidence"`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: { type: 'base64', media_type: mediaType, data: imageBase64 },
            },
            { type: 'text', text: prompt },
          ],
        }],
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
