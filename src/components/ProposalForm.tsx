import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
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

export type Platform = "upwork" | "mostaql";

interface ProposalFormProps {
  onGenerate: (
    jobDescription: string,
    proposalLength: "short" | "medium",
    experienceLevel: "beginner" | "intermediate" | "expert",
    platform: Platform
  ) => Promise<void>;
  isLoading: boolean;
  platform: Platform;
  onPlatformChange: (platform: Platform) => void;
}

export function ProposalForm({ onGenerate, isLoading, platform, onPlatformChange }: ProposalFormProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [proposalLength, setProposalLength] = useState<"short" | "medium">("medium");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate");

  const isArabic = platform === "mostaql";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    await onGenerate(jobDescription, proposalLength, experienceLevel, platform);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="platform" className="text-sm font-medium text-foreground">
          {isArabic ? "المنصة" : "Platform"}
        </Label>
        <Select
          value={platform}
          onValueChange={(value: Platform) => onPlatformChange(value)}
          disabled={isLoading}
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
        <Label htmlFor="job-description" className="text-sm font-medium text-foreground">
          {isArabic ? "وصف المشروع" : "Job Description"}
        </Label>
        <Textarea
          id="job-description"
          placeholder={isArabic ? "الصق وصف المشروع من مستقل هنا..." : "Paste the job posting from Upwork here..."}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px] resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 transition-shadow"
          dir={isArabic ? "rtl" : "ltr"}
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          {isArabic ? "أضف وصف المشروع كاملاً للحصول على أفضل النتائج" : "Include the full job description for best results"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proposal-length" className="text-sm font-medium text-foreground">
            {isArabic ? "طول العرض" : "Proposal Length"}
          </Label>
          <Select
            value={proposalLength}
            onValueChange={(value: "short" | "medium") => setProposalLength(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="proposal-length" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">{isArabic ? "قصير (60-80 كلمة)" : "Short (60-80 words)"}</SelectItem>
              <SelectItem value="medium">{isArabic ? "متوسط (120-180 كلمة)" : "Medium (120-180 words)"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience-level" className="text-sm font-medium text-foreground">
            {isArabic ? "مستوى الخبرة" : "Experience Level"}
          </Label>
          <Select
            value={experienceLevel}
            onValueChange={(value: "beginner" | "intermediate" | "expert") => setExperienceLevel(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="experience-level" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">{isArabic ? "مبتدئ" : "Beginner"}</SelectItem>
              <SelectItem value="intermediate">{isArabic ? "متوسط" : "Intermediate"}</SelectItem>
              <SelectItem value="expert">{isArabic ? "خبير" : "Expert"}</SelectItem>
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
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isArabic ? "جارٍ الإنشاء..." : "Generating..."}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {isArabic ? "إنشاء العرض" : "Generate Proposal"}
          </>
        )}
      </Button>
    </form>
  );
}
