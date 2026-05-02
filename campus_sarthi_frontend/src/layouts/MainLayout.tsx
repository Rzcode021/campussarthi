import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

export default function MainLayout() {
  return (
    <div className="flex bg-surface min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-64">
        <Topbar />
        <main className="pt-20 p-6 md:p-8 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
