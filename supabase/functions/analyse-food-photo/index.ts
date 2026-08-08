import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders() });
  }

  try {
    const { imageBase64, mediaType = 'image/jpeg' } = await req.json();
    if (!imageBase64) throw new Error('imageBase64 required');

    const prompt = `Analyse this food photo. Identify every food item visible and estimate calories and macros.

Respond ONLY with a valid JSON object matching this exact schema (no markdown, no extra text):
{
  "items": [
    {
      "name": "string",
      "calories": number,
      "protein_g": number or null,
      "carbs_g": number or null,
      "fat_g": number or null,
      "portion": "string describing the estimated portion size"
    }
  ],
  "total_calories": number,
  "total_protein_g": number or null,
  "total_carbs_g": number or null,
  "total_fat_g": number or null,
  "confidence": "high" or "medium" or "low",
  "notes": "string with any relevant caveats, or null",
  "follow_up_question": "a clarifying question if confidence is low, or null"
}

Rules:
- Use realistic serving-size estimates based on what is visible
- If you cannot identify a food item clearly, include it with low confidence
- confidence = "high" if most items are identifiable, "medium" if roughly half are, "low" if the photo is unclear or contains mixed items
- Do NOT refuse to estimate — always provide best-guess numbers
- All number fields must be integers or null (round calories to nearest 5)`;

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
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
