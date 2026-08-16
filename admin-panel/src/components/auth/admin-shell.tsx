'use client';

import { type ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getToken, logout, verify } from '@/services/auth';
import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === '/login';
  const [verifiedPath, setVerifiedPath] = useState<string | null>(null);

  useEffect(() => {
    if (isLogin) return;
    const token = getToken();
    if (!token) { router.replace('/login'); return; }
    verify(token).then(() => setVerifiedPath(pathname)).catch(() => { logout(); router.replace('/login'); });
  }, [isLogin, pathname, router]);

  if (isLogin) return <>{children}</>;
  if (verifiedPath !== pathname) return <main className="grid min-h-screen place-items-center bg-slate-50 text-sm text-slate-600">Verifying administrator access…</main>;

  return <div className="flex h-screen overflow-hidden bg-background"><Sidebar /><div className="flex min-w-0 flex-1 flex-col overflow-hidden"><Header /><main className="flex-1 overflow-y-auto bg-gray-50/50 p-6"><div className="mx-auto h-full max-w-7xl">{children}</div></main></div></div>;
}
