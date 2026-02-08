// Pricing Engine - محرك التسعير
// قابل للتعديل والتخصيص حسب احتياجات المستخدم

// ===============================
// Types & Interfaces
// ===============================

export type ServiceType = 
  | 'landing_page' 
  | 'wordpress_website' 
  | 'woocommerce_store' 
  | 'ui_fixes' 
  | 'api_integration' 
  | 'maintenance' 
  | 'seo_basic';

export type PricingModel = 'fixed' | 'hourly';
export type Complexity = 'low' | 'medium' | 'high';
export type Language = 'arabic' | 'english' | 'both';
export type ContentReadiness = 'ready' | 'needs_copywriting';
export type DesignType = 'template' | 'custom';
export type Urgency = 'normal' | 'rush' | 'extreme';

export type Addon = 
  | 'payment_gateway'
  | 'shipping_integration'
  | 'user_accounts'
  | 'admin_dashboard'
  | 'api_sync'
  | 'blog_setup'
  | 'performance_optimization'
  | 'seo_setup';

export interface UserSettings {
  hourly_rate: number;
  minimum_project_price: number;
  enable_complexity_multiplier: boolean;
  enable_language_multiplier: boolean;
  enable_content_multiplier: boolean;
  enable_design_multiplier: boolean;
  enable_urgency_multiplier: boolean;
}

