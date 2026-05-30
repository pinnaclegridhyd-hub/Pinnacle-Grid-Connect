'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Contact,
  HelpCircle,
  Calendar,
  Package,
  Archive,
  Settings,
  Heart,
  TrendingUp,
} from 'lucide-react';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    name: 'My vCards',
    href: '/dashboard/vcards',
    icon: CreditCard,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: TrendingUp,
  },
  {
    name: 'Manage Subscription',
    href: '/dashboard/subscription',
    icon: Heart,
  },
  {
    name: 'Exchanged Contacts',
    href: '/dashboard/contacts',
    icon: Contact,
  },
  {
    name: 'Profile Setup',
    href: '/dashboard/profile',
    icon: CreditCard,
  },
  {
    name: 'Enquiries',
    href: '/dashboard/enquiries',
    icon: HelpCircle,
  },
  {
    name: 'Appointments',
    href: '/dashboard/appointments',
    icon: Calendar,
  },
  {
    name: 'Product Orders',
    href: '/dashboard/orders',
    icon: Package,
  },
  {
    name: 'Storage',
    href: '/dashboard/storage',
    icon: Archive,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
].filter((item) => ENABLE_PREMIUM_FEATURES || item.name !== 'Manage Subscription');

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="w-full bg-sidebar text-sidebar-foreground flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold">
            BC
          </div>
          <span className="font-semibold text-sm">Bee Connect</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-2 border-sidebar-primary'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/60">
          All Rights Reserved Â©2026 Bee Connect
        </p>
      </div>
    </div>
  );
}

