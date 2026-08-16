'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Search, Bell, LogOut } from 'lucide-react';
import { logout } from '@/services/auth';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const routeNames: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/users': 'View Users',
  '/schemes': 'View Schemes',
  '/approvals': 'Approve Scraped Schemes',
  '/scraper': 'Monitor Scraper',
  '/indexer': 'Trigger Re-indexing',
  '/logs': 'View Logs',
  '/sources': 'Manage Sources',
  '/languages': 'Manage Languages',
  '/analytics': 'Analytics',
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const title = routeNames[pathname] || 'Dashboard';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            type="search" 
            placeholder="Search..." 
            className="w-full bg-background pl-9 focus-visible:ring-primary"
          />
        </div>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive"></span>
        </Button>
        <Button variant="ghost" size="icon" aria-label="Log out" onClick={() => { logout(); router.replace('/login'); }}><LogOut className="h-5 w-5 text-muted-foreground" /></Button>
      </div>
    </header>
  );
}
