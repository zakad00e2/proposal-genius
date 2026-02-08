import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { ProposalForm, Platform } from "@/components/ProposalForm";
import { ProposalOutput } from "@/components/ProposalOutput";
import { useToast } from "@/hooks/use-toast";
import { usePlatform } from "@/hooks/usePlatform";
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
  const [pricingData, setPricingData] = useState<PricingData | null>(null);
  const [lastRequest, setLastRequest] = useState<{
    jobDescription: string;
    proposalLength: "short" | "medium";
    experienceLevel: "beginner" | "intermediate" | "expert";
    platform: Platform;
    clientName?: string;
  } | null>(null);
  const { toast } = useToast();
  const { platform, setPlatform, isArabic, dir, t } = usePlatform();

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
          title: t('index.pricingReceived.title'),
          description: `${t('index.pricingReceived.desc')}${parsed.price}`,
        });
      } catch {
        console.error("Failed to parse pricing data");
      }
    }
  }, [toast, setPlatform, t]);

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
        let errorMessage = error instanceof Error ? error.message : t('error.generation.default');
        
        if (errorMessage.includes("Failed to send a request")) {
          errorMessage = t('error.generation.connection');
        }

        toast({
          title: t('error.generation.title'),
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast, t]
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

  return (
    <div 
      className={`min-h-screen bg-background ${isArabic ? "font-arabic" : ""}`}
      dir={dir}
    >
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-balance">
            {t('index.heading')}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('index.subheading')}
          </p>
        </div>

        {/* Pricing Data Alert */}
        {pricingData && (
          <Alert className="bg-primary/5 border-primary/20">
            <DollarSign className="h-4 w-4" />
            <AlertTitle className="flex items-center justify-between">
              <span>{t('index.pricingAlert.title')}</span>
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
              <p className="text-sm mb-2">{t('index.pricingAlert.price')} <strong>${pricingData.price}</strong></p>
              <div className="bg-muted/50 rounded p-2 text-xs whitespace-pre-wrap max-h-32 overflow-y-auto">
                {pricingData.paragraph}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('index.pricingAlert.note')}
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProposalForm 
            onGenerate={generateProposal} 
            isLoading={isLoading}
            pricingParagraph={pricingData?.paragraph}
          />
        </div>

        {proposal && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <ProposalOutput
              proposal={proposal}
              onRegenerate={handleRegenerate}
              isLoading={isLoading}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container max-w-3xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
