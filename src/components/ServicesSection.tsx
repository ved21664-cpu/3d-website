import React, { useEffect, useRef } from 'react';

const DISCIPLINES = [
  {
    num: '01',
    title: 'Residential Interior Design',
    scope: 'Full spatial volumetric planning, custom millwork, lighting orchestration, art curation.',
  },
  {
    num: '02',
    title: 'Commercial & Hospitality',
    scope: 'Experiential hospitality, luxury retail, and contemplative headquarters.',
  },
  {
    num: '03',
    title: 'Architectural Planning',
    scope: 'Structural grid alignment, facade fenestration, building envelope optimisation.',
  },
  {
    num: '04',
    title: 'Turnkey Execution',
    scope: 'Rigorous construction administration, artisan trades oversight, millimeter tolerances.',
  },
  {
    num: '05',
    title: 'Bespoke Furniture & Joinery',
    scope: 'Collector-grade monolithic stone tables, custom smoked oak cabinetry, patinated bronze.',
  },
];

export const ServicesSection: React.FC = () => {
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
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative w-full section-rule"
      style={{ padding: '120px 0 140px' }}
    >
      <div style={{ maxWidth: '1440px', padding: '0 48px' }} className="mx-auto">

        {/* ── Header ── */}
        <div className="flex items-end justify-between mb-16 pb-6 border-b border-white/10">
          <div>
            <div className="animate-in font-mono-tech text-[10px] tracking-[0.28em] text-white/40 uppercase mb-3">
              03 / Practice
            </div>
            <h2 className="animate-in delay-1 font-headline text-[clamp(2.6rem,5vw,5rem)] text-white uppercase tracking-tight">
              Disciplines
            </h2>
          </div>
          <div className="animate-in delay-2 font-mono-tech text-[10px] tracking-[0.18em] text-white/35 uppercase">
            End-to-End
          </div>
        </div>

        {/* ── Row list ── */}
        <div className="divide-y divide-white/10">
          {DISCIPLINES.map((d, i) => (
            <div
              key={d.num}
              className={`animate-in delay-${Math.min(i + 1, 4)} service-row py-8 px-4 -mx-4 rounded-xl hover:bg-white/[0.04] transition-all duration-200 grid grid-cols-12 gap-6 items-baseline`}
            >
              <div className="col-span-1 font-mono-tech text-[10px] text-white/35 tracking-widest">
                {d.num}
              </div>
              <div className="col-span-7 font-headline text-[clamp(1.2rem,2vw,1.75rem)] text-white uppercase tracking-tight">
                {d.title}
              </div>
              <div className="col-span-4 font-editorial text-[12px] leading-[1.8] text-white/50">
                {d.scope}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
