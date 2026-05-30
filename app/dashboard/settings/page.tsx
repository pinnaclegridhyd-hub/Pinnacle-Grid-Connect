'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';

interface ProfileSettings {
  enableContactForm: boolean;
  enableComments: boolean;
  makeProfilePrivate: boolean;
  hidePhoneNumber: boolean;
  hideEmailPublicly: boolean;
  requireApprovalForViewers: boolean;
  enableDownloadVCard: boolean;
}

interface Credentials {
  businessName: string;
  businessPhone: string;
  businessEmail: string;
  businessWebsite: string;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [credentials, setCredentials] = useState<Credentials>({
    businessName: '',
    businessPhone: '',
    businessEmail: '',
    businessWebsite: '',
  });
  const [settings, setSettings] = useState<ProfileSettings>({
    enableContactForm: true,
    enableComments: false,
    makeProfilePrivate: false,
    hidePhoneNumber: false,
    hideEmailPublicly: false,
    requireApprovalForViewers: false,
    enableDownloadVCard: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedSettings = localStorage.getItem('pf_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed.profileSettings || settings);
      setCredentials(parsed.credentials || credentials);
    }
  }, []);

  const handleSaveSettings = () => {
    const allSettings = { profileSettings: settings, credentials };
    localStorage.setItem('pf_settings', JSON.stringify(allSettings));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleSetting = (key: keyof ProfileSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your account and profile settings</p>
      </div>

      {/* Account Settings */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Account Settings</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Update your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Name</Label>
              <Input value={user?.name} disabled className="text-xs sm:text-sm h-9 sm:h-10" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs sm:text-sm">Email</Label>
              <Input value={user?.email} disabled className="text-xs sm:text-sm h-9 sm:h-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs sm:text-sm">Currency</Label>
            <Select defaultValue="inr">
              <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inr">Indian Rupee (₹ INR)</SelectItem>
                <SelectItem value="usd">US Dollar ($ USD)</SelectItem>
                <SelectItem value="eur">Euro (€ EUR)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Business Credentials */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Business Credentials</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Add your business contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-xs sm:text-sm">Business Name</Label>
              <Input
                id="businessName"
                placeholder="Your business name"
                value={credentials.businessName}
                onChange={(e) => setCredentials(prev => ({ ...prev, businessName: e.target.value }))}
                className="text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessPhone" className="text-xs sm:text-sm">Business Phone</Label>
              <Input
                id="businessPhone"
                placeholder="+91 XXXXX XXXXX"
                value={credentials.businessPhone}
                onChange={(e) => setCredentials(prev => ({ ...prev, businessPhone: e.target.value }))}
                className="text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessEmail" className="text-xs sm:text-sm">Business Email</Label>
              <Input
                id="businessEmail"
                type="email"
                placeholder="business@example.com"
                value={credentials.businessEmail}
                onChange={(e) => setCredentials(prev => ({ ...prev, businessEmail: e.target.value }))}
                className="text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessWebsite" className="text-xs sm:text-sm">Business Website</Label>
              <Input
                id="businessWebsite"
                placeholder="https://example.com"
                value={credentials.businessWebsite}
                onChange={(e) => setCredentials(prev => ({ ...prev, businessWebsite: e.target.value }))}
                className="text-xs sm:text-sm h-9 sm:h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Behavior & Privacy */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Profile Behavior & Privacy</CardTitle>
          <CardDescription className="text-xs sm:text-sm">Control how your profile is displayed and accessed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            {/* Toggle 1: Contact Form */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Enable Contact Form</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Allow visitors to contact you through a form</p>
              </div>
              <button
                onClick={() => toggleSetting('enableContactForm')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.enableContactForm ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enableContactForm ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 2: Comments */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Enable Comments</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Allow visitors to leave comments on your profile</p>
              </div>
              <button
                onClick={() => toggleSetting('enableComments')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.enableComments ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enableComments ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 3: Private Profile */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Make Profile Private</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Only accessible to people with the link</p>
              </div>
              <button
                onClick={() => toggleSetting('makeProfilePrivate')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.makeProfilePrivate ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.makeProfilePrivate ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 4: Hide Phone */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Hide Phone Number</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Don&apos;t display your phone publicly</p>
              </div>
              <button
                onClick={() => toggleSetting('hidePhoneNumber')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.hidePhoneNumber ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.hidePhoneNumber ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 5: Hide Email */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Hide Email Publicly</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Don&apos;t display your email publicly</p>
              </div>
              <button
                onClick={() => toggleSetting('hideEmailPublicly')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.hideEmailPublicly ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.hideEmailPublicly ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 6: Approval for Viewers */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Require Approval for Viewers</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Approve new viewer requests before they see your profile</p>
              </div>
              <button
                onClick={() => toggleSetting('requireApprovalForViewers')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.requireApprovalForViewers ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.requireApprovalForViewers ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Toggle 7: Download vCard */}
            <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border border-border">
              <div className="flex-1">
                <p className="text-sm sm:text-base font-medium text-foreground">Enable Download vCard</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Allow visitors to download your contact details</p>
              </div>
              <button
                onClick={() => toggleSetting('enableDownloadVCard')}
                className={`ml-4 w-10 h-6 rounded-full transition-colors ${
                  settings.enableDownloadVCard ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    settings.enableDownloadVCard ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
            <Button onClick={handleSaveSettings} className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none">
              {saved ? '✓ Saved' : 'Save All Settings'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
