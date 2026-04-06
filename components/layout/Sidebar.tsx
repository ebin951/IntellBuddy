
import React, { memo } from 'react';
import type { View } from '../../types';
import { NAV_ITEMS } from '../../constants';
import { useAppStore } from '../../store/useAppStore';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AcademicCapIcon = ({ className = 'w-6 h-6' }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.627 48.627 0 0 1 12 20.904a48.627 48.627 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.57 50.57 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
    </svg>
);

const Sidebar: React.FC<SidebarProps> = memo(({ sidebarOpen, setSidebarOpen }) => {
  const { activeView, setActiveView, user, logout } = useAppStore(); // Re-added logout
  const userName = user?.username || 'Guest';

  const handleNavClick = (view: View) => {
    setActiveView(view);
    setSidebarOpen(false);
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`fixed lg:relative inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 w-72 bg-secondary border-r border-white/5 flex-shrink-0 flex flex-col z-50 transition-all duration-500 ease-in-out shadow-2xl`}>
        <div className="flex flex-col px-8 pt-10 pb-6">
            <div className="flex items-center mb-2">
                <div className="bg-brand p-2 rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                    <AcademicCapIcon className="h-6 w-6 text-primary" />
                </div>
                <h1 className="text-xl font-black ml-3 tracking-tighter text-white leading-tight uppercase italic">STUDENT</h1>
            </div>
            <p className="text-[10px] font-black text-brand tracking-[0.4em] uppercase opacity-70">Assistant v3.0</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href="#"
              onClick={(e) => { e.preventDefault(); handleNavClick(item.name); }}
              className={`group flex items-center px-4 py-2.5 rounded-xl transition-all duration-300 ${
                activeView === item.name
                  ? 'bg-brand/10 text-brand font-bold shadow-[0_0_15px_rgba(56,189,248,0.05)] border border-brand/20'
                  : 'text-text-secondary hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${activeView === item.name ? 'scale-110' : 'group-hover:scale-110'}`} />
              <span className="text-[10px] tracking-wider uppercase font-black">{item.name}</span>
            </a>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5 bg-primary/30">
            {/* Logout button restored */}
            <button onClick={logout} className="w-full flex items-center p-3 rounded-xl transition-all duration-300 hover:bg-white/5 group">
                <img className="h-9 w-9 rounded-lg ring-1 ring-white/10" src={`https://api.dicebear.com/8.x/initials/svg?seed=${userName}`} alt="Avatar" />
                <div className="ml-3 text-left">
                    <p className="text-[10px] font-black text-white tracking-tight leading-none mb-1">{userName.toUpperCase()}</p>
                    <p className="text-[8px] text-brand uppercase tracking-widest font-black opacity-80">Disconnect</p>
                </div>
            </button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;