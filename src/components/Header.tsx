import React, { useState, useEffect } from 'react';
import { Shield, Radio, Volume2, Globe, Sparkles, User, SlidersHorizontal, Sun, Moon } from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../utils/translations';
import { speakText } from '../utils/speech';

interface HeaderProps {
  role: UserRole;
  setRole: (role: UserRole) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  isLargeText: boolean;
  setIsLargeText: (val: boolean) => void;
  activeCaseCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  setRole,
  lang,
  setLang,
  highContrast,
  setHighContrast,
  isLargeText,
  setIsLargeText,
  activeCaseCount
}) => {
  const [time, setTime] = useState<string>('');
  const t = translations[lang];

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleAudioAnnounce = () => {
    const text = role === 'citizen'
      ? `${t.appTitle} ${t.citizenTab}. Emergency Response Active. Tap the big red SOS button if you need immediate emergency help.`
      : `${t.appTitle} ${t.responderTab}. Control center online. ${activeCaseCount} active cases pending dispatch.`;
    speakText(text, lang);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-red-600 to-red-500 shadow-lg shadow-red-900/50">
              <span className="text-xl sm:text-2xl animate-pulse">🚨</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-red-400">
                  ResQ AI
                </span>
                <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-red-900/60 text-red-300 border border-red-700/50">
                  <Sparkles className="w-3 h-3 mr-1 text-red-400" /> AI INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium hidden sm:block">
                {t.subtitle}
              </p>
            </div>
          </div>

          {/* Center Mode Switcher */}
          <div className="flex items-center bg-slate-800/90 p-1.5 rounded-xl border border-slate-700/70 shadow-inner">
            <button
              onClick={() => setRole('citizen')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                role === 'citizen'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span>{t.citizenTab}</span>
            </button>
            <button
              onClick={() => setRole('responder')}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all relative ${
                role === 'responder'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>{t.responderTab}</span>
              {activeCaseCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px] font-extrabold animate-bounce">
                  {activeCaseCount}
                </span>
              )}
            </button>
          </div>

          {/* Right Toolbar: Language, Accessibility, Time */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Language Selector */}
            <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 px-2 py-1">
              <Globe className="w-3.5 h-3.5 text-slate-400 mr-1.5 hidden sm:block" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
                aria-label="Select Language"
              >
                <option value="en" className="bg-slate-800 text-white">English</option>
                <option value="ta" className="bg-slate-800 text-white">தமிழ் (Tamil)</option>
                <option value="hi" className="bg-slate-800 text-white">हिंदी (Hindi)</option>
              </select>
            </div>

            {/* Accessibility Buttons */}
            <div className="hidden lg:flex items-center space-x-1 border-l border-slate-800 pl-3">
              <button
                onClick={() => setHighContrast(!highContrast)}
                title={t.highContrast}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  highContrast ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Contrast
              </button>

              <button
                onClick={() => setIsLargeText(!isLargeText)}
                title={t.textSize}
                className={`p-1.5 rounded-lg text-xs font-semibold transition ${
                  isLargeText ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                Text+
              </button>

              <button
                onClick={handleAudioAnnounce}
                title="Audio Reader"
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <Volume2 className="w-4 h-4 text-slate-300" />
              </button>
            </div>

            {/* Live Clock / Status */}
            {role === 'responder' && (
              <div className="hidden sm:flex flex-col text-right pl-2 border-l border-slate-800">
                <span className="text-xs font-mono font-bold text-emerald-400 flex items-center justify-end">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-ping" /> ONLINE
                </span>
                <span className="text-[11px] font-mono text-slate-400">{time}</span>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
