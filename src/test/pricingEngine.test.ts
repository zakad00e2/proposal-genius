import { describe, it, expect } from 'vitest';
import {
  calculatePricing,
  validatePricingInput,
  roundPrice,
  PricingInput,
  BASE_RATES,
  ADDON_PRICES,
  COMPLEXITY_MULTIPLIERS,
  DEFAULT_USER_SETTINGS,
} from '../lib/pricingEngine';

describe('Pricing Engine', () => {
  describe('roundPrice', () => {
    it('should round to nearest 5 for USD', () => {
      expect(roundPrice(123, 'USD')).toBe(125);
      expect(roundPrice(122, 'USD')).toBe(120);
      expect(roundPrice(127, 'USD')).toBe(125);
    });

    it('should round to nearest 10 for other currencies', () => {
      expect(roundPrice(123, 'SAR')).toBe(120);
      expect(roundPrice(127, 'SAR')).toBe(130);
      expect(roundPrice(125, 'EUR')).toBe(130);
    });
  });

  describe('validatePricingInput', () => {
    it('should return valid for complete input', () => {
      const input: Partial<PricingInput> = {
        service_type: 'wordpress_website',
        pricing_model: 'fixed',
        complexity: 'medium',
        languages: 'arabic',
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        pages: 5,
        products: 0,
        addons: [],
        currency: 'USD',
      };

      const result = validatePricingInput(input);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for missing fields', () => {
      const input: Partial<PricingInput> = {
        service_type: 'wordpress_website',
      };

      const result = validatePricingInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should validate pages range', () => {
      const input: Partial<PricingInput> = {
        service_type: 'wordpress_website',
        pricing_model: 'fixed',
        complexity: 'medium',
        languages: 'arabic',
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        pages: 150, // Invalid: > 100
        products: 0,
        addons: [],
        currency: 'USD',
      };

      const result = validatePricingInput(input);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Pages must be between 0 and 100');
    });
  });

  describe('calculatePricing', () => {
    it('should calculate basic WordPress website price correctly', () => {
      const input: PricingInput = {
        service_type: 'wordpress_website',
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 5,
        products: 0,
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      // Base price for WordPress is 350
      // No multipliers (all 1.0)
      // So typical should be 350
      expect(result.typical_price).toBe(350);
      expect(result.min_price).toBe(roundPrice(350 * 0.85, 'USD')); // ~298 -> 300
      expect(result.max_price).toBe(roundPrice(350 * 1.20, 'USD')); // 420
    });

    it('should apply complexity multiplier correctly', () => {
      const inputLow: PricingInput = {
        service_type: 'api_integration',
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 0,
        products: 0,
        languages: 'english',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const inputMedium: PricingInput = {
        ...inputLow,
        complexity: 'medium',
      };

      const inputHigh: PricingInput = {
        ...inputLow,
        complexity: 'high',
      };

      const resultLow = calculatePricing(inputLow);
      const resultMedium = calculatePricing(inputMedium);
      const resultHigh = calculatePricing(inputHigh);

      // Base price for API Integration is 250
      expect(resultLow.typical_price).toBe(250); // 250 * 1.0
      expect(resultMedium.typical_price).toBe(300); // 250 * 1.2 = 300
      expect(resultHigh.typical_price).toBe(350); // 250 * 1.4 = 350
    });

    it('should calculate add-ons correctly', () => {
      const input: PricingInput = {
        service_type: 'api_integration',
        pricing_model: 'fixed',
        complexity: 'medium',
        pages: 0,
        products: 0,
        languages: 'both', // +15%
        addons: ['admin_dashboard', 'api_sync'], // +300 + +250 = +550
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      // Base: 250 (API Integration)
      // Addons: 300 (Admin Dashboard) + 250 (API Sync) = 550
      // Subtotal: 800
      // Multipliers: Complexity 1.2 × Languages 1.15 = 1.38
      // Final: 800 * 1.38 = 1104 -> rounded to 1105
      const expected = roundPrice(800 * 1.2 * 1.15, 'USD');
      expect(result.typical_price).toBe(expected);

      // Check breakdown contains addons
      const adminDashboardBreakdown = result.breakdown.find(
        (b) => b.label.includes('Admin Dashboard')
      );
      expect(adminDashboardBreakdown).toBeDefined();
      expect(adminDashboardBreakdown?.amount).toBe(300);
    });

    it('should apply urgency multiplier correctly', () => {
      const inputNormal: PricingInput = {
        service_type: 'landing_page',
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 1,
        products: 0,
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const inputRush: PricingInput = {
        ...inputNormal,
        urgency: 'rush',
      };

      const inputExtreme: PricingInput = {
        ...inputNormal,
        urgency: 'extreme',
      };

      const resultNormal = calculatePricing(inputNormal);
      const resultRush = calculatePricing(inputRush);
      const resultExtreme = calculatePricing(inputExtreme);

      // Base: 150 (Landing Page)
      expect(resultNormal.typical_price).toBe(150); // 150 * 1.0
      expect(resultRush.typical_price).toBe(roundPrice(150 * 1.25, 'USD')); // 187.5 -> 190
      expect(resultExtreme.typical_price).toBe(roundPrice(150 * 1.4, 'USD')); // 210
    });

    it('should calculate extra pages correctly', () => {
      const input: PricingInput = {
        service_type: 'wordpress_website',
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 10, // 5 extra pages beyond included 5
        products: 0,
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      // Base: 350
      // Extra pages: 5 * 30 = 150
      // Total: 500
      expect(result.typical_price).toBe(500);
    });

    it('should generate three packages correctly', () => {
      const input: PricingInput = {
        service_type: 'wordpress_website',
        pricing_model: 'fixed',
        complexity: 'medium',
        pages: 5,
        products: 0,
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      expect(result.packages).toHaveLength(3);
      expect(result.packages[0].name).toBe('Basic');
      expect(result.packages[1].name).toBe('Standard');
      expect(result.packages[2].name).toBe('Premium');

      // Basic should be 90% of typical
      expect(result.packages[0].price).toBe(roundPrice(result.typical_price * 0.9, 'USD'));
      
      // Standard should equal typical
      expect(result.packages[1].price).toBe(result.typical_price);
      
      // Premium should be 125% of typical
      expect(result.packages[2].price).toBe(roundPrice(result.typical_price * 1.25, 'USD'));
    });

    it('should respect minimum project price', () => {
      const input: PricingInput = {
        service_type: 'ui_fixes', // Base: 80
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 0,
        products: 0,
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
        user_settings: {
          minimum_project_price: 150, // Set minimum higher than base
        },
      };

      const result = calculatePricing(input);

      // Even though base is 80, minimum is 150
      expect(result.typical_price).toBe(150);
    });

    it('should generate pricing paragraph in Arabic', () => {
      const input: PricingInput = {
        service_type: 'woocommerce_store',
        pricing_model: 'fixed',
        complexity: 'medium',
        pages: 10,
        products: 50,
        languages: 'both',
        addons: ['payment_gateway', 'shipping_integration'],
        content_ready: 'ready',
        design: 'custom',
        urgency: 'rush',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      expect(result.pricing_paragraph_ar).toBeTruthy();
      expect(result.pricing_paragraph_ar).toContain('نطاق السعر المقترح');
      expect(result.pricing_paragraph_ar).toContain('مدة التنفيذ');
      expect(result.pricing_paragraph_ar).toContain('يشمل السعر');
    });

    it('should calculate hours estimation correctly', () => {
      const input: PricingInput = {
        service_type: 'wordpress_website', // Base hours: 20
        pricing_model: 'fixed',
        complexity: 'medium', // 1.2x
        pages: 5,
        products: 0,
        languages: 'arabic',
        addons: ['blog_setup'], // +4 hours
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      // Base hours: 20 + 4 (blog) = 24
      // With complexity 1.2x = 28.8
      // Min: 28.8 * 0.85 ≈ 24
      // Max: 28.8 * 1.15 ≈ 33
      expect(result.hours.min).toBeGreaterThanOrEqual(20);
      expect(result.hours.max).toBeLessThanOrEqual(40);
      expect(result.hours.max).toBeGreaterThan(result.hours.min);
    });

    it('should handle WooCommerce store with products', () => {
      const input: PricingInput = {
        service_type: 'woocommerce_store', // Base: 600
        pricing_model: 'fixed',
        complexity: 'low',
        pages: 5,
        products: 50, // 30 extra products (beyond 20 included)
        languages: 'arabic',
        addons: [],
        content_ready: 'ready',
        design: 'template',
        urgency: 'normal',
        currency: 'USD',
      };

      const result = calculatePricing(input);

      // Base: 600
      // Extra products: 30 * 2 = 60
      // Total: 660
      expect(result.typical_price).toBe(660);
    });

    it('should disable multipliers when user settings say so', () => {
      const input: PricingInput = {
        service_type: 'api_integration', // Base: 250
        pricing_model: 'fixed',
        complexity: 'high', // Would be 1.4x
        pages: 0,
        products: 0,
        languages: 'both', // Would be 1.15x
        addons: [],
        content_ready: 'needs_copywriting', // Would be 1.15x
        design: 'custom', // Would be 1.2x
        urgency: 'extreme', // Would be 1.4x
        currency: 'USD',
        user_settings: {
          enable_complexity_multiplier: false,
          enable_language_multiplier: false,
          enable_content_multiplier: false,
          enable_design_multiplier: false,
          enable_urgency_multiplier: false,
        },
      };

      const result = calculatePricing(input);

      // All multipliers disabled, should just be base price
      expect(result.typical_price).toBe(250);
    });
  });
});
