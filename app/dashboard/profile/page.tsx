'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { PLAN_LIMITS } from '@/lib/pricing';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';
import { getPublicProfileUrl } from '@/lib/public-url';
import {
  User,
  Palette,
  Clock,
  QrCode,
  Link2,
  Image as ImageIcon,
  Lock,
  FileText,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Check,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Briefcase,
  Images,
  MailQuestion
} from 'lucide-react';
import QRCode from 'react-qr-code';

const SECTION_KEYS = [
  'header',
  'businessHours',
  'services',
  'products',
  'gallery',
  'testimonials',
  'contact',
  'banner',
  'newsletter',
] as const;

type SectionKey = (typeof SECTION_KEYS)[number];

const sanitizeSections = (sections: any = {}) =>
  SECTION_KEYS.reduce((acc, key) => {
    acc[key] = Boolean(sections?.[key]);
    return acc;
  }, {} as Record<SectionKey, boolean>);

const sanitizeSectionOrder = (sectionOrder: string[] = []) =>
  sectionOrder.filter((section) => (SECTION_KEYS as readonly string[]).includes(section));

const STEPS = [
  { id: 1, label: 'Basic Details', icon: User },
  { id: 2, label: 'vCard Templates', icon: Palette },
  { id: 3, label: 'Business Hours', icon: Clock },
  { id: 4, label: 'Customize QR Code', icon: QrCode },
  { id: 5, label: 'Social Links', icon: Link2 },
  { id: 6, label: 'Banner', icon: ImageIcon },
  { id: 7, label: 'Privacy Policy', icon: Lock },
  { id: 8, label: 'Terms & Conditions', icon: FileText },
  { id: 9, label: 'Manage Sections', icon: Sliders },
  { id: 10, label: 'Services', icon: Briefcase },
  { id: 11, label: 'Gallery', icon: Images },
  { id: 12, label: 'Enquiry Form', icon: MailQuestion },
];

const TEMPLATES = [
  {
    id: 'simple-contact',
    name: 'Simple Contact',
    category: 'Business',
    description: 'Clean minimalist design',
    colors: { primary: '#7c3aed', accent: '#06b6d4', header: '#7c3aed', bg: '#f8fafc' },
  },
  {
    id: 'executive-profile',
    name: 'Executive Profile',
    category: 'Corporate',
    description: 'Professional and elegant',
    colors: { primary: '#1e40af', accent: '#3b82f6', header: '#1e3a8a', bg: '#f0f4ff' },
  },
  {
    id: 'modern-edge',
    name: 'Modern Edge',
    category: 'Creator',
    description: 'Bold gradient design',
    colors: { primary: '#db2777', accent: '#f97316', header: '#9d174d', bg: '#fff1f2' },
  },
  {
    id: 'corporate-connect',
    name: 'Corporate Connect',
    category: 'Corporate',
    description: 'Formal business card',
    colors: { primary: '#0f172a', accent: '#64748b', header: '#0f172a', bg: '#f8fafc' },
  },
  {
    id: 'medical-clean',
    name: 'Medical Clean',
    category: 'Medical',
    description: 'Clean clinical design',
    colors: { primary: '#0891b2', accent: '#22d3ee', header: '#0e7490', bg: '#f0fdff' },
  },
  {
    id: 'luxury-dark',
    name: 'Luxury Dark',
    category: 'Luxury',
    description: 'Elegant dark theme',
    colors: { primary: '#b45309', accent: '#fcd34d', header: '#1c1917', bg: '#1c1917' },
  },
  {
    id: 'fitness-energy',
    name: 'Fitness Energy',
    category: 'Fitness',
    description: 'High energy vibrant look',
    colors: { primary: '#16a34a', accent: '#84cc16', header: '#15803d', bg: '#f0fdf4' },
  },
  {
    id: 'salon-elegance',
    name: 'Salon Elegance',
    category: 'Salon',
    description: 'Elegant beauty design',
    colors: { primary: '#be185d', accent: '#f9a8d4', header: '#9d174d', bg: '#fdf2f8' },
  },
  {
    id: 'restaurant-warm',
    name: 'Restaurant Warm',
    category: 'Restaurant',
    description: 'Warm inviting feel',
    colors: { primary: '#c2410c', accent: '#fdba74', header: '#9a3412', bg: '#fff7ed' },
  },
];

const TEMPLATE_COLORS: Record<string, { primary: string; accent: string; header: string; bg: string }> = {
  'simple-contact':    { primary: '#7c3aed', accent: '#06b6d4', header: '#7c3aed', bg: '#f8fafc' },
  'executive-profile': { primary: '#1e40af', accent: '#3b82f6', header: '#1e3a8a', bg: '#f0f4ff' },
  'modern-edge':       { primary: '#db2777', accent: '#f97316', header: '#9d174d', bg: '#fff1f2' },
  'corporate-connect': { primary: '#0f172a', accent: '#64748b', header: '#0f172a', bg: '#f8fafc' },
  'medical-clean':     { primary: '#0891b2', accent: '#22d3ee', header: '#0e7490', bg: '#f0fdff' },
  'luxury-dark':       { primary: '#b45309', accent: '#fcd34d', header: '#1c1917', bg: '#1c1917' },
  'fitness-energy':    { primary: '#16a34a', accent: '#84cc16', header: '#15803d', bg: '#f0fdf4' },
  'salon-elegance':    { primary: '#be185d', accent: '#f9a8d4', header: '#9d174d', bg: '#fdf2f8' },
  'restaurant-warm':   { primary: '#c2410c', accent: '#fdba74', header: '#9a3412', bg: '#fff7ed' },
};

const defaultFormData = {
  // Basic Details
  name: '',
  designation: '',
  company: '',
  email: '',
  phone: '',
  whatsappNumber: '',
  address: '',
  bio: '',
  url: '',
  isActive: true,
  template: 'simple-contact',

  // Social Links
  website: '',
  facebook: '',
  instagram: '',
  linkedin: '',
  twitter: '',
  whatsapp: '',
  youtube: '',
  tiktok: '',
  pinterest: '',
  telegram: '',
  reddit: '',
  googledrive: '',

  // Business Hours
  hours: {
    Monday:    { open: '09:00', close: '18:00', closed: false },
    Tuesday:   { open: '09:00', close: '18:00', closed: false },
    Wednesday: { open: '09:00', close: '18:00', closed: false },
    Thursday:  { open: '09:00', close: '18:00', closed: false },
    Friday:    { open: '09:00', close: '18:00', closed: false },
    Saturday:  { open: '10:00', close: '16:00', closed: false },
    Sunday:    { open: '00:00', close: '00:00', closed: true  },
  },

  // QR
  qrColor: '#7c3aed',
  qrBgColor: '#ffffff',
  qrSize: 180,
  qrLabel: 'Scan to connect',

  // Banner
  bannerTitle: '',
  bannerUrl: '',
  bannerDescription: '',
  bannerButton: '',
  profileImage: '',
  bannerImage: '',
  bannerPositionX: 50,
  bannerPositionY: 50,
  bannerScale: 100,

  // Legal
  privacyPolicy: '',
  termsConditions: '',

  // Section Visibility
  sections: {
    header: true,
    businessHours: true,
    services: true,
    products: true,
    gallery: true,
    testimonials: true,
    contact: true,
    banner: true,
    newsletter: true,
  },

  // Section Order (array of section keys)
  sectionOrder: ['header','businessHours','services','products','gallery','testimonials','contact','banner','newsletter'],

  // Dynamic Sections
  servicesList: [] as { title: string; description: string; icon?: string }[],
  galleryImages: [] as { url: string; publicId: string; caption?: string }[],
  enquiryConfig: { email: '', title: 'Inquiries' },
};

