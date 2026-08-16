'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getToken, login, verify } from '@/services/auth';

export default function LoginPage() {
  const router = useRouter();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { const token = getToken(); if (token) verify(token).then(() => router.replace('/dashboard')).catch(() => undefined); }, [router]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(''); setLoading(true);
    try { await login(mobile, password); router.replace('/dashboard'); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Unable to sign in.'); } finally { setLoading(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-slate-100 p-6"><form onSubmit={submit} className="w-full max-w-sm space-y-5 rounded-xl bg-white p-8 shadow-sm"><div><h1 className="text-2xl font-bold">SathiX Admin</h1><p className="mt-1 text-sm text-slate-600">Sign in with an administrator account.</p></div>{error && <p role="alert" className="rounded bg-red-50 p-3 text-sm text-red-700">{error}</p>}<label className="block text-sm font-medium">Mobile<input required value={mobile} onChange={(event) => setMobile(event.target.value)} className="mt-1 w-full rounded border p-2" autoComplete="username" /></label><label className="block text-sm font-medium">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded border p-2" autoComplete="current-password" /></label><button disabled={loading} className="w-full rounded bg-emerald-700 p-2 text-white disabled:opacity-60">{loading ? 'Signing in…' : 'Sign in'}</button></form></main>;
}