export interface PricingInput {
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

export interface BreakdownItem {
  label: string;
  label_ar: string;
  amount: number | string;
  type: 'base' | 'addon' | 'multiplier' | 'extra';
}

export interface Package {
  name: string;
  name_ar: string;
  price: number;
  duration_days: string;
  includes: string[];
  includes_ar: string[];
  excludes: string[];
  excludes_ar: string[];
}

export interface PricingResult {
  typical_price: number;
  min_price: number;
  max_price: number;
  hours: {
    min: number;
    max: number;
  };
  breakdown: BreakdownItem[];
  packages: Package[];
  pricing_paragraph_ar: string;
  pricing_paragraph_en: string;
}

// ===============================
// Default Configuration
// ===============================

export const DEFAULT_USER_SETTINGS: UserSettings = {
  hourly_rate: 15,
  minimum_project_price: 100,
  enable_complexity_multiplier: true,
  enable_language_multiplier: true,
  enable_content_multiplier: true,
  enable_design_multiplier: true,
  enable_urgency_multiplier: true,
};

// Base rates for each service type (in USD)
export const BASE_RATES: Record<ServiceType, number> = {
  landing_page: 50,
  wordpress_website: 100,
  woocommerce_store: 250,
  ui_fixes: 40,
  api_integration: 70,
  maintenance: 70,
  seo_basic: 60,
};

// Base hours for each service type
export const BASE_HOURS: Record<ServiceType, number> = {
  landing_page: 8,
  wordpress_website: 15,
  woocommerce_store: 25,
  ui_fixes: 10,
  api_integration: 15,
  maintenance: 10,
  seo_basic: 10,
};

// Add-on prices
export const ADDON_PRICES: Record<Addon, number> = {
  payment_gateway: 30,
  shipping_integration: 40,
  user_accounts: 40,
  admin_dashboard: 60,
  api_sync: 60,
  blog_setup: 40,
  performance_optimization: 50,
  seo_setup: 50,
};

// Add-on hours
export const ADDON_HOURS: Record<Addon, number> = {
  payment_gateway: 8,
  shipping_integration: 6,
  user_accounts: 6,
  admin_dashboard: 16,
  api_sync: 12,
  blog_setup: 4,
  performance_optimization: 6,
  seo_setup: 5,
};

// Multipliers
export const COMPLEXITY_MULTIPLIERS: Record<Complexity, number> = {
  low: 1.0,
  medium: 1.2,
  high: 1.4,
};

export const LANGUAGE_MULTIPLIERS: Record<Language, number> = {
  arabic: 1.0,
  english: 1.0,
  both: 1.15,
};

export const CONTENT_MULTIPLIERS: Record<ContentReadiness, number> = {
  ready: 1.0,
  needs_copywriting: 1.15,
};

export const DESIGN_MULTIPLIERS: Record<DesignType, number> = {
  template: 1.0,
  custom: 1.2,
};

export const URGENCY_MULTIPLIERS: Record<Urgency, number> = {
  normal: 1.0,
  rush: 1.25,
  extreme: 1.4,
};

// Label translations
export const SERVICE_LABELS: Record<ServiceType, { en: string; ar: string }> = {
  landing_page: { en: 'Landing Page', ar: 'صفحة هبوط' },
  wordpress_website: { en: 'WordPress Website', ar: 'موقع ووردبريس' },
  woocommerce_store: { en: 'WooCommerce Store', ar: 'متجر ووكومرس' },
  ui_fixes: { en: 'UI Fixes', ar: 'إصلاحات واجهة المستخدم' },
  api_integration: { en: 'API Integration', ar: 'ربط API' },
  maintenance: { en: 'Maintenance', ar: 'صيانة' },
  seo_basic: { en: 'SEO Basic', ar: 'تحسين محركات البحث الأساسي' },
};

export const ADDON_LABELS: Record<Addon, { en: string; ar: string }> = {
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

/**
 * Round price to nearest 5 or 10 based on currency
 */
export function roundPrice(price: number, currency: string = 'USD'): number {
  const roundTo = currency === 'USD' ? 5 : 10;
  return Math.round(price / roundTo) * roundTo;
}

/**
 * Get combined multiplier based on settings
 */
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

/**
 * Calculate page/product extras
 */
function calculateExtras(input: PricingInput): { price: number; hours: number } {
  let extraPrice = 0;
  let extraHours = 0;
  
  // Extra pages (charge for every page for websites, first page included for landing page)
  if (['wordpress_website', 'woocommerce_store', 'landing_page'].includes(input.service_type)) {
    const includedPages = input.service_type === 'landing_page' ? 1 : 0;
    const extraPages = Math.max(0, input.pages - includedPages);
    extraPrice += extraPages * 30; // $30 per extra page
    extraHours += extraPages * 1.5; // 1.5 hours per extra page
  }
  
  // Extra products for WooCommerce (after first 20)
  if (input.service_type === 'woocommerce_store' && input.products > 20) {
    const extraProducts = input.products - 20;
    extraPrice += extraProducts * 2; // $2 per extra product
    extraHours += Math.ceil(extraProducts / 10) * 0.5; // 0.5 hours per 10 products
  }
  
  // Extra API endpoints
  if (input.service_type === 'api_integration' && input.api_endpoints && input.api_endpoints > 1) {
    const extraEndpoints = input.api_endpoints - 1;
    extraPrice += extraEndpoints * 50; // $50 per extra endpoint
    extraHours += extraEndpoints * 3; // 3 hours per extra endpoint
  }
  
  return { price: extraPrice, hours: extraHours };
}

// ===============================
// Main Calculation Function
// ===============================

export function calculatePricing(input: PricingInput): PricingResult {
  const settings: UserSettings = {
    ...DEFAULT_USER_SETTINGS,
    ...input.user_settings,
  };
  
  const breakdown: BreakdownItem[] = [];
  
  // 1. Base price
  const basePrice = BASE_RATES[input.service_type];
  const baseHours = BASE_HOURS[input.service_type];
  
  breakdown.push({
    label: `Base (${SERVICE_LABELS[input.service_type].en})`,
    label_ar: `الأساس (${SERVICE_LABELS[input.service_type].ar})`,
    amount: basePrice,
    type: 'base',
  });
  
  // 2. Add-ons
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
  
  // 3. Extras (pages, products, endpoints)
  const extras = calculateExtras(input);
  if (extras.price > 0) {
    breakdown.push({
      label: 'Extra pages/products',
      label_ar: 'صفحات/منتجات إضافية',
      amount: extras.price,
      type: 'extra',
    });
  }
  
  // 4. Calculate subtotal before multipliers
  const subtotal = basePrice + addonsPrice + extras.price;
  const subtotalHours = baseHours + addonsHours + extras.hours;
  
  // 5. Apply multipliers
  const multiplier = getCombinedMultiplier(input, settings);
  
  // Add multiplier breakdown items
  if (settings.enable_complexity_multiplier && COMPLEXITY_MULTIPLIERS[input.complexity] !== 1.0) {
    const mult = COMPLEXITY_MULTIPLIERS[input.complexity];
    breakdown.push({
      label: `Multiplier: Complexity (${input.complexity} ×${mult})`,
      label_ar: `معامل: التعقيد (${input.complexity === 'low' ? 'منخفض' : input.complexity === 'medium' ? 'متوسط' : 'عالي'} ×${mult})`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_language_multiplier && LANGUAGE_MULTIPLIERS[input.languages] !== 1.0) {
    const mult = LANGUAGE_MULTIPLIERS[input.languages];
    breakdown.push({
      label: `Multiplier: Languages (Both ×${mult})`,
      label_ar: `معامل: اللغات (كلاهما ×${mult})`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_content_multiplier && CONTENT_MULTIPLIERS[input.content_ready] !== 1.0) {
    const mult = CONTENT_MULTIPLIERS[input.content_ready];
    breakdown.push({
      label: `Multiplier: Content (Needs Copywriting ×${mult})`,
      label_ar: `معامل: المحتوى (يحتاج كتابة ×${mult})`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_design_multiplier && DESIGN_MULTIPLIERS[input.design] !== 1.0) {
    const mult = DESIGN_MULTIPLIERS[input.design];
    breakdown.push({
      label: `Multiplier: Design (Custom ×${mult})`,
      label_ar: `معامل: التصميم (مخصص ×${mult})`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  if (settings.enable_urgency_multiplier && URGENCY_MULTIPLIERS[input.urgency] !== 1.0) {
    const mult = URGENCY_MULTIPLIERS[input.urgency];
    const urgencyLabel = input.urgency === 'rush' ? 'Rush <7 days' : 'Extreme <3 days';
    const urgencyLabelAr = input.urgency === 'rush' ? 'مستعجل <7 أيام' : 'طارئ <3 أيام';
    breakdown.push({
      label: `Multiplier: Urgency (${urgencyLabel} ×${mult})`,
      label_ar: `معامل: الاستعجال (${urgencyLabelAr} ×${mult})`,
      amount: `+${Math.round((mult - 1) * 100)}%`,
      type: 'multiplier',
    });
  }
  
  // 6. Calculate final typical price
  let typicalPrice = subtotal * multiplier;
  
  // Apply minimum project price
  typicalPrice = Math.max(typicalPrice, settings.minimum_project_price);
  
  // Round typical price
  typicalPrice = roundPrice(typicalPrice, input.currency);
  
  // 7. Calculate price range
  const minPrice = roundPrice(typicalPrice * 0.85, input.currency);
  const maxPrice = roundPrice(typicalPrice * 1.20, input.currency);
  
  // 8. Calculate hours
  const typicalHours = subtotalHours * multiplier;
  const minHours = Math.round(typicalHours * 0.85);
  const maxHours = Math.round(typicalHours * 1.15);
  
  // 9. Generate packages
  const packages = generatePackages(input, typicalPrice, typicalHours);
  
  // 10. Generate pricing paragraphs
  const pricing_paragraph_ar = generatePricingParagraphAr(input, typicalPrice, minPrice, maxPrice, minHours, maxHours);
  const pricing_paragraph_en = generatePricingParagraphEn(input, typicalPrice, minPrice, maxPrice, minHours, maxHours);
  
  return {
    typical_price: typicalPrice,
    min_price: minPrice,
    max_price: maxPrice,
    hours: {
      min: minHours,
      max: maxHours,
    },
    breakdown,
    packages,
    pricing_paragraph_ar,
    pricing_paragraph_en,
  };
}

// ===============================
// Package Generation
// ===============================

function generatePackages(input: PricingInput, typicalPrice: number, typicalHours: number): Package[] {
  const serviceLabel = SERVICE_LABELS[input.service_type];
  
  // Base includes for all packages
  const baseIncludes = {
    en: [
      `${serviceLabel.en} development`,
      'Responsive design',
      'Basic testing',
    ],
    ar: [
      `تطوير ${serviceLabel.ar}`,
      'تصميم متجاوب',
      'اختبار أساسي',
    ],
  };
  
  // Standard additions
  const standardAdditions = {
    en: ['Performance optimization', 'Basic SEO setup', 'Browser compatibility'],
    ar: ['تحسين الأداء', 'إعداد SEO أساسي', 'توافق المتصفحات'],
  };
  
  // Premium additions
  const premiumAdditions = {
    en: ['1 month support', 'Priority revisions', 'Documentation', 'Training session'],
    ar: ['دعم لمدة شهر', 'مراجعات ذات أولوية', 'توثيق', 'جلسة تدريبية'],
  };
  
  // Calculate durations based on hours
  const baseDays = Math.ceil(typicalHours / 6); // Assuming 6 productive hours per day
  
  const packages: Package[] = [
    {
      name: 'Basic',
      name_ar: 'أساسي',
      price: roundPrice(typicalPrice * 0.9, input.currency),
      duration_days: `${baseDays}-${baseDays + 3}`,
      includes: baseIncludes.en,
      includes_ar: baseIncludes.ar,
      excludes: {
        en: ['Performance optimization', 'SEO setup', 'Extended support'],
        ar: ['تحسين الأداء', 'إعداد SEO', 'دعم ممتد'],
      }.en,
      excludes_ar: ['تحسين الأداء', 'إعداد SEO', 'دعم ممتد'],
    },
    {
      name: 'Standard',
      name_ar: 'قياسي',
      price: typicalPrice,
      duration_days: `${baseDays}-${baseDays + 3}`,
      includes: [...baseIncludes.en, ...standardAdditions.en],
      includes_ar: [...baseIncludes.ar, ...standardAdditions.ar],
      excludes: {
        en: ['Extended support', 'Training', 'Documentation'],
        ar: ['دعم ممتد', 'تدريب', 'توثيق'],
      }.en,
      excludes_ar: ['دعم ممتد', 'تدريب', 'توثيق'],
    },
    {
      name: 'Premium',
      name_ar: 'متميز',
      price: roundPrice(typicalPrice * 1.25, input.currency),
      duration_days: `${baseDays + 2}-${baseDays + 7}`,
      includes: [...baseIncludes.en, ...standardAdditions.en, ...premiumAdditions.en],
      includes_ar: [...baseIncludes.ar, ...standardAdditions.ar, ...premiumAdditions.ar],
      excludes: {
        en: [],
        ar: [],
      }.en,
      excludes_ar: [],
    },
  ];
  
  return packages;
}

// ===============================
// Pricing Paragraph Generation
// ===============================

function generatePricingParagraphAr(
  input: PricingInput,
  typicalPrice: number,
  minPrice: number,
  maxPrice: number,
  minHours: number,
  maxHours: number
): string {
  const serviceLabel = SERVICE_LABELS[input.service_type].ar;
  const daysMin = Math.ceil(minHours / 6);
  const daysMax = Math.ceil(maxHours / 6);
  
  // Build includes list
  const includesList: string[] = [serviceLabel];
  if (input.addons.length > 0) {
    const topAddons = input.addons.slice(0, 3).map(a => ADDON_LABELS[a].ar);
    includesList.push(...topAddons);
  }
  
  // Build excludes
  const excludes: string[] = [];
  if (!input.addons.includes('seo_setup')) excludes.push('تحسين SEO متقدم');
  if (!input.addons.includes('performance_optimization')) excludes.push('الصيانة الشهرية');
  
  // Questions based on missing info
  const questions: string[] = [];
  if (input.pages === 0 && ['wordpress_website', 'woocommerce_store'].includes(input.service_type)) {
    questions.push('كم عدد الصفحات المطلوبة؟');
  }
  if (input.service_type === 'woocommerce_store' && input.products === 0) {
    questions.push('كم عدد المنتجات المتوقعة؟');
  }
  
  let paragraph = `💰 **نطاق السعر المقترح:** ${minPrice} - ${maxPrice} دولار (السعر النموذجي: ${typicalPrice} دولار)\n`;
  paragraph += `⏱️ **مدة التنفيذ المتوقعة:** ${daysMin}-${daysMax} أيام عمل\n\n`;
  paragraph += `✅ **يشمل السعر:**\n`;
  includesList.forEach(item => {
    paragraph += `• ${item}\n`;
  });
  
  if (excludes.length > 0) {
    paragraph += `\n❌ **لا يشمل:** ${excludes.join('، ')}\n`;
  }
  
  if (questions.length > 0) {
    paragraph += `\n❓ **للتوضيح:**\n`;
    questions.forEach(q => {
      paragraph += `• ${q}\n`;
    });
  }
  
  return paragraph;
}

function generatePricingParagraphEn(
  input: PricingInput,
  typicalPrice: number,
  minPrice: number,
  maxPrice: number,
  minHours: number,
  maxHours: number
): string {
  const serviceLabel = SERVICE_LABELS[input.service_type].en;
  const daysMin = Math.ceil(minHours / 6);
  const daysMax = Math.ceil(maxHours / 6);
  
  // Build includes list
  const includesList: string[] = [serviceLabel];
  if (input.addons.length > 0) {
    const topAddons = input.addons.slice(0, 3).map(a => ADDON_LABELS[a].en);
    includesList.push(...topAddons);
  }
  
  // Build excludes
  const excludes: string[] = [];
  if (!input.addons.includes('seo_setup')) excludes.push('Advanced SEO');
  if (!input.addons.includes('performance_optimization')) excludes.push('Monthly maintenance');
  
  let paragraph = `💰 **Suggested Price Range:** $${minPrice} - $${maxPrice} (Typical: $${typicalPrice})\n`;
  paragraph += `⏱️ **Estimated Duration:** ${daysMin}-${daysMax} business days\n\n`;
  paragraph += `✅ **Price Includes:**\n`;
  includesList.forEach(item => {
    paragraph += `• ${item}\n`;
  });
  
  if (excludes.length > 0) {
    paragraph += `\n❌ **Not Included:** ${excludes.join(', ')}\n`;
  }
  
  return paragraph;
}

// ===============================
// Validation
// ===============================

export function validatePricingInput(input: Partial<PricingInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!input.service_type) {
    errors.push('Service type is required');
  }
  
  if (!input.pricing_model) {
    errors.push('Pricing model is required');
  }
  
  if (!input.complexity) {
    errors.push('Complexity level is required');
  }
  
  if (!input.languages) {
    errors.push('Language selection is required');
  }
  
  if (!input.content_ready) {
    errors.push('Content readiness is required');
  }
  
  if (!input.design) {
    errors.push('Design type is required');
  }
  
  if (!input.urgency) {
    errors.push('Urgency level is required');
  }
  
  if (input.pages !== undefined && (input.pages < 0 || input.pages > 100)) {
    errors.push('Pages must be between 0 and 100');
  }
  
  if (input.products !== undefined && (input.products < 0 || input.products > 10000)) {
    errors.push('Products must be between 0 and 10000');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}
