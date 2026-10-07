import React from 'react';
import { AlertTriangle, PhoneCall } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../utils/translations';

export const DisclaimerBanner: React.FC<{ lang: Language }> = ({ lang }) => {
  const t = translations[lang];

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-900 dark:text-amber-200 py-2 px-4 text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-center sm:text-left">
          <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 animate-pulse" />
          <span className="font-medium">
            <strong>HACKATHON DEMO PROTOTYPE:</strong> {t.disclaimer}
          </span>
        </div>
        <div className="flex items-center space-x-3 flex-shrink-0 font-semibold text-amber-700 dark:text-amber-300">
          <span className="flex items-center">
            <PhoneCall className="w-3.5 h-3.5 mr-1" />
            National Emergency: <strong className="ml-1 text-red-600 dark:text-red-400 font-extrabold">112 / 108</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
