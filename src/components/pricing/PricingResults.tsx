import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy, 
  Check, 
  Send, 
  DollarSign, 
  Clock, 
  TrendingUp,
  Package,
  FileText,
  CheckCircle,
  XCircle
} from "lucide-react";
import { PricingResult } from "@/lib/pricingEngine";
import { useToast } from "@/hooks/use-toast";
import { usePlatform } from "@/hooks/usePlatform";

interface PricingResultsProps {
  result: PricingResult;
  onSendToProposal: (pricingParagraph: string, selectedPrice: number) => void;
}

export function PricingResults({ result, onSendToProposal }: PricingResultsProps) {
  const [copiedParagraph, setCopiedParagraph] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("Standard");
  const { toast } = useToast();
  const { lang, isArabic, t } = usePlatform();

  const pricingParagraph = isArabic ? result.pricing_paragraph_ar : result.pricing_paragraph_en;

  const handleCopyParagraph = async () => {
    try {
      await navigator.clipboard.writeText(pricingParagraph);
      setCopiedParagraph(true);
      toast({
        title: t('results.copySuccess.title'),
        description: t('results.copySuccess.desc'),
      });
      setTimeout(() => setCopiedParagraph(false), 2000);
    } catch {
      toast({
        title: t('results.copyFail.title'),
        description: t('results.copyFail.desc'),
        variant: "destructive",
      });
    }
  };

  const handleSendToProposal = () => {
    const pkg = result.packages.find(p => p.name === selectedPackage);
    const price = pkg?.price || result.typical_price;
    onSendToProposal(pricingParagraph, price);
  };

  return (
    <div className="space-y-6">
      {/* Price Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>

              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">{t('results.minPrice')}</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">${result.min_price}</p>
              </div>
             
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="text-sm text-primary font-medium">{t('results.typicalPrice')}</p>
                <p className="text-2xl font-bold text-primary">${result.typical_price}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
                <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className={isArabic ? "text-right" : "text-left"}>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">{t('results.maxPrice')}</p>
                <p className="text-2xl font-bold text-orange-700 dark:text-orange-300">${result.max_price}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hours Estimate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className={isArabic ? "text-right" : "text-left"}>
              <p className="text-sm text-muted-foreground font-medium">{t('results.estimatedHours')}</p>
              <p className="text-xl font-semibold">
                {result.hours.min} - {result.hours.max} {t('results.hours')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="paragraph">{t('results.tab.paragraph')}</TabsTrigger>
          <TabsTrigger value="packages">{t('results.tab.packages')}</TabsTrigger>
          <TabsTrigger value="breakdown">{t('results.tab.breakdown')}</TabsTrigger>
        </TabsList>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'ml-auto' : 'mr-auto'}`}>
                <FileText className="h-5 w-5" />
                {t('results.breakdown.title')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.breakdown.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <Badge 
                      variant={item.type === 'multiplier' ? 'secondary' : 'outline'}
                      className="font-mono"
                    >
                      {typeof item.amount === 'number' ? `$${item.amount}` : item.amount}
                    </Badge>
                    <span className="text-sm">{isArabic ? item.label_ar : item.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Packages Tab */}
        <TabsContent value="packages" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {result.packages.map((pkg) => (
              <Card 
                key={pkg.name}
                className={`cursor-pointer transition-all ${isArabic ? 'text-right' : 'text-left'} ${
                  selectedPackage === pkg.name 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                <CardHeader>
                  <div className={`flex items-center justify-between ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <CardTitle className="text-lg">{isArabic ? pkg.name_ar : pkg.name}</CardTitle>
                    {selectedPackage === pkg.name ? (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    ) : <div></div>}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">${pkg.price}</span>
                    <span className={`text-sm text-muted-foreground ${isArabic ? 'mr-2' : 'ml-2'}`}>
                      / {pkg.duration_days} {t('results.days')}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Includes */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">{t('results.includes')}</p>
                    <ul className="space-y-1">
                      {(isArabic ? pkg.includes_ar : pkg.includes).slice(0, 4).map((item, i) => (
                        <li key={i} className={`flex items-center gap-2 text-sm ${isArabic ? 'flex-row-reverse' : ''}`}>
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {(isArabic ? pkg.includes_ar : pkg.includes).length > 4 && (
                        <li className={`text-sm text-muted-foreground ${isArabic ? 'mr-5' : 'ml-5'}`}>
                          +{(isArabic ? pkg.includes_ar : pkg.includes).length - 4} {t('results.more')}
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Excludes */}
                  {(isArabic ? pkg.excludes_ar : pkg.excludes).length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-600">{t('results.excludes')}</p>
                      <ul className="space-y-1">
                        {(isArabic ? pkg.excludes_ar : pkg.excludes).slice(0, 2).map((item, i) => (
                          <li key={i} className={`flex items-center gap-2 text-sm text-muted-foreground ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <XCircle className="h-3 w-3 text-red-400 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Paragraph Tab */}
        <TabsContent value="paragraph" className="space-y-4">
          <Card>
            <CardHeader className={isArabic ? "text-right" : "text-left"}>
              <CardTitle className={`text-lg flex items-center gap-2 ${isArabic ? 'ml-auto' : 'mr-auto'}`}>
                <Package className="h-5 w-5" />
                {t('results.paragraph.title')}
              </CardTitle>
              <CardDescription>
                {t('results.paragraph.desc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
                {pricingParagraph}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCopyParagraph}
        >
          {copiedParagraph ? (
            <>
              <Check className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              {t('results.copiedParagraph')}
            </>
          ) : (
            <>
              <Copy className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
              {t('results.copyParagraph')}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
