import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  DollarSign,
  ListOrdered,
  Clock,
  CheckCircle,
  Loader2
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = 'http://localhost:3000/api';

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/admin/orders`, { timeout: 10000 }),
          axios.get(`${API_URL}/products`, { timeout: 10000 })
        ]);

        setOrders(Array.isArray(ordersRes.data) ? ordersRes.data : []);
        setProducts(Array.isArray(productsRes.data) ? productsRes.data : []);

      } catch (err) {
        console.error('Dashboard API Error:', err);
        setOrders([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const safeOrders = Array.isArray(orders) ? orders : [];
  const safeProducts = Array.isArray(products) ? products : [];

  const totalOrders = safeOrders.length;

  const pendingOrders = safeOrders.filter(
    (o) => !o?.status || o.status === 'Pending Review'
  ).length;

  const approvedOrders = safeOrders.filter(
    (o) => o?.status === 'Approved'
  ).length;

  const totalRevenue = safeOrders.reduce((acc, order) => {
    if (!order || order.status === 'Cancelled') return acc;

    const rosterQty =
      order.roster?.reduce((s, i) => s + (Number(i?.quantity) || 0), 0) || 0;

    const basePrice =
      order.designDetails?.productType === 'cap' ? 24.99 : 59.99;

    const logoFee = order.designDetails?.logoUrl ? 10 : 0;
    const textFee = order.designDetails?.customText ? 5 : 0;

    const unitPrice = basePrice + logoFee + textFee;

    const orderTotal = unitPrice * rosterQty + (rosterQty > 0 ? 15 : 0);

    return acc + orderTotal;
  }, 0);

  const stats = [
    {
      label: 'REVENUE',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-brand-accent bg-brand-accent/15 border-brand-accent/30'
    },
    {
      label: 'ORDERS',
      value: totalOrders,
      icon: ListOrdered,
      color: 'text-brand-primary bg-brand-primary/15 border-brand-primary/30'
    },
    {
      label: 'PENDING',
      value: pendingOrders,
      icon: Clock,
      color: 'text-amber-400 bg-amber-400/15 border-amber-400/30'
    },
    {
      label: 'APPROVED',
      value: approvedOrders,
      icon: CheckCircle,
      color: 'text-emerald-400 bg-emerald-400/15 border-emerald-400/30'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">

      {/* HEADER */}
      <div>
        <h2 className="text-base sm:text-xl font-bold uppercase text-white">
          Workspace Metrics
        </h2>
        <p className="text-xs text-brand-text/60">
          Live database statistics
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">

        {stats.map((stat, i) => {
          const Icon = stat.icon;

          return (
            <div key={i} className="glass-panel p-4 sm:p-6 rounded-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] text-brand-text/50 uppercase">
                    {stat.label}
                  </div>
                  <div className="text-lg sm:text-2xl font-bold text-white">
                    {stat.value}
                  </div>
                </div>

                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-4 sm:w-5 h-4 sm:h-5" />
                </div>
              </div>
            </div>
          );
        })}

      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ORDERS */}
        <div className="lg:col-span-2 glass-panel p-4 sm:p-6 rounded-2xl max-h-[55vh] flex flex-col">

          <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
            <h4 className="text-xs font-bold uppercase text-white">
              Recent Orders
            </h4>

            <button
              onClick={() => onNavigate?.('orders')}
              className="text-[10px] text-brand-primary uppercase"
            >
              View All
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-3">

            {safeOrders.length === 0 ? (
              <div className="text-xs text-brand-text/50">
                No orders found
              </div>
            ) : (
              safeOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="p-3 rounded-xl bg-brand-dark/20 border border-brand-border/30 flex flex-col sm:flex-row sm:justify-between gap-2"
                >
                  <div>
                    <div className="text-xs font-bold text-white uppercase">
                      {order.contactDetails?.teamName || 'Unknown'}
                    </div>
                    <div className="text-[10px] text-brand-text/50">
                      {order.contactDetails?.name}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-xs text-white">
                      {order.roster?.reduce((s, i) => s + (Number(i?.quantity) || 0), 0)} items
                    </div>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

        {/* PRODUCTS */}
        <div className="glass-panel p-4 sm:p-6 rounded-2xl max-h-[55vh] flex flex-col">

          <div className="flex justify-between items-center border-b border-brand-border/30 pb-2">
            <h4 className="text-xs font-bold uppercase text-white">
              Products
            </h4>

            <button
              onClick={() => onNavigate?.('products')}
              className="text-[10px] text-brand-primary uppercase"
            >
              Edit
            </button>
          </div>

          <div className="flex-1 overflow-y-auto mt-3 space-y-3">

            {safeProducts.length === 0 ? (
              <div className="text-xs text-brand-text/50">
                No products found
              </div>
            ) : (
              safeProducts.map((p) => (
                <div
                  key={p.id || p._id}
                  className="p-3 rounded-xl bg-brand-dark/20 border border-brand-border/30"
                >
                  <div className="text-xs text-white font-bold uppercase">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-brand-text/50">
                    {p.category}
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>
    </div>
  );
}