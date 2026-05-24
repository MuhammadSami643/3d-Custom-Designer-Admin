import React, { useState } from 'react';
import { Search, User, Calendar, Shirt } from 'lucide-react';

export default function DesignsManager({ designs }) {
  const [search, setSearch] = useState('');

  const filteredDesigns = designs.filter((d) => {
    const term = search.toLowerCase();

    const userEmail = d.user?.email?.toLowerCase() || '';
    const userName = d.user?.username?.toLowerCase() || '';
    const textVal = d.customText?.toLowerCase() || '';

    return (
      d.name?.toLowerCase().includes(term) ||
      d.productType?.toLowerCase().includes(term) ||
      userEmail.includes(term) ||
      userName.includes(term) ||
      textVal.includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in select-none">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

        <div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <Shirt className="w-5 h-5 text-brand-primary" />
            Saved Custom Designs
          </h2>

          <p className="text-xs text-brand-text/70 mt-1">
            Browse and inspect saved custom configurations.
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative max-w-xs w-full">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/45" />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 text-xs text-white bg-brand-dark/40 border border-brand-border/50 rounded-xl outline-none"
          />

        </div>

      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block glass-panel rounded-2xl overflow-hidden border border-brand-border/60">

        <div className="overflow-x-auto">

          <table className="w-full text-left">

            <thead>
              <tr className="text-[10px] uppercase text-brand-text/60 border-b border-brand-border/40">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>

            <tbody className="text-xs text-brand-text/85">

              {filteredDesigns.map((d) => (
                <tr key={d._id} className="border-b border-brand-border/20 hover:bg-brand-primary/5">

                  <td className="px-6 py-4 font-bold text-white uppercase">
                    {d.name}
                  </td>

                  <td className="px-6 py-4">
                    <span className="text-brand-primary uppercase text-[10px]">
                      {d.productType}
                    </span>
                  </td>

                  <td className="px-6 py-4 flex items-center gap-2 text-brand-text/80">
                    <User className="w-3.5 h-3.5" />
                    {d.user?.username || 'Guest'}
                  </td>

                  <td className="px-6 py-4 font-mono text-brand-text/70">
                    {new Date(d.createdAt).toLocaleDateString()}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>

        </div>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-3">

        {filteredDesigns.map((d) => (
          <div
            key={d._id}
            className="glass-panel p-4 rounded-xl border border-brand-border/40 space-y-2"
          >

            {/* TOP ROW */}
            <div className="flex justify-between items-start">

              <div className="font-bold text-white uppercase">
                {d.name}
              </div>

              <span className="text-[10px] text-brand-primary uppercase">
                {d.productType}
              </span>

            </div>

            {/* USER */}
            <div className="text-xs text-brand-text/80 flex items-center gap-2">
              <User className="w-3.5 h-3.5" />
              {d.user?.username || 'Guest'}
            </div>

            {/* DATE */}
            <div className="text-[10px] text-brand-text/60 flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(d.createdAt).toLocaleDateString()}
            </div>

          </div>
        ))}

      </div>

    </div>
  );
}