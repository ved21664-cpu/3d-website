import React, { useEffect, useRef } from 'react';

export const StudioIntro: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const els = sectionRef.current?.querySelectorAll('.animate-in');
    if (!els) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.animationPlayState = 'running';
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    els.forEach((el) => {
      (el as HTMLElement).style.animationPlayState = 'paused';
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return (
    <section
      id="studio-intro"
      ref={sectionRef}
      className="relative w-full section-rule"
      style={{ padding: '120px 0 140px' }}
    >
      <div style={{ maxWidth: '1440px', padding: '0 48px' }} className="mx-auto">

        {/* ── Label ── */}
        <div className="animate-in font-mono-tech text-[10px] tracking-[0.28em] text-white/40 uppercase mb-16">
          01 / Monograph
        </div>

        {/* ── Headline + body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-x-24 items-end mb-24">
          <div className="lg:col-span-8">
            <h2 className="animate-in delay-1 font-headline text-[clamp(3rem,7vw,6.5rem)] text-white uppercase leading-[0.92]">
              Form Follows<br />
              <span style={{ color: 'rgba(255,255,255,0.30)' }}>Atmosphere.</span>
            </h2>
          </div>
          <div className="lg:col-span-4 lg:pb-3">
            <p className="animate-in delay-2 font-editorial text-[14px] leading-[1.85] text-white/60 max-w-xs">
              We engineer architectural spaces as contiguous sensory organisms — no decorative veneers, only structural mass, uninhibited daylight, and honest materials.
            </p>
          </div>
        </div>

        {/* ── 3 pillars ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-white/10">
          {[
            {
              num: '01',
              label: 'Massing',
              title: 'Volumetric Order',
              body: 'Column-free spans and post-tensioned cores designed to maximise spatial volume and vistas.',
            },
            {
              num: '02',
              label: 'Light',
              title: 'Circadian Grazing',
              body: 'Concealed cove channels calibrated to transition seamlessly from noon to dusk.',
            },
            {
              num: '03',
              label: 'Material',
              title: 'Tactile Truth',
              body: 'Honed basalt, smoked European oak, cast micro-cement, and hand-patinated bronze.',
            },
          ].map((p, i) => (
            <div
              key={p.num}
              className={`animate-in delay-${i + 2} pt-10 pb-10 pr-12 ${i < 2 ? 'md:border-r border-white/10' : ''
                } ${i > 0 ? 'md:pl-12' : ''}`}
            >
              <div className="font-mono-tech text-[9px] tracking-[0.28em] text-white/35 uppercase mb-5">
                {p.num} / {p.label}
              </div>
              <h3 className="font-headline text-[22px] text-white uppercase tracking-tight mb-3">
                {p.title}
              </h3>
              <p className="font-editorial text-[13px] leading-[1.8] text-white/50">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
