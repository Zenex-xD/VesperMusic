import React, { useState } from 'react';
import {
  Sliders,
  Zap,
  Check,
  RotateCcw,
  ShieldCheck,
} from 'lucide-react';
import { useAuthAndStorage } from '../context/AuthAndStorageContext';
import { useMusicPlayer } from '../context/MusicPlayerContext';
import { UserSettings } from '../types/music';

export const SettingsView: React.FC = () => {
  const { currentUser, updateSettings } = useAuthAndStorage();
  const {
    playbackEngine,
    currentSong,
  } = useMusicPlayer();

  const settings = currentUser.settings;
  const [saveToast, setSaveToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setSaveToast(message);
    setTimeout(() => {
      setSaveToast(null);
    }, 2500);
  };

  const handleAudioQualityChange = (quality: UserSettings['audioQuality']) => {
    updateSettings({ audioQuality: quality });
    showToast(`Streaming quality set to ${quality.toUpperCase()}`);
  };

  const handleAutoplayToggle = () => {
    const nextVal = !settings.autoplay;
    updateSettings({ autoplay: nextVal });
    showToast(`Autoplay ${nextVal ? 'enabled' : 'disabled'}`);
  };

  const handleDataSaverToggle = () => {
    const nextVal = !settings.dataSaver;
    updateSettings({ dataSaver: nextVal });
    showToast(`Data saver ${nextVal ? 'enabled' : 'disabled'}`);
  };

  const handleAmbientGlowChange = (intensity: UserSettings['ambientGlowIntensity']) => {
    updateSettings({ ambientGlowIntensity: intensity });
    showToast(`Ambient glow intensity set to ${intensity.toUpperCase()}`);
  };

  const handleResetDefaults = () => {
    updateSettings({
      audioQuality: 'lossless',
      autoplay: true,
      dataSaver: false,
      ambientGlowIntensity: 'high',
    });
    showToast('All settings restored to defaults');
  };

  return (
    <div className="min-h-[85vh] max-w-4xl mx-auto pb-28 pt-2 select-none">
      {/* Toast Notification */}
      {saveToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 bg-zinc-900/95 border border-purple-500/40 text-white text-sm font-medium px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-top-3 duration-200">
          <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
          <span>{saveToast}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <span className="text-xs uppercase font-bold tracking-widest text-purple-400">
            Audio & Player Preferences
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-white">Settings</h1>
        <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
          Customize your playback fidelity, dynamic visualizer preferences, and streaming settings.
        </p>
      </div>

      <div className="space-y-6">
        {/* ========================================================= */}
        {/* SECTION 1: AUDIO PLAYBACK QUALITY & STREAMING              */}
        {/* ========================================================= */}
        <section
          id="setting-card-audio-quality"
          className="rounded-2xl bg-zinc-900/70 border border-white/[0.08] p-6 backdrop-blur-md shadow-xl"
        >
          <div className="flex items-start gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">
                Streaming Audio Quality
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Select your preferred playback stream fidelity based on your network speed.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'lossless' as const,
                title: 'Lossless Hi-Fi',
                bitrate: '320 kbps (FLAC/Opus)',
                desc: 'Maximum depth, dynamic range & clarity',
              },
              {
                id: 'high' as const,
                title: 'High Quality',
                bitrate: '256 kbps (AAC)',
                desc: 'Balanced fidelity and reliable streaming',
              },
              {
                id: 'normal' as const,
                title: 'Data Saver',
                bitrate: '128 kbps (Standard)',
                desc: 'Fastest loading on mobile connections',
              },
            ].map(tier => {
              const isActive = settings.audioQuality === tier.id;
              return (
                <button
                  key={tier.id}
                  id={`quality-tier-${tier.id}`}
                  onClick={() => handleAudioQualityChange(tier.id)}
                  className={`flex flex-col text-left p-4 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-purple-950/40 border-purple-500/60 shadow-lg shadow-purple-900/20 ring-1 ring-purple-500/40'
                      : 'bg-black/40 border-white/5 hover:bg-zinc-800/50 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-sm font-bold text-white">{tier.title}</span>
                    {isActive && (
                      <div className="w-4 h-4 rounded-full bg-purple-500 flex items-center justify-center text-black">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] font-semibold text-purple-400">{tier.bitrate}</span>
                  <p className="text-xs text-zinc-400 mt-2 leading-snug">{tier.desc}</p>
                </button>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 2: PLAYBACK BEHAVIOR & PREFERENCES                 */}
        {/* ========================================================= */}
        <section
          id="setting-card-playback-behavior"
          className="rounded-2xl bg-zinc-900/70 border border-white/[0.08] p-6 backdrop-blur-md shadow-xl divide-y divide-white/[0.06]"
        >
          {/* Autoplay Toggle */}
          <div className="flex items-center justify-between pb-5">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-white">Autoplay Similar Music</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically append similar tracks to your queue when your songs reach the end.
              </p>
            </div>
            <button
              id="toggle-autoplay-switch"
              onClick={handleAutoplayToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ${
                settings.autoplay ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.autoplay ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Data Saver Toggle */}
          <div className="flex items-center justify-between py-5">
            <div className="pr-4">
              <h3 className="text-sm font-bold text-white">Data Saver Mode</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Optimize image previews and thumbnail resolutions to conserve cellular mobile data.
              </p>
            </div>
            <button
              id="toggle-datasaver-switch"
              onClick={handleDataSaverToggle}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ease-in-out cursor-pointer flex-shrink-0 ${
                settings.dataSaver ? 'bg-purple-600' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  settings.dataSaver ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Ambient Frequency Glow */}
          <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-white">Ambient Glow Intensity</h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Controls the intensity of audio-reactive ambient lighting behind player art.
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/5">
              {(['high', 'medium', 'low', 'off'] as const).map(level => {
                const isSelected = settings.ambientGlowIntensity === level;
                return (
                  <button
                    key={level}
                    id={`ambient-glow-${level}`}
                    onClick={() => handleAmbientGlowChange(level)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all whitespace-nowrap ${
                      isSelected
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {level}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: PLAYBACK ENGINE STATUS & RESET                  */}
        {/* ========================================================= */}
        <section
          id="setting-card-diagnostics"
          className="rounded-2xl bg-zinc-900/40 border border-white/[0.06] p-6 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-800 flex items-center justify-center text-zinc-400">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Playback Engine Status:</span>
                <span className="text-xs text-emerald-400 font-mono">
                  {playbackEngine === 'youtube' ? 'Direct High-Fidelity Engine' : 'HTML5 Lossless Engine'}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">
                Current track: {currentSong ? `${currentSong.title} — ${currentSong.artist}` : 'None'}
              </p>
            </div>
          </div>

          <button
            id="reset-defaults-button"
            onClick={handleResetDefaults}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white bg-zinc-800/80 hover:bg-zinc-700/80 border border-white/5 transition-all self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
        </section>
      </div>
    </div>
  );
};

export default SettingsView;
