import { useState, useCallback, useEffect } from "react";
import { Header } from "@/components/Header";
import { PricingForm, PricingResults, PricingSettings } from "@/components/pricing";
import { useToast } from "@/hooks/use-toast";
import { 
  calculatePricing, 
  PricingInput, 
  PricingResult,
  UserSettings,
  DEFAULT_USER_SETTINGS 
} from "@/lib/pricingEngine";
import { Button } from "@/components/ui/button";
import { Settings, Calculator } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePlatform } from "@/hooks/usePlatform";

const STORAGE_KEY = "offerly_pricing_settings";

const Pricing = () => {
  const [result, setResult] = useState<PricingResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [lastInput, setLastInput] = useState<PricingInput | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isArabic, dir, t } = usePlatform();

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserSettings({ ...DEFAULT_USER_SETTINGS, ...parsed });
      } catch {
        console.error("Failed to parse saved settings");
      }
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((settings: UserSettings) => {
    setUserSettings(settings);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast({
      title: t('settings.saved.title'),
      description: t('settings.saved.desc'),
    });
  }, [toast, t]);

  const handleCalculate = useCallback(async (input: PricingInput) => {
    setIsCalculating(true);
    setLastInput(input);
    
    try {
      // Add user settings to input
      const inputWithSettings: PricingInput = {
        ...input,
        user_settings: userSettings,
      };
      
      // Calculate locally (could also call API)
      const pricingResult = calculatePricing(inputWithSettings);
      setResult(pricingResult);
      
      toast({
        title: t('pricing.calculated.title'),
        description: `${t('pricing.calculated.desc')}${pricingResult.typical_price}`,
      });
    } catch (error) {
      console.error("Error calculating price:", error);
      toast({
        title: t('pricing.error.title'),
        description: t('pricing.error.desc'),
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  }, [userSettings, toast, t]);

  const handleSendToProposal = useCallback((pricingParagraph: string, selectedPrice: number) => {
    // Store in sessionStorage for the proposal generator to pick up
    sessionStorage.setItem("offerly_pricing_data", JSON.stringify({
      paragraph: pricingParagraph,
      price: selectedPrice,
    }));
    
    // Navigate to home page
    navigate("/");
    
    toast({
      title: t('pricing.sent.title'),
      description: t('pricing.sent.desc'),
    });
  }, [navigate, toast, t]);

  return (
    <div className={`min-h-screen bg-background ${isArabic ? "font-arabic" : ""}`} dir={dir}>
      <Header />
      
      <main className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="h-8 w-8 text-primary" />
            <h2 className="text-2xl sm:text-3xl font-semibold text-foreground">
              {t('pricing.heading')}
            </h2>
          </div>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t('pricing.subheading')}
          </p>
          
          {/* Settings Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="mt-4"
          >
            <Settings className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {showSettings ? t('pricing.settingsToggle.hide') : t('pricing.settingsToggle.show')}
          </Button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <PricingSettings 
              settings={userSettings}
              onSave={saveSettings}
            />
          </div>
        )}

        {/* Pricing Form */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <PricingForm 
            onCalculate={handleCalculate}
            isLoading={isCalculating}
          />
        </div>

        {/* Results */}
        {result && (
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            <PricingResults 
              result={result}
              onSendToProposal={handleSendToProposal}
            />
          </div>
        )}
      </main>

      <footer className="border-t border-border mt-auto">
        <div className="container max-w-4xl mx-auto px-4 py-6">
          <p className="text-center text-xs text-muted-foreground">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