export default function ProfileSetupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(defaultFormData);
  const [saved, setSaved] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [customLinks, setCustomLinks] = useState<{ id: string; label: string; url: string }[]>([]);
  const [userPlan, setUserPlan] = useState('free');

  useEffect(() => {
    const loadVCard = async () => {
      // Safely read query parameters in client component
      const searchParams = new URLSearchParams(window.location.search);
      const cardId = searchParams.get('id');

      try {
        const [vcardRes, userRes] = await Promise.all([
          fetch('/api/vcards', { credentials: 'include' }),
          fetch('/api/auth/me', { credentials: 'include' })
        ]);
        
        let planLimit = 4;
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user?.plan) {
            setUserPlan(ENABLE_PREMIUM_FEATURES ? userData.user.plan : 'free');
            const effectivePlan = ENABLE_PREMIUM_FEATURES ? userData.user.plan : 'free';
            planLimit = PLAN_LIMITS[effectivePlan as keyof typeof PLAN_LIMITS]?.maxVCards ?? 4;
          }
        }

        if (vcardRes.ok) {
          const data = await vcardRes.json();
          const userVCards = data.vcards || [];
          
          if (cardId) {
            // Edit mode: find the card by ID
            const vcard = userVCards.find((v: any) => v._id === cardId);
            if (vcard) {
              // Convert hours array to object format for UI
              const hoursObj: any = {};
              (vcard.hours || []).forEach((h: any) => {
                hoursObj[h.day] = { open: h.open, close: h.close, closed: h.closed };
              });

              const normalizedSections = sanitizeSections(vcard.sections || defaultFormData.sections);
              const normalizedSectionOrder = sanitizeSectionOrder(vcard.sectionOrder || defaultFormData.sectionOrder);

              const formattedData = {
                ...defaultFormData,
                ...vcard,
                website: vcard.socialLinks?.website || vcard.website || '',
                whatsappNumber: vcard.whatsappNumber || vcard.socialLinks?.whatsapp || '',
                whatsapp: vcard.socialLinks?.whatsapp || vcard.whatsappNumber || '',
                facebook: vcard.socialLinks?.facebook || '',
                instagram: vcard.socialLinks?.instagram || '',
                linkedin: vcard.socialLinks?.linkedin || '',
                twitter: vcard.socialLinks?.twitter || '',
                youtube: vcard.socialLinks?.youtube || '',
                tiktok: vcard.socialLinks?.tiktok || '',
                pinterest: vcard.socialLinks?.pinterest || '',
                telegram: vcard.socialLinks?.telegram || '',
                reddit: vcard.socialLinks?.reddit || '',
                googledrive: vcard.socialLinks?.googledrive || '',
                hours: Object.keys(hoursObj).length > 0 ? hoursObj : defaultFormData.hours,
                sections: normalizedSections,
                sectionOrder: normalizedSectionOrder.length > 0 ? normalizedSectionOrder : defaultFormData.sectionOrder,
              };
              setFormData(formattedData);
              setCustomLinks(vcard.customLinks || []);
              // Update localStorage cache
              localStorage.setItem('vcard_data', JSON.stringify({ ...formattedData, customLinks: vcard.customLinks || [] }));
              return;
            } else {
              alert('vCard not found.');
              router.push('/dashboard/vcards');
              return;
            }
          } else {
            // Create mode: verify count limit
            if (userVCards.length >= planLimit) {
              alert(`Limit reached: You can create a maximum of ${planLimit} vCards.`);
              router.push('/dashboard/vcards');
              return;
            }
            // Fresh form
            setFormData(defaultFormData);
            setCustomLinks([]);
            return;
          }
        }
      } catch (err) {
        console.error('Error loading card:', err);
      }

      // Fallback to localStorage cache
      const cached = localStorage.getItem('vcard_data');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          // If we are creating a new card (no cardId), but cached data has an _id, ignore it
          if (!cardId && parsed._id) {
            // Ignore cached data of another card
          } else {
            setFormData(parsed);
            if (parsed.customLinks) setCustomLinks(parsed.customLinks);
          }
        } catch {}
      }
    };

    loadVCard();
  }, []);

  const tplColors = useMemo(() => {
    return TEMPLATE_COLORS[formData.template] || TEMPLATE_COLORS['simple-contact'];
  }, [formData.template]);

  const hasSocialLink = useMemo(() => {
    const socials = [
      formData.website, formData.facebook, formData.instagram, formData.linkedin,
      formData.twitter, formData.whatsapp, formData.whatsappNumber, formData.youtube, formData.tiktok,
      formData.pinterest, formData.telegram, formData.reddit, formData.googledrive
    ];
    return socials.some(link => link && link.trim() !== '');
  }, [formData]);

  const isHoursCustomized = useMemo(() => {
    const defaults = {
      Monday:    { open: '09:00', close: '18:00', closed: false },
      Tuesday:   { open: '09:00', close: '18:00', closed: false },
      Wednesday: { open: '09:00', close: '18:00', closed: false },
      Thursday:  { open: '09:00', close: '18:00', closed: false },
      Friday:    { open: '09:00', close: '18:00', closed: false },
      Saturday:  { open: '10:00', close: '16:00', closed: false },
      Sunday:    { open: '00:00', close: '00:00', closed: true  },
    };
    return JSON.stringify(formData.hours) !== JSON.stringify(defaults);
  }, [formData.hours]);

  const completionPercentage = useMemo(() => {
    let pct = 0;
    if (formData.name?.trim()) pct += 15;
    if (formData.designation?.trim()) pct += 10;
    if (formData.phone?.trim()) pct += 10;
    if (formData.email?.trim()) pct += 10;
    if (formData.address?.trim()) pct += 10;
    if (hasSocialLink) pct += 15;
    if (formData.bio?.trim()) pct += 10;
    if (formData.template !== 'simple-contact') pct += 5;
    if (isHoursCustomized) pct += 15;
    return pct;
  }, [formData, hasSocialLink, isHoursCustomized]);

  const handleSave = async () => {
    // Convert hours object to array for MongoDB
    const hoursArray = Object.entries(formData.hours || {}).map(([day, h]: any) => ({
      day,
      open: h.open,
      close: h.close,
      closed: h.closed,
    }));

    const payload = {
      ...formData,
      customLinks,
      sections: sanitizeSections(formData.sections),
      sectionOrder: sanitizeSectionOrder(formData.sectionOrder),
      hours: hoursArray,
      whatsappNumber: formData.whatsappNumber || formData.whatsapp,
      socialLinks: {
        website:     formData.website,
        facebook:    formData.facebook,
        instagram:   formData.instagram,
        twitter:     formData.twitter,
        linkedin:    formData.linkedin,
        youtube:     formData.youtube,
        tiktok:      formData.tiktok,
        whatsapp:    formData.whatsapp || formData.whatsappNumber,
        reddit:      formData.reddit,
        pinterest:   formData.pinterest,
        telegram:    formData.telegram,
        googledrive: formData.googledrive,
      },
    };

    // Save to API
    try {
      const res = await fetch('/api/vcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        const savedVCard = data.vcard;
        
        // Also update local state and localStorage cache
        const updatedFormData = { ...formData, _id: savedVCard._id, url: savedVCard.url };
        setFormData(updatedFormData);
        localStorage.setItem('vcard_data', JSON.stringify({ ...updatedFormData, customLinks }));
        setSaved(true);

        // If this was a new card, update URL so subsequent saves are updates
        const searchParams = new URLSearchParams(window.location.search);
        if (!searchParams.get('id') && savedVCard?._id) {
          router.replace(`/dashboard/profile?id=${savedVCard._id}`);
        }

        setTimeout(() => setSaved(false), 2000);
      } else {
        const err = await res.json();
        alert(err.error || 'Save failed');
      }
    } catch {
      // Fallback: save to localStorage only
      localStorage.setItem('vcard_data', JSON.stringify({ ...formData, customLinks }));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleDiscard = () => {
    const stored = localStorage.getItem('vcard_data');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const sanitizedSections = sanitizeSections(parsed.sections || defaultFormData.sections);
        const sanitizedSectionOrder = sanitizeSectionOrder(parsed.sectionOrder || defaultFormData.sectionOrder);
        setFormData(prev => ({
          ...prev,
          ...parsed,
          hours: { ...prev.hours, ...parsed.hours },
          sections: sanitizedSections,
          sectionOrder: sanitizedSectionOrder.length > 0 ? sanitizedSectionOrder : prev.sectionOrder,
          website: parsed.website || prev.website,
          whatsappNumber: parsed.whatsappNumber || prev.whatsappNumber,
          whatsapp: parsed.whatsapp || prev.whatsapp,
        }));
        if (parsed.customLinks) {
          setCustomLinks(parsed.customLinks);
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      setFormData(defaultFormData);
      setCustomLinks([]);
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleHoursChange = (day: string, field: 'open' | 'close' | 'closed', value: any) => {
    setFormData(prev => ({
      ...prev,
      hours: {
        ...prev.hours,
        [day]: {
          ...prev.hours[day as keyof typeof prev.hours],
          [field]: value
        }
      }
    }));
  };

  const handleSectionVisibility = (key: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: checked
      }
    }));
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newOrder = [...formData.sectionOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;

    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;

    setFormData(prev => ({
      ...prev,
      sectionOrder: newOrder
    }));
  };

  const downloadQR = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = formData.qrSize;
    canvas.height = formData.qrSize;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement('a');
      a.download = 'qr-code.png';
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const addCustomLink = () => {
    setCustomLinks(prev => [...prev, { id: Date.now().toString(), label: '', url: '' }]);
  };

  const removeCustomLink = (id: string) => {
    setCustomLinks(prev => prev.filter(link => link.id !== id));
  };

  const updateCustomLink = (id: string, field: 'label' | 'url', value: string) => {
    setCustomLinks(prev => prev.map(link => link.id === id ? { ...link, [field]: value } : link));
  };

  const filteredTemplates = useMemo(() => {
    if (selectedCategory === 'All') return TEMPLATES;
    return TEMPLATES.filter(tpl => tpl.category === selectedCategory);
  }, [selectedCategory]);

  const activeSections = useMemo(() => {
    return formData.sectionOrder.filter(sec => formData.sections[sec as keyof typeof formData.sections]);
  }, [formData.sectionOrder, formData.sections]);

  // Subcomponents
  function PhoneFrameContent() {
    return (
      <div className="w-full h-full overflow-y-auto bg-white scrollbar-hide text-[10px] text-gray-800 flex flex-col pb-16">
        {/* 1. Header Strip */}
        <div 
          style={
            formData.bannerImage 
              ? { 
                  height: 40,
                  backgroundImage: `url(${formData.bannerImage})`,
                  backgroundPosition: `${formData.bannerPositionX ?? 50}% ${formData.bannerPositionY ?? 50}%`,
                  backgroundSize: `${formData.bannerScale ?? 100}%`,
                  backgroundRepeat: 'no-repeat',
                  position: 'relative'
                } 
              : { 
                  height: 40,
                  background: tplColors.header,
                  position: 'relative' 
                }
          } 
          className="flex-shrink-0"
        >
          {/* 2. Avatar */}
          <div 
            style={{ 
              width: 32, 
              height: 32, 
              borderRadius: '50%', 
              background: '#fff', 
              border: `2px solid ${tplColors.primary}`, 
              position: 'absolute', 
              bottom: -16, 
              left: '50%', 
              transform: 'translateX(-50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              fontWeight: 'bold',
              fontSize: '10px',
              color: tplColors.primary
            }}
          >
            {formData.profileImage ? (
              <img src={formData.profileImage} alt={formData.name} className="w-full h-full object-cover" />
            ) : (
              formData.name ? formData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'
            )}
          </div>
        </div>
        
        <div className="px-3 pt-5 text-center flex-shrink-0">
          {/* 3. Name */}
          <h4 className="font-bold text-xs truncate leading-tight text-gray-900">{formData.name || 'Your Name'}</h4>
          {/* 4. Designation */}
          <p className="text-[8px] text-gray-500 truncate mt-0.5">{formData.designation || 'Your Title'}</p>
          {/* Company */}
          {formData.company && <p className="text-[7px] text-gray-400 truncate">{formData.company}</p>}
        </div>

        {/* 5. Social Icons Dot Row */}
        {hasSocialLink && (
          <div className="flex justify-center gap-1 mt-2 px-3 flex-shrink-0">
            {[
              formData.website, formData.facebook, formData.instagram, formData.linkedin,
              formData.twitter, formData.whatsapp, formData.youtube, formData.tiktok,
              formData.pinterest, formData.telegram, formData.reddit, formData.googledrive
            ].filter(Boolean).slice(0, 5).map((_, idx) => (
              <div key={idx} style={{ width: 8, height: 8, borderRadius: '50%', background: tplColors.accent }} className="opacity-80" />
            ))}
          </div>
        )}

        {/* 6. Contact details */}
        <div className="px-3 mt-3 space-y-1 text-[8px] text-gray-600 flex-shrink-0">
          {formData.phone && (
            <div className="flex items-center gap-1.5 truncate">
              <Phone className="w-2.5 h-2.5 text-gray-400" />
              <span className="truncate">{formData.phone}</span>
            </div>
          )}
          {formData.email && (
            <div className="flex items-center gap-1.5 truncate">
              <Mail className="w-2.5 h-2.5 text-gray-400" />
              <span className="truncate">{formData.email}</span>
            </div>
          )}
          {formData.address && (
            <div className="flex items-start gap-1.5 truncate">
              <MapPin className="w-2.5 h-2.5 text-gray-400 mt-0.5" />
              <span className="truncate">{formData.address}</span>
            </div>
          )}
        </div>

        {/* 7. Services Skeleton Grid */}
        {formData.sections.services && (
          <div className="px-3 mt-4 flex-shrink-0">
            <h5 className="font-bold text-[8px] mb-1.5" style={{ color: tplColors.primary }}>Our Services</h5>
            <div className="grid grid-cols-2 gap-1">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-6 rounded bg-gray-50 flex items-center justify-center" style={{ borderLeft: `2px solid ${tplColors.primary}` }}>
                  <div className="w-3 h-3 rounded-full bg-gray-100" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. Business Hours Mon/Tue */}
        {formData.sections.businessHours && (
          <div className="px-3 mt-4 flex-shrink-0">
            <h5 className="font-bold text-[8px] mb-1" style={{ color: tplColors.primary }}>Business Hours</h5>
            <div className="space-y-0.5 text-[7px] text-gray-600">
              <div className="flex justify-between border-b border-gray-50 pb-0.5">
                <span>Monday</span>
                {formData.hours.Monday.closed ? (
                  <span className="text-red-500 font-medium">Closed</span>
                ) : (
                  <span>{formData.hours.Monday.open} - {formData.hours.Monday.close}</span>
                )}
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-0.5">
                <span>Tuesday</span>
                {formData.hours.Tuesday.closed ? (
                  <span className="text-red-500 font-medium">Closed</span>
                ) : (
                  <span>{formData.hours.Tuesday.open} - {formData.hours.Tuesday.close}</span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">vCard Profile Setup</h1>
          <p className="text-sm text-muted-foreground mt-1">Configure your personal digital business card profile</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-2"
          onClick={() => {
            handleSave();
            setTimeout(() => {
              router.push(`/profile/${formData.url || 'my-profile'}`);
            }, 200);
          }}
        >
          <Eye className="w-4 h-4" />
          <span>View Public Profile</span>
        </Button>
      </div>

      {/* Completion Tracker Card */}
      <Card className="border border-border bg-card">
        <CardContent className="pt-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-semibold text-foreground">Profile {completionPercentage}% Complete</span>
            <Badge variant={completionPercentage === 100 ? 'default' : 'secondary'} className="text-xs">
              {completionPercentage}%
            </Badge>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {!formData.name && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Name (+15%)
              </Badge>
            )}
            {!formData.designation && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Title (+10%)
              </Badge>
            )}
            {!formData.phone && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Phone (+10%)
              </Badge>
            )}
            {!formData.email && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Email (+10%)
              </Badge>
            )}
            {!formData.address && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Address (+10%)
              </Badge>
            )}
            {!hasSocialLink && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(5)}>
                + Add Social Links (+15%)
              </Badge>
            )}
            {!formData.bio && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(1)}>
                + Add Bio (+10%)
              </Badge>
            )}
            {formData.template === 'simple-contact' && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(2)}>
                + Change Template (+5%)
              </Badge>
            )}
            {!isHoursCustomized && (
              <Badge variant="outline" className="cursor-pointer hover:bg-muted/80 text-[10px]" onClick={() => setCurrentStep(3)}>
                + Set Hours (+15%)
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Split layout structure */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Step Navigation for Mobile (horizontal scroll) */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
          {STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-all flex-shrink-0 ${
                  isActive 
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                    : 'text-muted-foreground bg-card border-border hover:bg-muted/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Left Step Navigation for Desktop (vertical list) */}
        <div className="hidden lg:block w-56 flex-shrink-0 space-y-1">
          {STEPS.map(step => {
            const Icon = step.icon;
            const isActive = currentStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-left text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-l-2 border-primary pl-[14px]' 
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Middle Form Content */}
        <div className="flex-1 min-w-0 space-y-6">
          <Card className="border border-border bg-card shadow-sm">
            <CardHeader className="pb-3 border-b border-border">
              <CardTitle className="text-lg font-bold text-foreground">
                {STEPS.find(s => s.id === currentStep)?.label}
              </CardTitle>
              <CardDescription className="text-xs">
                Configure settings for this section below. Make sure to save your changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              
              {/* STEP 1: Basic Details */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-xs sm:text-sm">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="Ashwini Physiotherapy"
                      value={formData.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation" className="text-xs sm:text-sm">Designation / Title *</Label>
                    <Input
                      id="designation"
                      placeholder="Consultant Physiotherapist"
                      value={formData.designation}
                      onChange={(e) => updateField('designation', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-xs sm:text-sm">Company Name</Label>
                    <Input
                      id="company"
                      placeholder="Company name"
                      value={formData.company}
                      onChange={(e) => updateField('company', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs sm:text-sm">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="+91 9999999999"
                      value={formData.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsappNumber" className="text-xs sm:text-sm">WhatsApp Number</Label>
                    <Input
                      id="whatsappNumber"
                      placeholder="+91 9999999999"
                      value={formData.whatsappNumber}
                      onChange={(e) => updateField('whatsappNumber', e.target.value)}
                      className="text-xs sm:text-sm h-9 sm:h-10"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="url" className="text-xs sm:text-sm">Profile URL Slug</Label>
                    <div className="flex gap-2">
                      <span className="flex items-center px-3 bg-muted rounded-md text-xs text-muted-foreground whitespace-nowrap">
                        pinnaclegridconnect.com/
                      </span>
                      <Input
                        id="url"
                        placeholder="your-profile-slug"
                        value={formData.url}
                        onChange={(e) => updateField('url', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10 flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="address" className="text-xs sm:text-sm">Full Address</Label>
                    <Textarea
                      id="address"
                      placeholder="Full address"
                      value={formData.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      rows={2}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="bio" className="text-xs sm:text-sm">Bio / About</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell visitors about yourself..."
                      value={formData.bio}
                      onChange={(e) => updateField('bio', e.target.value)}
                      rows={3}
                      className="text-xs sm:text-sm"
                    />
                  </div>
                  {/* Profile Image Upload */}
                  <div className="sm:col-span-2 space-y-2 border-t border-border/40 pt-4">
                    <Label className="text-xs sm:text-sm font-semibold">Profile Photo</Label>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="relative w-20 h-20 rounded-full border border-border bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                        {formData.profileImage ? (
                          <img src={formData.profileImage} alt="Profile Photo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-muted-foreground text-xs font-semibold">No Image</span>
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex gap-2">
                          <label 
                            htmlFor="profile-upload"
                            className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                          >
                            Upload Photo
                            <input 
                              type="file" 
                              accept="image/*" 
                              id="profile-upload"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                
                                if (file.size > 5 * 1024 * 1024) {
                                  alert('Image size exceeds 5MB limit.');
                                  return;
                                }

                                try {
                                  const formDataToUpload = new FormData();
                                  formDataToUpload.append('file', file);
                                  const res = await fetch('/api/upload', {
                                    method: 'POST',
                                    body: formDataToUpload
                                  });
                                  if (res.ok) {
                                    const data = await res.json();
                                    updateField('profileImage', data.url);
                                  } else {
                                    const errData = await res.json();
                                    alert(errData.error || 'Failed to upload image');
                                  }
                                } catch (err) {
                                  console.error(err);
                                  alert('Error uploading image');
                                }
                              }}
                            />
                          </label>
                          {formData.profileImage && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => updateField('profileImage', '')}
                              type="button"
                              className="text-xs h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/20"
                            >
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">PNG, JPG, JPEG up to 5MB. Suggested square dimensions.</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:col-span-2 p-3 bg-muted/40 rounded-lg">
                    <div className="space-y-0.5">
                      <Label className="text-sm font-semibold text-foreground">Active State</Label>
                      <p className="text-[11px] text-muted-foreground">Keep profile active or temporarily offline</p>
                    </div>
                    <Switch
                      checked={formData.isActive}
                      onCheckedChange={(checked) => updateField('isActive', checked)}
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: vCard Templates */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Filter Pills */}
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide border-b border-border">
                    {['All', 'Medical', 'Corporate', 'Luxury', 'Business', 'Creator', 'Fitness', 'Salon', 'Restaurant'].map(cat => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all whitespace-nowrap flex-shrink-0 ${
                          selectedCategory === cat
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'text-muted-foreground border-border bg-card hover:bg-muted/50'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Templates Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {filteredTemplates.map(tpl => {
                      const isSelected = formData.template === tpl.id;
                      return (
                        <div
                          key={tpl.id}
                          onClick={() => updateField('template', tpl.id)}
                          className={`relative cursor-pointer flex flex-col items-center p-4 rounded-xl border-2 transition-all bg-card ${
                            isSelected
                              ? 'border-primary ring-2 ring-primary/20 shadow-lg'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          {/* Selected Checkmark Indicator Overlay */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md z-10">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </div>
                          )}

                          {/* JSX Mini Mockup Frame */}
                          <div style={{ background: tpl.colors.bg, borderRadius: 8, overflow: 'hidden', width: 120, height: 180, flexShrink: 0 }} className="shadow-sm border border-gray-100 flex flex-col relative select-none">
                            {/* Colored header bar */}
                            <div style={{ height: 40, background: tpl.colors.header }} />
                            {/* Avatar circle */}
                            <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#fff', border: `2px solid ${tpl.colors.primary}`, margin: '-14px auto 0', position: 'relative' }} />
                            {/* Name line */}
                            <div style={{ margin: '8px 8px 2px', height: 6, borderRadius: 3, background: tpl.colors.primary, width: '70%' }} />
                            {/* Designation line */}
                            <div style={{ margin: '0 8px 6px', height: 4, borderRadius: 3, background: tpl.colors.accent, opacity: 0.5, width: '50%' }} />
                            {/* Social dots row */}
                            <div style={{ display: 'flex', gap: 3, padding: '0 8px', marginBottom: 6 }}>
                              {[...Array(5)].map((_, i) => (
                                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: tpl.colors.accent, opacity: 0.7 }} />
                              ))}
                            </div>
                            {/* Contact rows */}
                            {[...Array(2)].map((_, i) => (
                              <div key={i} style={{ display: 'flex', gap: 4, padding: '2px 8px', alignItems: 'center' }}>
                                <div style={{ width: 8, height: 8, borderRadius: 2, background: tpl.colors.primary, opacity: 0.5 }} />
                                <div style={{ height: 3, flex: 1, borderRadius: 2, background: '#ccc' }} />
                              </div>
                            ))}
                            {/* Services grid */}
                            <div style={{ padding: '6px 8px 0', fontSize: 5, color: tpl.colors.primary, fontWeight: 700, marginBottom: 4 }}>Our Services</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: '0 8px' }}>
                              {[...Array(4)].map((_, i) => (
                                <div key={i} style={{ height: 20, borderRadius: 4, background: tpl.colors.primary, opacity: 0.15 }} />
                              ))}
                            </div>
                          </div>

                          <div className="mt-4 text-center">
                            <h3 className="font-bold text-sm text-foreground">{tpl.name}</h3>
                            <Badge variant="secondary" className="mt-1 text-[9px] scale-90">{tpl.category}</Badge>
                            <p className="text-[10px] text-muted-foreground mt-1 line-clamp-1 px-1">{tpl.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Business Hours */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  {Object.entries(formData.hours).map(([day, dayData]) => (
                    <div key={day} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg border border-border bg-muted/20 gap-3">
                      <span className="font-semibold text-sm w-24 text-foreground">{day}</span>
                      
                      {dayData.closed ? (
                        <div className="flex-1 flex items-center justify-start">
                          <Badge variant="destructive" className="text-xs">Closed</Badge>
                        </div>
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <Input
                            type="time"
                            value={dayData.open}
                            onChange={(e) => handleHoursChange(day, 'open', e.target.value)}
                            className="text-xs w-28 h-9 bg-background"
                          />
                          <span className="text-muted-foreground text-xs">—</span>
                          <Input
                            type="time"
                            value={dayData.close}
                            onChange={(e) => handleHoursChange(day, 'close', e.target.value)}
                            className="text-xs w-28 h-9 bg-background"
                          />
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id={`closed-${day}`}
                          checked={dayData.closed}
                          onCheckedChange={(checked) => handleHoursChange(day, 'closed', !!checked)}
                        />
                        <Label htmlFor={`closed-${day}`} className="text-xs cursor-pointer select-none">Closed</Label>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP 4: Customize QR Code */}
              {currentStep === 4 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left QR Preview */}
                  <div className="flex flex-col items-center justify-center p-6 border border-border rounded-xl bg-muted/10 gap-4">
                    <div 
                      className="p-4 rounded-2xl shadow-md border border-border inline-block"
                      style={{ backgroundColor: formData.qrBgColor }}
                    >
                      <QRCode
                        id="qr-code-svg"
                        value={getPublicProfileUrl(formData.url || 'my-profile')}
                        size={formData.qrSize}
                        fgColor={formData.qrColor}
                        bgColor={formData.qrBgColor}
                        level="H"
                      />
                    </div>
                    {formData.qrLabel && (
                      <p className="text-xs font-semibold text-muted-foreground tracking-wide uppercase">
                        {formData.qrLabel}
                      </p>
                    )}
                    <Button onClick={downloadQR} className="w-full gap-2 text-xs" size="sm">
                      Download QR Code
                    </Button>
                  </div>

                  {/* Right QR Controls */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold">Foreground Color</Label>
                      <div className="flex gap-3 items-center">
                        <Input
                          type="color"
                          value={formData.qrColor}
                          onChange={(e) => updateField('qrColor', e.target.value)}
                          className="w-12 h-10 p-0.5 border border-border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.qrColor}
                          onChange={(e) => updateField('qrColor', e.target.value)}
                          className="text-xs h-9 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm font-semibold">Background Color</Label>
                      <div className="flex gap-3 items-center">
                        <Input
                          type="color"
                          value={formData.qrBgColor}
                          onChange={(e) => updateField('qrBgColor', e.target.value)}
                          className="w-12 h-10 p-0.5 border border-border rounded cursor-pointer"
                        />
                        <Input
                          type="text"
                          value={formData.qrBgColor}
                          onChange={(e) => updateField('qrBgColor', e.target.value)}
                          className="text-xs h-9 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm font-semibold">
                        <Label>QR Code Size</Label>
                        <span className="text-muted-foreground">{formData.qrSize}px</span>
                      </div>
                      <Slider
                        min={128}
                        max={256}
                        step={4}
                        value={[formData.qrSize]}
                        onValueChange={(val) => updateField('qrSize', val[0])}
                        className="py-2"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="qrLabel" className="text-xs sm:text-sm">Frame Label text</Label>
                      <Input
                        id="qrLabel"
                        placeholder="Scan to connect"
                        value={formData.qrLabel}
                        onChange={(e) => updateField('qrLabel', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Social Links */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] sm:text-xs text-amber-700 leading-relaxed">
                    <strong>Note:</strong> Uploaded icon name should be &apos;WeChat.png&apos; / &apos;Tumbler.png&apos;, while downloading .vcf file that name will be used as label.
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">🌐 Website URL</Label>
                      <Input
                        placeholder="https://yourwebsite.com"
                        value={formData.website}
                        onChange={(e) => updateField('website', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">🐦 Twitter URL</Label>
                      <Input
                        placeholder="https://twitter.com/..."
                        value={formData.twitter}
                        onChange={(e) => updateField('twitter', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">📘 Facebook URL</Label>
                      <Input
                        placeholder="https://facebook.com/..."
                        value={formData.facebook}
                        onChange={(e) => updateField('facebook', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">📷 Instagram URL</Label>
                      <Input
                        placeholder="https://instagram.com/..."
                        value={formData.instagram}
                        onChange={(e) => updateField('instagram', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">🔴 Reddit URL</Label>
                      <Input
                        placeholder="https://reddit.com/..."
                        value={formData.reddit}
                        onChange={(e) => updateField('reddit', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">💼 LinkedIn URL</Label>
                      <Input
                        placeholder="https://linkedin.com/in/..."
                        value={formData.linkedin}
                        onChange={(e) => updateField('linkedin', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">▶️ YouTube URL</Label>
                      <Input
                        placeholder="https://youtube.com/..."
                        value={formData.youtube}
                        onChange={(e) => updateField('youtube', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">📌 Pinterest URL</Label>
                      <Input
                        placeholder="https://pinterest.com/..."
                        value={formData.pinterest}
                        onChange={(e) => updateField('pinterest', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">🎵 TikTok URL</Label>
                      <Input
                        placeholder="https://tiktok.com/..."
                        value={formData.tiktok}
                        onChange={(e) => updateField('tiktok', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">📁 Google Drive URL</Label>
                      <Input
                        placeholder="https://drive.google.com/..."
                        value={formData.googledrive}
                        onChange={(e) => updateField('googledrive', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">✈️ Telegram URL</Label>
                      <Input
                        placeholder="https://t.me/..."
                        value={formData.telegram}
                        onChange={(e) => updateField('telegram', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs sm:text-sm flex items-center gap-1.5">💬 WhatsApp Number</Label>
                      <Input
                        placeholder="+919999999999 (with prefix)"
                        value={formData.whatsapp}
                        onChange={(e) => updateField('whatsapp', e.target.value)}
                        className="text-xs sm:text-sm h-9"
                      />
                    </div>
                  </div>

                  {/* Custom Links Subsections */}
                  <div className="pt-6 border-t border-border space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-semibold text-foreground">Custom Links</h4>
                      <Button type="button" size="sm" variant="outline" onClick={addCustomLink} className="gap-1 h-8 text-[11px]">
                        <Plus className="w-3.5 h-3.5" /> Add Link
                      </Button>
                    </div>

                    {customLinks.map((link) => (
                      <div key={link.id} className="flex gap-2 items-center bg-muted/20 p-2 rounded-lg border border-border">
                        <Input
                          placeholder="Label (e.g. Portfolio)"
                          value={link.label}
                          onChange={(e) => updateCustomLink(link.id, 'label', e.target.value)}
                          className="text-xs h-8 flex-1"
                        />
                        <Input
                          placeholder="URL (e.g. https://...)"
                          value={link.url}
                          onChange={(e) => updateCustomLink(link.id, 'url', e.target.value)}
                          className="text-xs h-8 flex-[2]"
                        />
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={() => removeCustomLink(link.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 6: Banner */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="bannerTitle" className="text-xs sm:text-sm">Banner Title *</Label>
                      <Input
                        id="bannerTitle"
                        placeholder="Promotional Header Title"
                        value={formData.bannerTitle}
                        onChange={(e) => updateField('bannerTitle', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerUrl" className="text-xs sm:text-sm">Banner Target URL *</Label>
                      <Input
                        id="bannerUrl"
                        placeholder="https://yourwebsite.com/promotion"
                        value={formData.bannerUrl}
                        onChange={(e) => updateField('bannerUrl', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label htmlFor="bannerDescription" className="text-xs sm:text-sm">Banner Description *</Label>
                      <Textarea
                        id="bannerDescription"
                        placeholder="Description of promotion..."
                        value={formData.bannerDescription}
                        onChange={(e) => updateField('bannerDescription', e.target.value)}
                        rows={4}
                        className="text-xs sm:text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bannerButton" className="text-xs sm:text-sm">Banner Button Text *</Label>
                      <Input
                        id="bannerButton"
                        placeholder="Enquire Now"
                        value={formData.bannerButton}
                        onChange={(e) => updateField('bannerButton', e.target.value)}
                        className="text-xs sm:text-sm h-9 sm:h-10"
                      />
                    </div>
                  </div>

                  {/* Banner Preview Card */}
                  {formData.bannerTitle && (
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground font-semibold uppercase">Live Banner Preview</Label>
                      <div 
                        style={{ background: `linear-gradient(to right, ${tplColors.primary}, ${tplColors.accent})` }}
                        className="w-full px-4 py-3 rounded-xl flex items-center justify-between gap-3 shadow-md"
                      >
                        <div className="flex-1 text-white">
                          <p className="font-bold text-xs sm:text-sm truncate">{formData.bannerTitle}</p>
                          <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{formData.bannerDescription || 'Description will load here...'}</p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className="text-[10px] bg-white/20 text-white border border-white/40 px-3 py-1 rounded-full font-medium whitespace-nowrap">
                            {formData.bannerButton || 'Button'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Cover/Banner Image Section */}
                  <div className="border-t border-border/40 pt-6 space-y-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Cover Banner Image</h3>
                      <p className="text-xs text-muted-foreground">Upload a cover image that will display at the top of your public profile.</p>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Upload and controls */}
                      <div className="flex flex-col sm:flex-row gap-4 items-start">
                        <div className="flex-1 w-full space-y-3">
                          <div className="flex gap-2">
                            <label 
                              htmlFor="cover-upload"
                              className="inline-flex items-center justify-center rounded-md text-xs font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3 cursor-pointer"
                            >
                              Upload Cover Image
                              <input 
                                type="file" 
                                accept="image/*" 
                                id="cover-upload"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  
                                  if (file.size > 5 * 1024 * 1024) {
                                    alert('Image size exceeds 5MB limit.');
                                    return;
                                  }

                                  try {
                                    const formDataToUpload = new FormData();
                                    formDataToUpload.append('file', file);
                                    const res = await fetch('/api/upload', {
                                      method: 'POST',
                                      body: formDataToUpload
                                    });
                                    if (res.ok) {
                                      const data = await res.json();
                                      updateField('bannerImage', data.url);
                                    } else {
                                      const errData = await res.json();
                                      alert(errData.error || 'Failed to upload image');
                                    }
                                  } catch (err) {
                                    console.error(err);
                                    alert('Error uploading image');
                                  }
                                }}
                              />
                            </label>
                            {formData.bannerImage && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                type="button"
                                onClick={() => {
                                  updateField('bannerImage', '');
                                  updateField('bannerPositionX', 50);
                                  updateField('bannerPositionY', 50);
                                  updateField('bannerScale', 100);
                                }}
                                className="text-xs h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50/10 border-red-500/20"
                              >
                                Remove Cover
                              </Button>
                            )}
                          </div>
                          <p className="text-[10px] text-muted-foreground">PNG, JPG, JPEG up to 5MB. Suggested aspect ratio 16:9.</p>

                          {formData.bannerImage && (
                            <div className="space-y-3 pt-2">
                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span>Position X (Horizontal): {formData.bannerPositionX ?? 50}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={formData.bannerPositionX ?? 50} 
                                  onChange={(e) => updateField('bannerPositionX', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span>Position Y (Vertical): {formData.bannerPositionY ?? 50}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="0" 
                                  max="100" 
                                  value={formData.bannerPositionY ?? 50} 
                                  onChange={(e) => updateField('bannerPositionY', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                              </div>

                              <div className="space-y-1">
                                <div className="flex justify-between text-xs font-semibold">
                                  <span>Zoom / Scale: {formData.bannerScale ?? 100}%</span>
                                </div>
                                <input 
                                  type="range" 
                                  min="100" 
                                  max="200" 
                                  value={formData.bannerScale ?? 100} 
                                  onChange={(e) => updateField('bannerScale', parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Visual Live Preview container */}
                        <div className="w-full sm:w-60 h-32 rounded-lg border border-border overflow-hidden bg-muted flex-shrink-0 relative">
                          <div 
                            style={
                              formData.bannerImage 
                                ? { 
                                    backgroundImage: `url(${formData.bannerImage})`,
                                    backgroundPosition: `${formData.bannerPositionX ?? 50}% ${formData.bannerPositionY ?? 50}%`,
                                    backgroundSize: `${formData.bannerScale ?? 100}%`,
                                    backgroundRepeat: 'no-repeat',
                                  } 
                                : { 
                                    background: `linear-gradient(135deg, ${tplColors.header}, ${tplColors.accent})` 
                                  }
                            } 
                            className="w-full h-full relative"
                          >
                            <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
                            {/* Overlaid profile picture */}
                            <div 
                              style={{ borderColor: '#ffffff', backgroundColor: tplColors.bg, color: tplColors.primary }}
                              className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 shadow-md flex items-center justify-center overflow-hidden font-bold text-xs"
                            >
                              {formData.profileImage ? (
                                <img src={formData.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                              ) : (
                                formData.name ? formData.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : 'U'
                              )}
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: Privacy Policy */}
              {currentStep === 7 && (
                <div className="space-y-2">
                  <Label htmlFor="privacyPolicy" className="text-xs sm:text-sm font-semibold">Privacy Policy</Label>
                  <Textarea
                    id="privacyPolicy"
                    placeholder="Enter your privacy policy details here..."
                    value={formData.privacyPolicy}
                    onChange={(e) => updateField('privacyPolicy', e.target.value)}
                    rows={10}
                    className="text-xs sm:text-sm min-h-[200px] resize-y"
                  />
                </div>
              )}

              {/* STEP 8: Terms & Conditions */}
              {currentStep === 8 && (
                <div className="space-y-2">
                  <Label htmlFor="termsConditions" className="text-xs sm:text-sm font-semibold">Terms & Conditions</Label>
                  <Textarea
                    id="termsConditions"
                    placeholder="Enter your terms and conditions details here..."
                    value={formData.termsConditions}
                    onChange={(e) => updateField('termsConditions', e.target.value)}
                    rows={10}
                    className="text-xs sm:text-sm min-h-[200px] resize-y"
                  />
                </div>
              )}

              {/* STEP 9: Manage Sections */}
              {currentStep === 9 && (
                <div className="space-y-6">
                  {/* Visibility Toggles grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SECTION_KEYS.map((key) => {
                      const labelMapping: Record<string, string> = {
                        header: 'Header Section',
                        businessHours: 'Business Hours Section',
                        services: 'Services Section',
                        products: 'Products Section',
                        gallery: 'Gallery Section',
                        testimonials: 'Testimonials Section',
                        contact: 'Contact Inquiry Form',
                        banner: 'Promotional Banner',
                        newsletter: 'Newsletter Popup Signup'
                      };
                      return (
                        <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20">
                          <Label htmlFor={`visible-${key}`} className="text-xs sm:text-sm font-semibold cursor-pointer text-foreground">
                            {labelMapping[key] || key}
                          </Label>
                            <Switch
                              id={`visible-${key}`}
                              checked={formData.sections[key as keyof typeof formData.sections]}
                              onCheckedChange={(checked) => handleSectionVisibility(key, checked)}
                            />
                        </div>
                      );
                    })}
                  </div>

                  {/* Section Ordering List */}
                  <div className="pt-6 border-t border-border space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-foreground">Section Display Ordering</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Use ▲ and ▼ buttons below to arrange display order for enabled sections on your public card.</p>
                    </div>

                    <div className="space-y-2">
                      {formData.sectionOrder.map((sectionKey, index) => {
                        const isVisible = formData.sections[sectionKey as keyof typeof formData.sections];
                        if (!isVisible) return null;
                        const labelMapping: Record<string, string> = {
                          header: '👤 Header info & Avatar',
                          businessHours: '🕐 Business Hours Schedule',
                          services: '🛠 Dynamic Services Grid',
                          products: '📦 Product Showcase Carousel',
                          gallery: '🖼 Dynamic Photo Gallery',
                          testimonials: '💬 Client Testimonials Slider',
                          contact: '📧 Contact Inquiry Form',
                          banner: '🎁 Promotional Header Banner',
                          newsletter: '✉️ Newsletter Popup Signups'
                        };
                        return (
                          <div 
                            key={sectionKey} 
                            className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-card shadow-sm"
                          >
                            <span className="text-xs font-semibold text-foreground pl-1">
                              {labelMapping[sectionKey] || sectionKey}
                            </span>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                disabled={index === 0}
                                onClick={() => moveSection(index, 'up')}
                              >
                                <ArrowUp className="w-3.5 h-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                disabled={index === formData.sectionOrder.length - 1}
                                onClick={() => moveSection(index, 'down')}
                              >
                                <ArrowDown className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
              {/* STEP 10: Services */}
              {currentStep === 10 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Services List</Label>
                      {PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]?.maxServices !== Infinity && (
                        <p className="text-[10px] text-muted-foreground">
                          {formData.servicesList?.length || 0} / {PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS].maxServices} Services Used
                        </p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={formData.servicesList?.length >= (PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]?.maxServices || Infinity)}
                      onClick={() => setFormData(prev => ({
                        ...prev, 
                        servicesList: [...(prev.servicesList || []), { title: '', description: '' }]
                      }))}
                    >
                      + Add Service
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {(formData.servicesList || []).map((service, index) => (
                      <div key={index} className="p-3 border rounded-lg space-y-3 bg-muted/10 relative">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:bg-red-50"
                          onClick={() => setFormData(prev => ({
                            ...prev,
                            servicesList: prev.servicesList.filter((_, i) => i !== index)
                          }))}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <div className="space-y-2">
                          <Label className="text-xs">Service Title</Label>
                          <Input 
                            className="text-xs h-8"
                            value={service.title}
                            placeholder="e.g. Web Development"
                            onChange={(e) => {
                              const newList = [...formData.servicesList];
                              newList[index].title = e.target.value;
                              setFormData(prev => ({ ...prev, servicesList: newList }));
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Description</Label>
                          <Textarea 
                            className="text-xs min-h-[60px]"
                            value={service.description}
                            placeholder="Describe your service..."
                            onChange={(e) => {
                              const newList = [...formData.servicesList];
                              newList[index].description = e.target.value;
                              setFormData(prev => ({ ...prev, servicesList: newList }));
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    {(!formData.servicesList || formData.servicesList.length === 0) && (
                      <p className="text-xs text-muted-foreground text-center py-4 border rounded border-dashed">No services added yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 11: Gallery */}
              {currentStep === 11 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Label className="text-xs sm:text-sm font-semibold">Gallery Images</Label>
                      {PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]?.maxGalleryImages !== Infinity && (
                        <p className="text-[10px] text-muted-foreground">
                          {formData.galleryImages?.length || 0} / {PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS].maxGalleryImages} Images Used
                        </p>
                      )}
                    </div>
                    <div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        id="gallery-upload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          
                          const fd = new FormData();
                          fd.append('file', file);
                          
                          try {
                            const res = await fetch('/api/upload', { method: 'POST', body: fd });
                            if (res.ok) {
                              const data = await res.json();
                              setFormData(prev => ({
                                ...prev,
                                galleryImages: [...(prev.galleryImages || []), { url: data.url, publicId: data.publicId, caption: '' }]
                              }));
                            } else {
                              alert('Upload failed');
                            }
                          } catch(err) {
                            alert('Upload error');
                          }
                        }}
                      />
                      <Button variant="outline" size="sm" asChild disabled={formData.galleryImages?.length >= (PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]?.maxGalleryImages || Infinity)}>
                        <label htmlFor="gallery-upload" className={`cursor-pointer ${formData.galleryImages?.length >= (PLAN_LIMITS[userPlan as keyof typeof PLAN_LIMITS]?.maxGalleryImages || Infinity) ? 'opacity-50 pointer-events-none' : ''}`}>+ Upload Image</label>
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(formData.galleryImages || []).map((img, index) => (
                      <div key={index} className="relative group rounded-lg overflow-hidden border aspect-video bg-muted flex items-center justify-center">
                        <img src={img.url} alt="Gallery item" className="object-cover w-full h-full" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              galleryImages: prev.galleryImages.filter((_, i) => i !== index)
                            }))}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {(!formData.galleryImages || formData.galleryImages.length === 0) && (
                    <p className="text-xs text-muted-foreground text-center py-4 border rounded border-dashed">No images uploaded yet.</p>
                  )}
                </div>
              )}

              {/* STEP 12: Enquiry Form Config */}
              {currentStep === 12 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-semibold">Form Title</Label>
                    <Input 
                      className="text-xs sm:text-sm h-9 sm:h-10"
                      value={formData.enquiryConfig?.title || ''}
                      placeholder="e.g. Contact Us"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        enquiryConfig: { ...(prev.enquiryConfig || {email:''}), title: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs sm:text-sm font-semibold">Notification Email</Label>
                    <p className="text-[10px] text-muted-foreground">Enquiries will be stored in your dashboard, but you can also receive them here.</p>
                    <Input 
                      className="text-xs sm:text-sm h-9 sm:h-10"
                      type="email"
                      value={formData.enquiryConfig?.email || ''}
                      placeholder="your@email.com"
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        enquiryConfig: { ...(prev.enquiryConfig || {title:'Inquiries'}), email: e.target.value }
                      }))}
                    />
                  </div>
                </div>
              )}

            </CardContent>
          </Card>

          {/* Action Save/Discard buttons below active step */}
          <div className="flex justify-between items-center pt-2">
            <Button
              onClick={handleDiscard}
              variant="outline"
              size="sm"
              className="text-xs h-9 px-4"
            >
              Discard Changes
            </Button>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                size="sm"
                className="text-xs h-9 px-6 bg-primary text-primary-foreground hover:bg-primary/95"
              >
                {saved ? '✓ Saved!' : 'Save Profile'}
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Sticky Live Phone Preview (lg+ only) */}
        <div className="hidden lg:block w-[240px] flex-shrink-0 relative">
          <div className="sticky top-[100px] flex flex-col items-center">
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-2">Live Mobile Preview</p>
            <div className="w-[220px] h-[440px] rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl bg-gray-800 overflow-hidden relative flex-shrink-0">
              <PhoneFrameContent />
            </div>
          </div>
        </div>

        {/* Mobile Floating Preview Trigger (lg- only) */}
        <div className="lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                size="icon"
                className="fixed bottom-20 right-4 z-50 rounded-full h-11 w-11 shadow-2xl bg-primary text-primary-foreground hover:bg-primary/90 flex items-center justify-center border border-primary/20"
              >
                <Eye className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-3xl border-t border-border bg-background p-0 overflow-hidden">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-sm font-bold text-center">vCard Live Preview</SheetTitle>
              </SheetHeader>
              <div className="w-full h-full flex justify-center items-center py-6 bg-muted/20 overflow-y-auto">
                <div className="w-[220px] h-[440px] rounded-[2.5rem] border-[8px] border-gray-800 shadow-2xl bg-gray-800 overflow-hidden relative flex-shrink-0">
                  <PhoneFrameContent />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </div>
  );
}
