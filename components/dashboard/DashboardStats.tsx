'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, HelpCircle, Calendar } from 'lucide-react';

function CreditCard(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="1" y="5" width="22" height="14" rx="3" />
      <path d="M1 10h22" />
    </svg>
  );
}

export default function DashboardStats() {
  const [data, setData] = useState({
    activeVCards: 0,
    totalViews: 0,
    enquiries: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/analytics', { credentials: 'include' });
        if (res.ok) {
          const statsData = await res.json();
          setData(statsData);
        }
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  const stats = [
    {
      icon: CreditCard,
      label: 'Total Active vCards',
      value: loading ? '...' : data.activeVCards.toString(),
      bgColor: 'bg-primary/20',
      iconColor: 'text-primary',
    },
    {
      icon: Eye,
      label: 'Total Profile Views',
      value: loading ? '...' : data.totalViews.toLocaleString(),
      bgColor: 'bg-chart-2/20',
      iconColor: 'text-chart-2',
    },
    {
      icon: HelpCircle,
      label: 'Today Enquiries',
      value: loading ? '...' : data.enquiries.toString(),
      bgColor: 'bg-chart-4/20',
      iconColor: 'text-chart-4',
    },
    {
      icon: Calendar,
      label: 'Today Appointments',
      value: '0',
      bgColor: 'bg-chart-5/20',
      iconColor: 'text-chart-5',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="bg-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-foreground mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} p-2.5 flex items-center justify-center shadow-lg`}>
                  <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
