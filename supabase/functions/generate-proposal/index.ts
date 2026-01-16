import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProposalRequest {
  jobDescription: string;
  proposalLength: "short" | "medium";
  experienceLevel: "beginner" | "intermediate" | "expert";
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, proposalLength, experienceLevel }: ProposalRequest = await req.json();

    if (!jobDescription || !proposalLength || !experienceLevel) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Define word counts based on proposal length
    const wordCounts = {
      short: "60-80 words",
      medium: "120-180 words",
    };

    // Define tone adjustments based on experience level
    const experienceTone = {
      beginner: "Show enthusiasm and willingness to learn while demonstrating foundational knowledge. Be humble but confident.",
      intermediate: "Demonstrate solid experience with specific examples. Show capability without overstatement.",
      expert: "Convey deep expertise naturally through insight and problem-solving approach. Let expertise show through understanding, not claims.",
    };

    const systemPrompt = `You are an expert Upwork proposal writer who helps freelancers write winning proposals. Your proposals sound human, natural, and professional.

CRITICAL RULES - YOU MUST FOLLOW THESE:

1. NEVER use these robotic phrases or anything similar:
   - "I am a highly skilled professional"
   - "With X years of experience"
   - "I have extensive experience in"
   - "I am confident that I can"
   - "I would be delighted to"
   - "Looking forward to hearing from you"
   - "I am the perfect fit for"
   - "I have a proven track record"
   - "Rest assured"
   - "Please feel free to"
   
2. TONE REQUIREMENTS:
   - Be clear and direct
   - Sound like a real person, not a template
   - Be calm and professional, not salesy
   - No emojis whatsoever
   - No exaggeration or superlatives
   - No bullet points or markdown formatting
   - Plain paragraph text only

3. STRUCTURE:
   - Start by addressing the client's specific problem in your own words (shows you read and understood)
   - Briefly explain your approach to solving their problem
   - End with a simple, natural call to action

4. OUTPUT FORMAT:
   - Plain text paragraphs only
   - No greetings like "Hi there" or "Dear Client"
   - No sign-offs or signatures
   - No markdown, bullets, or formatting
   - Ready to copy-paste directly into Upwork

Experience Level Context: ${experienceTone[experienceLevel]}
Target Length: ${wordCounts[proposalLength]}`;

    const userPrompt = `Write an Upwork proposal for this job posting:

---
${jobDescription}
---

Remember: ${wordCounts[proposalLength]}, plain text, human-sounding, no robotic phrases.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "API credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate proposal" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    let proposal = data.choices?.[0]?.message?.content || "";

    // Clean the output
    proposal = proposal
      .replace(/^\s+|\s+$/g, "") // Trim whitespace
      .replace(/\n{3,}/g, "\n\n") // Reduce multiple newlines
      .replace(/[*_#`]/g, "") // Remove markdown characters
      .replace(/^[-•]\s*/gm, "") // Remove bullet points
      .trim();

    return new Response(
      JSON.stringify({ proposal }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating proposal:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
