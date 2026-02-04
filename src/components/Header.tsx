import { FileText, Calculator } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Header() {
  const location = useLocation();
  
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10" dir="ltr">
      <div className="container max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-foreground">Offerly</h1>
              <p className="text-xs text-muted-foreground">For freelancers</p>
            </div>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link 
              to="/"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">مولّد العروض</span>
            </Link>
            {/* <Link 
              to="/pricing"
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                location.pathname === "/pricing" 
                  ? "bg-primary/10 text-primary" 
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Calculator className="h-4 w-4" />
              <span className="hidden sm:inline">تحديد السعر</span>
            </Link> */}
          </nav>
        </div>
      </div>
    </header>
  );
}
