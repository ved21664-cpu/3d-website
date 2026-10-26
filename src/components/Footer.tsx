import React from 'react';

interface FooterProps {
  onScrollToTop: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onScrollToTop }) => {
  return (
    <footer className="w-full section-rule" style={{ padding: '40px 0' }}>
      <div
        style={{ maxWidth: '1440px', padding: '0 48px' }}
        className="mx-auto flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        {/* Brand */}
        <div className="font-mono-tech text-[10px] tracking-[0.22em] text-white uppercase">
          Ved Kamat © {new Date().getFullYear()}
        </div>

        {/* Locations */}
        <div className="font-mono-tech text-[9px] tracking-[0.18em] text-white/35 uppercase hidden sm:block">
          New York · Copenhagen · Tokyo
        </div>

        {/* Back to top */}
        <button
          onClick={onScrollToTop}
          className="font-mono-tech text-[10px] tracking-[0.18em] text-white/40 hover:text-white uppercase transition-colors duration-200 cursor-pointer flex items-center gap-2"
        >
          <span>Top</span>
          <span className="text-[11px]">↑</span>
        </button>
      </div>
    </footer>
  );
};
