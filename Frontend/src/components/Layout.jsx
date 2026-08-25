import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import EmergencyModal from './EmergencyModal';

export default function Layout() {
  const [sosOpen, setSosOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] text-stone-900">
      <Navbar onOpenSOS={() => setSosOpen(true)} />

      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-6 px-4 sm:px-6 lg:px-8 py-6">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet context={{ onOpenSOS: () => setSosOpen(true) }} />
        </main>
      </div>

      <Footer />
      <EmergencyModal isOpen={sosOpen} onClose={() => setSosOpen(false)} />
    </div>
  );
}
