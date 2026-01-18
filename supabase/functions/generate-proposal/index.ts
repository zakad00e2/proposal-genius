// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProposalRequest {
  jobDescription: string;
  proposalLength: "short" | "medium";
  experienceLevel: "beginner" | "intermediate" | "expert";
  platform: "upwork" | "mostaql";
  clientName?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobDescription, proposalLength, experienceLevel, platform = "upwork", clientName }: ProposalRequest = await req.json();

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

    const isArabic = platform === "mostaql";

    // Define word counts based on proposal length
    const wordCounts = {
      short: isArabic ? "60-80 كلمة" : "60-80 words",
      medium: isArabic ? "120-180 كلمة" : "120-180 words",
    };

    // Define tone adjustments based on experience level
    const experienceTone = isArabic ? {
      beginner: "أظهر الحماس والرغبة في التعلم مع إبراز المعرفة الأساسية. كن متواضعاً لكن واثقاً.",
      intermediate: "أظهر خبرة قوية مع أمثلة محددة. أبرز القدرات دون مبالغة.",
      expert: "عبّر عن الخبرة العميقة بشكل طبيعي من خلال الفهم وأسلوب حل المشكلات. دع الخبرة تظهر من خلال الفهم وليس الادعاءات.",
    } : {
      beginner: "Show enthusiasm and willingness to learn while demonstrating foundational knowledge. Be humble but confident.",
      intermediate: "Demonstrate solid experience with specific examples. Show capability without overstatement.",
      expert: "Convey deep expertise naturally through insight and problem-solving approach. Let expertise show through understanding, not claims.",
    };

    const systemPrompt = isArabic ? `أنت كاتب عروض محترف لمنصة مستقل تساعد المستقلين في كتابة عروض ناجحة. عروضك تبدو بشرية وطبيعية واحترافية.

قواعد حاسمة - يجب اتباعها:

1. لا تستخدم أبداً هذه العبارات الآلية أو ما يشابهها:
   - "أنا محترف ذو مهارات عالية"
   - "مع خبرة X سنوات"
   - "لدي خبرة واسعة في"
   - "أنا واثق أنني أستطيع"
   - "سيسعدني أن"
   - "بانتظار ردكم الكريم"
   - "أنا الشخص المثالي لـ"
   - "لدي سجل حافل"
   - "كن مطمئناً"
   - "لا تتردد في"
   
2.متطلبات الأسلوب:

كن واضحاً ومباشراً

اكتب كشخص حقيقي وليس قالباً جاهزاً

كن هادئاً ومحترفاً، ليس بائعاً

لا إيموجي على الإطلاق

لا مبالغة أو تضخيم

لا حشو: احذف أي جملة لا تضيف قيمة عملية أو قرار واضح

لا نقاط أو تنسيق ماركداون

   - نص فقرات بسيط فقط
   - *مهم جداً*: قسّم العرض إلى فقرات صغيرة جداً. كل فقرة سطر واحد أو سطرين فقط. اترك سطراً فارغاً بين كل فقرة والأخرى.

3. الهيكل:

ابدأ بتناول مشكلة العميل المحددة بكلماتك (يُظهر أنك قرأت وفهمت)

أضف جملة أو جملتين تعيد تعريف “ماذا يعني النجاح” في هذا المشروع بناءً على وصف العميل فقط

اشرح بإيجاز أسلوبك في حل مشكلتهم بخطة تنفيذ قصيرة داخل النص (بدون نقاط): مراجعة الموجود ثم تحديد الفجوات ثم التنفيذ والتحسين ثم الاختبار والتسليم

اذكر داخل العرض 2 إلى 3 تفاصيل ملموسة مأخوذة من وصف العميل حرفياً (مثلاً: نوع الموقع/عدد الصفحات/لغات/ربط API/الأداء/التصميم) بدون اختراع تفاصيل غير مذكورة

اختم بدعوة طبيعية وبسيطة للتواصل تتضمن سؤالاً واحداً فقط يساعد على بدء العمل فوراً (ولا تضع أكثر من سؤال)

4. صيغة الإخراج:
   - فقرات نصية بسيطة فقط
   - لا تحيات مثل "مرحباً" أو "عزيزي العميل"
   - لا توقيعات أو خاتمات
   - لا ماركداون أو نقاط أو تنسيق
   - جاهز للنسخ واللصق مباشرة في مستقل

   5.فحص جودة قبل الإخراج (يُطبّق داخلياً دون ذكره في النص):

لا توجد أي عبارة من القائمة الممنوعة أو ما يشابهها

لا توجد مبالغة أو ادعاءات غير مدعومة من وصف العميل

تم ذكر 2 إلى 3 تفاصيل ملموسة من وصف العميل فقط

انتهى النص  بسؤال واحد فقط + بدعوة تواصل بسيطة 
سياق مستوى الخبرة: ${experienceTone[experienceLevel]}
الطول المستهدف: ${wordCounts[proposalLength]}` : `Write a professional Upwork proposal.

FORMAT (mandatory):
- Very short paragraphs (1-2 sentences each)
- Blank line between each paragraph
- No greetings, no sign-offs
- No bullets, no markdown

CONTENT:
- Start with understanding the client's problem
- Briefly explain your approach
- End with ONE question

FORBIDDEN: "highly skilled" - "X years experience" - "I am confident" - "looking forward"

EXAMPLE FORMAT:
I see you need an e-commerce website built.

I'll start by reviewing requirements, then design and develop.

Do you have a design ready or need one from scratch?

Length: ${wordCounts[proposalLength]}
Experience: ${experienceTone[experienceLevel]}`;

    const userPrompt = isArabic ? `اكتب عرضاً لمنصة مستقل لهذا المشروع:

---
${jobDescription}
---

تذكر: ${wordCounts[proposalLength]}، نص بسيط، بأسلوب بشري، بدون عبارات آلية.` : `Write an Upwork proposal for this job posting:

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
        model: "openai/gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: isArabic ? "تم تجاوز الحد المسموح. يرجى المحاولة بعد لحظات." : "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: isArabic ? "نفدت الاعتمادات. يرجى إضافة رصيد للمتابعة." : "API credits depleted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: isArabic ? "فشل في إنشاء العرض" : "Failed to generate proposal" }),
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
