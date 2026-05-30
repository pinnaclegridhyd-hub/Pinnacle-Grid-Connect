'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardChart() {
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await fetch('/api/analytics', { credentials: 'include' });
        if (res.ok) {
          const statsData = await res.json();
          setTotalViews(statsData.totalViews || 0);
        }
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

  const data = [
    { date: 'Past Days', views: 0 },
    { date: todayStr, views: totalViews },
  ];

  if (loading) {
    return (
      <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground">
        Loading chart data...
      </div>
    );
  }

  if (totalViews === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-sm text-muted-foreground border border-dashed rounded-lg">
        No profile views recorded yet
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
      >
        <defs>
          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis 
          dataKey="date" 
          stroke="var(--color-muted-foreground)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="var(--color-muted-foreground)"
          style={{ fontSize: '12px' }}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--color-card)',
            border: '1px solid var(--color-border)',
            borderRadius: '0.5rem',
          }}
          labelStyle={{ color: 'var(--color-foreground)' }}
        />
        <Line
          type="monotone"
          dataKey="views"
          stroke="var(--color-primary)"
          strokeWidth={2}
          dot={false}
          fillOpacity={1}
          fill="url(#colorViews)"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
