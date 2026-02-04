// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ===============================
// Types
// ===============================

type ServiceType = 
  | 'landing_page' 
  | 'wordpress_website' 
  | 'woocommerce_store' 
  | 'ui_fixes' 
  | 'api_integration' 
  | 'maintenance' 
  | 'seo_basic';

type PricingModel = 'fixed' | 'hourly';
type Complexity = 'low' | 'medium' | 'high';
type Language = 'arabic' | 'english' | 'both';
type ContentReadiness = 'ready' | 'needs_copywriting';
type DesignType = 'template' | 'custom';
type Urgency = 'normal' | 'rush' | 'extreme';

type Addon = 
  | 'payment_gateway'
  | 'shipping_integration'
  | 'user_accounts'
  | 'admin_dashboard'
  | 'api_sync'
  | 'blog_setup'
  | 'performance_optimization'
  | 'seo_setup';

interface UserSettings {
  hourly_rate: number;
  minimum_project_price: number;
  enable_complexity_multiplier: boolean;
  enable_language_multiplier: boolean;
  enable_content_multiplier: boolean;
  enable_design_multiplier: boolean;
  enable_urgency_multiplier: boolean;
}

interface PricingInput {
  service_type: ServiceType;
  pricing_model: PricingModel;
  complexity: Complexity;
  pages: number;
  products: number;
  languages: Language;
  addons: Addon[];
  content_ready: ContentReadiness;
  design: DesignType;
  urgency: Urgency;
  currency: string;
  api_endpoints?: number;
  user_settings?: Partial<UserSettings>;
}

// ===============================
// Configuration
// ===============================

const DEFAULT_USER_SETTINGS: UserSettings = {
  hourly_rate: 15,
  minimum_project_price: 100,
  enable_complexity_multiplier: true,
  enable_language_multiplier: true,
  enable_content_multiplier: true,
  enable_design_multiplier: true,
  enable_urgency_multiplier: true,
};

const BASE_RATES: Record<ServiceType, number> = {
  landing_page: 150,
  wordpress_website: 350,
  woocommerce_store: 600,
  ui_fixes: 80,
  api_integration: 250,
  maintenance: 120,
  seo_basic: 120,
};

const BASE_HOURS: Record<ServiceType, number> = {
  landing_page: 8,
  wordpress_website: 20,
  woocommerce_store: 35,
  ui_fixes: 4,
  api_integration: 15,
  maintenance: 6,
  seo_basic: 8,
};

const ADDON_PRICES: Record<Addon, number> = {
  payment_gateway: 150,
  shipping_integration: 120,
  user_accounts: 120,
  admin_dashboard: 300,
  api_sync: 250,
  blog_setup: 80,
  performance_optimization: 120,
  seo_setup: 100,
};

const ADDON_HOURS: Record<Addon, number> = {
  payment_gateway: 8,
  shipping_integration: 6,
  user_accounts: 6,
  admin_dashboard: 16,
  api_sync: 12,
  blog_setup: 4,
  performance_optimization: 6,
  seo_setup: 5,
};

const COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.4,
};

const LANGUAGE_MULTIPLIERS: Record<Language, number> = {
  arabic: 1.0,
  english: 1.0,
  both: 1.15,
};

const CONTENT_MULTIPLIERS: Record<ContentReadiness, number> = {
  ready: 1.0,
  needs_copywriting: 1.15,
};

const DESIGN_MULTIPLIERS: Record<DesignType, number> = {
  template: 1.0,
  custom: 1.2,
};

const URGENCY_MULTIPLIERS: Record<Urgency, number> = {
  normal: 1.0,
  rush: 1.25,
  extreme: 1.4,
};

const SERVICE_LABELS: Record<ServiceType, { en: string; ar: string }> = {
  landing_page: { en: 'Landing Page', ar: 'صفحة هبوط' },
  wordpress_website: { en: 'WordPress Website', ar: 'موقع ووردبريس' },
  woocommerce_store: { en: 'WooCommerce Store', ar: 'متجر ووكومرس' },
  ui_fixes: { en: 'UI Fixes', ar: 'إصلاحات واجهة المستخدم' },
  api_integration: { en: 'API Integration', ar: 'ربط API' },
  maintenance: { en: 'Maintenance', ar: 'صيانة' },
  seo_basic: { en: 'SEO Basic', ar: 'تحسين محركات البحث الأساسي' },
};

