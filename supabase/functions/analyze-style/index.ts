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
    const { messages, imageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing style with AI...');

    // Build messages array with image if provided
    const aiMessages = [
      {
        role: 'system',
        content: `You are Stylish Genie, an expert AI fashion stylist and personal color analyst. You have deep knowledge of:

1. Skin Tone Analysis: Identify undertones (warm, cool, neutral) and depth (fair, light, medium, tan, deep, dark)
2. Color Theory: Understand which colors complement different skin tones based on color harmony
3. Fashion Styling: Provide personalized outfit recommendations for different occasions
4. Personal Style: Adapt advice to individual preferences and body types

When analyzing a photo:
- Carefully examine skin tone, identifying both the depth and undertone
- Provide specific color recommendations (with HEX codes when possible)
- List colors to embrace and colors to avoid
- Suggest complete outfit combinations for various occasions
- Be encouraging, professional, and specific in your advice
- Consider seasonal color analysis principles

When chatting without a photo:
- Ask clarifying questions about style preferences, occasions, or concerns
- Provide actionable fashion advice
- Be conversational yet professional
- Reference previous context in the conversation`
      },
      ...messages
    ];

    // If there's an image URL, add it to the last user message
    if (imageUrl) {
      const lastMessage = aiMessages[aiMessages.length - 1];
      if (lastMessage.role === 'user') {
        lastMessage.content = [
          {
            type: 'text',
            text: lastMessage.content
          },
          {
            type: 'image_url',
            image_url: {
              url: imageUrl
            }
          }
        ];
      }
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: aiMessages,
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI usage limit reached. Please add credits to continue.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`AI Gateway error: ${response.status}`);
    }

    // Stream the response back
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
      },
    });

  } catch (error) {
    console.error('Error in analyze-style function:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
