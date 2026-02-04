import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Calculator } from "lucide-react";
import {
  PricingInput,
  ServiceType,
  PricingModel,
  Complexity,
  Language,
  ContentReadiness,
  DesignType,
  Urgency,
  Addon,
  ADDON_LABELS,
  SERVICE_LABELS,
} from "@/lib/pricingEngine";

interface PricingFormProps {
  onCalculate: (input: PricingInput) => Promise<void>;
  isLoading: boolean;
}

const ADDON_OPTIONS: Addon[] = [
  'payment_gateway',
  'shipping_integration',
  'user_accounts',
  'admin_dashboard',
  'api_sync',
  'blog_setup',
  'performance_optimization',
  'seo_setup',
];

export function PricingForm({ onCalculate, isLoading }: PricingFormProps) {
  const [serviceType, setServiceType] = useState<ServiceType>('wordpress_website');
  const [pricingModel, setPricingModel] = useState<PricingModel>('fixed');
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [pages, setPages] = useState<number>(5);
  const [products, setProducts] = useState<number>(0);
  const [languages, setLanguages] = useState<Language>('arabic');
  const [addons, setAddons] = useState<Addon[]>([]);
  const [contentReady, setContentReady] = useState<ContentReadiness>('ready');
  const [design, setDesign] = useState<DesignType>('template');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [currency, setCurrency] = useState<string>('USD');
  const [apiEndpoints, setApiEndpoints] = useState<number>(1);

  const showProducts = serviceType === 'woocommerce_store';
  const showPages = ['wordpress_website', 'woocommerce_store', 'landing_page'].includes(serviceType);
  const showApiEndpoints = serviceType === 'api_integration';

  const handleAddonToggle = (addon: Addon) => {
    setAddons(prev => 
      prev.includes(addon)
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const input: PricingInput = {
      service_type: serviceType,
      pricing_model: pricingModel,
      complexity,
      pages: showPages ? pages : 0,
      products: showProducts ? products : 0,
      languages,
      addons,
      content_ready: contentReady,
      design,
      urgency,
      currency,
      api_endpoints: showApiEndpoints ? apiEndpoints : undefined,
    };
    
    await onCalculate(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Row 1: Service Type & Pricing Model */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="service-type" className="text-sm font-medium">
            نوع الخدمة
          </Label>
          <Select
            value={serviceType}
            onValueChange={(value: ServiceType) => setServiceType(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="service-type" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(SERVICE_LABELS) as ServiceType[]).map((type) => (
                <SelectItem key={type} value={type}>
                  {SERVICE_LABELS[type].ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pricing-model" className="text-sm font-medium">
            نموذج التسعير
          </Label>
          <Select
            value={pricingModel}
            onValueChange={(value: PricingModel) => setPricingModel(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="pricing-model" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fixed">سعر ثابت</SelectItem>
              <SelectItem value="hourly">بالساعة</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 2: Complexity & Languages */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="complexity" className="text-sm font-medium">
            مستوى التعقيد
          </Label>
          <Select
            value={complexity}
            onValueChange={(value: Complexity) => setComplexity(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="complexity" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">منخفض</SelectItem>
              <SelectItem value="medium">متوسط</SelectItem>
              <SelectItem value="high">عالي</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="languages" className="text-sm font-medium">
            لغات الموقع
          </Label>
          <Select
            value={languages}
            onValueChange={(value: Language) => setLanguages(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="languages" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="arabic">عربي (RTL)</SelectItem>
              <SelectItem value="english">إنجليزي</SelectItem>
              <SelectItem value="both">كلاهما</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3: Pages & Products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {showPages && (
          <div className="space-y-2">
            <Label htmlFor="pages" className="text-sm font-medium">
              عدد الصفحات
            </Label>
            <Input
              id="pages"
              type="number"
              min="1"
              max="100"
              value={pages}
              onChange={(e) => setPages(parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="bg-background"
            />
          </div>
        )}

        {showProducts && (
          <div className="space-y-2">
            <Label htmlFor="products" className="text-sm font-medium">
              عدد المنتجات
            </Label>
            <Input
              id="products"
              type="number"
              min="0"
              max="10000"
              value={products}
              onChange={(e) => setProducts(parseInt(e.target.value) || 0)}
              disabled={isLoading}
              className="bg-background"
            />
          </div>
        )}

        {showApiEndpoints && (
          <div className="space-y-2">
            <Label htmlFor="api-endpoints" className="text-sm font-medium">
              عدد نقاط API
            </Label>
            <Input
              id="api-endpoints"
              type="number"
              min="1"
              max="20"
              value={apiEndpoints}
              onChange={(e) => setApiEndpoints(parseInt(e.target.value) || 1)}
              disabled={isLoading}
              className="bg-background"
            />
          </div>
        )}
      </div>

      {/* Row 4: Content & Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="content-ready" className="text-sm font-medium">
            جاهزية المحتوى
          </Label>
          <Select
            value={contentReady}
            onValueChange={(value: ContentReadiness) => setContentReady(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="content-ready" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ready">جاهز</SelectItem>
              <SelectItem value="needs_copywriting">يحتاج كتابة محتوى</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="design" className="text-sm font-medium">
            التصميم
          </Label>
          <Select
            value={design}
            onValueChange={(value: DesignType) => setDesign(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="design" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="template">استخدام قالب جاهز</SelectItem>
              <SelectItem value="custom">تصميم مخصص</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 5: Urgency & Currency */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="urgency" className="text-sm font-medium">
            الاستعجال
          </Label>
          <Select
            value={urgency}
            onValueChange={(value: Urgency) => setUrgency(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="urgency" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">عادي</SelectItem>
              <SelectItem value="rush">مستعجل (&lt;7 أيام)</SelectItem>
              <SelectItem value="extreme">طارئ (&lt;3 أيام)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency" className="text-sm font-medium">
            العملة
          </Label>
          <Select
            value={currency}
            onValueChange={(value: string) => setCurrency(value)}
            disabled={isLoading}
          >
            <SelectTrigger id="currency" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
              <SelectItem value="EUR">يورو (EUR)</SelectItem>
              <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
              <SelectItem value="AED">درهم إماراتي (AED)</SelectItem>
              <SelectItem value="EGP">جنيه مصري (EGP)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add-ons */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">ميزات إضافية</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ADDON_OPTIONS.map((addon) => (
            <div key={addon} className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id={addon}
                checked={addons.includes(addon)}
                onCheckedChange={() => handleAddonToggle(addon)}
                disabled={isLoading}
              />
              <Label
                htmlFor={addon}
                className="text-sm font-normal cursor-pointer"
              >
                {ADDON_LABELS[addon].ar}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin ml-2" />
            جارٍ الحساب...
          </>
        ) : (
          <>
            <Calculator className="h-4 w-4 ml-2" />
            احسب السعر
          </>
        )}
      </Button>
    </form>
  );
}
