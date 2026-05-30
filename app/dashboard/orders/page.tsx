'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function OrdersPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Product Orders</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Track your product orders</p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Orders List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12 text-xs sm:text-sm text-muted-foreground">
            No orders yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
