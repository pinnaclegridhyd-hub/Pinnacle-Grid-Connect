'use client';

import { useEffect, useMemo, useState, use } from 'react';
import {
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Share2,
  UserPlus,
  Calendar,
  MapPin,
  X,
  Sparkles,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Twitter,
} from 'lucide-react';
import QRCode from 'react-qr-code';
import { getPublicProfileUrl } from '@/lib/public-url';

interface VCard {
  _id?: string;
  name: string;
  designation: string;
  company: string;
  bio: string;
  email: string;
  phone: string;
  whatsappNumber?: string;
  address: string;
  website: string;
  template: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
  youtube: string;
  whatsapp: string;
  tiktok?: string;
  pinterest?: string;
  telegram?: string;
  reddit?: string;
  googledrive?: string;
  bannerTitle: string;
  bannerUrl: string;
  bannerDescription: string;
  bannerButton: string;
  profileImage?: string;
  bannerImage?: string;
  bannerPositionX?: number;
  bannerPositionY?: number;
  bannerScale?: number;
  customLinks?: { id: string; label: string; url: string }[];
  sections: {
    header: boolean;
    businessHours: boolean;
    services: boolean;
    products: boolean;
    gallery: boolean;
    testimonials: boolean;
    contact: boolean;
    banner: boolean;
    newsletter: boolean;
  };
  servicesList?: { title: string; description: string; icon?: string }[];
  galleryImages?: { url: string; publicId?: string; caption?: string }[];
  enquiryConfig?: { email: string; title: string };
  privacyPolicy?: string;
  termsConditions?: string;
  hours: Record<string, { open: string; close: string; closed: boolean }>;
  sectionOrder: string[];
}

const TEMPLATE_COLORS: Record<string, { primary: string; accent: string; header: string; bg: string }> = {
  'simple-contact': { primary: '#7c3aed', accent: '#06b6d4', header: '#7c3aed', bg: '#f8fafc' },
  'executive-profile': { primary: '#1e40af', accent: '#3b82f6', header: '#1e3a8a', bg: '#f0f4ff' },
  'modern-edge': { primary: '#db2777', accent: '#f97316', header: '#9d174d', bg: '#fff1f2' },
  'corporate-connect': { primary: '#0f172a', accent: '#64748b', header: '#0f172a', bg: '#f8fafc' },
  'medical-clean': { primary: '#0891b2', accent: '#22d3ee', header: '#0e7490', bg: '#f0fdff' },
  'luxury-dark': { primary: '#b45309', accent: '#fcd34d', header: '#1c1917', bg: '#1c1917' },
  'fitness-energy': { primary: '#16a34a', accent: '#84cc16', header: '#15803d', bg: '#f0fdf4' },
  'salon-elegance': { primary: '#be185d', accent: '#f9a8d4', header: '#9d174d', bg: '#fdf2f8' },
  'restaurant-warm': { primary: '#c2410c', accent: '#fdba74', header: '#9a3412', bg: '#fff7ed' },
};

const DEFAULT_SECTIONS: VCard['sections'] = {
  header: true,
  businessHours: true,
  services: true,
  products: true,
  gallery: true,
  testimonials: true,
  contact: true,
  banner: true,
  newsletter: true,
};

const SocialIcon = ({ type, className = "w-4 h-4" }: { type: string; className?: string }) => {
  switch (type) {
    case 'website':
      return <Globe className={className} />;
    case 'facebook':
      return <Facebook className={className} />;
    case 'instagram':
      return <Instagram className={className} />;
    case 'linkedin':
      return <Linkedin className={className} />;
    case 'youtube':
      return <Youtube className={className} />;
    case 'twitter':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      );
    case 'whatsapp':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.713-1.458L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.97C16.579 2.019 14.122 1 11.503 1 6.066 1 1.643 5.371 1.64 10.8c-.001 1.838.5 3.626 1.45 5.216l-1.012 3.7 3.82-.998z" />
        </svg>
      );
    default:
      return <Globe className={className} />;
  }
};

const DEFAULT_ORDER = ['header', 'banner', 'services', 'gallery', 'products', 'testimonials', 'businessHours', 'contact', 'newsletter'];

