import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();

    const systemPrompt = `You are CareerAI, a friendly career guide for Indian students (10th, 12th, UG, PG).

RULES:
- Keep answers SHORT (2-4 sentences max for simple questions)
- Use SIMPLE language a 15-year-old can understand
- Use bullet points for lists, max 5-6 points
- NO long paragraphs, NO jargon
- Give specific Indian examples (colleges, salaries in INR, exam names)
- When explaining a course like BSc CS, list the key subjects/skills they'll learn (e.g. Python, Java, Data Structures)
- Be encouraging but realistic
- If unsure, say "I'm not sure" instead of guessing

Topics: stream selection, careers, colleges, courses, entrance exams (JEE/NEET/CAT), salaries, internships, skills.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('LOVABLE_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process your request. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
