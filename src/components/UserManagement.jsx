import React, { useState } from 'react';
import { Search, Users, Mail, Calendar, ShieldCheck } from 'lucide-react';

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
  //Title block 
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-primary" />
            Registered Users Catalogue
          </h2>
          <p className="text-xs text-brand-text/70 mt-1">
            Browse and inspect client accounts registered on the Custom 3D Builder MERN platform.
          </p>
        </div>

  //Search 
        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/45" />
          <input
            type="text"
            placeholder="Search by username, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder-brand-text/45 focus:outline-none focus:border-brand-primary/50 transition-all font-sans"
          />
        </div>
      </div>

    //Users table 
      <div className="glass-panel rounded-2xl overflow-hidden border border-brand-border/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-dark/45 border-b border-brand-border/60 text-[10px] font-extrabold uppercase tracking-widest text-brand-text/60">
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Role / Access</th>
                <th className="px-6 py-4">Registration Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30 text-xs text-brand-text/85">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-xs text-brand-text/50 font-medium">
                    No registered user accounts found matching your query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-brand-primary/5 transition-colors">
                    <td className="px-6 py-4.5 font-extrabold text-white uppercase tracking-wide">
                      {u.username}
                    </td>
                    <td className="px-6 py-4.5 font-mono text-brand-primary flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-brand-text/40" />
                      {u.email}
                    </td>
                    <td className="px-6 py-4.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded bg-brand-primary/10 border border-brand-primary/30 text-[9px] font-bold text-brand-primary uppercase">
                        <ShieldCheck className="w-3 h-3" />
                        Coach Account
                      </span>
                    </td>
                    <td className="px-6 py-4.5 text-brand-text/75 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-text/40" />
                        {new Date(u.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
