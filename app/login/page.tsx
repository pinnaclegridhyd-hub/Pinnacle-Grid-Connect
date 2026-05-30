'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useTheme } from 'next-themes';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const { setTheme } = useTheme();

  // Set dark theme for login page
  useEffect(() => {
    setTheme('dark');
  }, [setTheme]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <img src="/logo.png" alt="Pinnacle Grid Connect" className="h-16 mx-auto mb-3 sm:mb-4 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Pinnacle Grid Connect</h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Create smart digital visiting cards</p>
        </div>

        {/* Login Card */}
        <Card className="border-border/50 shadow-lg sm:shadow-2xl">
          <CardHeader className="space-y-1 sm:space-y-2 pb-3 sm:pb-6">
            <CardTitle className="text-xl sm:text-2xl">Welcome Back</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Sign in to your account to continue
            </CardDescription>
          </CardHeader>

          <CardContent className="p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {error && (
                <Alert variant="destructive" className="text-xs sm:text-sm">
                  <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                  <AlertDescription className="text-xs sm:text-sm">{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="email" className="text-xs sm:text-sm">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="text-xs sm:text-sm h-9 sm:h-10"
                />
              </div>

              <Button
                type="submit"
                className="w-full gap-2 text-xs sm:text-sm h-9 sm:h-10"
                disabled={loading}
              >
                {loading && <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin flex-shrink-0" />}
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 border-t border-border/50 pt-4 sm:pt-6">
              <p className="text-center text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Don&apos;t have an account?
              </p>
              <Link href="/signup">
                <Button variant="outline" className="w-full text-xs sm:text-sm h-9 sm:h-10">
                  Create Account
                </Button>
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-muted/30 rounded-lg border border-muted/50">
              <p className="text-xs font-semibold text-foreground mb-2">Demo Credentials:</p>
              <p className="text-xs text-muted-foreground mb-1 break-all">Email: <code className="bg-muted px-1 py-0.5 rounded text-xs">demo@example.com</code></p>
              <p className="text-xs text-muted-foreground break-all">Password: <code className="bg-muted px-1 py-0.5 rounded text-xs">demo123</code></p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6 sm:mt-8">
          All Rights Reserved ©2026 Pinnacle Grid Connect
        </p>
      </div>
    </div>
  );
}

