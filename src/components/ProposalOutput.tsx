import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Platform } from "./ProposalForm";

interface ProposalOutputProps {
  proposal: string;
  onRegenerate: () => void;
  isLoading: boolean;
  platform: Platform;
}

export function ProposalOutput({ proposal, onRegenerate, isLoading, platform }: ProposalOutputProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const isArabic = platform === "mostaql";
  const platformName = isArabic ? "مستقل" : "Upwork";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(proposal);
      setCopied(true);
      toast({
        title: isArabic ? "تم النسخ" : "Copied to clipboard",
        description: isArabic 
          ? "عرضك جاهز للصق في مستقل." 
          : "Your proposal is ready to paste into Upwork.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: isArabic ? "فشل النسخ" : "Failed to copy",
        description: isArabic 
          ? "يرجى تحديد النص ونسخه يدوياً." 
          : "Please select and copy the text manually.",
        variant: "destructive",
      });
    }
  };

  if (!proposal) return null;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">
          {isArabic ? "عرضك" : "Your Proposal"}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerate}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isArabic ? "إعادة الإنشاء" : "Regenerate"}
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
                {isArabic ? "تم النسخ" : "Copied"}
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                {isArabic ? "نسخ" : "Copy"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="p-6 rounded-lg bg-secondary/50 border border-border">
          <p 
            className="text-foreground leading-relaxed whitespace-pre-wrap"
            dir={isArabic ? "rtl" : "ltr"}
          >
            {proposal}
          </p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        {isArabic 
          ? "راجع العرض وخصّصه قبل الإرسال. أضف روابط معرض أعمالك إذا كان ذلك مناسباً."
          : "Review and personalize before sending. Add specific portfolio links if relevant."}
      </p>
    </div>
  );
}
