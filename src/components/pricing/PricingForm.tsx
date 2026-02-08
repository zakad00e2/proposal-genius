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
import { usePlatform } from "@/hooks/usePlatform";

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
  const [complexity, setComplexity] = useState<Complexity>('medium');
  const [pages, setPages] = useState<number>(5);
  const [products, setProducts] = useState<number>(0);
  const [languages, setLanguages] = useState<Language>('arabic');
  const [addons, setAddons] = useState<Addon[]>([]);
  const [contentReady, setContentReady] = useState<ContentReadiness>('ready');
  const [design, setDesign] = useState<DesignType>('template');
  const [urgency, setUrgency] = useState<Urgency>('normal');
  const [apiEndpoints, setApiEndpoints] = useState<number>(1);
  const { lang, isArabic, t } = usePlatform();

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
      pricing_model: 'fixed',
      complexity,
      pages: showPages ? pages : 0,
      products: showProducts ? products : 0,
      languages,
      addons,
      content_ready: contentReady,
      design,
      urgency,
      currency: 'USD',
      api_endpoints: showApiEndpoints ? apiEndpoints : undefined,
    };
    
    await onCalculate(input);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Service Type */}
        <div className="space-y-2">
          <Label htmlFor="service-type" className="text-sm font-medium">
            {t('pricingForm.serviceType')}
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
                  {SERVICE_LABELS[type][lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Complexity */}
        <div className="space-y-2">
          <Label htmlFor="complexity" className="text-sm font-medium">
            {t('pricingForm.complexity')}
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
              <SelectItem value="low">{t('pricingForm.complexity.low')}</SelectItem>
              <SelectItem value="medium">{t('pricingForm.complexity.medium')}</SelectItem>
              <SelectItem value="high">{t('pricingForm.complexity.high')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Languages */}
        <div className="space-y-2">
          <Label htmlFor="languages" className="text-sm font-medium">
            {t('pricingForm.languages')}
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
              <SelectItem value="arabic">{t('pricingForm.languages.arabic')}</SelectItem>
              <SelectItem value="english">{t('pricingForm.languages.english')}</SelectItem>
              <SelectItem value="both">{t('pricingForm.languages.both')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Fields: Pages, Products, API */}
        {showPages && (
          <div className="space-y-2">
            <Label htmlFor="pages" className="text-sm font-medium">
              {t('pricingForm.pages')}
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
              {t('pricingForm.products')}
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
              {t('pricingForm.apiEndpoints')}
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

        {/* Content Readiness */}
        <div className="space-y-2">
          <Label htmlFor="content-ready" className="text-sm font-medium">
            {t('pricingForm.contentReady')}
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
              <SelectItem value="ready">{t('pricingForm.contentReady.ready')}</SelectItem>
              <SelectItem value="needs_copywriting">{t('pricingForm.contentReady.needs')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Design */}
        <div className="space-y-2">
          <Label htmlFor="design" className="text-sm font-medium">
            {t('pricingForm.design')}
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
              <SelectItem value="template">{t('pricingForm.design.template')}</SelectItem>
              <SelectItem value="custom">{t('pricingForm.design.custom')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Urgency */}
        <div className="space-y-2">
          <Label htmlFor="urgency" className="text-sm font-medium">
            {t('pricingForm.urgency')}
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
              <SelectItem value="normal">{t('pricingForm.urgency.normal')}</SelectItem>
              <SelectItem value="rush">{t('pricingForm.urgency.rush')}</SelectItem>
              <SelectItem value="extreme">{t('pricingForm.urgency.extreme')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Add-ons */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('pricingForm.addons')}</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ADDON_OPTIONS.map((addon) => (
            <div key={addon} className={`flex items-center space-x-2 ${isArabic ? 'space-x-reverse' : ''}`}>
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
                {ADDON_LABELS[addon][lang]}
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
            <Loader2 className={`h-4 w-4 animate-spin ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {t('pricingForm.submitting')}
          </>
        ) : (
          <>
            <Calculator className={`h-4 w-4 ${isArabic ? 'ml-2' : 'mr-2'}`} />
            {t('pricingForm.submit')}
          </>
        )}
      </Button>
    </form>
  );
}
