export interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  avatar?: string;
  createdAt: Date;
}

export interface VCard {
  id: string;
  userId: string;
  title: string;
  description: string;
  templateId: 'simple-contact' | 'executive-profile' | 'modern-edge' | 'corporate-connect';
  profileUrl: string;
  views: number;
  subscribers: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface VCardProfile {
  id: string;
  vCardId: string;
  header: string;
  businessHours?: {
    day: string;
    hours: string;
  }[];
  socialLinks?: {
    platform: 'website' | 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'youtube' | 'tiktok' | 'whatsapp' | 'reddit' | 'pinterest' | 'tumblr' | 'google-drive';
    url: string;
  }[];
  banner?: string;
  sections: Section[];
}

export interface Section {
  id: string;
  type: 'contact' | 'services' | 'products' | 'testimonials' | 'gallery' | 'cta';
  title: string;
  content: Record<string, any>;
  order: number;
}

export interface Template {
  id: 'simple-contact' | 'executive-profile' | 'modern-edge' | 'corporate-connect';
  name: string;
  description: string;
  thumbnail: string;
  sections: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
