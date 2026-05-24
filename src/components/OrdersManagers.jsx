import React, { useState } from 'react';
import { Search, Eye, ClipboardList, Clock, CheckCircle, XCircle, ChevronDown, ChevronUp, Save, Users, Palette, Info } from 'lucide-react';

export default function OrdersManager({ orders, onUpdateStatus }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusVal, setStatusVal] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Accordion controls
  const [showContact, setShowContact] = useState(true);
  const [showRoster, setShowRoster] = useState(true);
  const [showDesign, setShowDesign] = useState(true);

  // Search logic
  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      (o._id || '').toLowerCase().includes(term) ||
      (o.contactDetails?.name || '').toLowerCase().includes(term) ||
      (o.contactDetails?.teamName || '').toLowerCase().includes(term) ||
      (o.contactDetails?.email || '').toLowerCase().includes(term)
    );
  });

  const handleOrderSelect = (order) => {
    setSelectedOrder(order);
    setStatusVal(order.status || 'Pending Review');
    setAdminNotes(order.contactDetails?.notes || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setSaving(true);
    try {
      await onUpdateStatus(selectedOrder._id, { status: statusVal, adminNotes });
      // Update selected reference
      setSelectedOrder({
        ...selectedOrder,
        status: statusVal,
        contactDetails: {
          ...selectedOrder.contactDetails,
          notes: adminNotes
        }
      });
      alert('Order parameters updated successfully!');
    } catch (err) {
      alert('Could not update status.');
    } finally {
      setSaving(false);
    }
  };

  // Pricing calculations for current selected order
  const getOrderTotal = (order) => {
    if (!order) return 0;
    const rosterQty = order.roster ? order.roster.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0;
    const baseVal = order.designDetails?.productType === 'cap' ? 24.99 : 59.99;
    const logoFee = order.designDetails?.logoUrl ? 10.00 : 0.00;
    const textFee = order.designDetails?.customText ? 5.00 : 0.00;
    const unitPrice = baseVal + logoFee + textFee;
    return unitPrice * rosterQty + (rosterQty > 0 ? 15.00 : 0.00);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)] animate-fade-in select-none">
      
      //Left Columns - Orders List Panel

      <div className="lg:col-span-1 glass-panel rounded-2xl flex flex-col overflow-hidden">
       //Search
        <div className="p-4 border-b border-brand-border/40 space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-[#F3F4F6]">Quotes Database</h3>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text/50" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH BY TEAM, EMAIL, ID..."
              className="w-full bg-brand-dark/50 border border-brand-border/80 hover:border-brand-border focus:border-brand-primary rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none transition-all uppercase placeholder:text-brand-text/30"
            />
          </div>
        </div>

        //Scrollable list 
        <div className="flex-grow overflow-y-auto scrollbar-thin divide-y divide-brand-border/30 p-2 space-y-1.5">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-xs italic text-brand-text/45">
              No orders matches found.
            </div>
          ) : (
            filteredOrders.map((order) => {
              const totalItems = order.roster ? order.roster.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0) : 0;
              const grandTotal = getOrderTotal(order);
              const isSelected = selectedOrder && selectedOrder._id === order._id;

              return (
                <button
                  key={order._id}
                  onClick={() => handleOrderSelect(order)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col justify-between cursor-pointer gap-2 ${
                    isSelected 
                      ? 'border-brand-primary bg-brand-primary/5 shadow-md shadow-brand-primary/5' 
                      : 'border-brand-border/50 hover:bg-brand-border/25 hover:border-brand-border bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start gap-2 w-full">
                    <div className="overflow-hidden">
                      <span className="font-bold text-[#F3F4F6] text-xs uppercase tracking-wide truncate block">
                        {order.contactDetails?.teamName || 'Team Uniform'}
                      </span>
                      <span className="text-[9px] text-brand-text/55 font-mono uppercase block tracking-wider mt-0.5">
                        Ref: #{order._id}
                      </span>
                    </div>
                    <span 
                      className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        order.status === 'Approved' 
                          ? 'bg-emerald-400/10 border border-emerald-400/20 text-emerald-400' 
                          : order.status === 'Cancelled'
                          ? 'bg-red-400/10 border border-red-400/20 text-red-400'
                          : 'bg-amber-400/10 border border-amber-400/20 text-amber-400'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-brand-text/50 uppercase border-t border-brand-border/30 pt-2 w-full">
                    <span>{order.contactDetails?.name} • {totalItems} items</span>
                    <span className="font-mono font-bold text-white">${grandTotal.toFixed(2)}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

    //Right Columns - Inspect drawer 
      <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
        {selectedOrder ? (
          <div className="flex-grow flex flex-col overflow-hidden bg-brand-card/30 border border-brand-border/60 rounded-2xl">
            {/* Header */}
            <div className="px-6 py-4 bg-brand-dark/30 border-b border-brand-border/60 flex justify-between items-center flex-shrink-0">
              <div>
                <h3 className="font-bold text-white text-sm uppercase tracking-wide">
                  Order Details Inspector
                </h3>
                <span className="text-[9px] text-brand-text/50 uppercase tracking-widest block font-mono">
                  REF ID: {selectedOrder._id}
                </span>
              </div>
              <span className="font-mono text-sm font-bold text-brand-accent">
                EST. INVOICE: ${getOrderTotal(selectedOrder).toFixed(2)}
              </span>
            </div>

          //Scrollable details
            <div className="flex-grow overflow-y-auto scrollbar-thin p-6 space-y-4">
              
              <div className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="w-full px-4 py-3 bg-brand-dark/20 flex justify-between items-center hover:bg-brand-dark/45 border-b border-brand-border/40 font-bold uppercase tracking-wider text-[10px] text-brand-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Customer Contact details
                  </span>
                  {showContact ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showContact && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold mb-0.5">Contact Name</span>
                      <span className="text-[#F3F4F6] font-bold block">{selectedOrder.contactDetails?.name}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold mb-0.5">Email Address</span>
                      <span className="text-brand-primary font-bold block">{selectedOrder.contactDetails?.email}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold mb-0.5">Phone Number</span>
                      <span className="text-[#F3F4F6] font-bold block">{selectedOrder.contactDetails?.phone}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold mb-0.5">Team Name</span>
                      <span className="text-brand-accent font-bold block uppercase">{selectedOrder.contactDetails?.teamName}</span>
                    </div>
                  </div>
                )}
              </div>

              // Accordion 2: Roster spreadsheet table 
              <div className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowRoster(!showRoster)}
                  className="w-full px-4 py-3 bg-brand-dark/20 flex justify-between items-center hover:bg-brand-dark/45 border-b border-brand-border/40 font-bold uppercase tracking-wider text-[10px] text-brand-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <ClipboardList className="w-4 h-4" />
                    Player Roster Spreadsheet
                  </span>
                  {showRoster ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showRoster && (
                  <div className="p-4 overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-brand-border/50 text-brand-text/50 uppercase tracking-widest font-extrabold text-[9px]">
                          <th className="pb-2 w-10 text-center">No.</th>
                          <th className="pb-2 pl-2">Player Name</th>
                          <th className="pb-2 text-center w-24">Number</th>
                          <th className="pb-2 text-center w-24">Size</th>
                          <th className="pb-2 text-center w-20">Quantity</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-border/20 text-[#e2e8f0]">
                        {selectedOrder.roster?.map((item, idx) => (
                          <tr key={idx} className="hover:bg-brand-border/10 transition-colors">
                            <td className="py-2 text-center font-mono text-brand-text/50">{idx + 1}</td>
                            <td className="py-2 pl-2 font-bold uppercase">{item.name || 'N/A'}</td>
                            <td className="py-2 text-center font-mono font-bold text-brand-accent">{item.number}</td>
                            <td className="py-2 text-center font-bold text-white uppercase">{item.size}</td>
                            <td className="py-2 text-center font-mono">{item.quantity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

    //Accordion 3: Uniform specifications 
              <div className="glass-panel rounded-xl overflow-hidden">
                <button
                  onClick={() => setShowDesign(!showDesign)}
                  className="w-full px-4 py-3 bg-brand-dark/20 flex justify-between items-center hover:bg-brand-dark/45 border-b border-brand-border/40 font-bold uppercase tracking-wider text-[10px] text-brand-primary cursor-pointer"
                >
                  <span className="flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    3D Customizer Specifications
                  </span>
                  {showDesign ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {showDesign && (
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
    // Zones & Colors 
                    <div className="space-y-3">
                      <h4 className="font-bold text-[#e2e8f0] uppercase tracking-wider text-[10px] border-b border-brand-border/40 pb-1 flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-brand-primary" />
                        Color Mapping
                      </h4>
                      <div className="space-y-2">
                        {selectedOrder.designDetails?.colors ? (
                          Object.entries(selectedOrder.designDetails.colors).map(([zone, hex]) => (
                            <div key={zone} className="flex justify-between items-center bg-brand-dark/15 border border-brand-border/40 px-3 py-1.5 rounded-lg">
                              <span className="text-[10px] font-bold text-brand-text/75 uppercase">{zone}</span>
                              <div className="flex items-center gap-2">
                                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: hex }} />
                                <span className="font-mono text-[10px] uppercase font-bold text-white">{hex}</span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <span className="italic text-brand-text/30">N/A</span>
                        )}
                      </div>
                    </div>

                    // Logo/Text specifics 
                    <div className="space-y-4">
                      {/* Fabric pattern */}
                      <div className="space-y-1">
                        <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold">Sublimation Pattern</span>
                        <span className="font-bold text-white bg-brand-primary/10 border border-brand-primary/20 px-2 py-0.5 rounded uppercase font-mono text-[10px] inline-block">
                          {selectedOrder.designDetails?.pattern || 'solid'}
                        </span>
                      </div>

                      // Letter overlays 
                      <div className="space-y-2">
                        <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold">Letter overlays</span>
                        <div className="grid grid-cols-2 gap-3 bg-brand-dark/15 border border-brand-border/40 p-2.5 rounded-lg">
                          <div>
                            <span className="text-[8px] text-brand-text/40 uppercase block mb-0.5">Team Name</span>
                            <span className="font-bold text-white uppercase truncate block">
                              "{selectedOrder.designDetails?.customText || 'N/A'}"
                            </span>
                          </div>
                          <div>
                            <span className="text-[8px] text-brand-text/40 uppercase block mb-0.5">Mock Number</span>
                            <span className="font-mono font-bold text-brand-accent block">
                              {selectedOrder.designDetails?.textNumber || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>

                      //Team Logo image
                      <div className="space-y-1.5">
                        <span className="text-[9px] uppercase tracking-wider text-brand-text/50 block font-semibold">Sublimated Team Logo</span>
                        {selectedOrder.designDetails?.logoUrl ? (
                          <div className="flex items-center gap-3.5 bg-brand-dark/15 border border-brand-border/40 p-2.5 rounded-lg">
                            <img 
                              src={selectedOrder.designDetails.logoUrl} 
                              alt="Logo" 
                              className="w-10 h-10 object-contain rounded border border-brand-border bg-white" 
                            />
                            <a 
                              href={selectedOrder.designDetails.logoUrl} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-[10px] text-brand-primary hover:underline uppercase tracking-wide font-extrabold"
                            >
                              Open Full Image
                            </a>
                          </div>
                        ) : (
                          <div className="italic text-brand-text/40 py-1 font-semibold text-[10px]">
                            No Team Logo Uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          // Bottom Status workflow updater
            <form 
              onSubmit={handleSaveStatus}
              className="p-5 bg-brand-dark/30 border-t border-brand-border/60 grid grid-cols-1 md:grid-cols-3 gap-4 items-center flex-shrink-0"
            >
              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] uppercase tracking-widest text-brand-text/50 font-extrabold flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-brand-primary" />
                  Blueprint Status
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full bg-brand-dark border border-brand-border hover:border-brand-primary rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-brand-primary cursor-pointer transition-all uppercase"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Approved">Approved Blueprint</option>
                  <option value="Shipped">Shipped Order</option>
                  <option value="Cancelled">Cancelled Request</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2 relative">
                <label className="text-[9px] uppercase tracking-widest text-brand-text/50 font-extrabold">Admin instructions / Comments</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="ENTER BLUEPRINT VERIFICATION NOTES OR FABRICATION SPECS..."
                    className="flex-grow glass-input text-xs uppercase"
                  />
                  <button
                    type="submit"
                    disabled={saving}
                    className="glass-btn-primary px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? 'SAVING...' : 'SAVE'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center border border-brand-border/60 bg-brand-card/30 rounded-2xl text-center p-6 text-brand-text/40">
            <Eye className="w-12 h-12 mb-3 text-brand-border animate-pulse" />
            <h4 className="font-bold uppercase tracking-wider text-xs text-white">Select Quote from Directory</h4>
            <p className="text-[10px] tracking-wide mt-1 max-w-[260px] leading-relaxed">
              Click on any team uniform request in the database directory to inspect custom parameters, colors, and rosters.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
