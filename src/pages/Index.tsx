import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProposalForm, Platform } from "@/components/ProposalForm";
import { ProposalOutput } from "@/components/ProposalOutput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [proposal, setProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [platform, setPlatform] = useState<Platform>("upwork");
  const [lastRequest, setLastRequest] = useState<{
    jobDescription: string;
    proposalLength: "short" | "medium";
    experienceLevel: "beginner" | "intermediate" | "expert";
    platform: Platform;
    clientName?: string;
  } | null>(null);
  const { toast } = useToast();

  const isArabic = platform === "mostaql";

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
        toast({
          title: isArabic ? "فشل الإنشاء" : "Generation failed",
          description: error instanceof Error ? error.message : (isArabic ? "يرجى المحاولة مرة أخرى." : "Please try again."),
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

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProposalForm 
            onGenerate={generateProposal} 
            isLoading={isLoading}
            platform={platform}
            onPlatformChange={handlePlatformChange}
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
