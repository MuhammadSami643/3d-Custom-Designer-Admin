import React, { useState } from 'react';
import { Search, Mail, Calendar, ShieldCheck } from 'lucide-react';

export default function UsersManager({ users }) {
  const [search, setSearch] = useState('');

  const filteredUsers = users.filter((u) => {
    const term = search.toLowerCase();
    return (
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-primary" />
            Registered Users
          </h2>

          <p className="text-xs text-brand-text/70 mt-1">
            Browse and inspect client accounts.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-xs w-full">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/40" />

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="
              w-full h-11 pl-10 pr-4 text-xs text-white
              bg-brand-dark/40 border border-brand-border/50
              rounded-xl outline-none
              focus:border-brand-primary/50
              focus:ring-1 focus:ring-brand-primary/20
            "
          />
        </div>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-brand-border/60">

        <table className="w-full text-left">

          <thead>
            <tr className="text-[10px] uppercase text-brand-text/60 border-b border-brand-border/40">
              <th className="px-6 py-4">Username</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Date</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-brand-border/30 text-xs">

            {filteredUsers.map((u) => (
              <tr key={u._id} className="hover:bg-brand-primary/5">

                <td className="px-6 py-4 font-bold text-white uppercase">
                  {u.username}
                </td>

                <td className="px-6 py-4 font-mono text-brand-primary">
                  {u.email}
                </td>

                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/30 rounded">
                    <ShieldCheck className="w-3 h-3" />
                    {u.role || 'User'}
                  </span>
                </td>

                <td className="px-6 py-4 text-brand-text/70 font-mono">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">

        {filteredUsers.map((u) => (
          <div
            key={u._id}
            className="glass-panel rounded-2xl p-4 border border-brand-border/40"
          >

            {/* NAME */}
            <div className="text-white font-bold text-lg tracking-wide">
              {u.username}
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-2 mt-2 text-xs text-brand-primary font-mono">
              <Mail className="w-3.5 h-3.5 text-brand-text/40" />
              {u.email}
            </div>

            {/* ROLE BADGE */}
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[9px] uppercase font-bold text-brand-primary bg-brand-primary/10 border border-brand-primary/30 rounded">
                <ShieldCheck className="w-3 h-3" />
                {u.role || 'User'}
              </span>
            </div>

            {/* DATE */}
            <div className="flex items-center gap-2 mt-2 text-xs text-brand-text/60 font-mono">
              <Calendar className="w-3.5 h-3.5 text-brand-text/40" />
              {new Date(u.createdAt).toLocaleDateString()}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}