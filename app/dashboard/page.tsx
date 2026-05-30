'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, TrendingUp, HelpCircle, Calendar } from 'lucide-react';
import Link from 'next/link';
import DashboardChart from '@/components/dashboard/DashboardChart';
import DashboardStats from '@/components/dashboard/DashboardStats';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4 sm:p-6 border border-primary/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Hey, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage your digital business cards
            </p>
          </div>
          <Link href="/dashboard/profile" className="flex-shrink-0">
            <Button className="w-full sm:w-auto gap-2 text-xs sm:text-sm">
              <span>Edit Profile</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2 overflow-hidden">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="truncate">vCard Analytics</span>
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-2">Apr 16, 2026 - May 16, 2026</p>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <DashboardChart />
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard/profile">
                <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-auto py-2">
                  <span>Create vCard</span>
                </Button>
              </Link>
              <Link href="/dashboard/contacts">
                <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-auto py-2">
                  <span>View Contacts</span>
                </Button>
              </Link>
              <Link href="/dashboard/settings">
                <Button variant="outline" className="w-full justify-start text-xs sm:text-sm h-auto py-2">
                  <span>Settings</span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Today's Appointments */}
      <Card>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span>Today Appointments</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:-mx-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 font-semibold text-foreground whitespace-nowrap">VCARD NAME</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground hidden sm:table-cell whitespace-nowrap">NAME</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground hidden md:table-cell whitespace-nowrap">PHONE</th>
                  <th className="text-left py-2 px-4 font-semibold text-foreground hidden lg:table-cell whitespace-nowrap">EMAIL</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/50 hover:bg-muted/50">
                  <td colSpan={4} className="py-8 px-4 text-center text-muted-foreground text-xs">
                    No Data Available
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
