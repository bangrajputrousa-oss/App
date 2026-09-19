import React from 'react';
import { Settings, Download, Upload, Shield, Globe, Info, RefreshCcw, ChevronRight, Lock } from 'lucide-react';
import { ScreenType } from '../types';
import { InstallApkCard } from './InstallApkCard';

interface OtherScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetDefaults: () => void;
}

export const OtherScreen: React.FC<OtherScreenProps> = ({
  onNavigate,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
}) => {
  return (
    <div id="screen-other" className="flex-1 flex flex-col overflow-y-auto bg-[#131416] text-white">
      <div className="bg-[#006837] px-4 py-3.5 shadow-md shrink-0">
        <h1 className="text-white text-lg font-bold tracking-tight">
          Other & Settings
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-4 flex-1 pb-8">
        {/* Install / Download App APK / PWA Card */}
        <InstallApkCard />

        {/* Control Panel Shortcut */}
        <div
          id="btn-goto-control-panel"
          onClick={() => onNavigate('control_panel')}
          className="w-full bg-gradient-to-r from-emerald-950/80 to-[#222428] border border-emerald-500/40 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:border-emerald-400 transition-all shadow-md active:scale-[0.99]"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-400 relative">
              <Settings className="w-6 h-6 animate-spin-slow" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black rounded-full flex items-center justify-center shadow">
                <Lock className="w-2.5 h-2.5 stroke-[3]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-white font-bold text-base leading-tight">
                  Control Panel
                </h2>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" /> Locked
                </span>
              </div>
              <p className="text-emerald-300 text-xs mt-0.5">
                Edit personal data, photos, documents & IDs
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-emerald-400" />
        </div>

        {/* Section: Device File Manager Offline Storage */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-400 px-1">
            Device File Manager & Offline Storage
          </span>
          <div className="bg-[#222428] border border-neutral-800 rounded-2xl p-4 flex flex-col gap-3">
            <p className="text-xs text-neutral-400 leading-relaxed">
              This application works 100% offline. You can backup your identity and document database directly to your Android device storage or restore anytime.
            </p>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                id="btn-export-storage-json"
                onClick={onExportBackup}
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-emerald-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Save to Device</span>
              </button>

              <button
                id="btn-import-storage-json"
                onClick={onImportBackup}
                className="py-2.5 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border border-neutral-700 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Load from File</span>
              </button>
            </div>

            <button
              onClick={onResetDefaults}
              className="py-2 text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-1.5 cursor-pointer mt-1"
            >
              <RefreshCcw className="w-3.5 h-3.5" />
              <span>Reset to Screenshot Default Data</span>
            </button>
          </div>
        </div>

        {/* General Settings */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-neutral-400 px-1">
            General Preferences
          </span>
          <div className="bg-[#222428] border border-neutral-800 rounded-2xl overflow-hidden divide-y divide-neutral-800">
            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-800/30">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-white">Language / اللغة</span>
              </div>
              <span className="text-xs text-neutral-400">English / العربية</span>
            </div>

            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-800/30">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-white">Security & Biometrics</span>
              </div>
              <span className="text-xs text-emerald-400 font-semibold">Enabled</span>
            </div>

            <div className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-neutral-800/30">
              <div className="flex items-center gap-3">
                <Info className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-medium text-white">App Version</span>
              </div>
              <span className="text-xs text-neutral-400 font-mono">v4.39.0 (Offline)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
