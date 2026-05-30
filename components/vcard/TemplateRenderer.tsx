'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Mail,
  Phone,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  MessageCircle,
  Share2,
  Download,
} from 'lucide-react';

interface TemplateProps {
  template: 'simple-contact' | 'executive-profile' | 'modern-edge' | 'corporate-connect';
  vcard: {
    name: string;
    title: string;
    description: string;
    email: string;
    phone: string;
    website?: string;
    image?: string;
    services?: string[];
    socialLinks?: {
      facebook?: string;
      instagram?: string;
      linkedin?: string;
      twitter?: string;
    };
  };
}

export function SimpleContactTemplate({ vcard }: Omit<TemplateProps, 'template'>) {
  return (
    <Card className="overflow-hidden shadow-lg max-w-md">
      <div className="p-8 space-y-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{vcard.name}</h1>
          <p className="text-primary font-semibold mt-1">{vcard.title}</p>
        </div>

        <div className="space-y-2">
          <a
            href={`mailto:${vcard.email}`}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted"
          >
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm">{vcard.email}</span>
          </a>
          <a
            href={`tel:${vcard.phone}`}
            className="flex items-center gap-2 p-2 rounded hover:bg-muted"
          >
            <Phone className="w-4 h-4 text-primary" />
            <span className="text-sm">{vcard.phone}</span>
          </a>
          {vcard.website && (
            <a
              href={vcard.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 p-2 rounded hover:bg-muted"
            >
              <Globe className="w-4 h-4 text-primary" />
              <span className="text-sm">{vcard.website}</span>
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}

export function ExecutiveProfileTemplate({ vcard }: Omit<TemplateProps, 'template'>) {
  return (
    <Card className="overflow-hidden shadow-2xl max-w-md">
      <div className="h-40 bg-gradient-to-r from-primary to-accent" />
      <div className="px-8 py-6 space-y-4 -mt-20 relative z-10">
        <div className="bg-card p-4 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-foreground">{vcard.name}</h1>
          <p className="text-primary font-semibold">{vcard.title}</p>
          <p className="text-sm text-muted-foreground mt-2">{vcard.description}</p>
        </div>

        <div className="space-y-2">
          <a
            href={`mailto:${vcard.email}`}
            className="block p-3 rounded bg-muted/50 hover:bg-muted"
          >
            <div className="text-xs text-muted-foreground">Email</div>
            <div className="text-sm font-medium">{vcard.email}</div>
          </a>
          <a
            href={`tel:${vcard.phone}`}
            className="block p-3 rounded bg-muted/50 hover:bg-muted"
          >
            <div className="text-xs text-muted-foreground">Phone</div>
            <div className="text-sm font-medium">{vcard.phone}</div>
          </a>
        </div>
      </div>
    </Card>
  );
}

export function ModernEdgeTemplate({ vcard }: Omit<TemplateProps, 'template'>) {
  return (
    <div className="max-w-md space-y-4">
      <Card className="overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-br from-primary via-accent to-primary p-8 text-white">
          <h1 className="text-3xl font-bold">{vcard.name}</h1>
          <p className="text-white/80 font-semibold mt-2">{vcard.title}</p>
        </div>

        <div className="p-8 space-y-4">
          <p className="text-muted-foreground text-sm">{vcard.description}</p>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`mailto:${vcard.email}`}
              className="p-3 rounded bg-primary/10 text-center hover:bg-primary/20 transition"
            >
              <Mail className="w-4 h-4 mx-auto text-primary mb-1" />
              <div className="text-xs font-medium truncate">Email</div>
            </a>
            <a
              href={`tel:${vcard.phone}`}
              className="p-3 rounded bg-primary/10 text-center hover:bg-primary/20 transition"
            >
              <Phone className="w-4 h-4 mx-auto text-primary mb-1" />
              <div className="text-xs font-medium truncate">Phone</div>
            </a>
          </div>

          <Button className="w-full gap-2">
            <Share2 className="w-4 h-4" />
            Share Profile
          </Button>
        </div>
      </Card>
    </div>
  );
}

export function CorporateConnectTemplate({ vcard }: Omit<TemplateProps, 'template'>) {
  return (
    <Card className="overflow-hidden shadow-2xl max-w-md bg-card">
      <div className="bg-slate-900 text-white p-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{vcard.name}</h1>
            <p className="text-white/70 mt-1">{vcard.title}</p>
          </div>
          <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center">
            <div className="w-10 h-10 rounded bg-primary text-white flex items-center justify-center font-bold">
              {vcard.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-3">
        <div className="space-y-2">
          <a
            href={`mailto:${vcard.email}`}
            className="flex items-center gap-3 p-3 rounded border border-border hover:border-primary transition"
          >
            <Mail className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">Email</div>
              <div className="text-sm font-medium truncate">{vcard.email}</div>
            </div>
          </a>

          <a
            href={`tel:${vcard.phone}`}
            className="flex items-center gap-3 p-3 rounded border border-border hover:border-primary transition"
          >
            <Phone className="w-5 h-5 text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-xs text-muted-foreground">Phone</div>
              <div className="text-sm font-medium truncate">{vcard.phone}</div>
            </div>
          </a>
        </div>

        {vcard.services && vcard.services.length > 0 && (
          <div className="pt-4 border-t border-border">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Services</h3>
            <div className="grid grid-cols-2 gap-2">
              {vcard.services.map((service) => (
                <div key={service} className="text-xs bg-muted/50 rounded p-2">
                  {service}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export function TemplateRenderer({ template, vcard }: TemplateProps) {
  switch (template) {
    case 'simple-contact':
      return <SimpleContactTemplate vcard={vcard} />;
    case 'executive-profile':
      return <ExecutiveProfileTemplate vcard={vcard} />;
    case 'modern-edge':
      return <ModernEdgeTemplate vcard={vcard} />;
    case 'corporate-connect':
      return <CorporateConnectTemplate vcard={vcard} />;
    default:
      return <SimpleContactTemplate vcard={vcard} />;
  }
}
