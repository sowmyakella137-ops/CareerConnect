import React, { useState, useEffect } from 'react';
import { adminService } from '../api/adminService.js';
import { getErrorMessage } from '../api/api.js';

import LoadingSpinner from '../components/LoadingSpinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import EmptyState from '../components/EmptyState.jsx';

import { Users, Search, RefreshCw, Shield, GraduationCap, Building2 } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [editingUser, setEditingUser] = useState(null);
const [saving, setSaving] = useState(false);
const [actionError, setActionError] = useState('');
const [actionSuccess, setActionSuccess] = useState('');
const [updatingUserId, setUpdatingUserId] = useState(null);
const [actionMessage, setActionMessage] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err));
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleBadge = (roleStr) => {
    const r = String(roleStr || '').replace('ROLE_', '').toUpperCase();
    if (r === 'ADMIN') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 border border-purple-200 px-2 py-0.5 text-[11px] font-semibold text-purple-700">
          <Shield className="h-3 w-3" /> ADMIN
        </span>
      );
    }
    if (r === 'COMPANY') {
      return (
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 border border-blue-200 px-2 py-0.5 text-[11px] font-semibold text-blue-700">
          <Building2 className="h-3 w-3" /> COMPANY
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
        <GraduationCap className="h-3 w-3" /> STUDENT
      </span>
    );
  };

  const filteredUsers = users.filter((u) => {
    const nameMatch = !search || u.name?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = !search || u.email?.toLowerCase().includes(search.toLowerCase());
    const roleNormalized = String(u.role || '').replace('ROLE_', '').toUpperCase();
    const roleMatch = roleFilter === 'ALL' || roleNormalized === roleFilter;

    return (nameMatch || emailMatch) && roleMatch;
  });

   const handleUpdateUser = async (e) => {
  e.preventDefault();
  if (!editingUser) return;

  setSaving(true);
  setActionError('');
  setActionSuccess('');

  try {
    const updated = await adminService.updateUser(editingUser.id, {
      name: editingUser.name,
      email: editingUser.email,
    });

    setUsers((current) =>
      current.map((user) =>
        user.id === updated.id ? { ...user, ...updated } : user
      )
    );

    setEditingUser(null);
    setActionSuccess('User details updated successfully.');
  } catch (err) {
    setActionError(getErrorMessage(err));
  } finally {
    setSaving(false);
  }
};

const handleToggleUser = async (user) => {
  const currentlyEnabled = user.enabled !== false;

  setUpdatingUserId(user.id);
  setActionMessage('');
  setActionError('');

  try {
    const updated = await adminService.setUserEnabled(
      user.id,
      !currentlyEnabled
    );

    setUsers((current) =>
      current.map((item) =>
        item.id === updated.id ? { ...item, ...updated } : item
      )
    );

    setActionMessage(
      `${updated.name} has been ${updated.enabled ? 'activated' : 'disabled'}.`
    );
  } catch (err) {
    setActionError(getErrorMessage(err));
  } finally {
    setUpdatingUserId(null);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Registered Users Directory
          </h1>
          <p className="mt-1 text-xs text-slate-500">
              Manage student, employer, and administrator accounts ({users.length}).          </p>
        </div>

        <button
          type="button"
          onClick={fetchUsers}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-xs"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
        >
          <option value="ALL">All Roles ({users.length})</option>
          <option value="STUDENT">Students</option>
          <option value="COMPANY">Companies</option>
          <option value="ADMIN">Admins</option>
        </select>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchUsers} />}
      {actionMessage && (
  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
    {actionMessage}
  </div>
)}

{actionError && (
  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
    {actionError}
  </div>
)}

      {/* Table */}
      {loading ? (
        <LoadingSpinner message="Loading user directory from database..." size="lg" className="py-20" />
      ) : filteredUsers.length > 0 ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase tracking-wider font-mono text-[11px]">
                <tr>
                  <th className="px-4 py-3">User ID</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Email Address</th>
                  <th className="px-4 py-3">Assigned Role</th>
                  <th className="px-4 py-3">Account Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              
<tbody className="divide-y divide-slate-100">
  {filteredUsers.map((user) => (
    <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
      <td className="px-4 py-3 font-mono font-medium text-slate-500">
        #{user.id}
      </td>

      <td className="px-4 py-3 font-semibold text-slate-900">
        {user.name || 'Unnamed User'}
      </td>

      <td className="px-4 py-3 text-slate-600">
        {user.email}
      </td>

      <td className="px-4 py-3">
        {getRoleBadge(user.role)}
      </td>

      {/* Account Status */}
      <td className="px-4 py-3">
        <span
          className={`rounded-md border px-2 py-1 text-[11px] font-semibold ${
            user.enabled !== false
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {user.enabled !== false ? 'ACTIVE' : 'DISABLED'}
        </span>
      </td>

      {/* Actions */}
      <td className="px-4 py-3 text-right whitespace-nowrap">
        <button
          type="button"
          onClick={() => {
            setActionError('');
            setActionSuccess('');
            setEditingUser({
              id: user.id,
              name: user.name || '',
              email: user.email || '',
            });
          }}
          disabled={
            user.email?.toLowerCase() ===
            JSON.parse(localStorage.getItem('user') || '{}').email?.toLowerCase()
          }
          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40"
        >
          Edit
        </button>

        <button
          type="button"
          onClick={() => handleToggleUser(user)}
          disabled={
            updatingUserId === user.id ||
            String(user.role).replace('ROLE_', '').toUpperCase() === 'ADMIN'
          }
          className={`ml-2 rounded-lg border px-3 py-1.5 text-xs font-semibold disabled:opacity-40 ${
            user.enabled !== false
              ? 'border-rose-200 text-rose-700 hover:bg-rose-50'
              : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
          }`}
        >
          {updatingUserId === user.id
            ? 'Updating...'
            : user.enabled !== false
              ? 'Disable'
              : 'Activate'}
        </button>
      </td>
    </tr>
  ))}
</tbody>

            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No users found"
          description={
            search || roleFilter !== 'ALL'
              ? "No registered users match your search and filter criteria."
              : "No users are currently returned by the backend endpoint."
          }
          actionLabel={search || roleFilter !== 'ALL' ? "Reset Filters" : undefined}
          onAction={search || roleFilter !== 'ALL' ? () => { setSearch(''); setRoleFilter('ALL'); } : undefined}
        />
      )}
      
{actionError && (
  <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
    {actionError}
  </div>
)}

{actionSuccess && (
  <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
    {actionSuccess}
  </div>
)}

{editingUser && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
    <form
      onSubmit={handleUpdateUser}
      className="w-full max-w-md space-y-4 rounded-xl bg-white p-6 shadow-xl"
    >
      <h2 className="text-lg font-bold text-slate-900">Edit User</h2>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Full Name
        </label>
        <input
          required
          value={editingUser.name}
          onChange={(e) =>
            setEditingUser({ ...editingUser, name: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Email Address
        </label>
        <input
          required
          type="email"
          value={editingUser.email}
          onChange={(e) =>
            setEditingUser({ ...editingUser, email: e.target.value })
          }
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => setEditingUser(null)}
          disabled={saving}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
}
