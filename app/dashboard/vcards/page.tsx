'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, Edit2, Trash2, Plus, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function VCardsPage() {
  const [vcards, setVcards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadVCards = async () => {
      try {
        const res = await fetch('/api/vcards', { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setVcards(data.vcards || []);
        }
      } catch {}
      setLoading(false);
    };
    loadVCards();
  }, []);

  const filteredVCards = vcards.filter((vcard) =>
    (vcard.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (vcard.url || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            My vCards {!loading && `(${vcards.length}/4)`}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">Manage your digital business cards</p>
        </div>
        {!loading && vcards.length >= 4 ? (
          <Button 
            className="gap-2 text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none"
            variant="outline"
            onClick={() => alert("Limit reached: You can create a maximum of 4 vCards.")}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Create New vCard</span>
            <span className="sm:hidden">Create</span>
          </Button>
        ) : (
          <Link href="/dashboard/profile">
            <Button className="gap-2 text-xs sm:text-sm h-9 sm:h-10 flex-1 sm:flex-none">
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Create New vCard</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </Link>
        )}
      </div>

      <div className="">
        <Input 
          placeholder="Search vCards..." 
          className="text-xs sm:text-sm h-9 sm:h-10" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-lg sm:text-xl">Active vCards</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto -mx-6 sm:-mx-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold">ACTION</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold hidden sm:table-cell">VCARD NAME</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold hidden md:table-cell">PREVIEW URL</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold hidden lg:table-cell">VIEWS</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold hidden lg:table-cell">SUBSCRIBERS</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold">STATUS</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold hidden md:table-cell">CREATED AT</th>
                  <th className="text-left py-2 sm:py-3 px-4 font-semibold">STATS</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">Loading vCards...</td>
                  </tr>
                ) : filteredVCards.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-muted-foreground">
                      {searchQuery ? 'No vCards matches your search.' : 'No vCards created yet.'}
                    </td>
                  </tr>
                ) : (
                  filteredVCards.map((vcard) => {
                    const id = vcard._id.toString();
                    const name = vcard.name;
                    const slug = vcard.url;
                    const views = vcard.views || 0;
                    const subscribers = 0;
                    const isActive = vcard.isActive !== false;
                    const status = isActive ? 'Active' : 'Inactive';
                    const createdAt = vcard.createdAt ? new Date(vcard.createdAt).toLocaleDateString('en-GB') : '';

                    return (
                      <tr key={id} className="border-b border-border/50 hover:bg-muted/50">
                        <td className="py-2 sm:py-3 px-4">
                          <div className="flex gap-1 sm:gap-2">
                            <a href={`/profile/${slug}`} target="_blank" rel="noopener noreferrer">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </a>
                            <Link href={`/dashboard/profile?id=${id}`}>
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                                <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              </Button>
                            </Link>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                              onClick={async () => {
                                if (confirm(`Are you sure you want to delete ${name}?`)) {
                                  try {
                                    const res = await fetch(`/api/vcards/${id}`, { method: 'DELETE' });
                                    if (res.ok) {
                                      setVcards(prev => prev.filter(v => v._id !== vcard._id));
                                    }
                                  } catch {}
                                }
                              }}
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </div>
                        </td>
                        <td className="py-2 sm:py-3 px-4 font-medium hidden sm:table-cell truncate">{name}</td>
                        <td className="py-2 sm:py-3 px-4 hidden md:table-cell">
                          <a href={`/profile/${slug}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs truncate block">
                            /profile/{slug}
                          </a>
                        </td>
                        <td className="py-2 sm:py-3 px-4 hidden lg:table-cell">{views}</td>
                        <td className="py-2 sm:py-3 px-4 hidden lg:table-cell">{subscribers}</td>
                        <td className="py-2 sm:py-3 px-4">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></span>
                          <span className="hidden sm:inline">{status}</span>
                          <span className="sm:hidden">{status}</span>
                        </td>
                        <td className="py-2 sm:py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">{createdAt}</td>
                        <td className="py-2 sm:py-3 px-4">
                          <a href="/dashboard/analytics">
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground">
                              <BarChart2 className="w-3 h-3 sm:w-4 sm:h-4" />
                            </Button>
                          </a>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
