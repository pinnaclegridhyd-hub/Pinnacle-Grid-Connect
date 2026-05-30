'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export default function StoragePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Storage</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your storage usage</p>
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Storage Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs sm:text-sm">
              <span>Used: 0 MB</span>
              <span>Total: 100 MB</span>
            </div>
            <Progress value={0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