const ADDON_LABELS: Record<Addon, { en: string; ar: string }> = {
  payment_gateway: { en: 'Payment Gateway', ar: 'بوابة الدفع' },
  shipping_integration: { en: 'Shipping Integration', ar: 'ربط الشحن' },
  user_accounts: { en: 'User Accounts', ar: 'حسابات المستخدمين' },
  admin_dashboard: { en: 'Admin Dashboard', ar: 'لوحة تحكم المدير' },
  api_sync: { en: 'API Sync', ar: 'مزامنة API' },
  blog_setup: { en: 'Blog Setup', ar: 'إعداد المدونة' },
  performance_optimization: { en: 'Performance Optimization', ar: 'تحسين الأداء' },
  seo_setup: { en: 'SEO Setup', ar: 'إعداد SEO' },
};

// ===============================
// Utility Functions
// ===============================

function roundPrice(price: number, currency: string = 'USD'): number {
  const roundTo = currency === 'USD' ? 5 : 10;
  return Math.round(price / roundTo) * roundTo;
}

function getCombinedMultiplier(input: PricingInput, settings: UserSettings): number {
  let multiplier = 1.0;
  
  if (settings.enable_complexity_multiplier) {
    multiplier *= COMPLEXITY_MULTIPLIERS[input.complexity];
  }
  if (settings.enable_language_multiplier) {
    multiplier *= LANGUAGE_MULTIPLIERS[input.languages];
  }
  if (settings.enable_content_multiplier) {
    multiplier *= CONTENT_MULTIPLIERS[input.content_ready];
  }
  if (settings.enable_design_multiplier) {
    multiplier *= DESIGN_MULTIPLIERS[input.design];
  }
  if (settings.enable_urgency_multiplier) {
    multiplier *= URGENCY_MULTIPLIERS[input.urgency];
  }
  
  return multiplier;
}

function calculateExtras(input: PricingInput): { price: number; hours: number } {
  let extraPrice = 0;
  let extraHours = 0;
  
  if (['wordpress_website', 'woocommerce_store', 'landing_page'].includes(input.service_type)) {
    const includedPages = input.service_type === 'landing_page' ? 1 : 5;
    const extraPages = Math.max(0, input.pages - includedPages);
    extraPrice += extraPages * 30;
    extraHours += extraPages * 1.5;
  }
  
  if (input.service_type === 'woocommerce_store' && input.products > 20) {
    const extraProducts = input.products - 20;
    extraPrice += extraProducts * 2;
    extraHours += Math.ceil(extraProducts / 10) * 0.5;
  }
  
  if (input.service_type === 'api_integration' && input.api_endpoints && input.api_endpoints > 1) {
    const extraEndpoints = input.api_endpoints - 1;
    extraPrice += extraEndpoints * 50;
    extraHours += extraEndpoints * 3;
  }
  
  return { price: extraPrice, hours: extraHours };
}

// ===============================
// Main Calculation
// ===============================

