import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save } from "lucide-react";
import { UserSettings, DEFAULT_USER_SETTINGS } from "@/lib/pricingEngine";

interface PricingSettingsProps {
  settings: UserSettings;
  onSave: (settings: UserSettings) => void;
}

export function PricingSettings({ settings, onSave }: PricingSettingsProps) {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleSave = () => {
    onSave(localSettings);
  };

  const handleReset = () => {
    setLocalSettings(DEFAULT_USER_SETTINGS);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">إعدادات التسعير الشخصية</h3>
        <Button variant="ghost" size="sm" onClick={handleReset}>
          إعادة تعيين
        </Button>
      </div>

      {/* Basic Settings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="hourly-rate" className="text-sm font-medium">
            سعر الساعة (USD)
          </Label>
          <Input
            id="hourly-rate"
            type="number"
            min="5"
            max="500"
            value={localSettings.hourly_rate}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              hourly_rate: parseInt(e.target.value) || 15
            }))}
            className="bg-background"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="min-price" className="text-sm font-medium">
            الحد الأدنى للمشروع (USD)
          </Label>
          <Input
            id="min-price"
            type="number"
            min="0"
            max="10000"
            value={localSettings.minimum_project_price}
            onChange={(e) => setLocalSettings(prev => ({
              ...prev,
              minimum_project_price: parseInt(e.target.value) || 0
            }))}
            className="bg-background"
          />
        </div>
      </div>

      {/* Multiplier Toggles */}
      <div className="space-y-4">
        <Label className="text-sm font-medium">تفعيل/تعطيل المعاملات</Label>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="complexity-mult" className="text-sm cursor-pointer">
              معامل التعقيد
            </Label>
            <Switch
              id="complexity-mult"
              checked={localSettings.enable_complexity_multiplier}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                enable_complexity_multiplier: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="language-mult" className="text-sm cursor-pointer">
              معامل اللغات
            </Label>
            <Switch
              id="language-mult"
              checked={localSettings.enable_language_multiplier}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                enable_language_multiplier: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="content-mult" className="text-sm cursor-pointer">
              معامل المحتوى
            </Label>
            <Switch
              id="content-mult"
              checked={localSettings.enable_content_multiplier}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                enable_content_multiplier: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="design-mult" className="text-sm cursor-pointer">
              معامل التصميم
            </Label>
            <Switch
              id="design-mult"
              checked={localSettings.enable_design_multiplier}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                enable_design_multiplier: checked
              }))}
            />
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <Label htmlFor="urgency-mult" className="text-sm cursor-pointer">
              معامل الاستعجال
            </Label>
            <Switch
              id="urgency-mult"
              checked={localSettings.enable_urgency_multiplier}
              onCheckedChange={(checked) => setLocalSettings(prev => ({
                ...prev,
                enable_urgency_multiplier: checked
              }))}
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <Button onClick={handleSave} className="w-full">
        <Save className="h-4 w-4 ml-2" />
        حفظ الإعدادات
      </Button>
    </div>
  );
}
