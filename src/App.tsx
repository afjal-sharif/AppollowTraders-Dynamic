import { useState, useEffect, lazy, Suspense, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { setAuthErrorHandler } from './api';
import Layout from './components/Layout';

// Lazy load all pages for faster initial load
const HomePage = lazy(() => import('./pages/HomePage'));
const BanksPage = lazy(() => import('./pages/BanksPage'));
const VehiclesPage = lazy(() => import('./pages/VehiclesPage'));
const DocumentsPage = lazy(() => import('./pages/DocumentsPage'));
const AddBankPage = lazy(() => import('./pages/AddBankPage'));
const AddVehiclePage = lazy(() => import('./pages/AddVehiclePage'));
const AddDocumentPage = lazy(() => import('./pages/AddDocumentPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SuperAdminPage = lazy(() => import('./pages/SuperAdminPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const ExpiredPage = lazy(() => import('./pages/ExpiredPage'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-400 mt-3">লোড হচ্ছে...</p>
      </div>
    </div>
  );
}

export default function App() {
  const [authState, setAuthState] = useState<'checking' | 'login' | 'expired' | 'authenticated'>('checking');
  const [userRole, setUserRole] = useState<'none' | 'user' | 'admin' | 'superadmin'>('none');

  const handleLogout = useCallback(() => {
    setAuthState('login');
    setUserRole('none');
  }, []);

  useEffect(() => {
    // Set global auth error handler so API calls redirect to login on 401
    setAuthErrorHandler(handleLogout);
  }, [handleLogout]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Step 1: Check if user is logged in (has valid auth cookie)
      const authRes = await fetch('/api/check-auth', { 
        credentials: 'include',
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!authRes.ok) {
        setAuthState('login');
        return;
      }
      const authData = await authRes.json();
      if (!authData.loggedIn) {
        // NOT logged in — must show login page
        setAuthState('login');
        return;
      }

      // Store the user role
      setUserRole(authData.role as any);

      // Step 2: Check license status
      const licRes = await fetch('/api/license-info', { 
        credentials: 'include',
        cache: 'no-store'
      });
      if (licRes.ok) {
        const licData = await licRes.json();
        if (licData.status === 'EXPIRED') {
          setAuthState('expired');
          return;
        }
      }

      // All good - user is authenticated and license is valid
      setAuthState('authenticated');
    } catch {
      // If we can't reach the API at all, show login
      setAuthState('login');
    }
  };

  if (authState === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center text-white text-xl font-bold mx-auto mb-4 shadow-2xl">
            AT
          </div>
          <div className="w-8 h-8 border-3 border-white/20 border-t-white rounded-full animate-spin mx-auto mt-4" />
          <p className="text-blue-200/50 text-xs mt-3">লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (authState === 'expired') {
    return (
      <Suspense fallback={<PageLoader />}>
        <ExpiredPage />
      </Suspense>
    );
  }

  if (authState === 'login') {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage onLogin={() => {
          // Re-check auth to get the role
          checkAuth();
        }} />
      </Suspense>
    );
  }

  return (
    <BrowserRouter>
      <Layout userRole={userRole}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/banks" element={<BanksPage />} />
            <Route path="/vehicles" element={<VehiclesPage />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/add-bank" element={<AddBankPage />} />
            <Route path="/add-vehicle" element={<AddVehiclePage />} />
            <Route path="/add-document" element={<AddDocumentPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/super-admin" element={<SuperAdminPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
