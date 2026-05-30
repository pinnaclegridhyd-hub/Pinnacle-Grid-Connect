'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Mail, Phone, Calendar, Clock, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

interface Enquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'closed';
  createdAt: string;
}

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [quota, setQuota] = useState<{ used: number; max: number } | null>(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await fetch('/api/enquiries');
      if (res.ok) {
        const data = await res.json();
        setEnquiries(data.enquiries || []);
        if (data.quota) setQuota(data.quota);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        setEnquiries((prev) =>
          prev.map((e) => (e._id === id ? { ...e, status: newStatus as any } : e))
        );
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enquiries</h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage messages received from your public profile</p>
        </div>
        
        {quota && quota.max !== Infinity && (
          <Card className={`p-4 min-w-[250px] border ${quota.used >= quota.max ? 'border-red-500 bg-red-500/10' : 'border-border bg-card'}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-semibold">Monthly Quota</span>
              <span className={`text-xs font-bold ${quota.used >= quota.max ? 'text-red-500' : 'text-muted-foreground'}`}>
                {quota.used} / {quota.max} Used
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 mb-2">
              <div
                className={`h-2 rounded-full transition-all ${quota.used >= quota.max ? 'bg-red-500' : 'bg-primary'}`}
                style={{ width: `${Math.min(100, (quota.used / quota.max) * 100)}%` }}
              />
            </div>
            {quota.used >= quota.max && (
              <p className="text-[10px] text-red-500 font-semibold mb-2">Limit reached. New enquiries are blocked.</p>
            )}
            {ENABLE_PREMIUM_FEATURES && (
              <Button size="sm" className="w-full h-8 text-xs" variant={quota.used >= quota.max ? 'default' : 'outline'} asChild>
                <a href="/dashboard/subscription">Upgrade to Premium</a>
              </Button>
            )}
          </Card>
        )}
      </div>

      {enquiries.length === 0 ? (
        <Card className="border-dashed bg-muted/20">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No Enquiries Yet</h3>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              When visitors contact you through your public profile form, their messages will appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {enquiries.map((enquiry) => (
            <Card key={enquiry._id} className="overflow-hidden">
              <div className="flex flex-col sm:flex-row border-b border-border bg-muted/10 p-4 gap-4 items-start sm:items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{enquiry.name}</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5" />
                      {enquiry.email}
                    </span>
                    {enquiry.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" />
                        {enquiry.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {format(new Date(enquiry.createdAt), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {format(new Date(enquiry.createdAt), 'h:mm a')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={enquiry.status}
                    onChange={(e) => handleStatusChange(enquiry._id, e.target.value)}
                    className="flex h-9 w-full sm:w-[130px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Badge 
                    variant={enquiry.status === 'new' ? 'default' : enquiry.status === 'contacted' ? 'secondary' : 'outline'}
                    className="h-9 hidden sm:flex"
                  >
                    {enquiry.status.charAt(0).toUpperCase() + enquiry.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <div className="p-4 text-sm leading-relaxed whitespace-pre-wrap text-foreground">
                {enquiry.message}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