function calculatePricing(input: PricingInput) {
  const settings: UserSettings = {
    ...DEFAULT_USER_SETTINGS,
    ...input.user_settings,
  };
  
  const breakdown = [];
  
  // Base price
  const basePrice = BASE_RATES[input.service_type];
  const baseHours = BASE_HOURS[input.service_type];
  
  breakdown.push({
    label: `Base (${SERVICE_LABELS[input.service_type].en})`,
    label_ar: `الأساس (${SERVICE_LABELS[input.service_type].ar})`,
    amount: basePrice,
    type: 'base',
  });
  
  // Add-ons
  let addonsPrice = 0;
  let addonsHours = 0;
  
  for (const addon of input.addons) {
    const addonPrice = ADDON_PRICES[addon];
    addonsPrice += addonPrice;
    addonsHours += ADDON_HOURS[addon];
    
    breakdown.push({
      label: `Add-on: ${ADDON_LABELS[addon].en}`,
      label_ar: `إضافة: ${ADDON_LABELS[addon].ar}`,
      amount: addonPrice,
      type: 'addon',
    });
  }
  
  // Extras
  const extras = calculateExtras(input);
  if (extras.price > 0) {
    breakdown.push({
      label: 'Extra pages/products',
      label_ar: 'صفحات/منتجات إضافية',
      amount: extras.price,
      type: 'extra',
    });
  }
  
  // Subtotal
  const subtotal = basePrice + addonsPrice + extras.price;
  const subtotalHours = baseHours + addonsHours + extras.hours;
  
  // Multipliers
  const multiplier = getCombinedMultiplier(input, settings);
  
  if (settings.enable_complexity_multiplier && COMPLEXITY_MULTIPLIERS[input.complexity] !== 1.0) {
    const mult = COMPLEXITY_MULTIPLIERS[input.complexity];
    breakdown.push({
      label: `Multiplier: Complexity (${input.complexity} ×${mult})`,
      label_ar: `معامل: التعقيد ×${mult}`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_language_multiplier && LANGUAGE_MULTIPLIERS[input.languages] !== 1.0) {
    const mult = LANGUAGE_MULTIPLIERS[input.languages];
    breakdown.push({
      label: `Multiplier: Languages (Both ×${mult})`,
      label_ar: `معامل: اللغات ×${mult}`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_content_multiplier && CONTENT_MULTIPLIERS[input.content_ready] !== 1.0) {
    const mult = CONTENT_MULTIPLIERS[input.content_ready];
    breakdown.push({
      label: `Multiplier: Content ×${mult}`,
      label_ar: `معامل: المحتوى ×${mult}`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_design_multiplier && DESIGN_MULTIPLIERS[input.design] !== 1.0) {
    const mult = DESIGN_MULTIPLIERS[input.design];
    breakdown.push({
      label: `Multiplier: Design (Custom ×${mult})`,
      label_ar: `معامل: التصميم ×${mult}`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_urgency_multiplier && URGENCY_MULTIPLIERS[input.urgency] !== 1.0) {
    const mult = URGENCY_MULTIPLIERS[input.urgency];
    breakdown.push({
      label: `Multiplier: Urgency ×${mult}`,
      label_ar: `معامل: الاستعجال ×${mult}`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  // Final calculations
  let typicalPrice = subtotal * multiplier;
  typicalPrice = Math.max(typicalPrice, settings.minimum_project_price);
  typicalPrice = roundPrice(typicalPrice, input.currency);
  
  const minPrice = roundPrice(typicalPrice * 0.85, input.currency);
  const maxPrice = roundPrice(typicalPrice * 1.20, input.currency);
  
  const typicalHours = subtotalHours * multiplier;
  const minHours = Math.round(typicalHours * 0.85);
  const maxHours = Math.round(typicalHours * 1.15);
  
  // Generate packages
  const baseDays = Math.ceil(typicalHours / 6);
  
  const packages = [
    {
      name: 'Basic',
      name_ar: 'أساسي',
      price: roundPrice(typicalPrice * 0.9, input.currency),
      duration_days: `${baseDays}-${baseDays + 3}`,
      includes: [`${SERVICE_LABELS[input.service_type].en} development`, 'Responsive design', 'Basic testing'],
      includes_ar: [`تطوير ${SERVICE_LABELS[input.service_type].ar}`, 'تصميم متجاوب', 'اختبار أساسي'],
      excludes: ['Performance optimization', 'SEO setup', 'Extended support'],
      excludes_ar: ['تحسين الأداء', 'إعداد SEO', 'دعم ممتد'],
    },
    {
      name: 'Standard',
      name_ar: 'قياسي',
      price: typicalPrice,
      duration_days: `${baseDays}-${baseDays + 3}`,
      includes: [`${SERVICE_LABELS[input.service_type].en} development`, 'Responsive design', 'Basic testing', 'Performance optimization', 'Basic SEO setup'],
      includes_ar: [`تطوير ${SERVICE_LABELS[input.service_type].ar}`, 'تصميم متجاوب', 'اختبار أساسي', 'تحسين الأداء', 'إعداد SEO أساسي'],
      excludes: ['Extended support', 'Training', 'Documentation'],
      excludes_ar: ['دعم ممتد', 'تدريب', 'توثيق'],
    },
    {
      name: 'Premium',
      name_ar: 'متميز',
      price: roundPrice(typicalPrice * 1.25, input.currency),
      duration_days: `${baseDays + 2}-${baseDays + 7}`,
      includes: [`${SERVICE_LABELS[input.service_type].en} development`, 'Responsive design', 'Full testing', 'Performance optimization', 'SEO setup', '1 month support', 'Documentation'],
      includes_ar: [`تطوير ${SERVICE_LABELS[input.service_type].ar}`, 'تصميم متجاوب', 'اختبار شامل', 'تحسين الأداء', 'إعداد SEO', 'دعم لمدة شهر', 'توثيق'],
      excludes: [],
      excludes_ar: [],
    },
  ];
  
  // Generate pricing paragraph
  const serviceLabel = SERVICE_LABELS[input.service_type].ar;
  const daysMin = Math.ceil(minHours / 6);
  const daysMax = Math.ceil(maxHours / 6);
  
  const includesList = [serviceLabel];
  if (input.addons.length > 0) {
    const topAddons = input.addons.slice(0, 3).map(a => ADDON_LABELS[a].ar);
    includesList.push(...topAddons);
  }
  
  const excludes = [];
  if (!input.addons.includes('seo_setup')) excludes.push('تحسين SEO متقدم');
  if (!input.addons.includes('performance_optimization')) excludes.push('الصيانة الشهرية');
  
  let pricing_paragraph_ar = `💰 **نطاق السعر المقترح:** ${minPrice} - ${maxPrice} دولار (السعر النموذجي: ${typicalPrice} دولار)\n`;
  pricing_paragraph_ar += `⏱️ **مدة التنفيذ المتوقعة:** ${daysMin}-${daysMax} أيام عمل\n\n`;
  pricing_paragraph_ar += `✅ **يشمل السعر:**\n`;
  includesList.forEach(item => {
    pricing_paragraph_ar += `• ${item}\n`;
  });
  
  if (excludes.length > 0) {
    pricing_paragraph_ar += `\n❌ **لا يشمل:** ${excludes.join('، ')}\n`;
  }
  
  return {
    typical_price: typicalPrice,
    min_price: minPrice,
    max_price: maxPrice,
    hours: { min: minHours, max: maxHours },
    breakdown,
    packages,
    pricing_paragraph_ar,
  };
}

// ===============================
// Validation
// ===============================

function validateInput(input: Partial<PricingInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  const validServiceTypes = ['landing_page', 'wordpress_website', 'woocommerce_store', 'ui_fixes', 'api_integration', 'maintenance', 'seo_basic'];
  if (!input.service_type || !validServiceTypes.includes(input.service_type)) {
    errors.push('Invalid or missing service_type');
  }
  
  if (!input.pricing_model || !['fixed', 'hourly'].includes(input.pricing_model)) {
    errors.push('Invalid or missing pricing_model');
  }
  
  if (!input.complexity || !['low', 'medium', 'high'].includes(input.complexity)) {
    errors.push('Invalid or missing complexity');
  }
  
  if (!input.languages || !['arabic', 'english', 'both'].includes(input.languages)) {
    errors.push('Invalid or missing languages');
  }
  
  if (!input.content_ready || !['ready', 'needs_copywriting'].includes(input.content_ready)) {
    errors.push('Invalid or missing content_ready');
  }
  
  if (!input.design || !['template', 'custom'].includes(input.design)) {
    errors.push('Invalid or missing design');
  }
  
  if (!input.urgency || !['normal', 'rush', 'extreme'].includes(input.urgency)) {
    errors.push('Invalid or missing urgency');
  }
  
  return { valid: errors.length === 0, errors };
}

// ===============================
// Server Handler
// ===============================

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const input: PricingInput = await req.json();
    
    // Validate input
    const validation = validateInput(input);
    if (!validation.valid) {
      return new Response(
        JSON.stringify({ error: "Validation failed", details: validation.errors }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Set defaults
    input.pages = input.pages || 0;
    input.products = input.products || 0;
    input.addons = input.addons || [];
    input.currency = input.currency || 'USD';
    
    // Calculate pricing
    const result = calculatePricing(input);
    
    return new Response(
      JSON.stringify(result),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in estimate-pricing function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
