import React from 'react';
import Navbar from '../ui/Navbar';
import Sidebar from '../ui/Sidebar';
import BottomNav from '../ui/BottomNav';

export default function MainLayout({ children, showSidebar = true }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <main className={`main-content ${showSidebar ? 'with-sidebar' : ''}`}>
          {children}
        </main>
      </div>
      <BottomNav />

      <style>{`
        .app-layout {
          min-height: 100vh;
          background: var(--bg-void);
        }
        
        .main-content {
          flex: 1;
          padding: 80px 0; /* space for fixed navbar */
          min-height: 100vh;
          transition: all 0.3s;
        }
        
        .main-content.with-sidebar {
          margin-left: 240px;
        }

        @media (max-width: 1024px) {
          .main-content.with-sidebar {
            margin-left: 80px;
          }
        }

        @media (max-width: 768px) {
          .main-content.with-sidebar {
            margin-left: 0;
            padding-bottom: 80px; /* space for bottom nav */
          }
        }
      `}</style>
    </div>
  );
}
