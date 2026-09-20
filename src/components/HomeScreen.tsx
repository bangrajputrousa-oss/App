import React, { useState, useRef } from 'react';
import { Search, Settings, Bell, Car, Fingerprint, MapPin, Sparkles, MessageSquare, ChevronRight, X, AlertCircle, Lock, ZoomIn, ZoomOut, RotateCw } from 'lucide-react';
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
  const [isRotatedLandscape, setIsRotatedLandscape] = useState(true);
  const [isZoomed2x, setIsZoomed2x] = useState(true);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, panX: 0, panY: 0 });

  const handleOpenCardPreview = () => {
    setIsRotatedLandscape(true);
    setIsZoomed2x(true);
    setPan({ x: 0, y: 0 });
    setShowCardPreview(true);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      panX: pan.x,
      panY: pan.y,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPan({
      x: dragStartRef.current.panX + dx,
      y: dragStartRef.current.panY + dy,
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  // Dedicated Home Page Digital ID card image (uploaded directly from Control Panel or resident ID doc)
  const residentDoc = appState.documents.find((d) => d.type === 'resident_id');
  const homeDigitalIdImage = visuals.homeDigitalIdImage || residentDoc?.image;

  return (
    <div id="screen-home" className="flex-1 flex flex-col overflow-y-auto bg-[#211F1F] text-white select-none">
      {/* Green Header Section (20% bigger with generous spacing & larger brand crest) */}
      <div className="bg-gradient-to-b from-[#006837] to-[#00522c] px-5 pt-5 pb-7 flex flex-col gap-5 shadow-lg">
        {/* Top bar with Logo & Action Icons (+20% larger) */}
        <div className="flex items-center justify-between">
          {/* Logo / Crest (1x Bigger / Configurable via Control Panel) */}
          <div
            onClick={() => onNavigate('control_panel')}
            className="cursor-pointer group flex items-center"
            title="Header Logo (tap to change in Control Panel)"
          >
            {visuals.headerLogo ? (
              <img
                src={visuals.headerLogo}
                alt="Header Logo"
                className="max-w-[260px] w-auto object-contain transition-transform group-hover:scale-105"
                style={{
                  height: visuals.headerLogoScale && visuals.headerLogoScale >= 2 ? '4.25rem' : visuals.headerLogoScale && visuals.headerLogoScale <= 1 ? '2.75rem' : '3.5rem',
                  aspectRatio: '400/120',
                }}
              />
            ) : (
              <div
                className="flex items-center gap-3 origin-left transition-transform duration-200"
                style={{
                  transform: `scale(${visuals.headerLogoScale ? (visuals.headerLogoScale >= 2 ? 1.25 : visuals.headerLogoScale <= 1 ? 1.0 : 1.15) : 1.15})`,
                }}
              >
                <div className="w-12 h-12 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-xs shadow-inner">
                  <span className="text-white text-xl font-bold font-arabic">أبشر</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-base font-bold tracking-wide leading-tight font-sans">
                    Absher Individual
                  </span>
                  <span className="text-emerald-100/90 text-xs font-arabic font-medium -mt-0.5">
                    أفراد
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (+20% spacing and sizing) */}
          <div className="flex items-center gap-3.5">
            <button
              id="header-btn-search"
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer"
              title="Search"
            >
              <Search className="w-5.5 h-5.5" />
            </button>
            <button
              id="header-btn-settings"
              onClick={() => onNavigate('control_panel')}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer relative"
              title="Control Panel (Locked)"
            >
              <Settings className="w-5.5 h-5.5" />
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-amber-500 text-black rounded-full flex items-center justify-center text-[8px] font-black shadow ring-1 ring-[#006837]">
                <Lock className="w-2 h-2 stroke-[3]" />
              </span>
            </button>
            <button
              id="header-btn-notifications"
              onClick={() => setShowNotifications(true)}
              className="p-2 rounded-full hover:bg-white/15 text-white transition-colors cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5.5 h-5.5" />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#7BE4C2] rounded-full ring-2 ring-[#006837]" />
            </button>
          </div>
        </div>

        {/* Quick Search Overlay */}
        {showSearch && (
          <div className="w-full bg-[#2C3033] rounded-xl p-3 flex items-center gap-2.5 border border-emerald-400/40 animate-in fade-in shadow-lg">
            <Search className="w-4.5 h-4.5 text-neutral-300" />
            <input
              type="text"
              placeholder="Search services, vehicles, documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-neutral-400 font-sans"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>
        )}

        {/* User Card Header (20% bigger padding, larger avatar and fonts) */}
        <div
          id="user-summary-card"
          onClick={() => onNavigate('profile')}
          className="w-full bg-[#26282B] hover:bg-[#2E3135] border border-neutral-700/60 rounded-2xl p-4.5 sm:py-5 flex items-center gap-4.5 cursor-pointer shadow-xl transition-all active:scale-[0.99]"
        >
          <UserAvatar
            src={visuals.profilePhoto}
            name={personalDetails.name}
            size="md"
            className="w-14 h-14 sm:w-15 sm:h-15 rounded-xl shrink-0 border border-white/10"
          />
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-bold text-base sm:text-lg leading-tight truncate">
              {personalDetails.name}
            </h2>
            <p className="text-neutral-300 text-xs sm:text-sm font-mono mt-1">
              ID No.: {personalDetails.idNumber}
            </p>
          </div>
          <ChevronRight className="w-5.5 h-5.5 text-neutral-400 shrink-0" />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4.5 py-5 flex flex-col gap-6 flex-1">
        {/* Section: My Digital Documents (Shows strictly only the Digital ID) */}
        <section id="section-digital-documents" className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold text-lg tracking-tight font-sans">
              My Digital Documents
            </h3>
            <span className="text-xs text-[#7BE4C2] font-medium">Tap to view full screen</span>
          </div>

          {/* Digital Muqeem Resident ID Card */}
          <div className="cursor-pointer" onClick={handleOpenCardPreview}>
            <DigitalIdCard
              personalDetails={personalDetails}
              customCardImage={homeDigitalIdImage}
              avatarUrl={visuals.profilePhoto}
              onCardClick={handleOpenCardPreview}
            />
          </div>
        </section>

        {/* Section: Quick Access */}
        <section id="section-quick-access" className="bg-[#006837] -mx-4.5 px-4.5 pt-5 pb-9 flex flex-col gap-3.5 shadow-md">
          <div className="w-full">
            <h3 className="text-white font-bold text-lg tracking-tight font-sans">
              Quick Access
            </h3>
          </div>

          {/* Card: My Vehicles */}
          <div
            id="card-my-vehicles"
            onClick={() => onNavigate('license')}
            className="w-full bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/50 rounded-2xl p-5 min-h-[108px] flex items-center gap-4.5 cursor-pointer shadow-md transition-all active:scale-[0.99]"
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[#7BE4C2]">
              <Car className="w-7 h-7" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-base leading-snug">
                My Vehicles
              </h4>
              <p className="text-neutral-300 text-xs leading-relaxed mt-1">
                View details, renew documents, report accidents, and much more.
              </p>
            </div>
          </div>

          {/* Grid row: Authentication & Absher Travel */}
          <div className="w-full grid grid-cols-2 gap-3.5">
            {/* Authentication */}
            <div
              id="card-authentication"
              onClick={() => onNavigate('services')}
              className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/50 rounded-2xl p-5 min-h-[145px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2]">
                <Fingerprint className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  Authentication
                </h4>
                <p className="text-neutral-300 text-xs mt-1">
                  Biometric Login
                </p>
              </div>
            </div>

            {/* Absher Travel */}
            <div
              id="card-absher-travel"
              onClick={() => onNavigate('services')}
              className="bg-[#2C3033] hover:bg-[#34393D] border border-neutral-700/50 rounded-2xl p-5 min-h-[145px] flex flex-col justify-between cursor-pointer shadow-md transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-2xl bg-neutral-800/90 flex items-center justify-center text-[#7BE4C2]">
                <MapPin className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm leading-tight">
                  Absher Travel
                </h4>
                <p className="text-neutral-300 text-xs mt-1">
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
        className="fixed bottom-20 right-5 w-13 h-13 rounded-full bg-[#7BE4C2] hover:bg-[#68dcb7] text-[#064e3b] shadow-xl flex items-center justify-center cursor-pointer transition-transform hover:scale-105 active:scale-95 z-20"
        title="Absher Smart Assistant"
      >
        <div className="relative">
          <MessageSquare className="w-6 h-6 fill-current stroke-[2]" />
          <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1.5 text-emerald-800" />
        </div>
      </button>

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-[#211F1F]/90 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#2C3033] border border-neutral-700 rounded-2xl p-5 shadow-2xl flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-neutral-700 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-[#7BE4C2]" />
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
              <div className="p-3 bg-emerald-950/40 border border-emerald-800/40 rounded-xl flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-[#7BE4C2] shrink-0 mt-0.5" />
                <div className="text-xs">
                  <p className="text-white font-semibold">Resident ID Valid</p>
                  <p className="text-neutral-300 mt-0.5">
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
        <div className="fixed bottom-36 right-5 w-80 bg-[#2C3033] border border-neutral-700 rounded-2xl shadow-2xl p-4 z-40 flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-neutral-700/80 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-[#7BE4C2] text-[#064e3b] flex items-center justify-center">
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
          <div className="text-xs text-neutral-300 leading-relaxed bg-[#211F1F] p-3 rounded-xl">
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

      {/* Full-Screen Landscape Digital ID Inspection Modal */}
      {showCardPreview && (
        <div
          id="modal-digital-id-preview"
          className="fixed inset-0 z-50 bg-[#211F1F] flex flex-col items-center justify-between p-3 sm:p-6 overflow-hidden select-none animate-in fade-in duration-200"
          onClick={() => setShowCardPreview(false)}
        >
          {/* Top Bar with Clean White 'X' Close Button & Clean Action Controls (Zero text writing!) */}
          <div className="w-full flex items-center justify-between px-2 pt-1 z-20 shrink-0">
            <button
              id="btn-close-fullscreen-doc"
              onClick={() => setShowCardPreview(false)}
              className="p-2.5 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
              title="Close"
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>

            {/* Action Buttons: 2X Zoom Toggle & Clean Orientation Rotate (Zero "Horizontal Mode" text!) */}
            <div className="flex items-center gap-2">
              <button
                id="btn-toggle-zoom"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed2x(!isZoomed2x);
                  setPan({ x: 0, y: 0 });
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold cursor-pointer transition-colors"
                title={isZoomed2x ? 'Zoom Out to 1X' : 'Zoom In 2X'}
              >
                {isZoomed2x ? (
                  <>
                    <ZoomOut className="w-4 h-4 text-[#7BE4C2]" />
                    <span className="font-mono text-xs text-[#7BE4C2]">2X</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4 text-white" />
                    <span className="font-mono text-xs text-white">1X</span>
                  </>
                )}
              </button>

              <button
                id="btn-toggle-rotate"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRotatedLandscape(!isRotatedLandscape);
                  setPan({ x: 0, y: 0 });
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white cursor-pointer transition-colors"
                title="Rotate Orientation"
              >
                <RotateCw className="w-4.5 h-4.5 text-white" />
              </button>
            </div>
          </div>

          {/* Center Stage: Document in Horizontal Mode with 2X Zoom & Smooth Pan */}
          <div
            className="flex-1 w-full flex items-center justify-center p-2 overflow-hidden select-none cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <div
              className="transition-transform duration-75 origin-center will-change-transform"
              style={{
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0px)`,
                touchAction: 'none',
              }}
            >
              <div
                className={`transition-all duration-300 origin-center flex items-center justify-center ${
                  isRotatedLandscape
                    ? 'rotate-90 sm:rotate-0 w-[78vh] sm:w-[94%] max-w-[620px] aspect-[1.586/1]'
                    : 'w-full max-w-[620px] aspect-[1.586/1]'
                } ${isZoomed2x ? 'scale-[2.0]' : 'scale-100'}`}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsZoomed2x(!isZoomed2x);
                  setPan({ x: 0, y: 0 });
                }}
              >
                {homeDigitalIdImage ? (
                  <img
                    src={homeDigitalIdImage}
                    alt="Digital Document"
                    draggable={false}
                    className="w-full h-auto max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/10 pointer-events-none select-none"
                  />
                ) : (
                  <div className="w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 pointer-events-none select-none">
                    <DigitalIdCard
                      personalDetails={personalDetails}
                      avatarUrl={visuals.profilePhoto}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bottom helper text */}
          <div className="py-2 text-center text-xs text-neutral-400 z-10 shrink-0">
            <span>{isZoomed2x ? '2X Zoom • Drag to pan • Double-tap or tap ✕ to exit' : 'Tap ✕ or tap background to exit'}</span>
          </div>
        </div>
      )}
    </div>
  );
};
