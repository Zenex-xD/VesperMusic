import React, { useState, useEffect } from 'react';
import { AuthAndStorageProvider, useAuthAndStorage } from './context/AuthAndStorageContext';
import { MusicPlayerProvider, useMusicPlayer } from './context/MusicPlayerContext';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNavbar, MobileHeader } from './components/layout/MobileNavbar';
import { DesktopPlayerBar } from './components/player/DesktopPlayerBar';
import { MobileBottomPlayer } from './components/player/MobileBottomPlayer';
import { FullScreenPlayerModal } from './components/player/FullScreenPlayerModal';
import { LyricsDrawer } from './components/player/LyricsView';
import { QueueDrawer } from './components/player/QueueDrawer';
import { ModalsContainer } from './components/modals/Modals';

import { HomeView } from './views/HomeView';
import { SearchView } from './views/SearchView';
import { LibraryView } from './views/LibraryView';
import { PlaylistView } from './views/PlaylistView';
import { SettingsView } from './views/SettingsView';

const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<{ id?: string }>({});

  const { currentUser } = useAuthAndStorage();
  const {
    currentSong,
    isPlaying,
    togglePlay,
    next,
    previous,
    seek,
    currentTime,
    duration,
    toggleMute,
    isLyricsOpen,
    setIsLyricsOpen,
    isQueueOpen,
    setIsQueueOpen,
    isFullScreenOpen,
    setIsFullScreenOpen,
    openModal,
  } = useMusicPlayer();

  const handleNavigate = (view: string, params?: { id?: string }) => {
    setCurrentView(view);
    setViewParams(params || {});
    const scrollElem = document.getElementById('main-scroll-area');
    if (scrollElem) {
      scrollElem.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs or textareas
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || activeTag === 'select') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key === 'ArrowRight' && !e.shiftKey) {
        e.preventDefault();
        seek(Math.min(duration, currentTime + 5));
      } else if (e.key === 'ArrowLeft' && !e.shiftKey) {
        e.preventDefault();
        seek(Math.max(0, currentTime - 5));
      } else if (e.key === 'n' || (e.key === 'ArrowRight' && e.shiftKey)) {
        e.preventDefault();
        next();
      } else if (e.key === 'p' || (e.key === 'ArrowLeft' && e.shiftKey)) {
        e.preventDefault();
        previous();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        toggleMute();
      } else if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        setIsLyricsOpen(!isLyricsOpen);
      } else if (e.key === 'q' || e.key === 'Q') {
        e.preventDefault();
        setIsQueueOpen(!isQueueOpen);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFullScreenOpen(!isFullScreenOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    isPlaying,
    currentTime,
    duration,
    isLyricsOpen,
    isQueueOpen,
    isFullScreenOpen,
    togglePlay,
    next,
    previous,
    seek,
    toggleMute,
    setIsLyricsOpen,
    setIsQueueOpen,
    setIsFullScreenOpen,
  ]);

  return (
    <div className="flex h-screen w-full bg-black text-zinc-100 font-sans overflow-hidden select-none">
      {/* Desktop Sidebar */}
      <Sidebar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main App Window */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Top Header */}
        <MobileHeader
          onNavigate={handleNavigate}
          onOpenProfile={() => openModal('profile')}
          userAvatar={currentUser.avatar}
        />

        {/* Scrollable Main Views Area */}
        <main
          id="main-scroll-area"
          className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl w-full mx-auto"
        >
          {currentView === 'home' && <HomeView onNavigate={handleNavigate} />}
          {currentView === 'search' && <SearchView onNavigate={handleNavigate} />}
          {currentView === 'library' && <LibraryView onNavigate={handleNavigate} />}
          {currentView === 'playlist' && (
            <PlaylistView playlistId={viewParams.id} onNavigate={handleNavigate} />
          )}
          {currentView === 'settings' && <SettingsView />}
        </main>

        {/* Desktop Bottom Player Bar */}
        <DesktopPlayerBar />

        {/* Mobile Floating Mini Player */}
        <MobileBottomPlayer />

        {/* Mobile Bottom Navigation Bar */}
        <MobileNavbar currentView={currentView} onNavigate={handleNavigate} />
      </div>

      {/* Full Screen Player Modal (matches IMG_6118.jpeg with Related Songs scroll & synced lyrics) */}
      <FullScreenPlayerModal />

      {/* Synchronized Lyrics Drawer */}
      <LyricsDrawer />

      {/* Queue Drawer */}
      <QueueDrawer />

      {/* Modals (Playlist creation, adding, share song, profile switcher) */}
      <ModalsContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthAndStorageProvider>
      <MusicPlayerProvider>
        <AppContent />
      </MusicPlayerProvider>
    </AuthAndStorageProvider>
  );
}

export default App;
