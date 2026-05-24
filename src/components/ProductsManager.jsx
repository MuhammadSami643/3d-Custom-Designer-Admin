import React, { useState } from 'react';
import { Tag, Edit, Save, ArrowRight, Layers, Palette } from 'lucide-react';

export default function ProductsManager({ products, onUpdatePrice }) {
  const [editingProduct, setEditingProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');
  const [saving, setSaving] = useState(false);

  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setNewPrice(product.basePrice.toString());
  };

  const handlePriceSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    const parsed = parseFloat(newPrice);
    if (isNaN(parsed) || parsed <= 0) {
      alert('Please enter a valid positive base price.');
      return;
    }
    setSaving(true);
    try {
      await onUpdatePrice(editingProduct.id, parsed);
      setEditingProduct(null);
      alert('Base product price updated successfully!');
    } catch (err) {
      alert('Could not update base product pricing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in select-none">
  //Title
      <div>
        <h2 className="text-xl font-bold tracking-wider text-white uppercase font-sans">Garment Catalog modifier</h2>
        <p className="text-xs text-brand-text/70 mt-1">
          Review details of available builder blueprints and override active client unit pricing.
        </p>
      </div>

  // Grid 
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((p) => (
          <div key={p.id} className="glass-panel p-6 rounded-2xl flex flex-col justify-between hover:border-brand-primary/50 transition-all duration-300">
            <div className="space-y-4">
        //Product header 
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <h3 className="font-extrabold text-white text-md uppercase tracking-wide">
                    {p.name}
                  </h3>
                  <span className="text-[9px] text-brand-text/45 uppercase tracking-widest font-mono">
                    ID: {p.id} • Category: {p.category}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-brand-text/45 uppercase tracking-widest block mb-0.5">Active base price</span>
                  <span className="font-mono font-bold text-lg text-brand-accent">${p.basePrice?.toFixed(2)}</span>
                </div>
              </div>

              {/* Design specifications */}
              <div className="grid grid-cols-1 gap-3.5 bg-brand-dark/25 p-4 rounded-xl border border-brand-border/40 text-xs">
      //3D zones 
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-wider text-brand-text/40 font-bold flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-brand-primary" />
                    Color zones configuration
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {p.zones?.map((z) => (
                      <span key={z.id} className="px-2.5 py-0.5 rounded bg-brand-border/30 border border-brand-border/60 text-[9px] text-brand-text uppercase font-semibold">
                        {z.name}
                      </span>
                    ))}
                  </div>
                </div>

      //  Default colors 
                <div className="space-y-1.5 pt-2.5 border-t border-brand-border/30">
                  <span className="text-[9px] uppercase tracking-wider text-brand-text/40 font-bold flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-brand-primary" />
                    Default Preset Colors
                  </span>
                  <div className="flex flex-wrap gap-2.5">
                    {p.defaultColors && Object.entries(p.defaultColors).map(([zone, hex]) => (
                      <div key={zone} className="flex items-center gap-1.5 bg-brand-dark/30 border border-brand-border/50 px-2 py-0.5 rounded text-[8px] uppercase">
                        <span className="w-2 h-2 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                        <span className="font-bold text-brand-text/60 truncate max-w-[50px]">{zone}</span>
                        <span className="font-mono text-white text-[8px]">{hex}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

  //Bottom edit trigger 
            <div className="mt-6 pt-4 border-t border-brand-border/40 flex justify-end">
              <button
                onClick={() => handleStartEdit(p)}
                className="glass-btn-secondary px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
              >
                <Edit className="w-4 h-4 text-brand-primary" />
                Edit Unit Pricing
              </button>
            </div>
          </div>
        ))}
      </div>

    // Edit Pricing Modal 
      {editingProduct && (
        <div className="fixed inset-0 bg-brand-dark/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handlePriceSubmit} className="glass-panel w-full max-w-sm p-6 rounded-xl space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold tracking-wider text-brand-primary uppercase">
              Modify Base Unit Price
            </h3>
            <p className="text-xs text-brand-text/60 leading-normal">
              Change the baseline cost for <strong className="text-white uppercase">{editingProduct.name}</strong>. The customizer custom estimates will instantly reflect this value.
            </p>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase tracking-wider text-brand-text/50 font-bold flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-brand-primary" />
                Base Unit Price ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="e.g. 59.99"
                className="glass-input text-xs font-mono font-bold"
              />
            </div>
            <div className="flex gap-2 justify-end pt-3 border-t border-brand-border/40">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="glass-btn-secondary px-3 py-1.5 text-xs uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="glass-btn-primary px-3 py-1.5 text-xs uppercase flex items-center gap-1"
              >
                {saving ? 'Saving...' : 'Update'}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
