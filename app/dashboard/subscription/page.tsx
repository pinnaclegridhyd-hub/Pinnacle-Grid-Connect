'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import Script from 'next/script';
import { ENABLE_PREMIUM_FEATURES } from '@/lib/feature-flags';

export default function SubscriptionPage() {
  const router = useRouter();
  const [totalVCards, setTotalVCards] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showPlans, setShowPlans] = useState(false);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMockRazorpay, setShowMockRazorpay] = useState(false);
  const [mockOrderData, setMockOrderData] = useState<any>(null);
  const [mockProcessing, setMockProcessing] = useState(false);

  useEffect(() => {
    if (!ENABLE_PREMIUM_FEATURES) {
      router.replace('/dashboard');
    }
  }, [router]);

  if (!ENABLE_PREMIUM_FEATURES) {
    return null;
  }

  const AVAILABLE_PLANS = [
    {
      id: 'free',
      name: 'Basic Plan',
      price: 'Free',
      duration: '/ Forever',
      features: [
        '1 vCard Creation',
        'Max 4 Services',
        'Max 4 Gallery Images',
        '10 Enquiries per month',
        'Basic Templates',
      ],
      isCurrent: currentPlan === 'free',
    },
    {
      id: 'premium',
      name: 'Unlimited Premium Plan',
      price: '₹799',
      duration: '/ Year',
      promo: '₹1200 / Year',
      features: [
        'Unlimited vCard Creation',
        'Unlimited Services',
        'Unlimited Gallery Uploads',
        'Unlimited Enquiries',
        'Custom Platform URLs',
        'Advanced Branding & Customization',
      ],
      isCurrent: currentPlan === 'premium',
    }
  ];

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [statsRes, userRes] = await Promise.all([
          fetch('/api/analytics', { credentials: 'include' }),
          fetch('/api/auth/me', { credentials: 'include' })
        ]);
        
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setTotalVCards(statsData.totalVCards || 0);
        }
        if (userRes.ok) {
          const userData = await userRes.json();
          if (userData.user?.plan) setCurrentPlan(userData.user.plan);
        }
      } catch {}
      setLoading(false);
    };
    loadStats();
  }, []);

  const handleUpgradeClick = () => {
    if (currentPlan === 'premium') {
      alert("🌟 Unlimited Plan Active!\n\nYour account is currently enjoying our highest tier Unlimited Plan, valid till 26th Feb, 2126. No further upgrades are required at this time!");
      return;
    }
    handleSelectPlan('premium');
  };

  const handleSelectPlan = async (planId: string) => {
    if (planId !== 'premium') return;

    setIsProcessing(true);
    try {
      const res = await fetch('/api/payment/create-order', { method: 'POST' });
      const data = await res.json();
      
      if (!res.ok) {
        alert(data.error || 'Failed to initiate payment');
        setIsProcessing(false);
        return;
      }

      if (data.isMock) {
        setMockOrderData(data);
        setShowMockRazorpay(true);
        setIsProcessing(false);
        return;
      }

      const options = {
        key: data.key_id,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Digital Portfolio',
        description: 'Unlimited Premium Plan Upgrade',
        order_id: data.order.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch('/api/payment/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok) {
              alert('Payment successful! You are now a Premium user.');
              setCurrentPlan('premium');
            } else {
              alert(verifyData.error || 'Payment verification failed.');
            }
          } catch (e) {
            alert('An error occurred during payment verification.');
          }
        },
        prefill: {
          name: data.user.name,
          email: data.user.email,
          contact: data.user.phone,
        },
        theme: { color: '#7c3aed' },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment Failed! ' + response.error.description);
      });
      rzp.open();
    } catch (error) {
      console.error(error);
      alert('Something went wrong.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleViewPlansClick = () => {
    setShowPlans(!showPlans);
  };

  const handleMockPayment = async (success: boolean) => {
    if (!success) {
      setShowMockRazorpay(false);
      alert('Payment cancelled or failed (Mock).');
      return;
    }

    setMockProcessing(true);
    try {
      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: mockOrderData.order.id,
          razorpay_payment_id: 'pay_mock_success_123',
          razorpay_signature: '', // empty for mock
        }),
      });
      const verifyData = await verifyRes.json();
      if (verifyRes.ok) {
        alert('Payment successful! You are now a Premium user.');
        setCurrentPlan('premium');
        setShowMockRazorpay(false);
      } else {
        alert(verifyData.error || 'Payment verification failed.');
      }
    } catch (e) {
      alert('An error occurred during payment verification.');
    } finally {
      setMockProcessing(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manage Subscription</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">View and manage your subscription plan</p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <CardTitle className="text-lg sm:text-xl">Your Current Plan</CardTitle>
              <CardDescription className="text-xs sm:text-sm">{currentPlan === 'premium' ? 'Unlimited Premium Plan' : 'Basic Plan (Free)'}</CardDescription>
            </div>
            {currentPlan === 'premium' ? (
              <Badge variant="secondary" className="text-xs sm:text-sm w-fit bg-green-500/20 text-green-500">Active Premium</Badge>
            ) : (
              <Badge variant="outline" className="text-xs sm:text-sm w-fit">Free Tier</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Plan Price</p>
              <p className="text-xl sm:text-2xl font-bold text-primary">{currentPlan === 'premium' ? '₹799 / Year' : 'Free'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-muted-foreground">Number of vCards</p>
              <p className="text-xl sm:text-2xl font-bold">
                {loading ? '...' : totalVCards}
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            <h3 className="font-semibold text-sm sm:text-base">Included Features:</h3>
            <ul className="space-y-1 sm:space-y-2">
              {(currentPlan === 'premium' ? [
                'Unlimited vCard Creation',
                'Unlimited Services & Gallery Uploads',
                'Unlimited Enquiries',
                'Custom Platform URLs',
                'Advanced Branding & Customization',
              ] : [
                '1 vCard Creation',
                'Max 4 Services',
                'Max 4 Gallery Images',
                '10 Enquiries per month',
                'Basic Templates',
              ]).map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-xs sm:text-sm">
                  <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button 
              className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none"
              onClick={handleUpgradeClick}
              disabled={isProcessing || currentPlan === 'premium'}
            >
              {isProcessing ? 'Processing...' : 'Upgrade Plan'}
            </Button>
            <Button 
              variant="outline" 
              className="text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none"
              onClick={handleViewPlansClick}
            >
              View All Plans
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPlans && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Available Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {AVAILABLE_PLANS.map((plan) => (
              <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 ${plan.isCurrent ? 'border-primary shadow-md' : 'border-border'}`}>
                {plan.isCurrent && (
                  <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Current
                  </div>
                )}
                <CardHeader className="pb-3 sm:pb-6">
                  <CardTitle className="text-lg sm:text-xl">{plan.name}</CardTitle>
                  <CardDescription className="flex items-baseline gap-2 mt-2">
                    <span className="text-2xl sm:text-3xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-sm text-muted-foreground">{plan.duration}</span>
                    {plan.promo && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through ml-2">{plan.promo}</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <ul className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full text-xs sm:text-sm h-9 sm:h-10" 
                    variant={plan.isCurrent ? "secondary" : "default"}
                    disabled={plan.isCurrent || (plan.id === 'premium' && isProcessing)}
                    onClick={() => handleSelectPlan(plan.id)}
                  >
                    {plan.isCurrent ? 'Currently Active' : (plan.id === 'premium' && isProcessing ? 'Processing...' : 'Select Plan')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            <div className="p-3 sm:p-4 border border-border rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="font-medium text-sm sm:text-base">Unlimited Premium Plan</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Amount: ₹0 | Subscribed Date: 2026-03-22 15:28:06</p>
              </div>
              <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30">Active</Badge>
            </div>
            <div className="p-4 border border-border rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium">Subscribed Plan</p>
                <p className="text-sm text-muted-foreground">Amount: ₹1200 | Subscribed Date: 2025-03-22 15:28:06</p>
              </div>
              <Badge variant="outline">Closed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mock Razorpay Modal */}
      {showMockRazorpay && mockOrderData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-200 border border-border">
            <div className="bg-[#3395ff] p-6 text-white text-center space-y-2">
              <div className="w-12 h-12 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm">
                <span className="text-[#3395ff] font-bold text-xl">₹</span>
              </div>
              <h3 className="font-semibold">Digital Portfolio</h3>
              <p className="text-sm opacity-90">Unlimited Premium Plan Upgrade</p>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex justify-between items-center text-lg font-bold text-foreground">
                <span>Amount Payable</span>
                <span>₹{(mockOrderData.order.amount / 100).toFixed(2)}</span>
              </div>
              
              <div className="space-y-3 pt-2">
                <p className="text-xs text-center text-muted-foreground bg-amber-500/10 text-amber-600 p-2 rounded border border-amber-500/20">
                  <strong>TEST MODE</strong><br/>No real money will be charged.
                </p>
                
                <Button 
                  className="w-full bg-[#3395ff] hover:bg-[#2b7ee5] text-white" 
                  onClick={() => handleMockPayment(true)}
                  disabled={mockProcessing}
                >
                  {mockProcessing ? 'Processing...' : 'Simulate Success'}
                </Button>
                
                <Button 
                  variant="outline"
                  className="w-full border-red-200 text-red-500 hover:bg-red-50" 
                  onClick={() => handleMockPayment(false)}
                  disabled={mockProcessing}
                >
                  Simulate Failure
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
