import React, { useState, useEffect } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';

import axios from 'axios';

import {
  Shield,
  LayoutDashboard,
  ClipboardList,
  Package,
  LogOut,
  Loader2,
  Sparkles,
  Users,
  Shirt,
  MoreVertical
} from 'lucide-react';

import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import OrdersManager from './components/OrdersManagers';
import ProductsManager from './components/ProductsManager';
import UsersManager from './components/UserManagement';
import DesignsManager from './components/DesignManager';

const API_URL = 'http://localhost:3000/api';

/* ---------------- ADMIN LAYOUT ---------------- */

function AdminLayout({
  orders,
  products,
  users,
  designs,
  loading,
  onUpdateOrderStatus,
  onUpdateProductPrice,
  onLogout
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const currentPath = location.pathname;

  const tabs = [
    { id: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: '/orders', label: 'Orders', icon: ClipboardList },
    { id: '/products', label: 'Catalogue', icon: Package },
    { id: '/users', label: 'Users', icon: Users },
    { id: '/designs', label: 'Designs', icon: Shirt }
  ];

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-xs tracking-widest text-brand-primary/80 uppercase">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-brand-primary" />
          <span>Syncing Database Logs...</span>
        </div>
      );
    }

    switch (currentPath) {
      case '/dashboard':
        return (
          <Dashboard
            orders={orders}
            products={products}
            onNavigate={(route) => navigate(`/${route}`)}
          />
        );

      case '/orders':
        return <OrdersManager orders={orders} onUpdateStatus={onUpdateOrderStatus} />;

      case '/products':
        return <ProductsManager products={products} onUpdatePrice={onUpdateProductPrice} />;

      case '/users':
        return <UsersManager users={users} />;

      case '/designs':
        return <DesignsManager designs={designs} />;

      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col text-brand-text">

      {/* HEADER */}
      <header className="h-16 bg-brand-card/70 border-b border-brand-border/60 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 relative z-50">

        {/* LOGO */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary">
            <Shield className="w-4 h-4" />
          </div>

          <span className="font-extrabold text-white text-sm tracking-wider uppercase flex items-center gap-1.5">
            Admin Studio
            <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
          </span>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex bg-brand-dark/40 border border-brand-border/60 rounded-xl p-0.5 text-xs font-bold uppercase tracking-wider">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentPath === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg transition-all ${
                  isActive
                    ? 'bg-brand-primary text-white'
                    : 'text-brand-text/60 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LOGOUT (DESKTOP) */}
        <button
          onClick={onLogout}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 text-xs font-bold uppercase"
        >
          <LogOut className="w-3.5 h-3.5" />
          Exit
        </button>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="md:hidden p-2 rounded-lg hover:bg-brand-dark/40 transition"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>

        {/* BACKDROP */}
        <div
          onClick={() => setMenuOpen(false)}
          className={`
            fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200
            ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
          `}
        />

        {/* MOBILE DROPDOWN */}
       {/* MOBILE DROPDOWN (SOLID + CLEAN) */}
<div
  className={`
    absolute right-4 top-14 w-56
    bg-black
    border border-brand-border/60
    rounded-2xl shadow-2xl
    overflow-hidden z-50

    transform transition-all duration-200 origin-top-right
    ${menuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}
  `}
>

          {/* NAV ITEMS */}
          <div className="py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentPath === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    navigate(tab.id);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition ${
                    isActive
                      ? 'bg-brand-primary/10 text-white'
                      : 'text-brand-text/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* DIVIDER */}
          <div className="border-t border-brand-border/40" />

          {/* LOGOUT */}
          <button
            onClick={() => {
              setMenuOpen(false);
              onLogout();
            }}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

      </header>

      {/* MAIN */}
      <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
        {renderPage()}
      </main>

    </div>
  );
}

/* ---------------- PROTECTED ROUTE ---------------- */

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}

/* ---------------- APP ---------------- */

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [designs, setDesigns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchData = async () => {
      setLoading(true);

      try {
        const [ordersRes, productsRes, usersRes, designsRes] =
          await Promise.all([
            axios.get(`${API_URL}/orders`),
            axios.get(`${API_URL}/products`),
            axios.get(`${API_URL}/admin/users`),
            axios.get(`${API_URL}/admin/designs`)
          ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
        setDesigns(designsRes.data);
      } catch (err) {
        console.warn(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, refreshTrigger]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('admin_authenticated', 'true');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = '/login';
  };

  const handleUpdateOrderStatus = async (orderId, updates) => {
    await axios.put(`${API_URL}/orders/${orderId}`, updates);
    setRefreshTrigger((p) => p + 1);
  };

  const handleUpdateProductPrice = async (productId, newPrice) => {
    await axios.put(`${API_URL}/products/${productId}`, {
      basePrice: newPrice
    });
    setRefreshTrigger((p) => p + 1);
  };

  return (
    <Router>
      <Routes>

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" />
              : <AdminAuth onAuthenticate={handleAuthenticate} />
          }
        />

        <Route
          path="/*"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AdminLayout
                orders={orders}
                products={products}
                users={users}
                designs={designs}
                loading={loading}
                onUpdateOrderStatus={handleUpdateOrderStatus}
                onUpdateProductPrice={handleUpdateProductPrice}
                onLogout={handleLogout}
              />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}