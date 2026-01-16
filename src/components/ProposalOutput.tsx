import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProposalOutputProps {
  proposal: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function ProposalOutput({ proposal, onRegenerate, isLoading }: ProposalOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Your proposal is ready to paste into Upwork.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  if (!proposal) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Your Proposal</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            Regenerate
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="p-6 rounded-lg bg-secondary/50 border border-border">
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">
            {proposal}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Review and personalize before sending. Add specific portfolio links if relevant.
      </p>
    </div>
  );
}
