import React, { useEffect, useRef } from 'react';

interface Project {
  id: string;
  title: string;
  location: string;
  year: string;
  category: string;
  area: string;
}

const PROJECTS: Project[] = [
  {
    id: 'basalt-residence',
    title: 'Basalt Residence',
    location: 'Aspen, Colorado',
    year: '2025',
    category: 'Private Villa',
    area: '6,400 sq.ft',
  },
  {
    id: 'penthouse-monolith',
    title: 'Tribeca Duplex',
    location: 'New York City',
    year: '2024',
    category: 'Duplex Penthouse',
    area: '4,850 sq.ft',
  },
  {
    id: 'pavilion-lago',
    title: 'Lago Pavilion',
    location: 'Lake Como, Italy',
    year: '2024',
    category: 'Waterfront Villa',
    area: '5,200 sq.ft',
  },
  {
    id: 'atelier-loft',
    title: 'Nordic Loft',
    location: 'Copenhagen, Denmark',
    year: '2023',
    category: 'Warehouse Conversion',
    area: '3,600 sq.ft',
  },
];

const BG_COLORS = ['rgba(255, 255, 255, 0.08)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0.07)', 'rgba(255, 255, 255, 0.06)'];

export const SelectedProjects: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.animate-in');
    if (!els) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationPlayState = 'running';
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="selected-projects"
      ref={sectionRef}
      className="relative w-full section-rule"
      style={{ padding: '120px 0 140px' }}
    >
      <div style={{ maxWidth: '1440px', padding: '0 48px' }} className="mx-auto">

        {/* ── Header row ── */}
        <div className="flex items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="animate-in font-mono-tech text-[10px] tracking-[0.28em] text-white/40 uppercase mb-3">
              02 / Selected Works
            </div>
            <h2 className="animate-in delay-1 font-headline text-[clamp(2.6rem,5vw,5rem)] text-white uppercase tracking-tight">
              Portfolio
            </h2>
          </div>
          <div className="animate-in delay-2 font-mono-tech text-[10px] tracking-[0.18em] text-white/35 uppercase">
            04 Commissions
          </div>
        </div>

        {/* ── Project rows ── */}
        <div className="divide-y divide-white/10">
          {PROJECTS.map((project, idx) => (
            <div
              key={project.id}
              className={`animate-in delay-${Math.min(idx + 1, 4)} project-card group py-8 px-4 -mx-4 rounded-xl hover:bg-white/[0.04] transition-all duration-300 grid grid-cols-12 gap-6 items-center`}
            >
              {/* Index */}
              <div className="col-span-1 font-mono-tech text-[10px] text-white/35 tracking-widest">
                0{idx + 1}
              </div>

              {/* Thumbnail */}
              <div
                className="col-span-2 aspect-[4/3] rounded-lg overflow-hidden border border-white/10 backdrop-blur-sm"
                style={{ background: BG_COLORS[idx] }}
              >
                <div className="card-img w-full h-full flex items-center justify-center">
                  <span
                    className="font-mono-tech text-[9px] tracking-widest text-white/35 uppercase"
                    aria-hidden
                  >
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Title + location */}
              <div className="col-span-5 pl-2">
                <h3 className="font-headline text-[clamp(1.4rem,2.5vw,2.2rem)] text-white uppercase tracking-tight group-hover:text-white/70 transition-colors duration-300">
                  {project.title}
                </h3>
                <div className="font-editorial text-[12px] text-white/45 mt-1">
                  {project.location}
                </div>
              </div>

              {/* Meta */}
              <div className="col-span-3 flex flex-col items-end gap-1 font-mono-tech text-[10px] tracking-widest text-white/40 uppercase">
                <div>{project.area}</div>
                <div>{project.year}</div>
                <div className="mt-2 text-white/25">{project.category}</div>
              </div>

              {/* Arrow */}
              <div className="col-span-1 flex justify-end">
                <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 group-hover:border-white group-hover:text-white transition-all duration-300 text-xs">
                  ↗
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
