import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Shield, LayoutDashboard, ClipboardList, Package, LogOut, Loader2, Sparkles, Users, Shirt } from 'lucide-react';
import AdminAuth from './components/AdminAuth';
import Dashboard from './components/Dashboard';
import OrdersManager from './components/OrdersManagers';
import ProductsManager from './components/ProductsManager';
import UsersManager from './components/UserManagement';
import DesignsManager from './components/DesignManager';

const API_URL = 'http://localhost:3000/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'orders', 'products', 'users', 'designs'
  
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [designs, setDesigns] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

{  /* Auto-authenticate if previously logged in (mock session storage)*/}  
useEffect(() => {
    const isAuth = sessionStorage.getItem('admin_authenticated') === 'true';
    if (isAuth) {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, productsRes, usersRes, designsRes] = await Promise.all([
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
        console.warn('API error fetching admin metrics. Using offline data mockup:', err);
        setOrders([
          {
            _id: 'ORDER_882910',
            createdAt: new Date(Date.now() - 3600000),
            status: 'Pending Review',
            contactDetails: {
              name: 'Coach Vance',
              email: 'coach.vance@whales.com',
              phone: '(555) 303-1289',
              teamName: 'Whales Varsity',
              notes: 'Require matching outline embroidery on Cap Visors.'
            },
            designDetails: {
              productType: 'jersey',
              colors: { body: '#0f172a', sleeves: '#3b82f6', collar: '#06b6d4' },
              pattern: 'camo',
              customText: 'WHALES',
              textNumber: '10',
              textColor: '#ffffff',
              textFont: 'varsity'
            },
            roster: [
              { name: 'VANCE', number: '10', size: 'XL', quantity: 2 },
              { name: 'MILLER', number: '24', size: 'L', quantity: 12 }
            ]
          },
          {
            _id: 'ORDER_110904',
            createdAt: new Date(Date.now() - 86400000),
            status: 'Approved',
            contactDetails: {
              name: 'Coach Sarah',
              email: 'sarah.t@panthers.com',
              phone: '(555) 902-8823',
              teamName: 'Mighty Panthers',
              notes: 'Use sublimation patterns for letters.'
            },
            designDetails: {
              productType: 'jersey',
              colors: { body: '#BE123C', sleeves: '#111827', collar: '#F59E0B' },
              pattern: 'vertical-stripes',
              customText: 'PANTHERS',
              textNumber: '99',
              textColor: '#FFFFFF',
              textFont: 'varsity'
            },
            roster: [
              { name: 'JONES', number: '99', size: 'M', quantity: 15 },
              { name: 'SMITH', number: '07', size: 'S', quantity: 1 }
            ]
          }
        ]);
        setProducts([
          {
            id: 'jersey',
            name: 'JUICE Sublimated Jersey',
            category: 'jerseys',
            basePrice: 59.99,
            zones: [
              { id: 'body', name: 'Body Panel' },
              { id: 'sleeves', name: 'Sleeves' },
              { id: 'collar', name: 'Collar & Trim' }
            ],
            defaultColors: { body: '#1E3A8A', sleeves: '#BE123C', collar: '#F59E0B' }
          },
          {
            id: 'cap',
            name: 'Pro-Stitch Baseball Cap',
            category: 'caps',
            basePrice: 24.99,
            zones: [
              { id: 'crown', name: 'Crown Panels' },
              { id: 'visor', name: 'Visor / Brim' },
              { id: 'button', name: 'Top Button' },
              { id: 'eyelets', name: 'Eyelets' }
            ],
            defaultColors: { crown: '#1E3A8A', visor: '#BE123C', button: '#111827', eyelets: '#F59E0B' }
          }
        ]);
        setUsers([
          { _id: 'mem_user_1', username: 'coach_smith', email: 'smith@highschool.edu', createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000) },
          { _id: 'mem_user_2', username: 'coach_sarah', email: 'sarah.t@panthers.com', createdAt: new Date(Date.now() - 10 * 24 * 3600 * 1000) }
        ]);
        setDesigns([
          { 
            _id: 'mem_design_1', 
            name: 'Blue Panthers V1', 
            productType: 'jersey', 
            user: { username: 'coach_sarah', email: 'sarah.t@panthers.com' }, 
            colors: { body: '#BE123C', sleeves: '#111827', collar: '#F59E0B' }, 
            pattern: 'vertical-stripes', 
            customText: 'PANTHERS', 
            textNumber: '99', 
            textFont: 'varsity', 
            createdAt: new Date(Date.now() - 5 * 24 * 3600 * 1000) 
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, refreshTrigger]);

  const handleAuthenticate = (status) => {
    setIsAuthenticated(status);
    if (status) {
      sessionStorage.setItem('admin_authenticated', 'true');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
  };

  const handleUpdateOrderStatus = async (orderId, updates) => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}`, updates);
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.warn('API update failed. Updating in local state array (Offline mockup):', err);
      setOrders(prev => prev.map(o => 
        o._id === orderId 
          ? { ...o, status: updates.status, contactDetails: { ...o.contactDetails, notes: updates.adminNotes } } 
          : o
      ));
    }
  };

  const handleUpdateProductPrice = async (productId, newPrice) => {
    try {
      await axios.put(`${API_URL}/products/${productId}`, { basePrice: newPrice });
      setRefreshTrigger(prev => prev + 1);
    } catch (err) {
      console.warn('API price update failed. Updating in local state array (Offline mockup):', err);
      setProducts(prev => prev.map(p => 
        p.id === productId ? { ...p, basePrice: newPrice } : p
      ));
    }
  };

  if (!isAuthenticated) {
    return <AdminAuth onAuthenticate={handleAuthenticate} />;
  }

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex-grow:1 flex flex-col items-center justify-center text-xs tracking-widest text-brand-primary/80 uppercase">
          <Loader2 className="w-10 h-10 animate-spin mb-3 text-brand-primary" />
          <span>Syncing Database logs...</span>
        </div>
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            orders={orders} 
            products={products} 
            onNavigate={(tab) => setActiveTab(tab)} 
          />
        );
      case 'orders':
        return (
          <OrdersManager 
            orders={orders} 
            onUpdateStatus={handleUpdateOrderStatus} 
          />
        );
      case 'products':
        return (
          <ProductsManager 
            products={products} 
            onUpdatePrice={handleUpdateProductPrice} 
          />
        );
      case 'users':
        return (
          <UsersManager 
            users={users} 
          />
        );
      case 'designs':
        return (
          <DesignsManager 
            designs={designs} 
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col text-brand-text">
    
   {/* Top Navigation Header Bar */}
      <header className="h-16 bg-brand-card/70 border-b border-brand-border/60 backdrop-blur-md flex items-center justify-between px-6 z-40 select-none">
        
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

{    /* Tab switcher */}
        <div className="flex bg-brand-dark/40 border border-brand-border/60 rounded-xl p-0.5 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
            { id: 'orders', label: 'Orders', icon: ClipboardList },
            { id: 'products', label: 'Catalogue', icon: Package },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'designs', label: 'Designs', icon: Shirt }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

    {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 hover:border-red-500/50 bg-red-500/5 hover:bg-red-500/15 text-red-400 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Exit Workspace</span>
        </button>

      </header>

     {/* Main Page Container */} 
      <main className="flex-grow:1 p-6 overflow-y-auto">
        {renderActiveTab()}
      </main>
    </div>
  );
}
