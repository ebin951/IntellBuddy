
import React, { useState, memo } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotificationPanel from './NotificationPanel';
import FloatingChat from './FloatingChat';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = memo(({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <div className="flex h-screen bg-secondary">
      <Sidebar 
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar 
            setSidebarOpen={setSidebarOpen} 
            onToggleNotifications={() => setNotificationsOpen(prev => !prev)}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-primary">
            {children}
        </main>
        {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
        
        {/* Floating Assistant Assistant */}
        <FloatingChat />
      </div>
    </div>
  );
});

Layout.displayName = 'Layout';
