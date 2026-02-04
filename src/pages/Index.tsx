import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProposalForm, Platform } from "@/components/ProposalForm";
import { ProposalOutput } from "@/components/ProposalOutput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { DollarSign, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingData {
  paragraph: string;
  price: number;
}

const Index = () => {
  const [proposal, setProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("upwork");
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [lastRequest, setLastRequest] = useState<{
    jobDescription: string;
    proposalLength: "short" | "medium";
    experienceLevel: "beginner" | "intermediate" | "expert";
    platform: Platform;
    clientName?: string;
  } | null>(null);
  const { toast } = useToast();

  const isArabic = platform === "mostaql";

  // Check for pricing data from sessionStorage on mount
  useEffect(() => {
    const storedPricingData = sessionStorage.getItem("offerly_pricing_data");
    if (storedPricingData) {
      try {
        const parsed = JSON.parse(storedPricingData);
        setPricingData(parsed);
        // Switch to Arabic platform since pricing is in Arabic
        setPlatform("mostaql");
        sessionStorage.removeItem("offerly_pricing_data");
        toast({
          title: "تم استلام بيانات التسعير",
          description: `السعر المحدد: $${parsed.price}`,
        });
      } catch {
        console.error("Failed to parse pricing data");
      }
    }
  }, [toast]);

  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = isArabic ? "ar" : "en";
  }, [isArabic]);

  const generateProposal = useCallback(
    async (
      jobDescription: string,
      proposalLength: "short" | "medium",
      experienceLevel: "beginner" | "intermediate" | "expert",
      platform: Platform,
      clientName?: string
    ) => {
      setIsLoading(true);
      setLastRequest({ jobDescription, proposalLength, experienceLevel, platform, clientName });

      try {
        const { data, error } = await supabase.functions.invoke("generate-proposal", {
          body: { jobDescription, proposalLength, experienceLevel, platform, clientName },
        });

        if (error) {
          throw new Error(error.message || "Failed to generate proposal");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.proposal) {
          let finalProposal = data.proposal;
          if (clientName && clientName.trim()) {
            const greeting = platform === "mostaql" 
              ? `السلام عليكم أستاذ ${clientName.trim()}.\n\n` 
              : `Hi ${clientName.trim()},\n\n`;
            finalProposal = greeting + finalProposal;
          }
          setProposal(finalProposal);
        } else {
          throw new Error("No proposal returned");
        }
      } catch (error) {
        console.error("Error generating proposal:", error);
        let errorMessage = error instanceof Error ? error.message : (isArabic ? "يرجى المحاولة مرة أخرى." : "Please try again.");
        
        if (errorMessage.includes("Failed to send a request")) {
          errorMessage = isArabic 
            ? "تعذر الاتصال بالخادم. قد يكون هناك ضغط على الخدمة، يرجى المحاولة بعد قليل." 
            : "Could not connect to server. The service might be busy, please try again momentarily.";
        }

        toast({
          title: isArabic ? "فشل الإنشاء" : "Generation failed",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, isArabic]
  );

  const handleRegenerate = useCallback(() => {
    if (lastRequest) {
      generateProposal(
        lastRequest.jobDescription,
        lastRequest.proposalLength,
        lastRequest.experienceLevel,
        lastRequest.platform,
        lastRequest.clientName
      );
    }
  }, [lastRequest, generateProposal]);

  const handlePlatformChange = (newPlatform: Platform) => {
    setPlatform(newPlatform);
    setProposal(""); // Clear proposal when platform changes
  };

  return (
    <div 
      className={`min-h-screen bg-background ${isArabic ? "font-arabic" : ""}`}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-balance">
            {isArabic ? "اكتب عروضاً احترافية لمستقل" : "Write winning Upwork proposals"}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isArabic 
              ? "الصق وصف المشروع واحصل على عرض احترافي بأسلوب بشري في ثوانٍ. بدون قوالب جاهزة."
              : "Paste a job description and get a professional, human-sounding proposal in seconds. No robotic templates."}
          </p>
        </div>

        {/* Pricing Data Alert */}
        {pricingData && (
          <Alert className="bg-primary/5 border-primary/20">
            <DollarSign className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>بيانات التسعير جاهزة</span>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setPricingData(null)}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p className="text-sm mb-2">السعر المحدد: <strong>${pricingData.price}</strong></p>
              <div className="bg-muted/50 rounded p-2 text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
                {pricingData.paragraph}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                ستتم إضافة فقرة التسعير تلقائياً إلى العرض المُنشأ
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProposalForm 
            onGenerate={generateProposal} 
            isLoading={isLoading}
            platform={platform}
            onPlatformChange={handlePlatformChange}
            pricingParagraph={pricingData?.paragraph}
          />
        </div>

        {proposal && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <ProposalOutput
              proposal={proposal}
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
              platform={platform}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            {isArabic ? "© جميع الحقوق محفوظة لزكريا صافي" : "© All rights reserved to Zakaria Safi"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
