import { FileText } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="container max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-foreground">Proposal Assistant</h1>
            <p className="text-xs text-muted-foreground">For Upwork freelancers</p>
          </div>
        </div>
      </div>
    </header>
  );
}
