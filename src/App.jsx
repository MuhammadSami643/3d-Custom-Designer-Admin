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
  Shirt
} from 'lucide-react';

import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import OrdersManager from './components/OrdersManagers';
import ProductsManager from './components/ProductsManager';
import UsersManager from './components/UserManagement';
import DesignsManager from './components/DesignManager';

const API_URL = 'http://localhost:3000/api';

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

  const currentPath = location.pathname;

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
        return (
          <OrdersManager
            orders={orders}
            onUpdateStatus={onUpdateOrderStatus}
          />
        );

      case '/products':
        return (
          <ProductsManager
            products={products}
            onUpdatePrice={onUpdateProductPrice}
          />
        );

      case '/users':
        return (
          <UsersManager users={users} />
        );

      case '/designs':
        return (
          <DesignsManager designs={designs} />
        );

      default:
        return <Navigate to="/dashboard" replace />;
    }
  };

  const tabs = [
    {
      id: '/dashboard',
      label: 'Overview',
      icon: LayoutDashboard
    },
    {
      id: '/orders',
      label: 'Orders',
      icon: ClipboardList
    },
    {
      id: '/products',
      label: 'Catalogue',
      icon: Package
    },
    {
      id: '/users',
      label: 'Users',
      icon: Users
    },
    {
      id: '/designs',
      label: 'Designs',
      icon: Shirt
    }
  ];

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col text-brand-text">

      {/* HEADER */}
      <header className="h-16 bg-brand-card/70 border-b border-brand-border/60 backdrop-blur-md flex items-center justify-between px-6 z-40 select-none">

        {/* LOGO */}
        <div className="flex items-center gap-2">

          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/30 text-brand-primary shadow shadow-brand-primary/10">
            <Shield className="w-4 h-4" />
          </div>

          <div>
            <span className="font-extrabold text-white text-sm tracking-wider uppercase flex items-center gap-1.5">
              Admin Studio
              <Sparkles className="w-3.5 h-3.5 text-brand-accent animate-pulse" />
            </span>
          </div>

        </div>

        {/* NAVIGATION */}
        <div className="flex bg-brand-dark/40 border border-brand-border/60 rounded-xl p-0.5 text-xs font-bold uppercase tracking-wider">

          {tabs.map((tab) => {
            const Icon = tab.icon;

            const isSelected = currentPath === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-brand-primary text-white shadow shadow-brand-primary/10'
                    : 'text-brand-text/60 hover:text-[#e2e8f0]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}

        </div>

        {/* LOGOUT */}
        <button
          onClick={onLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>

      </header>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-y-auto">
        {renderPage()}
      </main>

    </div>
  );
}

function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated
    ? children
    : <Navigate to="/login" replace />;
}

export default function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [designs, setDesigns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const isAuth =
      sessionStorage.getItem('admin_authenticated') === 'true';

    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {

    if (!isAuthenticated) return;

    const fetchData = async () => {

      setLoading(true);

      try {

        const [
          ordersRes,
          productsRes,
          usersRes,
          designsRes
        ] = await Promise.all([
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

        console.warn('API fetch failed:', err);

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
    try {

      await axios.put(
        `${API_URL}/orders/${orderId}`,
        updates
      );

      setRefreshTrigger((prev) => prev + 1);

    } catch (err) {

      console.warn(err);

    }
  };

  const handleUpdateProductPrice = async (
    productId,
    newPrice
  ) => {
    try {

      await axios.put(
        `${API_URL}/products/${productId}`,
        { basePrice: newPrice }
      );

      setRefreshTrigger((prev) => prev + 1);

    } catch (err) {

      console.warn(err);

    }
  };

  return (
    <Router>

      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/dashboard" replace />
              : <AdminAuth onAuthenticate={handleAuthenticate} />
          }
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
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

        {/* ORDERS */}
        <Route
          path="/orders"
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

        {/* PRODUCTS */}
        <Route
          path="/products"
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

        {/* USERS */}
        <Route
          path="/users"
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

        {/* DESIGNS */}
        <Route
          path="/designs"
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

        {/* DEFAULT */}
        <Route
          path="*"
          element={<Navigate to="/dashboard" replace />}
        />

      </Routes>

    </Router>
  );
}