import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProtectedRoute } from '@/lib/auth';
import { BgmProvider } from '@/lib/BgmContext';
import GlobalBgmWidget from '@/Components/GlobalBgmWidget';

export default function AuthenticatedLayout() {
  return (
    <ProtectedRoute>
      <BgmProvider>
        <GlobalBgmWidget />
        <Outlet />
      </BgmProvider>
    </ProtectedRoute>
  );
}
