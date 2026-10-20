import React from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Settings,
  Plus,
  Compass,
  Music2,
} from 'lucide-react';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { AeroXLogo } from '../common/AeroXLogo';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentUser } = useAuthAndStorage();
  const { openModal } = useMusicPlayer();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search & Explore', icon: Search },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-60 lg:w-64 h-screen bg-[#0c0c0f] border-r border-white/[0.06] p-4 flex-shrink-0 z-30 select-none justify-between"
    >
      {/* Top Branding & Main Navigation */}
      <div className="space-y-6">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group px-2 pt-1"
        >
          <AeroXLogo size="md" />
          <span className="font-semibold text-base tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            AeroX
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-white/[0.08] text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.03]'
                }`}
              >
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-purple-400' : 'text-zinc-400'
                  }`}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Liked Songs Button */}
        <div>
          <button
            onClick={() => onNavigate('library')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-zinc-300 hover:text-white hover:bg-white/[0.03] transition-colors group"
          >
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white flex-shrink-0">
              <Heart className="w-3.5 h-3.5 fill-white" />
            </div>
            <span className="truncate flex-1 text-left">Liked Songs</span>
            <span className="text-xs text-zinc-500 font-mono">
              {currentUser.favorites.length}
            </span>
          </button>
        </div>

        {/* User Playlists in Sidebar */}
        <div className="space-y-2 pt-2 border-t border-white/[0.06]">
          <div className="flex items-center justify-between px-3">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
              Playlists
            </span>
            <button
              onClick={() => openModal('create-playlist')}
              title="Create Playlist"
              className="p-1 rounded-md hover:bg-white/[0.06] text-zinc-400 hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-0.5 max-h-56 overflow-y-auto no-scrollbar px-1">
            {currentUser.playlists.length === 0 ? (
              <p className="text-xs text-zinc-400 px-2 py-1">No playlists yet</p>
            ) : (
              currentUser.playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => onNavigate('playlist', { id: pl.id })}
                  className="w-full text-left px-2.5 py-1.5 rounded-md text-xs text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors truncate block"
                >
                  {pl.title}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom User Profile Section */}
      <div className="pt-3 border-t border-white/[0.06] mt-auto">
        <button
          onClick={() => openModal('profile')}
          title="Open User Profile"
          className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all text-left group cursor-pointer"
        >
          <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/10 flex-shrink-0 bg-zinc-800">
            <img
              src={
                currentUser.avatar ||
                'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
              }
              alt={currentUser.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                {currentUser.name}
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 truncate">
              Lossless Audio
            </p>
          </div>
        </button>
      </div>
    </aside>
  );
};