export default function PublicProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [loading, setLoading] = useState(true);
  const [vcard, setVcard] = useState<VCard | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [profileUrl, setProfileUrl] = useState('');
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  useEffect(() => {
    if (activeImageIndex === null) return;
    
    const gallery = vcard?.galleryImages;
    if (!gallery) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveImageIndex(null);
      } else if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev !== null && prev < gallery.length - 1) ? prev + 1 : 0);
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev !== null && prev > 0) ? prev - 1 : (gallery.length - 1 || 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, vcard?.galleryImages]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch(`/api/profile/${slug}`);
        if (!res.ok) {
          setVcard(null);
          return;
        }

        const data = await res.json();
        const dbVcard = data.vcard;
        if (!dbVcard) {
          setVcard(null);
          return;
        }

        const hoursObj: Record<string, { open: string; close: string; closed: boolean }> = {};
        (dbVcard.hours || []).forEach((h: any) => {
          hoursObj[h.day] = { open: h.open, close: h.close, closed: h.closed };
        });

        setVcard({
          ...dbVcard,
          website: dbVcard.socialLinks?.website || dbVcard.website || '',
          facebook: dbVcard.socialLinks?.facebook || '',
          instagram: dbVcard.socialLinks?.instagram || '',
          linkedin: dbVcard.socialLinks?.linkedin || '',
          youtube: dbVcard.socialLinks?.youtube || '',
          whatsappNumber: dbVcard.whatsappNumber || dbVcard.socialLinks?.whatsapp || '',
          whatsapp: dbVcard.socialLinks?.whatsapp || dbVcard.whatsappNumber || '',
          twitter: dbVcard.socialLinks?.twitter || '',
          tiktok: dbVcard.socialLinks?.tiktok || '',
          pinterest: dbVcard.socialLinks?.pinterest || '',
          telegram: dbVcard.socialLinks?.telegram || '',
          reddit: dbVcard.socialLinks?.reddit || '',
          googledrive: dbVcard.socialLinks?.googledrive || '',
          customLinks: dbVcard.customLinks || [],
          hours: hoursObj,
          sections: { ...DEFAULT_SECTIONS, ...(dbVcard.sections || {}) },
          sectionOrder: Array.isArray(dbVcard.sectionOrder) && dbVcard.sectionOrder.length > 0 ? dbVcard.sectionOrder : DEFAULT_ORDER,
        });
      } catch {
        setVcard(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [slug]);

  useEffect(() => {
    setProfileUrl(getPublicProfileUrl(slug));
  }, [slug]);

  const tplColors = useMemo(() => {
    if (!vcard) return TEMPLATE_COLORS['simple-contact'];
    return TEMPLATE_COLORS[vcard.template] || TEMPLATE_COLORS['simple-contact'];
  }, [vcard]);

  const downloadQR = () => {
    const svg = document.querySelector('#public-qr-code svg') as SVGElement;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 256, 256);
      const a = document.createElement('a');
      a.download = `${vcard?.name?.replace(/\s+/g, '_') || 'profile'}-qr.png`;
      a.href = canvas.toDataURL('image/png');
      a.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const downloadVCF = () => {
    const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${vcard?.name || ''}\nTITLE:${vcard?.designation || ''}\nORG:${vcard?.company || ''}\nTEL:${vcard?.phone || ''}\nEMAIL:${vcard?.email || ''}\nURL:${vcard?.website || ''}\nADR:;;${vcard?.address || ''};;;\nEND:VCARD`;
    const blob = new Blob([vcf], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(vcard?.name || 'contact').replace(/\s+/g, '_')}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    const shareData = {
      title: vcard?.name || 'Pinnacle Grid Connect profile',
      text: `Check out ${vcard?.name || 'this'}'s digital card`,
      url: profileUrl || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // ignore
      }
    } else {
      await navigator.clipboard.writeText(shareData.url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 relative pb-24 overflow-x-hidden selection:bg-purple-100">
        <div className="max-w-[480px] mx-auto bg-white border-x border-gray-100 min-h-screen shadow-sm flex flex-col animate-pulse">
          {/* Skeleton Cover Banner */}
          <div className="h-32 sm:h-36 w-full bg-gray-100 relative">
            {/* Skeleton Profile Picture */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-4 border-white bg-gray-200 shadow-md" />
          </div>
          {/* Skeleton Details */}
          <div className="pt-12 px-6 pb-6 text-center space-y-3">
            <div className="h-5 w-32 bg-gray-200 rounded mx-auto" />
            <div className="h-3.5 w-24 bg-gray-200 rounded mx-auto" />
            <div className="h-3 w-16 bg-gray-100 rounded mx-auto" />
            <div className="h-12 w-full bg-gray-100 rounded-lg mt-4" />
          </div>
          {/* Skeleton Social Row */}
          <div className="px-6 py-2 flex justify-center gap-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-8 h-8 rounded-full bg-gray-200" />
            ))}
          </div>
          {/* Skeleton Action Grid */}
          <div className="px-6 py-6 grid grid-cols-2 gap-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 rounded-xl bg-gray-100" />
            ))}
          </div>
          {/* Skeleton Services Section */}
          <div className="px-6 py-6 space-y-4">
            <div className="h-4 w-28 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-24 rounded-xl bg-gray-100" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!vcard) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-sm sm:text-base">Profile not found.</p>
        </div>
      </div>
    );
  }

  const avatarInitials = vcard.name ? vcard.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : 'BC';

  const hasSocialLinks = [
    vcard.website,
    vcard.facebook,
    vcard.instagram,
    vcard.linkedin,
    vcard.youtube,
    vcard.whatsapp || vcard.whatsappNumber,
    vcard.twitter,
  ].some(Boolean);

  const renderSection = (sectionKey: string) => {
    if (!vcard.sections[sectionKey as keyof VCard['sections']]) return null;

    switch (sectionKey) {
      case 'banner':
        if (!vcard.bannerTitle || bannerDismissed) return null;
        return (
          <div
            key="banner"
            style={{ background: `linear-gradient(to right, ${tplColors.primary}, ${tplColors.accent})` }}
            className="w-full px-4 py-3 flex items-center justify-between gap-3 text-white flex-shrink-0 animate-fade-in relative z-20"
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-xs leading-snug truncate">{vcard.bannerTitle}</p>
              <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5">{vcard.bannerDescription}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {vcard.bannerButton && (
                <a
                  href={vcard.bannerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] font-bold border border-white/60 bg-white/10 text-white px-2.5 py-1 rounded-full hover:bg-white/20 transition-all uppercase tracking-wide"
                >
                  {vcard.bannerButton}
                </a>
              )}
              <button onClick={() => setBannerDismissed(true)} className="text-white/70 hover:text-white p-0.5 rounded-full hover:bg-white/10">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        );

      case 'header':
        return (
          <div key="header" className="flex-shrink-0">
            <div 
              style={
                vcard.bannerImage 
                  ? { 
                      backgroundImage: `url(${vcard.bannerImage})`,
                      backgroundPosition: `${vcard.bannerPositionX ?? 50}% ${vcard.bannerPositionY ?? 50}%`,
                      backgroundSize: `${vcard.bannerScale ?? 100}%`,
                      backgroundRepeat: 'no-repeat',
                    } 
                  : { 
                      background: `linear-gradient(135deg, ${tplColors.header}, ${tplColors.accent})` 
                    }
              } 
              className="h-32 sm:h-36 w-full relative"
            >
              <div className="absolute inset-0 opacity-10 bg-grid-pattern" />
              <div
                style={{ borderColor: '#ffffff', backgroundColor: tplColors.bg, color: tplColors.primary }}
                className="absolute -bottom-14 left-1/2 -translate-x-1/2 w-28 h-28 rounded-full border-4 shadow-md flex items-center justify-center overflow-hidden font-bold text-2xl"
              >
                {vcard.profileImage ? (
                  <img src={vcard.profileImage} alt={vcard.name} className="w-full h-full object-cover" />
                ) : (
                  avatarInitials
                )}
              </div>
            </div>

            <div className="pt-16 px-4 pb-4 text-center space-y-1">
              <h1 className="text-xl font-bold text-gray-900 tracking-tight leading-tight">{vcard.name}</h1>
              <p className="text-xs font-semibold" style={{ color: tplColors.primary }}>
                {vcard.designation}
              </p>
              {vcard.company && <p className="text-[10px] text-gray-400 font-medium">{vcard.company}</p>}
              {vcard.bio && <p className="text-xs text-gray-500 px-4 pt-2 leading-relaxed italic">{vcard.bio}</p>}
            </div>

            {hasSocialLinks && (
              <div className="px-4 py-2 flex justify-center gap-2 flex-wrap max-w-full overflow-x-auto scrollbar-hide">
                {[
                  { url: vcard.website, color: tplColors.accent, label: 'Website', icon: 'website' },
                  { url: vcard.facebook, color: '#1877f2', label: 'Facebook', icon: 'facebook' },
                  { url: vcard.instagram, color: 'linear-gradient(to bottom right, #e1306c, #f56040)', label: 'Instagram', icon: 'instagram' },
                  { url: vcard.linkedin, color: '#0077b5', label: 'LinkedIn', icon: 'linkedin' },
                  { url: vcard.youtube, color: '#ff0000', label: 'YouTube', icon: 'youtube' },
                  { url: vcard.whatsapp || vcard.whatsappNumber || '', color: '#25d366', label: 'WhatsApp', icon: 'whatsapp' },
                  { url: vcard.twitter, color: '#000000', label: 'Twitter', icon: 'twitter' },
                ]
                  .filter((social) => social.url)
                  .slice(0, 7)
                  .map((social) => (
                    <a
                      key={social.label}
                      href={social.icon === 'whatsapp' ? `https://wa.me/${social.url.replace(/\D/g, '')}` : social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ background: social.color }}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                      <SocialIcon type={social.icon} className="w-4 h-4" />
                    </a>
                  ))}
              </div>
            )}

            {vcard.customLinks && vcard.customLinks.length > 0 && (
              <div className="px-4 py-2 flex justify-center gap-1.5 flex-wrap">
                {vcard.customLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ borderColor: tplColors.primary + '30', backgroundColor: tplColors.primary + '08', color: tplColors.primary }}
                    className="px-2.5 py-1 border rounded-full text-[9px] font-semibold tracking-wider hover:opacity-85"
                  >
                    {link.label || 'Link'}
                  </a>
                ))}
              </div>
            )}

            {vcard.address && (
              <div className="px-5 py-3 mt-2 flex items-start gap-3 bg-gray-50/50 border-y border-gray-100">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tplColors.primary }} />
                <p className="text-[11px] text-gray-600 leading-relaxed font-medium">{vcard.address}</p>
              </div>
            )}

            <div className="flex gap-2 px-4 py-4 overflow-x-auto pb-1 scrollbar-hide flex-shrink-0 border-b border-gray-100">
              {[
                { label: 'Email', icon: Mail, action: () => (window.location.href = `mailto:${vcard.email}`), color: tplColors.primary },
                { label: 'Call', icon: Phone, action: () => (window.location.href = `tel:${vcard.phone}`), color: '#16a34a' },
                { label: 'WhatsApp', icon: MessageCircle, action: () => window.open(`https://wa.me/${(vcard.whatsapp || vcard.whatsappNumber || '').replace(/\D/g, '')}`), color: '#25d366' },
                { label: 'Website', icon: Globe, action: () => window.open(vcard.website), color: tplColors.accent },
                { label: 'Location', icon: MapPin, action: () => window.open(`https://maps.google.com/?q=${encodeURIComponent(vcard.address)}`), color: '#ef4444' },
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={btn.action}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-full border text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all hover:opacity-80 active:scale-95"
                  style={{ borderColor: btn.color + '40', backgroundColor: btn.color + '15', color: btn.color }}
                >
                  <btn.icon className="w-3.5 h-3.5" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>

            <section className="px-4 py-6 border-b border-gray-100 bg-gray-50/30 flex flex-col items-center">
              <h2 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: tplColors.primary }}>
                QR Code
              </h2>
              <div id="public-qr-code" className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 flex flex-col items-center gap-3 mx-auto w-fit">
                <QRCode value={profileUrl || getPublicProfileUrl(slug)} size={150} fgColor={tplColors.primary} bgColor="#ffffff" level="H" />
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Scan to connect</p>
                <button
                  onClick={downloadQR}
                  className="text-[10px] font-bold border rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors tracking-wide uppercase mt-1"
                  style={{ borderColor: tplColors.primary + '60', color: tplColors.primary }}
                >
                  Download QR
                </button>
              </div>
            </section>
          </div>
        );

      case 'services':
        if (!vcard.servicesList || vcard.servicesList.length === 0) return null;
        return (
          <section key="services" className="px-4 py-6 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: tplColors.primary }}>
              Our Services
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {vcard.servicesList.map((service, idx) => (
                <div key={service.title || idx} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  <div className="h-20 rounded-t-xl relative flex-shrink-0" style={{ background: `linear-gradient(135deg, ${tplColors.primary}20, ${tplColors.accent}30)` }}>
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center shadow-inner" style={{ background: `linear-gradient(135deg, ${tplColors.primary}, ${tplColors.accent})` }}>
                        <Sparkles className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                  </div>
                  <div className="p-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <p className="font-bold text-[11px] text-gray-800 leading-snug line-clamp-1">{service.title}</p>
                      <p className="text-[9px] text-gray-500 mt-1 line-clamp-3 leading-relaxed">{service.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'gallery':
        if (!vcard.galleryImages || vcard.galleryImages.length === 0) return null;
        return (
          <section key="gallery" className="px-4 py-6 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: tplColors.primary }}>
              Gallery
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x snap-mandatory">
              {vcard.galleryImages.map((img, i) => (
                <div
                  key={img.publicId || i}
                  onClick={() => setActiveImageIndex(i)}
                  className="w-28 h-20 rounded-xl flex-shrink-0 snap-start shadow-sm border border-gray-50 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  style={{ background: `linear-gradient(${120 + i * 30}deg, ${tplColors.primary}${30 + i * 10}, ${tplColors.accent}${40 + i * 10})` }}
                >
                  {img?.url ? <img src={img.url} alt="Gallery" className="w-full h-full object-cover" /> : null}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-1.5 mt-3">
              {vcard.galleryImages.map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full transition-colors" style={{ background: i === 0 ? tplColors.primary : '#e5e7eb' }} />
              ))}
            </div>
          </section>
        );

      case 'products':
      case 'testimonials':
      case 'newsletter':
        return null;

      case 'businessHours':
        if (Object.keys(vcard.hours || {}).length === 0) return null;
        return (
          <section key="businessHours" className="px-4 py-6 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: tplColors.primary }}>
              Business Hours
            </h2>
            <div className="space-y-1.5">
              {Object.entries(vcard.hours).map(([day, hrs], idx) => (
                <div key={day} className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border border-gray-100 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: tplColors.primary + '18' }}>
                    <Calendar className="w-3.5 h-3.5" style={{ color: tplColors.primary }} />
                  </div>
                  <span className="text-xs font-semibold text-gray-700 flex-1">{day}</span>
                  {hrs.closed ? (
                    <span className="text-[9px] bg-red-50 text-red-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">Closed</span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-bold">
                      {hrs.open} – {hrs.close}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key="contact" className="px-4 py-6 border-b border-gray-100">
            <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: tplColors.primary }}>
              {vcard.enquiryConfig?.title || 'Inquiries'}
            </h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const fd = new FormData(form);
                const body = Object.fromEntries(fd.entries());
                body.vcardId = vcard._id || '';

                try {
                  const res = await fetch('/api/enquiry', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body),
                  });
                  const data = await res.json();
                  if (data.error) alert(data.error);
                  else {
                    alert('Message sent successfully!');
                    form.reset();
                  }
                } catch {
                  alert('Error submitting form');
                }
              }}
              className="space-y-3"
            >
              <input type="text" name="_honey" style={{ display: 'none' }} />
              <input required name="name" type="text" placeholder="Your Name" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ '--tw-ring-color': tplColors.primary } as any} />
              <input required name="email" type="email" placeholder="Email Address" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ '--tw-ring-color': tplColors.primary } as any} />
              <input required name="phone" type="tel" placeholder="Phone Number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50" style={{ '--tw-ring-color': tplColors.primary } as any} />
              <textarea required name="message" rows={3} placeholder="Your Message..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-xs bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-opacity-50 resize-none" style={{ '--tw-ring-color': tplColors.primary } as any} />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider shadow-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ background: `linear-gradient(to right, ${tplColors.primary}, ${tplColors.accent})` }}
              >
                Send Message
              </button>
            </form>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-800 relative pb-24 overflow-x-hidden selection:bg-purple-100" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <div className="max-w-[480px] mx-auto bg-white border-x border-gray-100 min-h-screen shadow-sm flex flex-col">
        {vcard.sectionOrder.map((sectionKey) => renderSection(sectionKey))}

        <div className="px-4 py-6 text-center bg-gray-50 flex-grow flex flex-col justify-end space-y-4">
          <div className="flex justify-center gap-4 text-[9px] font-bold uppercase tracking-widest text-gray-400">
            {vcard.privacyPolicy && (
              <span onClick={() => alert(vcard.privacyPolicy)} className="hover:text-gray-600 cursor-pointer">
                Privacy Policy
              </span>
            )}
            {vcard.termsConditions && (
              <span onClick={() => alert(vcard.termsConditions)} className="hover:text-gray-600 cursor-pointer">
                Terms & Conditions
              </span>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">
              Created with <span className="font-extrabold" style={{ color: tplColors.primary }}>Pinnacle Grid Connect</span>
            </p>
            <p className="text-[8px] text-gray-400 tracking-wider">All Rights Reserved ©{new Date().getFullYear()} Pinnacle Grid Connect</p>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
        <div className="max-w-[480px] mx-auto px-4 pb-3">
          <div className="backdrop-blur-md bg-white/90 border border-gray-200/50 shadow-2xl rounded-2xl p-2 flex items-center justify-around pointer-events-auto">
            {[
              { label: 'Call', icon: Phone, action: () => (window.location.href = `tel:${vcard.phone}`), color: '#16a34a' },
              { label: 'WhatsApp', icon: MessageCircle, action: () => window.open(`https://wa.me/${(vcard.whatsapp || vcard.whatsappNumber || '').replace(/\D/g, '')}`), color: '#25d366' },
              { label: 'Email', icon: Mail, action: () => (window.location.href = `mailto:${vcard.email}`), color: tplColors.primary },
              { label: 'Save', icon: UserPlus, action: downloadVCF, color: tplColors.accent },
              { label: 'Share', icon: Share2, action: handleShare, color: '#6366f1' },
            ].map((btn) => (
              <button key={btn.label} onClick={btn.action} className="flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl active:scale-90 hover:bg-gray-50 transition-all">
                <btn.icon className="w-4.5 h-4.5" style={{ color: btn.color }} />
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wide">{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Gallery Lightbox Viewer */}
      {activeImageIndex !== null && vcard.galleryImages && vcard.galleryImages[activeImageIndex] && (() => {
        const galleryImages = vcard.galleryImages;
        return (
          <div 
            className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 select-none animate-fade-in"
            onClick={() => setActiveImageIndex(null)}
          >
            {/* Close button */}
            <button 
              type="button"
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                setActiveImageIndex(null);
              }}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation controls */}
            {galleryImages.length > 1 && (
              <>
                <button 
                  type="button"
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10 hidden sm:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev !== null && prev > 0) ? prev - 1 : galleryImages.length - 1);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors z-10 hidden sm:block"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveImageIndex(prev => (prev !== null && prev < galleryImages.length - 1) ? prev + 1 : 0);
                  }}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Image and Caption */}
            <div className="relative w-full max-w-4xl max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <img 
                src={galleryImages[activeImageIndex].url} 
                alt={galleryImages[activeImageIndex].caption || "Gallery image"}
                className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl animate-scale-in"
              />
              {galleryImages[activeImageIndex].caption && (
                <p className="text-white/90 text-sm mt-4 text-center px-6 leading-relaxed max-w-prose">
                  {galleryImages[activeImageIndex].caption}
                </p>
              )}
              
              {/* Mobile swipe/tap navigation helper info */}
              {galleryImages.length > 1 && (
                <div className="flex justify-between w-full mt-4 px-4 sm:hidden">
                  <button 
                    type="button" 
                    className="text-white/70 hover:text-white text-xs font-semibold px-3 py-1.5 rounded bg-white/10"
                    onClick={() => setActiveImageIndex(prev => (prev !== null && prev > 0) ? prev - 1 : galleryImages.length - 1)}
                  >
                    ◀ Prev
                  </button>
                  <span className="text-white/60 text-xs self-center">
                    {activeImageIndex + 1} / {galleryImages.length}
                  </span>
                  <button 
                    type="button" 
                    className="text-white/70 hover:text-white text-xs font-semibold px-3 py-1.5 rounded bg-white/10"
                    onClick={() => setActiveImageIndex(prev => (prev !== null && prev < galleryImages.length - 1) ? prev + 1 : 0)}
                  >
                    Next ▶
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })()}
    </main>
  );
}
