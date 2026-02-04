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

interface PricingResultsProps {
  result: PricingResult;
  onSendToProposal: (pricingParagraph: string, selectedPrice: number) => void;
}

export function PricingResults({ result, onSendToProposal }: PricingResultsProps) {
  const [copiedParagraph, setCopiedParagraph] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>("Standard");
  const { toast } = useToast();

  const handleCopyParagraph = async () => {
    try {
      await navigator.clipboard.writeText(result.pricing_paragraph_ar);
      setCopiedParagraph(true);
      toast({
        title: "تم النسخ",
        description: "تم نسخ فقرة التسعير إلى الحافظة",
      });
      setTimeout(() => setCopiedParagraph(false), 2000);
    } catch {
      toast({
        title: "فشل النسخ",
        description: "لم نتمكن من نسخ النص",
        variant: "destructive",
      });
    }
  };

  const handleSendToProposal = () => {
    const pkg = result.packages.find(p => p.name === selectedPackage);
    const price = pkg?.price || result.typical_price;
    onSendToProposal(result.pricing_paragraph_ar, price);
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
              <div>
                <p className="text-sm text-green-600 dark:text-green-400 font-medium">الحد الأدنى</p>
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
              <div>
                <p className="text-sm text-primary font-medium">السعر النموذجي</p>
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
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">الحد الأقصى</p>
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
            <div>
              <p className="text-sm text-muted-foreground font-medium">الساعات المقدرة</p>
              <p className="text-xl font-semibold">
                {result.hours.min} - {result.hours.max} ساعة
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs for different sections */}
      <Tabs defaultValue="breakdown" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="breakdown">تفصيل البنود</TabsTrigger>
          <TabsTrigger value="packages">الباقات</TabsTrigger>
          <TabsTrigger value="paragraph">فقرة التسعير</TabsTrigger>
        </TabsList>

        {/* Breakdown Tab */}
        <TabsContent value="breakdown" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                تفصيل حساب السعر
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.breakdown.map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-sm">{item.label_ar}</span>
                    <Badge 
                      variant={item.type === 'multiplier' ? 'secondary' : 'outline'}
                      className="font-mono"
                    >
                      {typeof item.amount === 'number' ? `$${item.amount}` : item.amount}
                    </Badge>
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
                className={`cursor-pointer transition-all ${
                  selectedPackage === pkg.name 
                    ? 'ring-2 ring-primary border-primary' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => setSelectedPackage(pkg.name)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{pkg.name_ar}</CardTitle>
                    {selectedPackage === pkg.name && (
                      <CheckCircle className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <CardDescription>
                    <span className="text-2xl font-bold text-foreground">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground mr-2">
                      / {pkg.duration_days} أيام
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Includes */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-green-600">يشمل:</p>
                    <ul className="space-y-1">
                      {pkg.includes_ar.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                      {pkg.includes_ar.length > 4 && (
                        <li className="text-sm text-muted-foreground">
                          +{pkg.includes_ar.length - 4} المزيد
                        </li>
                      )}
                    </ul>
                  </div>

                  {/* Excludes */}
                  {pkg.excludes_ar.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-red-600">لا يشمل:</p>
                      <ul className="space-y-1">
                        {pkg.excludes_ar.slice(0, 2).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
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
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5" />
                فقرة التسعير الجاهزة
              </CardTitle>
              <CardDescription>
                انسخ هذه الفقرة وألصقها في عرضك
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap text-sm leading-relaxed">
                {result.pricing_paragraph_ar}
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
              <Check className="h-4 w-4 ml-2" />
              تم النسخ
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 ml-2" />
              نسخ فقرة التسعير
            </>
          )}
        </Button>

        <Button
          className="flex-1"
          onClick={handleSendToProposal}
        >
          <Send className="h-4 w-4 ml-2" />
          أرسل إلى مولّد العرض ({selectedPackage})
        </Button>
      </div>
    </div>
  );
}
