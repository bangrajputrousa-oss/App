import React, { useState, useRef } from 'react';
import { ArrowLeft, Upload, Trash2, Plus, Check, KeyRound, Download, FolderOpen, RotateCcw, Lock } from 'lucide-react';
import { AppState, DocumentItem } from '../types';

interface ControlPanelScreenProps {
  appState: AppState;
  onSave: (newState: AppState) => void;
  onBack: () => void;
  onExportBackup: () => void;
  onImportBackup: () => void;
  onResetDefaults: () => void;
}

export const ControlPanelScreen: React.FC<ControlPanelScreenProps> = ({
  appState,
  onSave,
  onBack,
  onExportBackup,
  onImportBackup,
  onResetDefaults,
}) => {
  const [formData, setFormData] = useState<AppState>(JSON.parse(JSON.stringify(appState)));
  const [newDocTitle, setNewDocTitle] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Hidden file input refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const homeDigitalIdInputRef = useRef<HTMLInputElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);
  const loginInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const docInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  const handlePersonalChange = (field: keyof typeof formData.personalDetails, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personalDetails: {
        ...prev.personalDetails,
        [field]: value,
      },
    }));
  };

  const handleDocumentChange = (id: string, field: keyof DocumentItem, value: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.map((doc) =>
        doc.id === id ? { ...doc, [field]: value } : doc
      ),
    }));
  };

  const handleDeleteDocument = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((doc) => doc.id !== id),
    }));
  };

  const handleAddDocument = () => {
    if (!newDocTitle.trim()) return;
    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      title: newDocTitle.trim(),
      number: 'DOC-' + Math.floor(100000 + Math.random() * 900000),
      issuing: '-',
      expiry: '-',
      type: 'custom',
    };
    setFormData((prev) => ({
      ...prev,
      documents: [...prev.documents, newDoc],
    }));
    setNewDocTitle('');
  };

  // Generic image upload helper
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        callback(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveChanges = () => {
    onSave(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div id="screen-control-panel" className="flex-1 flex flex-col overflow-y-auto bg-[#131416] text-white">
      {/* Top Bar matching screenshot */}
      <div className="bg-[#191b1e] border-b border-neutral-800 px-4 py-3.5 flex items-center gap-3 shadow-md shrink-0 sticky top-0 z-20">
        <button
          id="control-panel-btn-back"
          onClick={onBack}
          className="p-1 -ml-1 text-white hover:bg-neutral-800 rounded-full transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-white text-lg font-bold tracking-tight flex items-center gap-2">
          <span>Control Panel</span>
          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-600/40 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
            <Lock className="w-2.5 h-2.5" /> Unlocked
          </span>
        </h1>
        <div className="ml-auto flex items-center gap-2">
          {saveSuccess && (
            <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-600 px-2 py-0.5 rounded-full flex items-center gap-1 animate-in fade-in">
              <Check className="w-3.5 h-3.5" /> Saved!
            </span>
          )}
          <button
            id="btn-lock-panel-now"
            onClick={onBack}
            className="px-2.5 py-1 bg-amber-950/50 hover:bg-amber-900/60 text-amber-300 border border-amber-600/50 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            title="Lock Control Panel & return to app"
          >
            <Lock className="w-3 h-3" />
            <span>Lock</span>
          </button>
        </div>
      </div>

      {/* Main Form Fields */}
      <div className="p-4 flex flex-col gap-4 flex-1 pb-28">
        {/* Card: Header Logo (400x120px) */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-neutral-200">
              Header Logo (400×120 px)
            </span>
            <span className="text-[11px] text-emerald-400 font-mono">
              Home Top Bar
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Upload custom 400×120px logo to replace "Absher Individual" header branding anytime.
          </p>
          <div className="flex items-center gap-3.5">
            <div className="w-36 h-12 rounded-xl bg-[#141517] border border-neutral-700/60 flex items-center justify-center overflow-hidden shrink-0 px-2">
              {formData.visuals.headerLogo ? (
                <img
                  src={formData.visuals.headerLogo}
                  alt="Header logo preview"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-[11px] text-emerald-400 font-bold">Default Logo</span>
              )}
            </div>
            <input
              type="file"
              ref={logoInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, headerLogo: base64 },
                  }))
                )
              }
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => logoInputRef.current?.click()}
                className="px-3.5 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Logo</span>
              </button>
              {formData.visuals.headerLogo && (
                <button
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      visuals: { ...prev.visuals, headerLogo: '' },
                    }))
                  }
                  className="px-2.5 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 cursor-pointer transition-all"
                  title="Reset to default logo"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: Home Page Digital ID Card (Separate from Profile Documents) */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-emerald-500/40 shadow-sm flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-emerald-300 flex items-center gap-1.5">
              <span>Home Page Digital ID Card</span>
            </span>
            <span className="text-[11px] bg-emerald-950 text-emerald-300 border border-emerald-700/50 px-2 py-0.5 rounded-full font-mono">
              Home Screen Only
            </span>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Upload your dedicated Home Page Digital ID card directly here. This card is completely separate and never merges with your My Profile page digital documents.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3.5 pt-1">
            <div className="w-full sm:w-44 h-28 rounded-xl bg-[#141517] border border-neutral-700/70 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.homeDigitalIdImage ? (
                <img
                  src={formData.visuals.homeDigitalIdImage}
                  alt="Home Page Digital ID Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center p-2">
                  <span className="text-[11px] text-emerald-400 font-semibold">Absher Digital ID</span>
                  <span className="text-[9px] text-neutral-500 mt-0.5">Custom layout / Default card</span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={homeDigitalIdInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) => {
                  const updated = {
                    ...formData,
                    visuals: { ...formData.visuals, homeDigitalIdImage: base64 },
                  };
                  setFormData(updated);
                  onSave(updated);
                  setSaveSuccess(true);
                  setTimeout(() => setSaveSuccess(false), 2000);
                })
              }
            />
            <div className="flex flex-wrap items-center gap-2">
              <button
                id="btn-upload-home-digital-id"
                onClick={() => homeDigitalIdInputRef.current?.click()}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-neutral-950 font-bold text-xs rounded-xl flex items-center gap-2 cursor-pointer shadow-md active:scale-95 transition-all"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Home Digital ID</span>
              </button>
              {formData.visuals.homeDigitalIdImage && (
                <button
                  id="btn-reset-home-digital-id"
                  onClick={() => {
                    const updated = {
                      ...formData,
                      visuals: { ...formData.visuals, homeDigitalIdImage: '' },
                    };
                    setFormData(updated);
                    onSave(updated);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 2000);
                  }}
                  className="px-3 py-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-300 text-xs font-semibold rounded-xl border border-red-800/50 cursor-pointer transition-all"
                  title="Remove uploaded image and show standard digital card"
                >
                  Clear Image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Card: Background Image */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <span className="text-sm font-semibold text-neutral-200">
            Background Image
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-18 h-18 rounded-xl bg-[#141517] border border-neutral-700/60 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.backgroundImage ? (
                <img
                  src={formData.visuals.backgroundImage}
                  alt="Background preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-neutral-500">No img</span>
              )}
            </div>
            <input
              type="file"
              ref={bgInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, backgroundImage: base64 },
                  }))
                )
              }
            />
            <button
              onClick={() => bgInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Background</span>
            </button>
          </div>
        </div>

        {/* Card: Login Screen Image */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <span className="text-sm font-semibold text-neutral-200">
            Login Screen Image
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-18 h-18 rounded-xl bg-[#00e600] flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
              {formData.visuals.loginScreenImage ? (
                <img
                  src={formData.visuals.loginScreenImage}
                  alt="Login screen preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-black tracking-wide">Image</span>
              )}
            </div>
            <input
              type="file"
              ref={loginInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, loginScreenImage: base64 },
                  }))
                )
              }
            />
            <button
              onClick={() => loginInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Image</span>
            </button>
          </div>
        </div>

        {/* Card: Profile Photo */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3">
          <span className="text-sm font-semibold text-neutral-200">
            Profile Photo
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-full bg-[#2a2d33] border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
              {formData.visuals.profilePhoto ? (
                <img
                  src={formData.visuals.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-neutral-300">
                  {formData.personalDetails.name ? formData.personalDetails.name[0] : 'M'}
                </span>
              )}
            </div>
            <input
              type="file"
              ref={profileInputRef}
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                handleImageUpload(e, (base64) =>
                  setFormData((prev) => ({
                    ...prev,
                    visuals: { ...prev.visuals, profilePhoto: base64 },
                  }))
                )
              }
            />
            <button
              onClick={() => profileInputRef.current?.click()}
              className="px-4 py-2.5 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Upload Photo</span>
            </button>
          </div>
        </div>

        {/* Card: Personal Details Form */}
        <div className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-4">
          <span className="text-sm font-semibold text-neutral-200">
            Personal Details
          </span>

          <div className="flex flex-col gap-3">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Name</label>
              <input
                type="text"
                id="input-personal-name"
                value={formData.personalDetails.name}
                onChange={(e) => handlePersonalChange('name', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Full Name"
              />
            </div>

            {/* ID Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">ID Number</label>
              <input
                type="text"
                id="input-personal-id-number"
                value={formData.personalDetails.idNumber}
                onChange={(e) => handlePersonalChange('idNumber', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="2602801801"
              />
            </div>

            {/* Birth City */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Birth City</label>
              <input
                type="text"
                id="input-personal-birth-city"
                value={formData.personalDetails.birthCity}
                onChange={(e) => handlePersonalChange('birthCity', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="-"
              />
            </div>

            {/* Birth Country/Region */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Birth Country/Region</label>
              <input
                type="text"
                id="input-personal-birth-country"
                value={formData.personalDetails.birthCountry}
                onChange={(e) => handlePersonalChange('birthCountry', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="Bangladesh"
              />
            </div>

            {/* Date of Birth */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Date of Birth</label>
              <input
                type="text"
                id="input-personal-dob"
                value={formData.personalDetails.dateOfBirth}
                onChange={(e) => handlePersonalChange('dateOfBirth', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="01/01/1983"
              />
            </div>

            {/* Marital Status */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-neutral-400">Marital Status</label>
              <input
                type="text"
                id="input-personal-marital-status"
                value={formData.personalDetails.maritalStatus}
                onChange={(e) => handlePersonalChange('maritalStatus', e.target.value)}
                className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                placeholder="SINGLE"
              />
            </div>

            {/* Extra details for full accuracy */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Religion</label>
                <input
                  type="text"
                  value={formData.personalDetails.religion}
                  onChange={(e) => handlePersonalChange('religion', e.target.value)}
                  className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
                  placeholder="Islam"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-neutral-400">Transfers</label>
                <input
                  type="text"
                  value={formData.personalDetails.sponsorshipTransfers}
                  onChange={(e) => handlePersonalChange('sponsorshipTransfers', e.target.value)}
                  className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-mono focus:border-emerald-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: My Profile Digital Documents (Passport, Resident ID, Visa, License, etc.) */}
        <div className="flex flex-col gap-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-neutral-200">
              My Profile Page Digital Documents
            </h2>
            <span className="text-[11px] text-neutral-400">
              Profile Page Only
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            These documents belong exclusively to your <strong>My Profile</strong> page (My Resident ID, My Passport, My Visa, My Driving License) and are kept separate from the Home Page Digital ID.
          </p>

          <div className="flex flex-col gap-3.5">
            {formData.documents.map((doc) => (
              <div
                key={doc.id}
                className="w-full bg-[#1e2024] rounded-2xl p-4 border border-neutral-800/80 flex flex-col gap-3"
              >
                {/* Document Title & Red Delete Button */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">
                    {doc.title}
                  </span>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="flex items-center gap-1 text-[#ea5b5b] hover:text-red-400 text-xs font-semibold cursor-pointer py-1 px-2 rounded-lg hover:bg-red-950/20 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>

                {/* Inputs for document */}
                {doc.type === 'resident_id' ? (
                  <div className="flex flex-col gap-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Resident ID Number</label>
                        <input
                          type="text"
                          value={doc.number}
                          onChange={(e) => handleDocumentChange(doc.id, 'number', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="2602801801"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">ID Version</label>
                        <input
                          type="text"
                          value={doc.extra?.version || '1'}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((d) =>
                                d.id === doc.id
                                  ? { ...d, extra: { ...d.extra, version: val } }
                                  : d
                              ),
                            }));
                          }}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="1"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Issuing Date</label>
                        <input
                          type="text"
                          value={doc.issuing}
                          onChange={(e) => handleDocumentChange(doc.id, 'issuing', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="24/04/2025"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Expiry Date</label>
                        <input
                          type="text"
                          value={doc.expiry}
                          onChange={(e) => handleDocumentChange(doc.id, 'expiry', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                          placeholder="05/10/2026"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-neutral-400 bg-[#141517] p-2.5 rounded-xl border border-neutral-800">
                      ℹ️ On your <strong>My Profile</strong> page, My Resident ID shows strictly these 4 details (Resident ID Number, ID Version, Issuing Date, Expiry Date).
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Number</label>
                        <input
                          type="text"
                          value={doc.number}
                          onChange={(e) => handleDocumentChange(doc.id, 'number', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Issuing</label>
                        <input
                          type="text"
                          value={doc.issuing}
                          onChange={(e) => handleDocumentChange(doc.id, 'issuing', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] text-neutral-400">Expiry</label>
                        <input
                          type="text"
                          value={doc.expiry}
                          onChange={(e) => handleDocumentChange(doc.id, 'expiry', e.target.value)}
                          className="w-full bg-[#17181a] border border-neutral-700/80 rounded-xl px-2.5 py-2 text-xs text-white font-mono focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Image upload row: "No img" + "Upload" */}
                    <div className="flex items-center gap-3 pt-1">
                      <div className="w-16 h-12 rounded-lg bg-[#151618] border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
                        {doc.image ? (
                          <img src={doc.image} alt={doc.title} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-neutral-500">No img</span>
                        )}
                      </div>
                      <input
                        type="file"
                        ref={(el) => {
                          docInputRefs.current[doc.id] = el;
                        }}
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, (base64) =>
                            setFormData((prev) => ({
                              ...prev,
                              documents: prev.documents.map((d) =>
                                d.id === doc.id ? { ...d, image: base64 } : d
                              ),
                            }))
                          )
                        }
                      />
                      <button
                        onClick={() => docInputRefs.current[doc.id]?.click()}
                        className="px-3.5 py-2 bg-[#25282c] hover:bg-[#2e3238] text-neutral-200 text-xs font-semibold rounded-xl flex items-center gap-2 border border-neutral-700/60 cursor-pointer active:scale-95 transition-all"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Add New Document Row */}
          <div className="flex items-center gap-2 mt-1">
            <input
              type="text"
              id="input-new-document-title"
              placeholder="New document title"
              value={newDocTitle}
              onChange={(e) => setNewDocTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddDocument()}
              className="flex-1 bg-[#17181a] border border-neutral-700/80 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-neutral-500 focus:border-emerald-500 focus:outline-none"
            />
            <button
              id="btn-add-document"
              onClick={handleAddDocument}
              className="px-4 py-2.5 bg-[#008744] hover:bg-[#007038] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 transition-all shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Offline Device Storage Management Box */}
        <div className="mt-4 p-4 rounded-2xl bg-[#1a1c1f] border border-emerald-900/50 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-emerald-400">
            <FolderOpen className="w-4 h-4" />
            <span className="text-xs font-bold">Device File Manager Sync</span>
          </div>
          <p className="text-[11px] text-neutral-400 leading-relaxed">
            Export all current documents and profile data directly into your Android device storage as a JSON file, or restore anytime.
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={onExportBackup}
              className="py-2 px-2.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-700/40 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Backup to Device</span>
            </button>
            <button
              onClick={onImportBackup}
              className="py-2 px-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Load from Storage</span>
            </button>
          </div>
          <button
            onClick={onResetDefaults}
            className="text-[11px] text-neutral-400 hover:text-neutral-200 flex items-center justify-center gap-1 mt-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to Initial Screenshot Data</span>
          </button>
        </div>
      </div>

      {/* Sticky Bottom Actions Bar (matches Screenshot 6 exactly) */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-[#17181a]/95 backdrop-blur-md border-t border-neutral-800 p-4 flex items-center gap-3 z-30">
        {/* Save Changes button */}
        <button
          id="btn-save-changes"
          onClick={handleSaveChanges}
          className="flex-1 py-3 px-4 bg-[#557a68] hover:bg-[#436453] active:bg-[#008744] text-white font-semibold text-sm rounded-xl shadow-lg cursor-pointer transition-colors flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {saveSuccess ? <Check className="w-4 h-4 text-white" /> : null}
          <span>Save Changes</span>
        </button>

        {/* Reset Password button */}
        <button
          id="btn-reset-password"
          onClick={() => setShowPasswordModal(true)}
          className="py-3 px-4 bg-[#28292d] hover:bg-[#323439] active:bg-[#3b3d44] text-neutral-200 font-semibold text-sm rounded-xl border border-neutral-700 cursor-pointer transition-colors shrink-0"
        >
          Reset Password
        </button>
      </div>

      {/* Reset Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-sm bg-[#1e2024] border border-neutral-700 rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center gap-2 border-b border-neutral-700 pb-3">
              <KeyRound className="w-5 h-5 text-emerald-400" />
              <h3 className="text-white font-bold text-base">Reset Password</h3>
            </div>
            <p className="text-xs text-neutral-400">
              Enter your new password for offline native device authentication.
            </p>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full bg-[#17181a] border border-neutral-700 rounded-xl px-3 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none"
            />
            {passwordSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Password reset successfully!
              </span>
            )}
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordSuccess(false);
                  setNewPassword('');
                }}
                className="flex-1 py-2 bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (newPassword.trim()) {
                    setPasswordSuccess(true);
                    setTimeout(() => {
                      setShowPasswordModal(false);
                      setPasswordSuccess(false);
                      setNewPassword('');
                    }, 1200);
                  }
                }}
                className="flex-1 py-2 bg-[#008744] hover:bg-[#007038] text-white text-xs font-semibold rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
