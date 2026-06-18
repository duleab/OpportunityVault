import { useState, useEffect } from 'react';

import { Outlet, Navigate, useNavigate } from 'react-router-dom';

import { Sidebar } from './Sidebar';

import { TopBar } from './TopBar';

import { useAuthStore } from '../../store/authStore';



const titles: Record<string, string> = {

  '/dashboard': 'Dashboard',

  '/opportunities': 'Opportunities',

  '/add': 'Add Opportunity',

  '/settings': 'Settings',

};



export function AppShell() {

  const [mobileOpen, setMobileOpen] = useState(false);

  const [authReady, setAuthReady] = useState(false);

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const refresh = useAuthStore((s) => s.refresh);

  const navigate = useNavigate();

  const path = window.location.pathname;

  const title = Object.entries(titles).find(([k]) => path.startsWith(k))?.[1] ?? 'OpportunityVault';



  useEffect(() => {

    let active = true;

    void refresh().finally(() => {

      if (active) setAuthReady(true);

    });

    return () => {

      active = false;

    };

  }, [refresh]);



  useEffect(() => {

    const handler = (e: KeyboardEvent) => {

      if (e.ctrlKey && e.key === 'n') {

        e.preventDefault();

        navigate('/add');

      }

    };

    window.addEventListener('keydown', handler);

    return () => window.removeEventListener('keydown', handler);

  }, [navigate]);



  if (!authReady) {

    return (

      <div className="flex min-h-screen items-center justify-center bg-base text-gray-400">

        Loading...

      </div>

    );

  }



  if (!isAuthenticated) return <Navigate to="/login" replace />;



  return (

    <div className="flex min-h-screen bg-base">

      <Sidebar />

      {mobileOpen && (

        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setMobileOpen(false)}>

          <div className="absolute inset-y-0 left-0 w-64 bg-surface" onClick={(e) => e.stopPropagation()}>

            <Sidebar />

          </div>

        </div>

      )}

      <div className="flex flex-1 flex-col">

        <TopBar title={title} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1 overflow-auto p-4 md:p-8">

          <Outlet />

        </main>

      </div>

    </div>

  );

}

