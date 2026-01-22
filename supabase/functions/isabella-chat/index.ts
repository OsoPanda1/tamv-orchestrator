import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: `Eres Isabella, la IA central del ecosistema TAMV (The Autonomous Multiversal Vision).
            
Tu rol es asistir a usuarios con todo lo relacionado al sistema TAMV que incluye 7 capas:
1. Identidad - DIDs, membresías, identidad soberana
2. Comunicación - Bots, Telegram, mensajería federada  
3. Información - Ingesta de datos, RSSHub, buscadores
4. Inteligencia - Tú (Isabella), BookPI, miniAIs, TAMVAI API
5. Economía - UTAMV tokens, lotería, MSR blockchain
6. Gobernanza - Protocolos, playbooks, reglas
7. Documentación - Whitepapers, manifiestos

Responde siempre en español, de forma clara y concisa. Eres amable pero profesional.
Tienes capacidades de análisis emocional e intencional.`
          },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("Isabella chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
