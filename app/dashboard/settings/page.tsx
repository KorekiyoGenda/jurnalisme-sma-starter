"use client";

import { useState } from 'react';
import { useAdminStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon,
  Palette,
  FileText,
  MessageSquare,
  Save
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';

export default function SettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [formData, setFormData] = useState(settings);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = () => {
    updateSettings(formData);
    setHasChanges(false);
    toast.success('Settings saved successfully');
  };

  const handleReset = () => {
    setFormData(settings);
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure your journalism platform</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleReset}
            disabled={!hasChanges}
          >
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>Basic site configuration and branding</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input
                  id="site_name"
                  value={formData.site_name}
                  onChange={(e) => handleChange('site_name', e.target.value)}
                  placeholder="Enter site name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  value={formData.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Enter site tagline"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand_primary">Primary Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="brand_primary"
                    type="color"
                    value={formData.brand_primary}
                    onChange={(e) => handleChange('brand_primary', e.target.value)}
                    className="w-16 h-10 p-1"
                  />
                  <Input
                    value={formData.brand_primary}
                    onChange={(e) => handleChange('brand_primary', e.target.value)}
                    placeholder="#EF4444"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Publishing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Publishing Settings
              </CardTitle>
              <CardDescription>Configure article workflow and publishing options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="review_required">Require Review</Label>
                  <p className="text-sm text-muted-foreground">Articles need editor approval before publishing</p>
                </div>
                <Switch
                  id="review_required"
                  checked={formData.review_required}
                  onCheckedChange={(checked) => handleChange('review_required', checked)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="default_status">Default Article Status</Label>
                <Select 
                  value={formData.default_status} 
                  onValueChange={(value) => handleChange('default_status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="In Review">In Review</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Comment Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Comment Settings
              </CardTitle>
              <CardDescription>Manage user comments and moderation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="comments_enabled">Enable Comments</Label>
                  <p className="text-sm text-muted-foreground">Allow users to comment on articles</p>
                </div>
                <Switch
                  id="comments_enabled"
                  checked={formData.comments_enabled}
                  onCheckedChange={(checked) => handleChange('comments_enabled', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto_moderation">Auto Moderation</Label>
                  <p className="text-sm text-muted-foreground">Automatically hide flagged comments</p>
                </div>
                <Switch
                  id="auto_moderation"
                  checked={formData.auto_moderation}
                  onCheckedChange={(checked) => handleChange('auto_moderation', checked)}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Live Preview
              </CardTitle>
              <CardDescription>See how your changes will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Site Header Preview */}
                <div className="border border-border/50 rounded-lg p-4 bg-background">
                  <div 
                    className="text-lg font-bold mb-1"
                    style={{ color: formData.brand_primary }}
                  >
                    {formData.site_name || 'Site Name'}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formData.tagline || 'Site tagline'}
                  </div>
                </div>

                {/* Button Preview */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Primary Button:</div>
                  <button 
                    className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                    style={{ backgroundColor: formData.brand_primary }}
                  >
                    Example Button
                  </button>
                </div>

                {/* Badge Preview */}
                <div className="space-y-2">
                  <div className="text-sm font-medium">Status Badge:</div>
                  <span 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                    style={{ 
                      backgroundColor: formData.brand_primary + '20',
                      color: formData.brand_primary,
                      borderColor: formData.brand_primary + '40'
                    }}
                  >
                    Published
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Settings Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Current Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Review Required:</span>
                <span className={formData.review_required ? 'text-green-400' : 'text-red-400'}>
                  {formData.review_required ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Default Status:</span>
                <span className="text-muted-foreground">{formData.default_status}</span>
              </div>
              <div className="flex justify-between">
                <span>Comments:</span>
                <span className={formData.comments_enabled ? 'text-green-400' : 'text-red-400'}>
                  {formData.comments_enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Auto Moderation:</span>
                <span className={formData.auto_moderation ? 'text-green-400' : 'text-red-400'}>
                  {formData.auto_moderation ? 'On' : 'Off'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}