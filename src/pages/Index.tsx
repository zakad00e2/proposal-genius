import { useState, useCallback } from "react";
import { Header } from "@/components/Header";
import { ProposalForm } from "@/components/ProposalForm";
import { ProposalOutput } from "@/components/ProposalOutput";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [proposal, setProposal] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastRequest, setLastRequest] = useState<{
    jobDescription: string;
    proposalLength: "short" | "medium";
    experienceLevel: "beginner" | "intermediate" | "expert";
  } | null>(null);
  const { toast } = useToast();

  const generateProposal = useCallback(
    async (
      jobDescription: string,
      proposalLength: "short" | "medium",
      experienceLevel: "beginner" | "intermediate" | "expert"
    ) => {
      setIsLoading(true);
      setLastRequest({ jobDescription, proposalLength, experienceLevel });

      try {
        const { data, error } = await supabase.functions.invoke("generate-proposal", {
          body: { jobDescription, proposalLength, experienceLevel },
        });

        if (error) {
          throw new Error(error.message || "Failed to generate proposal");
        }

        if (data?.error) {
          throw new Error(data.error);
        }

        if (data?.proposal) {
          setProposal(data.proposal);
        } else {
          throw new Error("No proposal returned");
        }
      } catch (error) {
        console.error("Error generating proposal:", error);
        toast({
          title: "Generation failed",
          description: error instanceof Error ? error.message : "Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [toast]
  );

  const handleRegenerate = useCallback(() => {
    if (lastRequest) {
      generateProposal(
        lastRequest.jobDescription,
        lastRequest.proposalLength,
        lastRequest.experienceLevel
      );
    }
  }, [lastRequest, generateProposal]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-foreground text-balance">
            Write winning Upwork proposals
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste a job description and get a professional, human-sounding proposal in seconds. No robotic templates.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <ProposalForm onGenerate={generateProposal} isLoading={isLoading} />
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
            Designed for Upwork. More platforms coming soon.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
