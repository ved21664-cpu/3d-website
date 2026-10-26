import React from 'react';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  visible: boolean;
}

const NAV_LINKS = [
  { label: 'Monograph', id: 'studio-intro' },
  { label: 'Works', id: 'selected-projects' },
  { label: 'Practice', id: 'services' },
  { label: 'Contact', id: 'contact' },
];

export const Navbar: React.FC<NavbarProps> = ({ onNavigate, visible }) => {
  return (
    <header
      style={{ transition: 'opacity 0.7s ease, transform 0.7s ease' }}
      className={`fixed top-0 left-0 right-0 z-50 ${visible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-3 pointer-events-none'
        }`}
    >
      {/* Hairline rule sits below nav */}
      <div className="relative border-b border-white/10" style={{ background: 'rgba(8, 8, 8, 0.55)', backdropFilter: 'blur(12px) saturate(1.2)', WebkitBackdropFilter: 'blur(12px) saturate(1.2)' }}>
        <div
          style={{ maxWidth: '1440px', padding: '0 48px' }}
          className="mx-auto h-14 flex items-center justify-between"
        >
          {/* Brand */}
          <button
            onClick={() => onNavigate('hero-experience')}
            className="font-mono-tech text-[11px] text-white tracking-[0.18em] uppercase focus:outline-none cursor-pointer hover:opacity-50 transition-opacity duration-200"
          >
            VED KAMAT
          </button>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className="link-underline font-editorial text-[13px] font-light text-white/60 hover:text-white transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA */}
          <button
            onClick={() => onNavigate('contact')}
            className="hidden sm:flex items-center gap-2 cursor-pointer"
          >
            <span className="font-mono-tech text-[10px] tracking-[0.18em] uppercase text-white hover:opacity-50 transition-opacity duration-200">
              Inquire ↗
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
