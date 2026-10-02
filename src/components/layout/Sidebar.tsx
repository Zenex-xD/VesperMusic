import React from 'react';
import {
  Home,
  Search,
  Library,
  Heart,
  Settings,
  Plus,
  Radio,
  Sparkles,
  Compass,
  Disc,
} from 'lucide-react';
import { useAuthAndStorage } from '../../context/AuthAndStorageContext';
import { useMusicPlayer } from '../../context/MusicPlayerContext';
import { AeroXLogo } from '../common/AeroXLogo';
import { NavSquircleIcon, NavIconType } from '../common/NavSquircleIcon';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string, params?: { id?: string }) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { currentUser } = useAuthAndStorage();
  const { openModal } = useMusicPlayer();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search & Explore', icon: Compass },
    { id: 'library', label: 'Your Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside
      id="desktop-sidebar"
      className="hidden md:flex flex-col w-64 lg:w-72 h-screen bg-black border-r border-white/[0.06] p-5 flex-shrink-0 z-30 select-none justify-between"
    >
      {/* Top Branding & Main Navigation */}
      <div className="space-y-7">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2.5 cursor-pointer group px-2"
        >
          <AeroXLogo size="md" />
          <span className="font-semibold text-[17px] tracking-tight text-white group-hover:text-zinc-200 transition-colors">
            AeroX
          </span>
        </div>

        {/* Main Navigation Links */}
        <nav className="space-y-1.5">
          {navItems.map(item => {
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-all group ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-200 border border-purple-500/30'
                    : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <NavSquircleIcon
                  type={item.id as NavIconType}
                  size="md"
                  isActive={isActive}
                />
                <span className={isActive ? 'text-white font-medium' : ''}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Quick Liked Songs Button */}
        <div className="pt-2">
          <button
            onClick={() => onNavigate('library')}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl bg-gradient-to-r from-pink-900/20 to-purple-900/20 border border-pink-500/20 hover:border-pink-500/40 text-pink-200 transition-all font-semibold text-sm group"
          >
            <div className="w-7 h-7 rounded-xl bg-pink-600/30 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
              <Heart className="w-4 h-4 fill-pink-500" />
            </div>
            <span className="truncate">Liked Songs</span>
            <span className="ml-auto text-xs text-pink-400 font-mono">
              {currentUser.favorites.length}
            </span>
          </button>
        </div>

        {/* User Playlists in Sidebar */}
        <div className="space-y-2 pt-2 border-t border-white/5">
          <div className="flex items-center justify-between px-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
              Playlists
            </span>
            <button
              onClick={() => openModal('create-playlist')}
              title="Create Playlist"
              className="p-1 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1 max-h-48 overflow-y-auto no-scrollbar">
            {currentUser.playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => onNavigate('playlist', { id: pl.id })}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-colors truncate block"
              >
                {pl.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
