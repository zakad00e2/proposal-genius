// ===============================
// Translation System
// ===============================

export type Lang = 'en' | 'ar';

export const translations = {
  // Header
  'header.title': { en: 'Offerly', ar: 'Offerly' },
  'header.subtitle': { en: 'For freelancers', ar: 'للمستقلين' },
  'header.nav.proposals': { en: 'Proposal Generator', ar: 'مولّد العروض' },
  'header.nav.pricing': { en: 'Pricing', ar: 'تحديد السعر' },

  // Index page
  'index.heading': { en: 'Write winning Upwork proposals', ar: 'اكتب عروضاً احترافية لمستقل' },
  'index.subheading': {
    en: 'Paste a job description and get a professional, human-sounding proposal in seconds. No robotic templates.',
    ar: 'الصق وصف المشروع واحصل على عرض احترافي بأسلوب بشري في ثوانٍ. بدون قوالب جاهزة.',
  },
  'index.pricingAlert.title': { en: 'Pricing data ready', ar: 'بيانات التسعير جاهزة' },
  'index.pricingAlert.price': { en: 'Selected price:', ar: 'السعر المحدد:' },
  'index.pricingAlert.note': {
    en: 'The pricing paragraph will be automatically added to the generated proposal',
    ar: 'ستتم إضافة فقرة التسعير تلقائياً إلى العرض المُنشأ',
  },
  'index.pricingReceived.title': { en: 'Pricing data received', ar: 'تم استلام بيانات التسعير' },
  'index.pricingReceived.desc': { en: 'Selected price: $', ar: 'السعر المحدد: $' },

  // ProposalForm
  'form.platform': { en: 'Platform', ar: 'المنصة' },
  'form.clientName': { en: "Client's Name (Optional)", ar: 'اسم العميل (اختياري)' },
  'form.clientName.placeholder': { en: "Enter client's name if available...", ar: 'أدخل اسم العميل إذا كان متاحاً...' },
  'form.jobDescription': { en: 'Job Description', ar: 'وصف المشروع' },
  'form.jobDescription.placeholder': { en: 'Paste the job posting from Upwork here...', ar: 'الصق وصف المشروع من مستقل هنا...' },
  'form.jobDescription.hint': { en: 'Include the full job description for best results', ar: 'أضف وصف المشروع كاملاً للحصول على أفضل النتائج' },
  'form.proposalLength': { en: 'Proposal Length', ar: 'طول العرض' },
  'form.proposalLength.short': { en: 'Short (60-80 words)', ar: 'قصير (60-80 كلمة)' },
  'form.proposalLength.medium': { en: 'Medium (120-180 words)', ar: 'متوسط (120-180 كلمة)' },
  'form.experienceLevel': { en: 'Experience Level', ar: 'مستوى الخبرة' },
  'form.experienceLevel.beginner': { en: 'Beginner', ar: 'مبتدئ' },
  'form.experienceLevel.intermediate': { en: 'Intermediate', ar: 'متوسط' },
  'form.experienceLevel.expert': { en: 'Expert', ar: 'خبير' },
  'form.submit': { en: 'Generate Proposal', ar: 'إنشاء العرض' },
  'form.submitting': { en: 'Generating...', ar: 'جارٍ الإنشاء...' },

  // ProposalOutput
  'output.title': { en: 'Your Proposal', ar: 'عرضك' },
  'output.regenerate': { en: 'Regenerate', ar: 'إعادة الإنشاء' },
  'output.copy': { en: 'Copy', ar: 'نسخ' },
  'output.copied': { en: 'Copied', ar: 'تم النسخ' },
  'output.copySuccess': { en: 'Copied to clipboard', ar: 'تم النسخ' },
  'output.copySuccessDesc': { en: 'Your proposal is ready to paste into Upwork.', ar: 'عرضك جاهز للصق في مستقل.' },
  'output.copyFail': { en: 'Failed to copy', ar: 'فشل النسخ' },
  'output.copyFailDesc': { en: 'Please select and copy the text manually.', ar: 'يرجى تحديد النص ونسخه يدوياً.' },
  'output.hint': {
    en: 'Review and personalize before sending. Add specific portfolio links if relevant.',
    ar: 'راجع العرض وخصّصه قبل الإرسال. أضف روابط معرض أعمالك إذا كان ذلك مناسباً.',
  },

  // Pricing page
  'pricing.heading': { en: 'Pricing Calculator', ar: 'تحديد سعر العمل' },
  'pricing.subheading': {
    en: 'Enter your project details to get a professional price estimate with ready-made packages and a copyable pricing paragraph',
    ar: 'أدخل تفاصيل مشروعك واحصل على تقدير احترافي للسعر مع باقات جاهزة وفقرة تسعير قابلة للنسخ',
  },
  'pricing.settingsToggle.show': { en: 'Pricing Settings', ar: 'إعدادات التسعير' },
  'pricing.settingsToggle.hide': { en: 'Hide Settings', ar: 'إخفاء الإعدادات' },
  'pricing.calculated.title': { en: 'Price calculated', ar: 'تم حساب السعر' },
  'pricing.calculated.desc': { en: 'Typical price: $', ar: 'السعر النموذجي: $' },
  'pricing.error.title': { en: 'Calculation failed', ar: 'فشل الحساب' },
  'pricing.error.desc': { en: 'An error occurred while calculating the price', ar: 'حدث خطأ أثناء حساب السعر' },
  'pricing.sent.title': { en: 'Sent', ar: 'تم الإرسال' },
  'pricing.sent.desc': { en: 'Pricing data sent to proposal generator', ar: 'تم إرسال بيانات التسعير إلى مولّد العرض' },

  // PricingForm
  'pricingForm.serviceType': { en: 'Service Type', ar: 'نوع الخدمة' },
  'pricingForm.complexity': { en: 'Complexity Level', ar: 'مستوى التعقيد' },
  'pricingForm.complexity.low': { en: 'Low', ar: 'منخفض' },
  'pricingForm.complexity.medium': { en: 'Medium', ar: 'متوسط' },
  'pricingForm.complexity.high': { en: 'High', ar: 'عالي' },
  'pricingForm.languages': { en: 'Website Languages', ar: 'لغات الموقع' },
  'pricingForm.languages.arabic': { en: 'Arabic (RTL)', ar: 'عربي (RTL)' },
  'pricingForm.languages.english': { en: 'English', ar: 'إنجليزي' },
  'pricingForm.languages.both': { en: 'Both', ar: 'كلاهما' },
  'pricingForm.pages': { en: 'Number of Pages', ar: 'عدد الصفحات' },
  'pricingForm.products': { en: 'Number of Products', ar: 'عدد المنتجات' },
  'pricingForm.apiEndpoints': { en: 'API Endpoints', ar: 'عدد نقاط API' },
  'pricingForm.contentReady': { en: 'Content Readiness', ar: 'جاهزية المحتوى' },
  'pricingForm.contentReady.ready': { en: 'Ready', ar: 'جاهز' },
  'pricingForm.contentReady.needs': { en: 'Needs Copywriting', ar: 'يحتاج كتابة محتوى' },
  'pricingForm.design': { en: 'Design', ar: 'التصميم' },
  'pricingForm.design.template': { en: 'Use a Template', ar: 'استخدام قالب جاهز' },
  'pricingForm.design.custom': { en: 'Custom Design', ar: 'تصميم مخصص' },
  'pricingForm.urgency': { en: 'Urgency', ar: 'الاستعجال' },
  'pricingForm.urgency.normal': { en: 'Normal', ar: 'عادي' },
  'pricingForm.urgency.rush': { en: 'Rush (<7 days)', ar: 'مستعجل (<7 أيام)' },
  'pricingForm.urgency.extreme': { en: 'Extreme (<3 days)', ar: 'طارئ (<3 أيام)' },
  'pricingForm.addons': { en: 'Additional Features', ar: 'ميزات إضافية' },
  'pricingForm.submit': { en: 'Calculate Price', ar: 'احسب السعر' },
  'pricingForm.submitting': { en: 'Calculating...', ar: 'جارٍ الحساب...' },

  // PricingResults
  'results.minPrice': { en: 'Minimum', ar: 'الحد الأدنى' },
  'results.typicalPrice': { en: 'Typical Price', ar: 'السعر النموذجي' },
  'results.maxPrice': { en: 'Maximum', ar: 'الحد الأقصى' },
  'results.estimatedHours': { en: 'Estimated Hours', ar: 'الساعات المقدرة' },
  'results.hours': { en: 'hours', ar: 'ساعة' },
  'results.tab.paragraph': { en: 'Pricing Paragraph', ar: 'فقرة التسعير' },
  'results.tab.packages': { en: 'Packages', ar: 'الباقات' },
  'results.tab.breakdown': { en: 'Breakdown', ar: 'تفصيل البنود' },
  'results.breakdown.title': { en: 'Price Breakdown', ar: 'تفصيل حساب السعر' },
  'results.paragraph.title': { en: 'Ready Pricing Paragraph', ar: 'فقرة التسعير الجاهزة' },
  'results.paragraph.desc': { en: 'Copy this paragraph and paste it in your proposal', ar: 'انسخ هذه الفقرة وألصقها في عرضك' },
  'results.copyParagraph': { en: 'Copy Pricing Paragraph', ar: 'نسخ فقرة التسعير' },
  'results.copiedParagraph': { en: 'Copied!', ar: 'تم النسخ' },
  'results.copySuccess.title': { en: 'Copied', ar: 'تم النسخ' },
  'results.copySuccess.desc': { en: 'Pricing paragraph copied to clipboard', ar: 'تم نسخ فقرة التسعير إلى الحافظة' },
  'results.copyFail.title': { en: 'Copy failed', ar: 'فشل النسخ' },
  'results.copyFail.desc': { en: 'Could not copy the text', ar: 'لم نتمكن من نسخ النص' },
  'results.includes': { en: 'Includes:', ar: 'يشمل:' },
  'results.excludes': { en: 'Not included:', ar: 'لا يشمل:' },
  'results.more': { en: 'more', ar: 'المزيد' },
  'results.days': { en: 'days', ar: 'أيام' },

  // PricingSettings
  'settings.title': { en: 'Personal Pricing Settings', ar: 'إعدادات التسعير الشخصية' },
  'settings.reset': { en: 'Reset', ar: 'إعادة تعيين' },
  'settings.hourlyRate': { en: 'Hourly Rate (USD)', ar: 'سعر الساعة (USD)' },
  'settings.minPrice': { en: 'Minimum Project Price (USD)', ar: 'الحد الأدنى للمشروع (USD)' },
  'settings.multipliers': { en: 'Enable/Disable Multipliers', ar: 'تفعيل/تعطيل المعاملات' },
  'settings.complexityMult': { en: 'Complexity Multiplier', ar: 'معامل التعقيد' },
  'settings.languageMult': { en: 'Language Multiplier', ar: 'معامل اللغات' },
  'settings.contentMult': { en: 'Content Multiplier', ar: 'معامل المحتوى' },
  'settings.designMult': { en: 'Design Multiplier', ar: 'معامل التصميم' },
  'settings.urgencyMult': { en: 'Urgency Multiplier', ar: 'معامل الاستعجال' },
  'settings.save': { en: 'Save Settings', ar: 'حفظ الإعدادات' },
  'settings.saved.title': { en: 'Settings saved', ar: 'تم حفظ الإعدادات' },
  'settings.saved.desc': { en: 'Your settings have been saved successfully', ar: 'تم حفظ إعداداتك بنجاح' },

  // Errors
  'error.generation.title': { en: 'Generation failed', ar: 'فشل الإنشاء' },
  'error.generation.connection': {
    en: 'Could not connect to server. The service might be busy, please try again momentarily.',
    ar: 'تعذر الاتصال بالخادم. قد يكون هناك ضغط على الخدمة، يرجى المحاولة بعد قليل.',
  },
  'error.generation.default': { en: 'Please try again.', ar: 'يرجى المحاولة مرة أخرى.' },

  // NotFound
  'notFound.title': { en: '404', ar: '404' },
  'notFound.message': { en: 'Oops! Page not found', ar: 'عذراً! الصفحة غير موجودة' },
  'notFound.link': { en: 'Return to Home', ar: 'العودة إلى الرئيسية' },

  // Footer
  'footer.copyright': { en: '© All rights reserved to Zakaria Safi', ar: '© جميع الحقوق محفوظة لزكريا صافي' },
} as const;

export type TranslationKey = keyof typeof translations;

export function t(key: TranslationKey, lang: Lang): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang];
}
