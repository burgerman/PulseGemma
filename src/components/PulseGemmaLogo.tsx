import React from 'react';

interface PulseGemmaLogoProps {
  height?: string;
  className?: string;
}

export const PulseGemmaLogo: React.FC<PulseGemmaLogoProps> = ({
  height = 'h-6',
  className = ''
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Small, sleek custom image logo from user asset */}
      <img
        src="/PulseGemma.png"
        alt="PulseGemma Logo"
        className={`${height} w-auto object-contain rounded-md filter drop-shadow-sm hover:scale-105 transition-transform duration-200`}
      />
      <span className="text-[9px] font-mono font-bold text-rose-300 bg-rose-500/15 border border-rose-500/30 px-1.5 py-0.2 rounded">
        CDS ENGINE
      </span>
    </div>
  );
};
