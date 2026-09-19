import React, { useState } from 'react';
import { Search, Settings, Bell, Car, Fingerprint, MapPin, Sparkles, MessageSquare, ChevronRight, X, AlertCircle, Lock } from 'lucide-react';
import { AppState, ScreenType } from '../types';
import { UserAvatar } from './UserAvatar';
import { DigitalIdCard } from './DigitalIdCard';

interface HomeScreenProps {
  appState: AppState;
  onNavigate: (screen: ScreenType) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  appState,
  onNavigate,
}) => {
  const { personalDetails, visuals } = appState;
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);

  // Dedicated Home Page Digital ID card image (uploaded directly from Control Panel)
  const homeDigitalIdImage = visuals.homeDigitalIdImage;

  return (
    <div id="screen-home" className="flex-1 flex flex-col overflow-y-auto bg-[#131416] text-white">
      {/* Green Header Section */}
      <div className="bg-gradient-to-b from-[#006837] to-[#005a30] px-4 pt-3 pb-6 flex flex-col gap-4 shadow-md">
        {/* Top bar with Logo & Action Icons */}
        <div className="flex items-center justify-between">
          {/* Logo / Crest (400x120px support or default Absher branding) */}
          <div
            onClick={() => onNavigate('control_panel')}
            className="cursor-pointer group flex items-center"
            title="Header Logo (tap to change in Control Panel)"
          >
            {visuals.headerLogo ? (
              <img
                src={visuals.headerLogo}
                alt="Header Logo"
                className="h-10 max-w-[170px] w-auto object-contain transition-transform group-hover:scale-105"
                style={{ aspectRatio: '400/120' }}
              />
            ) : (
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-white/15 border border-white/25 flex items-center justify-center backdrop-blur-xs shadow-inner">
                  <span className="text-white text-base font-bold font-arabic">أبشر</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold tracking-wide leading-tight">
                    Absher Individual
                  </span>
                  <span className="text-emerald-100/75 text-[10px] font-arabic font-medium -mt-0.5">
                    أفراد
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <button
              id="header-btn-search"
              onClick={() => setShowSearch(!showSearch)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              id="header-btn-settings"
              onClick={() => onNavigate('control_panel')}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer relative"
              title="Control Panel (Locked)"
            >
              <Settings className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 text-black rounded-full flex items-center justify-center text-[8px] font-black shadow ring-1 ring-[#006837]">
                <Lock className="w-2 h-2 stroke-[3]" />
              </span>
            </button>
            <button
              id="header-btn-notifications"
              onClick={() => setShowNotifications(true)}
              className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-[#006837]" />
            </button>
          </div>
        </div>

        {/* Quick Search Overlay */}
        {showSearch && (
          <div className="w-full bg-[#1c1e22] rounded-xl p-2.5 flex items-center gap-2 border border-emerald-500/40 animate-in fade-in">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search services, vehicles, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-white outline-none placeholder:text-neutral-500"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Card Header (More breadth, well-proportioned length) */}
        <div
          id="user-summary-card"
          onClick={() => onNavigate('profile')}
          className="w-[96%] mx-auto bg-[#1e2023] hover:bg-[#25282c] border border-neutral-700/50 rounded-2xl p-4 sm:py-4.5 flex items-center gap-4 cursor-pointer shadow-lg transition-all active:scale-[0.99]"
        >
          <UserAvatar
            src={visuals.profilePhoto}
            name={personalDetails.name}
            size="md"
            className="w-13 h-13 rounded-xl shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base leading-tight truncate">
              {personalDetails.name}
            </h2>
            <p className="text-neutral-400 text-xs font-mono mt-1">
              ID No.: {personalDetails.idNumber}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-neutral-500 shrink-0" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 py-4 flex flex-col gap-6 flex-1">
        {/* Section: My Digital Documents (Shows strictly only the Digital ID) */}
        <section id="section-digital-documents" className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg tracking-tight">
              My Digital Documents
            </h3>
          </div>

          {/* Digital Muqeem Resident ID Card */}
          <DigitalIdCard
            personalDetails={personalDetails}
            customCardImage={homeDigitalIdImage}
            avatarUrl={visuals.profilePhoto}
            onCardClick={() => setShowCardPreview(true)}
          />
        </section>

        {/* Section: Quick Access (Emerald green background matching header, cards with more breadth / less length) */}
        <section id="section-quick-access" className="bg-[#006837] -mx-4 px-4 pt-5 pb-9 flex flex-col gap-3.5 shadow-md">
          <div className="w-[96%] mx-auto">
            <h3 className="text-white font-bold text-lg tracking-tight">
              Quick Access
            </h3>
          </div>

          {/* Card: My Vehicles (More breadth / height, balanced length) */}
          <div
            id="card-my-vehicles"
            onClick={() => {}}
            className="w-[96%] mx-auto bg-[#1e2024] hover:bg-[#24272c] border border-neutral-800/80 rounded-2xl p-5 sm:p-5.5 min-h-[108px] flex items-center gap-4.5 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400">
              <Car className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-base leading-snug">
                My Vehicles
              </h4>
              <p className="text-neutral-400 text-xs leading-relaxed mt-1">
                View details, renew documents, report accidents, and much more.
              </p>
            </div>
          </div>

          {/* Grid row: Authentication & Absher Travel (Deep, spacious breadth, less stretched length) */}
          <div className="w-[96%] mx-auto grid grid-cols-2 gap-3.5">
            {/* Authentication */}
            <div
              id="card-authentication"
              className="bg-[#1e2024] hover:bg-[#24272c] border border-neutral-800/80 rounded-2xl p-5 min-h-[145px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/90 flex items-center justify-center text-emerald-400">
                <Fingerprint className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  Authentication
                </h4>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Biometric Login
                </p>
              </div>
            </div>

            {/* Absher Travel */}
            <div
              id="card-absher-travel"
              className="bg-[#1e2024] hover:bg-[#24272c] border border-neutral-800/80 rounded-2xl p-5 min-h-[145px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/90 flex items-center justify-center text-emerald-400">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  Absher Travel
                </h4>
                <p className="text-neutral-400 text-[11px] mt-1">
                  Trip permits & info
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button (Mint Chat & AI Assistant) */}
      <button
        id="fab-assistant"
        onClick={() => setShowChatbot(!showChatbot)}
        className="fixed bottom-20 right-5 w-13 h-13 rounded-full bg-[#8de1be] hover:bg-[#7bcfad] text-[#064e3b] shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-20"
        title="Absher Smart Assistant"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-current" />
          <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1.5 text-emerald-800" />
        </div>
      </button>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#1e2024] border border-neutral-700 rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-emerald-400" />
                <h3 className="text-white font-bold text-base">Notifications</h3>
              </div>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex flex-col gap-2.5 max-h-60 overflow-y-auto">
              <div className="p-3 bg-emerald-950/30 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-white font-semibold">Resident ID Valid</p>
                  <p className="text-neutral-400 mt-0.5">
                    Your digital identity is active and synchronized offline.
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowNotifications(false)}
              className="w-full py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Smart Assistant Dialog */}
      {showChatbot && (
        <div className="fixed bottom-36 right-5 w-80 bg-[#1e2024] border border-neutral-700 rounded-2xl shadow-2xl p-4 z-40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-neutral-700/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#8de1be] text-[#064e3b] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-white">Absher Assistant</span>
            </div>
            <button
              onClick={() => setShowChatbot(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-neutral-300 leading-relaxed bg-[#151618] p-3 rounded-xl">
            Hello {personalDetails.name}! Your documents are valid. You can view your Passport, Resident ID, Driving License, or edit everything via the <strong>Control Panel</strong>.
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowChatbot(false);
                onNavigate('resident_id');
              }}
              className="flex-1 py-1.5 bg-emerald-900/60 hover:bg-emerald-800/60 text-emerald-200 text-[11px] rounded-lg border border-emerald-700/40"
            >
              Resident ID
            </button>
            <button
              onClick={() => {
                setShowChatbot(false);
                onNavigate('control_panel');
              }}
              className="flex-1 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[11px] rounded-lg"
            >
              Control Panel
            </button>
          </div>
        </div>
      )}

      {/* Full-Screen Digital ID Inspection Modal */}
      {showCardPreview && (
        <div
          id="modal-digital-id-preview"
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4"
          onClick={() => setShowCardPreview(false)}
        >
          <div
            className="w-full max-w-md flex flex-col gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-1">
              <span className="text-white font-bold text-sm tracking-wide">
                Digital Resident ID
              </span>
              <button
                onClick={() => setShowCardPreview(false)}
                className="p-1.5 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white cursor-pointer transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="w-full shadow-2xl rounded-2xl overflow-hidden border border-neutral-700/60">
              <DigitalIdCard
                personalDetails={personalDetails}
                customCardImage={homeDigitalIdImage}
                avatarUrl={visuals.profilePhoto}
              />
            </div>

            <p className="text-center text-xs text-neutral-400 mt-1">
              Tap anywhere outside to close
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
