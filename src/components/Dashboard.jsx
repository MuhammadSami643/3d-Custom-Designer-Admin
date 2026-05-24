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
          axios.get(`${API_URL}/admin/orders`, {
            timeout: 10000
          }),

          axios.get(`${API_URL}/products`, {
            timeout: 10000
          })
        ]);

        console.log('Orders API Response:', ordersRes.data);
        console.log('Products API Response:', productsRes.data);

        setOrders(
          Array.isArray(ordersRes.data)
            ? ordersRes.data
            : []
        );

        setProducts(
          Array.isArray(productsRes.data)
            ? productsRes.data
            : []
        );

      } catch (err) {

        console.error('Dashboard API Error:', err);
        if (err.response) {

          console.log('Backend Response Error:');
          console.log(err.response.status);
          console.log(err.response.data);

        } else if (err.request) {

          console.log('No response received from backend server.');

        } else {

          console.log('Axios Error:', err.message);

        }
        setOrders([]);
        setProducts([]);

      } finally {

        setLoading(false);

      }

    };

    fetchDashboardData();

  }, []);

  const safeOrders = Array.isArray(orders)
    ? orders
    : [];

  const safeProducts = Array.isArray(products)
    ? products
    : [];

{  /*DashBoard Stats*/}
  const totalOrders = safeOrders.length;

  const pendingOrders = safeOrders.filter(
    order =>
      !order?.status ||
      order.status === 'Pending Review'
  ).length;

  const approvedOrders = safeOrders.filter(
    order =>
      order?.status === 'Approved'
  ).length;

  const totalRevenue = safeOrders.reduce((acc, order) => {

    if (!order) return acc;

    if (order.status === 'Cancelled') {
      return acc;
    }

    const rosterQty = order.roster?.reduce(
      (sum, item) =>
        sum + (Number(item?.quantity) || 0),
      0
    ) || 0;

    const basePrice =
      order.designDetails?.productType === 'cap'
        ? 24.99
        : 59.99;

    const logoFee =
      order.designDetails?.logoUrl
        ? 10
        : 0;

    const customTextFee =
      order.designDetails?.customText
        ? 5
        : 0;

    const unitPrice =
      basePrice +
      logoFee +
      customTextFee;

    const orderTotal =
      (unitPrice * rosterQty) +
      (rosterQty > 0 ? 15 : 0);

    return acc + orderTotal;

  }, 0);

{/*Stats Config*/}
  const stats = [
    {
      label: 'ESTIMATED REVENUE',
      value: `$${totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color:
        'text-brand-accent bg-brand-accent/15 border-brand-accent/30',
      description: 'Revenue generated from orders'
    },
    {
      label: 'TOTAL QUOTE REQUESTS',
      value: totalOrders,
      icon: ListOrdered,
      color:
        'text-brand-primary bg-brand-primary/15 border-brand-primary/30',
      description: 'Total submitted orders'
    },
    {
      label: 'PENDING REVIEWS',
      value: pendingOrders,
      icon: Clock,
      color:
        'text-amber-400 bg-amber-400/15 border-amber-400/30',
      description: 'Orders waiting approval'
    },
    {
      label: 'APPROVED ORDERS',
      value: approvedOrders,
      icon: CheckCircle,
      color:
        'text-emerald-400 bg-emerald-400/15 border-emerald-400/30',
      description: 'Production ready orders'
    }
  ];

  if (loading) {

    return (
      <div className="flex items-center justify-center h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
      </div>
    );
  }
  return (

    <div className="space-y-8 animate-fade-in select-none">

{/*Header*/}

      <div>

        <h2 className="text-xl font-bold tracking-wider text-white uppercase">
          WORKSPACE METRICS
        </h2>

        <p className="text-xs text-brand-text/70 mt-1">
          Live database statistics
        </p>

      </div>

{/*Stats*/}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {stats.map((stat, idx) => {

          const Icon = stat.icon;

          return (

            <div
              key={idx}
              className="glass-panel p-6 rounded-2xl flex flex-col justify-between"
            >

              <div className="flex justify-between items-start">

                <div>

                  <div className="text-[10px] uppercase text-brand-text/50">
                    {stat.label}
                  </div>

                  <div className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </div>

                </div>

                <div className={`p-2 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

              </div>

              <div className="text-[10px] text-brand-text/50 mt-4">
                {stat.description}
              </div>

            </div>

          );

        })}

      </div>

{/*Main Grid*/}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT ORDERS */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl h-[400px] overflow-hidden">

          <div className="flex justify-between items-center mb-4 border-b border-brand-border/30 pb-3">

            <h4 className="text-xs font-bold text-white uppercase">
              Recent Orders
            </h4>

            <button
              onClick={() => onNavigate?.('orders')}
              className="text-[10px] text-brand-primary uppercase"
            >
              View All
            </button>

          </div>

          <div className="overflow-y-auto h-[320px] space-y-3 pr-2">

            {safeOrders.length === 0 ? (

              <div className="text-xs text-brand-text/50">
                No orders found in database.
              </div>

            ) : (

              safeOrders.slice(0, 5).map((order) => (

                <div
                  key={order._id}
                  className="flex justify-between items-start p-3 rounded-xl bg-brand-dark/20 border border-brand-border/30"
                >

                  <div>

                    <div className="text-xs font-bold text-white uppercase">
                      {order.contactDetails?.teamName || 'Unknown Team'}
                    </div>

                    <div className="text-[10px] text-brand-text/50 mt-1">
                      {order.contactDetails?.name || 'Unknown User'}
                    </div>

                  </div>

                  <div className="text-right">

                    <div className="text-xs text-white">

                      {
                        order.roster?.reduce(
                          (sum, item) =>
                            sum + (Number(item?.quantity) || 0),
                          0
                        ) || 0
                      } items

                    </div>

                    <div className="text-[10px] text-brand-text/50 mt-1">

                      {
                        order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString()
                          : 'N/A'
                      }

                    </div>

                    <div
                      className={`text-[9px] uppercase mt-1 ${
                        order.status === 'Approved'
                          ? 'text-emerald-400'
                          : order.status === 'Cancelled'
                          ? 'text-red-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {order.status || 'Pending'}
                    </div>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

{/*Products*/}


        <div className="glass-panel p-6 rounded-2xl h-[400px] overflow-hidden">

          <div className="flex justify-between items-center mb-4 border-b border-brand-border/30 pb-3">

            <h4 className="text-xs font-bold text-white uppercase">
              Products
            </h4>

            <button
              onClick={() => onNavigate?.('products')}
              className="text-[10px] text-brand-primary uppercase"
            >
              Edit
            </button>

          </div>

          <div className="overflow-y-auto h-[320px] space-y-3 pr-2">

            {safeProducts.length === 0 ? (

              <div className="text-xs text-brand-text/50">
                No products found.
              </div>

            ) : (

              safeProducts.map((product) => (

                <div
                  key={product.id || product._id}
                  className="p-3 rounded-xl bg-brand-dark/20 border border-brand-border/30"
                >

                  <div className="text-xs text-white font-bold uppercase">
                    {product.name}
                  </div>

                  <div className="text-[10px] text-brand-text/50 mt-1">
                    Category: {product.category}
                  </div>

                  <div className="text-sm text-brand-primary mt-2 font-bold">
                    ${Number(product.basePrice || 0).toFixed(2)}
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