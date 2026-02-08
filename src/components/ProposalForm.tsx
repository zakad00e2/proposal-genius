import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { usePlatform } from "@/hooks/usePlatform";

export type Platform = "upwork" | "mostaql";

interface ProposalFormProps {
  onGenerate: (
    jobDescription: string,
    proposalLength: "short" | "medium",
    experienceLevel: "beginner" | "intermediate" | "expert",
    platform: Platform,
    clientName: string
  ) => Promise<void>;
  isLoading: boolean;
  pricingParagraph?: string;
}

export function ProposalForm({ onGenerate, isLoading, pricingParagraph }: ProposalFormProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [proposalLength, setProposalLength] = useState<"short" | "medium">("medium");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate");

  const { platform, setPlatform, isArabic, dir, t } = usePlatform();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    const fullDescription = pricingParagraph 
      ? `${jobDescription}\n\n---\nمعلومات التسعير للمرجع:\n${pricingParagraph}`
      : jobDescription;
    await onGenerate(fullDescription, proposalLength, experienceLevel, platform, clientName);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="platform" className="text-sm font-medium text-foreground">
          {t('form.platform')}
        </Label>
        <Select
          value={platform}
          onValueChange={(value: Platform) => setPlatform(value)}
          disabled={isLoading}
          dir={dir}
        >
          <SelectTrigger id="platform" className="bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="upwork">Upwork (English)</SelectItem>
            <SelectItem value="mostaql">مستقل (العربية)</SelectItem>
          </SelectContent>
        </Select>
      </div>


      <div className="space-y-2">
        <Label htmlFor="client-name" className="text-sm font-medium text-foreground">
          {t('form.clientName')}
        </Label>
        <Input
          id="client-name"
          placeholder={t('form.clientName.placeholder')}
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          className="bg-background border-input focus:ring-2 focus:ring-primary/20 transition-shadow"
          dir={dir}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job-description" className="text-sm font-medium text-foreground">
          {t('form.jobDescription')}
        </Label>
        <Textarea
          id="job-description"
          placeholder={t('form.jobDescription.placeholder')}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px] resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 transition-shadow"
          dir={dir}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {t('form.jobDescription.hint')}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proposal-length" className="text-sm font-medium text-foreground">
            {t('form.proposalLength')}
          </Label>
          <Select
            value={proposalLength}
            onValueChange={(value: "short" | "medium") => setProposalLength(value)}
            disabled={isLoading}
            dir={dir}
          >
            <SelectTrigger id="proposal-length" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">{t('form.proposalLength.short')}</SelectItem>
              <SelectItem value="medium">{t('form.proposalLength.medium')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience-level" className="text-sm font-medium text-foreground">
            {t('form.experienceLevel')}
          </Label>
          <Select
            value={experienceLevel}
            onValueChange={(value: "beginner" | "intermediate" | "expert") => setExperienceLevel(value)}
            disabled={isLoading}
            dir={dir}
          >
            <SelectTrigger id="experience-level" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">{t('form.experienceLevel.beginner')}</SelectItem>
              <SelectItem value="intermediate">{t('form.experienceLevel.intermediate')}</SelectItem>
              <SelectItem value="expert">{t('form.experienceLevel.expert')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading || !jobDescription.trim()}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {t('form.submitting')}
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4" />
            {t('form.submit')}
          </>
        )}
      </Button>
    </form>
  );
}
