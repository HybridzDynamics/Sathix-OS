import React, { useState } from 'react';
import { BackendApiError, login, register, setToken } from '../api/backend';

export function LoginScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isRegistering) await register(name.trim(), mobile.trim(), password);
      const result = await login(mobile.trim(), password);
      if (result.user.role !== 'CITIZEN') throw new Error('Please use the administration panel for administrator accounts.');
      setToken(result.token);
      onAuthenticated();
    } catch (cause) {
      setError(cause instanceof BackendApiError || cause instanceof Error ? cause.message : 'Unable to sign in. Please try again.');
    } finally { setLoading(false); }
  }

  return <main className="min-h-screen grid place-items-center bg-[#F8F9FA] p-4">
    <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4" aria-describedby={error ? 'auth-error' : undefined}>
      <div><h1 className="text-2xl font-bold text-[#1A237E]">SathiX OS</h1><p className="mt-1 text-sm text-slate-600">{isRegistering ? 'Create your citizen account' : 'Sign in to continue'}</p></div>
      {isRegistering && <label className="block text-sm font-medium text-slate-700">Name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" autoComplete="name" /></label>}
      <label className="block text-sm font-medium text-slate-700">Mobile number<input required value={mobile} onChange={(event) => setMobile(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" inputMode="tel" autoComplete="tel" /></label>
      <label className="block text-sm font-medium text-slate-700">Password<input required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-2" type="password" autoComplete={isRegistering ? 'new-password' : 'current-password'} /></label>
      {error && <p id="auth-error" role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <button disabled={loading} className="w-full rounded-xl bg-[#1A237E] px-4 py-2.5 font-semibold text-white disabled:opacity-60">{loading ? 'Please wait…' : isRegistering ? 'Create account' : 'Sign in'}</button>
      <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(null); }} className="w-full text-sm font-medium text-[#1A237E] underline">{isRegistering ? 'Already have an account? Sign in' : 'New here? Create an account'}</button>
    </form>
  </main>;
}
