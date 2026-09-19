import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, ChevronRight, Globe, CreditCard, FileText, Award, Plane } from 'lucide-react';
import { AppState, ScreenType } from '../types';
import { UserAvatar } from './UserAvatar';

interface ProfileScreenProps {
  appState: AppState;
  onNavigate: (screen: ScreenType) => void;
  onBack: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  appState,
  onNavigate,
  onBack,
}) => {
  const { personalDetails, visuals } = appState;
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(personalDetails.idNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="screen-my-profile" className="flex-1 flex flex-col overflow-y-auto bg-[#131416] text-white">
      {/* Green Header Bar */}
      <div className="bg-[#006837] px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0">
        <button
          id="profile-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight">
          My Profile
        </h1>
      </div>

      {/* Main Content */}
      <div className="p-4 flex flex-col gap-4 flex-1">
        {/* Profile Card */}
        <div
          id="profile-main-card"
          className="w-full bg-[#222428] rounded-2xl p-5 flex flex-col items-center text-center shadow-lg border border-neutral-800/60"
        >
          {/* Centered Avatar */}
          <div className="mb-3">
            <UserAvatar
              src={visuals.profilePhoto}
              name={personalDetails.name}
              size="xl"
              className="w-20 h-20 rounded-xl shadow-md border-2 border-neutral-700/60"
            />
          </div>

          {/* User Full Name */}
          <h2 className="text-white text-lg font-bold tracking-wide">
            {personalDetails.name}
          </h2>

          {/* ID Number with Copy icon */}
          <div className="flex items-center gap-2 mt-1.5 text-neutral-300 text-sm font-mono">
            <span>ID No. {personalDetails.idNumber}</span>
            <button
              id="btn-copy-profile-id"
              onClick={handleCopyId}
              className="p-1 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
              title="Copy ID Number"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-400 animate-in zoom-in" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Link to Personal Details */}
          <button
            id="btn-goto-personal-details"
            onClick={() => onNavigate('personal_details')}
            className="mt-4 flex items-center gap-1 text-neutral-300 hover:text-white text-sm font-semibold tracking-wide cursor-pointer transition-colors group"
          >
            <span>My Personal Details</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* 2x2 Grid of Document Cards */}
        <div className="grid grid-cols-2 gap-3">
          {/* My Passport */}
          <div
            id="btn-my-passport"
            onClick={() => onNavigate('passport')}
            className="bg-[#222428] hover:bg-[#282b30] border border-neutral-800/80 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700/40">
              <Globe className="w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm">
              My Passport
            </span>
          </div>

          {/* My Resident ID */}
          <div
            id="btn-my-resident-id"
            onClick={() => onNavigate('resident_id')}
            className="bg-[#222428] hover:bg-[#282b30] border border-neutral-800/80 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700/40">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm">
              My Resident ID
            </span>
          </div>

          {/* My Visa */}
          <div
            id="btn-my-visa"
            onClick={() => onNavigate('visa')}
            className="bg-[#222428] hover:bg-[#282b30] border border-neutral-800/80 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700/40">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm">
              My Visa
            </span>
          </div>

          {/* My Driving License */}
          <div
            id="btn-my-driving-license"
            onClick={() => onNavigate('license')}
            className="bg-[#222428] hover:bg-[#282b30] border border-neutral-800/80 rounded-2xl p-4 flex flex-col gap-3 cursor-pointer shadow-md transition-all active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700/40">
              <Award className="w-5 h-5" />
            </div>
            <span className="text-white font-bold text-sm">
              My Driving License
            </span>
          </div>
        </div>

        {/* Travel Records Banner Card */}
        <div
          id="card-travel-records"
          className="relative w-full rounded-2xl overflow-hidden min-h-[90px] p-4 flex flex-col justify-between cursor-pointer shadow-md border border-neutral-800 group"
          style={{
            background: 'linear-gradient(135deg, #093b22 0%, #064e3b 50%, #134e4a 100%)',
          }}
        >
          {/* Subtle nature wave graphic */}
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <Plane className="w-32 h-32 text-emerald-200" />
          </div>

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-black/40 text-emerald-300 font-medium backdrop-blur-xs">
              Inside Kingdom
            </span>
          </div>

          <div className="relative z-10 mt-3">
            <h3 className="text-white font-bold text-base group-hover:text-emerald-200 transition-colors">
              My Travel Records...
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
};
