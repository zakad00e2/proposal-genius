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

interface ProposalFormProps {
  onGenerate: (
    jobDescription: string,
    proposalLength: "short" | "medium",
    experienceLevel: "beginner" | "intermediate" | "expert"
  ) => Promise<void>;
  isLoading: boolean;
}

export function ProposalForm({ onGenerate, isLoading }: ProposalFormProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [proposalLength, setProposalLength] = useState<"short" | "medium">("medium");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "expert">("intermediate");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) return;
    await onGenerate(jobDescription, proposalLength, experienceLevel);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="job-description" className="text-sm font-medium text-foreground">
          Job Description
        </Label>
        <Textarea
          id="job-description"
          placeholder="Paste the job posting from Upwork here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="min-h-[200px] resize-none bg-background border-input focus:ring-2 focus:ring-primary/20 transition-shadow"
          disabled={isLoading}
        />
        <p className="text-xs text-muted-foreground">
          Include the full job description for best results
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="proposal-length" className="text-sm font-medium text-foreground">
            Proposal Length
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
              <SelectItem value="short">Short (60-80 words)</SelectItem>
              <SelectItem value="medium">Medium (120-180 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="experience-level" className="text-sm font-medium text-foreground">
            Experience Level
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
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="expert">Expert</SelectItem>
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
            Generating...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate Proposal
          </>
        )}
      </Button>
    </form>
  );
}
