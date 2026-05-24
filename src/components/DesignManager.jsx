import React, { useState } from 'react';
import { Search, Palette, User, Calendar, Image, Shirt } from 'lucide-react';

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
   
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wider text-white uppercase flex items-center gap-2">
            <Shirt className="w-5 h-5 text-brand-primary" />
            Saved Custom Designs
          </h2>
          <p className="text-xs text-brand-text/70 mt-1">
            Browse and inspect active custom configurations, styling parameters, and sublimations saved by registered coaches.
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/45" />
          <input
            type="text"
            placeholder="Search by name, user, text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder-brand-text/45 focus:outline-none focus:border-brand-primary/50 transition-all font-sans"
          />
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-brand-border/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-dark/45 border-b border-brand-border/60 text-[10px] font-extrabold uppercase tracking-widest text-brand-text/60">
                <th className="px-6 py-4">Design Name</th>
                <th className="px-6 py-4">Product Category</th>
                <th className="px-6 py-4">Creator User</th>
                <th className="px-6 py-4">Styling Specs</th>
                <th className="px-6 py-4">Lettering / Numbers</th>
                <th className="px-6 py-4">Date Saved</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-border/30 text-xs text-brand-text/85">
              {filteredDesigns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-xs text-brand-text/50 font-medium">
                    No saved custom designs found matching your query.
                  </td>
                </tr>
              ) : (
                filteredDesigns.map((d) => (
                  <tr key={d._id} className="hover:bg-brand-primary/5 transition-colors">

                    <td className="px-6 py-4.5">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-white uppercase tracking-wide block">
                          {d.name}
                        </span>
                        <span className="text-[9px] font-mono text-brand-text/40 block">
                          ID: {d._id}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[8px] font-extrabold uppercase border ${
                        d.productType === 'jersey' 
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/35' 
                          : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/35'
                      }`}>
                        {d.productType}
                      </span>
                    </td>

              
                    <td className="px-6 py-4.5">
                      {d.user ? (
                        <div className="space-y-0.5">
                          <span className="font-semibold text-white uppercase text-[10px] flex items-center gap-1">
                            <User className="w-3 h-3 text-brand-primary" />
                            {d.user.username}
                          </span>
                          <span className="font-mono text-brand-text/60 text-[10px] block">
                            {d.user.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-brand-text/40 text-[10px] italic">Guest</span>
                      )}
                    </td>

                    <td className="px-6 py-4.5">
                      <div className="space-y-1.5">
                        <div className="flex gap-1.5 items-center">
                          {d.colors && Object.entries(d.colors).map(([zone, val]) => (
                            <span 
                              key={zone} 
                              className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm"
                              style={{ backgroundColor: val }}
                              title={`${zone}: ${val}`}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] uppercase tracking-wider text-brand-text/50 font-bold font-mono">
                          Pattern: {d.pattern}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4.5">
                      {(d.customText || d.textNumber) ? (
                        <div className="space-y-0.5">
                          {d.customText && (
                            <span className="font-bold text-white uppercase block text-[10px] tracking-wider font-mono">
                              "{d.customText}"
                            </span>
                          )}
                          {d.textNumber && (
                            <span className="text-[9px] text-brand-text/55 block">
                              Num: <strong className="font-mono text-brand-accent">{d.textNumber}</strong> ({d.textFont})
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-brand-text/40 text-[9px] italic">None</span>
                      )}
                    </td>

                    <td className="px-6 py-4.5 text-brand-text/75 font-mono">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-text/40" />
                        {new Date(d.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
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
