import React from 'react';
import { Home, Search, Library, Settings, Bell } from 'lucide-react';
import { AeroXLogo } from '../common/AeroXLogo';

interface MobileNavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 h-14 bg-[#0c0c0f]/95 backdrop-blur-md border-t border-white/[0.08] z-40 px-3 flex items-center justify-around select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${
              isActive ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'text-purple-400' : 'text-zinc-400'}`} />
            <span className={`text-[10px] tracking-tight ${isActive ? 'font-semibold text-white' : 'font-normal'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export const MobileHeader: React.FC<{
  onNavigate: (view: string) => void;
  onOpenProfile?: () => void;
  userAvatar?: string;
}> = ({ onNavigate, onOpenProfile, userAvatar }) => {
  return (
    <header className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0c0c0f]/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
      {/* Left: AeroX Logo */}
      <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer group">
        <AeroXLogo size="sm" />
        <span className="font-semibold text-base tracking-tight text-white">
          AeroX
        </span>
      </div>

      {/* Right: Search Shortcut & Notifications & Profile Avatar */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate('search')}
          title="Search"
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          title="Notifications"
          className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenProfile}
          title="User Profile"
          className="w-7 h-7 rounded-full overflow-hidden border border-white/20 active:scale-95 transition-transform"
        >
          <img
            src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
