import React from 'react';
import { Radio, Bell } from 'lucide-react';
import { AeroXLogo } from '../common/AeroXLogo';
import { NavSquircleIcon, NavIconType } from '../common/NavSquircleIcon';

interface MobileNavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export const MobileNavbar: React.FC<MobileNavbarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'search', label: 'Search' },
    { id: 'library', label: 'Library' },
    { id: 'settings', label: 'Settings' },
  ];

  return (
    <nav
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#09090b]/95 backdrop-blur-xl border-t border-white/10 z-40 px-4 flex items-center justify-around select-none"
    >
      {navItems.map(item => {
        const isActive = currentView === item.id;
        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl transition-all ${
              isActive ? 'text-purple-300 font-semibold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <NavSquircleIcon
              type={item.id as NavIconType}
              size="sm"
              isActive={isActive}
            />
            <span className="text-[10px] tracking-tight">{item.label}</span>
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
    <header className="md:hidden flex items-center justify-between px-5 py-3.5 bg-black/90 backdrop-blur-md border-b border-white/[0.06] sticky top-0 z-30">
      {/* Left: AeroX Logo */}
      <div onClick={() => onNavigate('home')} className="flex items-center gap-2 cursor-pointer group">
        <AeroXLogo size="sm" />
        <span className="font-semibold text-base tracking-tight text-white">
          AeroX
        </span>
      </div>

      {/* Right: Notification Bell & Profile Avatar */}
      <div className="flex items-center gap-3">
        <button
          title="Notifications"
          className="w-9 h-9 rounded-full flex items-center justify-center text-zinc-300 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Bell className="w-5 h-5" />
        </button>
        <button
          onClick={onOpenProfile}
          title="User Profile"
          className="w-8 h-8 rounded-full overflow-hidden border border-white/20 ring-2 ring-purple-500/20 active:scale-95 transition-transform"
        >
          <img
            src={userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
            alt="Profile"
            className="w-full h-full object-cover grayscale"
          />
        </button>
      </div>
    </header>
  );
};

