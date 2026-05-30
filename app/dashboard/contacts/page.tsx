'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function ContactsPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Exchanged Contacts</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">View all contacts you&apos;ve exchanged with</p>
      </div>

      <Input placeholder="Search contacts..." className="text-xs sm:text-sm h-9 sm:h-10" />

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Contact List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 sm:py-12 text-xs sm:text-sm text-muted-foreground">
            No contacts yet
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
