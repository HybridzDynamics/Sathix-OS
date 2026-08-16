'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CheckSquare, 
  Activity, 
  RefreshCw, 
  TerminalSquare, 
  Link as LinkIcon, 
  Languages, 
  BarChart3
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'View Users', href: '/users', icon: Users },
  { name: 'View Schemes', href: '/schemes', icon: FileText },
  { name: 'Approve Schemes', href: '/approvals', icon: CheckSquare },
  { name: 'Monitor Scraper', href: '/scraper', icon: Activity },
  { name: 'RAG Knowledge Base', href: '/rag', icon: RefreshCw },
  { name: 'View Logs', href: '/logs', icon: TerminalSquare },
  { name: 'Manage Sources', href: '/sources', icon: LinkIcon },
  { name: 'Manage Languages', href: '/languages', icon: Languages },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar border-r border-sidebar-border">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-sidebar-border">
        {/* Placeholder for Logo, since logo files were not provided in the directory */}
        <span className="text-xl font-bold text-sidebar-primary">SarthixOS</span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-4 pb-4">
        <nav className="flex-1 space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors'
                )}
              >
                <item.icon
                  className={cn(
                    isActive ? 'text-sidebar-primary-foreground' : 'text-muted-foreground group-hover:text-sidebar-accent-foreground',
                    'mr-3 h-5 w-5 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
