'use client';
import { useEffect, useState } from 'react';
import { ApiError } from '@/services/api';
import { type AdminUser, listUsers, updateUserRole, updateUserStatus } from '@/services/users';

export default function UsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<AdminUser['role'] | ''>('');
  const [isActive, setIsActive] = useState<'true' | 'false' | ''>('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let active = true;
    listUsers({
      page,
      search: search || undefined,
      role: role || undefined,
      isActive: isActive || undefined,
    })
      .then((result) => {
        if (active) {
          setItems(result.items);
          setTotalPages(Math.max(1, result.totalPages));
        }
      })
      .catch((cause) => {
        if (active) setError(cause instanceof ApiError ? cause.message : 'Unable to load users.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [page, search, role, isActive, refresh]);

  const reload = () => {
    setLoading(true);
    setRefresh((value) => value + 1);
  };

  async function toggleActive(user: AdminUser) {
    const next = !user.isActive;
    if (!window.confirm(`${next ? 'Activate' : 'Deactivate'} ${user.name}?`)) return;
    try {
      await updateUserStatus(user.id, next);
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Status update failed.');
    }
  }

  async function changeRole(user: AdminUser, next: AdminUser['role']) {
    if (next === user.role || !window.confirm(`Change ${user.name}'s role to ${next}?`)) return;
    try {
      await updateUserRole(user.id, next);
      reload();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Role update failed.');
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-bold">User management</h2>
        <p className="text-sm text-slate-600">Citizens and administrators registered through Backend authentication.</p>
      </div>
      <div className="flex flex-wrap gap-3">
        <input
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
          placeholder="Search name, mobile, or email"
          className="min-w-64 rounded border p-2"
        />
        <select
          value={role}
          onChange={(e) => {
            setPage(1);
            setRole(e.target.value as AdminUser['role'] | '');
          }}
          className="rounded border p-2"
        >
          <option value="">All roles</option>
          <option value="CITIZEN">Citizen</option>
          <option value="ADMIN">Admin</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="PARTNER">Partner</option>
        </select>
        <select
          value={isActive}
          onChange={(e) => {
            setPage(1);
            setIsActive(e.target.value as 'true' | 'false' | '');
          }}
          className="rounded border p-2"
        >
          <option value="">All statuses</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      {error && <p role="alert" className="rounded bg-red-50 p-3 text-red-700">{error}</p>}
      {loading ? (
        <p>Loading users…</p>
      ) : (
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th className="p-3">User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Location</th>
                <th>Last active</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="p-3">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-slate-500">{user.mobile}{user.email ? ` · ${user.email}` : ''}</div>
                  </td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => changeRole(user, e.target.value as AdminUser['role'])}
                      className="rounded border p-1"
                    >
                      <option value="CITIZEN">Citizen</option>
                      <option value="ADMIN">Admin</option>
                      <option value="SUPER_ADMIN">Super Admin</option>
                      <option value="PARTNER">Partner</option>
                    </select>
                  </td>
                  <td>{user.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{user.profile?.state || '—'}{user.profile?.district ? `, ${user.profile.district}` : ''}</td>
                  <td>{user.lastActiveAt ? new Date(user.lastActiveAt).toLocaleString() : 'Never'}</td>
                  <td className="p-3">
                    <button onClick={() => toggleActive(user)} className="rounded border px-2 py-1">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {items.length === 0 && <p className="p-4 text-slate-600">No users match the current filters.</p>}
        </div>
      )}
      <div className="flex gap-3">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="rounded border px-3 py-1 disabled:opacity-50">Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="rounded border px-3 py-1 disabled:opacity-50">Next</button>
      </div>
    </section>
  );
}
