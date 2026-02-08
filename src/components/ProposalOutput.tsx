import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePlatform } from "@/hooks/usePlatform";

interface ProposalOutputProps {
  proposal: string;
  onRegenerate: () => void;
  isLoading: boolean;
}

export function ProposalOutput({ proposal, onRegenerate, isLoading }: ProposalOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t, dir } = usePlatform();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      toast({
        title: t('output.copySuccess'),
        description: t('output.copySuccessDesc'),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: t('output.copyFail'),
        description: t('output.copyFailDesc'),
        variant: "destructive",
      });
    }
  };

  if (!proposal) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {t('output.title')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {t('output.regenerate')}
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleCopy}
            disabled={copied}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                {t('output.copied')}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {t('output.copy')}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="p-6 rounded-lg bg-secondary/50 border border-border">
          <p 
            className="text-foreground leading-relaxed whitespace-pre-wrap"
            dir={dir}
          >
            {proposal}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {t('output.hint')}
      </p>
    </div>
  );
}
