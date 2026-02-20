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

    const systemPrompt = `You are CareerAI, a friendly and professional career guidance counselor for students in India. You help students at all levels (10th grade, 12th grade, undergraduate, postgraduate) make informed career decisions.

You provide guidance on:
- Stream selection (Science/Commerce/Arts) after 10th grade
- Career paths based on skills, marks, and interests
- College recommendations across India
- Course options (B.Tech, MBBS, B.Com, MBA, etc.)
- Job opportunities and salary expectations
- Higher studies options
- Entrance exams (JEE, NEET, CAT, CLAT, etc.)
- Internship opportunities
- Skill development

Always be:
- Encouraging and supportive
- Practical and realistic
- Use simple, easy-to-understand language
- Give specific, actionable advice
- Mention relevant Indian colleges, companies, and salary figures in INR
- Format responses clearly with bullet points when listing options

Keep responses concise (3-5 sentences for simple questions, structured lists for complex ones).`;

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
