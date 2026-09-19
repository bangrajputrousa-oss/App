import React from 'react';
import { ShieldCheck, FileCheck, Car, Briefcase, Calendar, HelpCircle, ChevronRight } from 'lucide-react';
import { ScreenType } from '../types';

interface ServicesScreenProps {
  onNavigate: (screen: ScreenType) => void;
}

export const ServicesScreen: React.FC<ServicesScreenProps> = ({ onNavigate }) => {
  const serviceCategories = [
    {
      title: 'Civil Affairs (الأحوال المدنية)',
      desc: 'National Registry, ID renewal, family registers',
      icon: ShieldCheck,
      action: () => onNavigate('resident_id'),
    },
    {
      title: 'Passports / Jawazat (الجوازات)',
      desc: 'Resident permit, visa issuance, travel authorization',
      icon: FileCheck,
      action: () => onNavigate('passport'),
    },
    {
      title: 'Traffic / Muroor (المرور)',
      desc: 'Driving licenses, vehicle renewal, traffic violations',
      icon: Car,
      action: () => onNavigate('license'),
    },
    {
      title: 'Expatriate & Labor Affairs (العمالة)',
      desc: 'Work permits, sponsorship transfer, contracts',
      icon: Briefcase,
      action: () => onNavigate('personal_details'),
    },
    {
      title: 'Appointments (المواعيد)',
      desc: 'Book or verify government ministry visits',
      icon: Calendar,
      action: () => {},
    },
    {
      title: 'General Inquiries (الاستعلامات)',
      desc: 'Document status, query validity offline',
      icon: HelpCircle,
      action: () => {},
    },
  ];

  return (
    <div id="screen-services" className="flex-1 flex flex-col overflow-y-auto bg-[#131416] text-white">
      {/* Header */}
      <div className="bg-[#006837] px-4 py-3.5 shadow-md shrink-0">
        <h1 className="text-white text-lg font-bold tracking-tight">
          Services
        </h1>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-1 pb-8">
        <p className="text-xs text-neutral-400">
          Access all public and government digital services offline
        </p>

        <div className="flex flex-col gap-2.5">
          {serviceCategories.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                onClick={item.action}
                className="bg-[#222428] hover:bg-[#282b30] border border-neutral-800 rounded-xl p-4 flex items-center gap-3.5 cursor-pointer transition-all active:scale-[0.99] shadow-sm"
              >
                <div className="w-10 h-10 rounded-xl bg-neutral-800 flex items-center justify-center text-emerald-400 border border-neutral-700/40 shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-bold text-sm leading-snug truncate">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 text-xs mt-0.5 truncate">
                    {item.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
