import React, { useState, useEffect, useRef } from 'react';

export const ContactCTA: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full section-rule"
      style={{ padding: '120px 0 160px' }}
    >
      <div style={{ maxWidth: '1440px', padding: '0 48px' }} className="mx-auto">
        {/* ── Left ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-y-16 lg:gap-x-24 items-start">
          <div className="lg:col-span-5 space-y-12">
            <div>
              <div className="animate-in font-mono-tech text-[10px] tracking-[0.28em] text-white/40 uppercase mb-6">
                04 / Commissions
              </div>
              <h2 className="animate-in delay-1 font-headline text-[clamp(3rem,6vw,5.5rem)] text-white uppercase leading-[0.9] tracking-tight">
                Let's<br />Build.
              </h2>
              <p className="animate-in delay-2 font-editorial text-[13px] leading-[1.9] text-white/55 max-w-xs mt-6">
                Now accepting private residential and commercial commissions for 2026 / 2027.
              </p>
            </div>

            <div className="animate-in delay-3 pt-8 border-t border-white/10 space-y-5">
              {[
                { city: 'New York', line: '448 West Broadway, SoHo, NY 10012' },
                { city: 'Copenhagen', line: 'Bredgade 34, 1260 København K' },
                { city: 'Direct', line: 'inquiries@atelierveda.com' },
              ].map((item) => (
                <div key={item.city} className="grid grid-cols-3 gap-4">
                  <div className="font-mono-tech text-[10px] tracking-[0.18em] text-white uppercase">
                    {item.city}
                  </div>
                  <div className="col-span-2 font-editorial text-[12px] text-white/45 leading-relaxed">
                    {item.line}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="lg:col-span-7">
            {submitted ? (
              <div
                className="animate-in border border-white/15 p-10 space-y-3 rounded-xl backdrop-blur-sm"
                style={{ background: 'rgba(255, 255, 255, 0.05)' }}
              >
                <div className="font-mono-tech text-[10px] tracking-widest text-white/40 uppercase">
                  Transmitted
                </div>
                <h3 className="font-headline text-2xl text-white uppercase">
                  Inquiry Received
                </h3>
                <p className="font-editorial text-[13px] text-white/50 leading-relaxed">
                  Our principal director will respond within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {[
                  { id: 'name', label: 'Name', type: 'text', field: 'name' },
                  { id: 'email', label: 'Email', type: 'email', field: 'email' },
                ].map((f, i) => (
                  <div key={f.id} className={`animate-in delay-${i + 1}`}>
                    <label
                      htmlFor={f.id}
                      className="block font-mono-tech text-[9px] tracking-[0.28em] text-white/35 uppercase mb-3"
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      required
                      value={formData[f.field as keyof typeof formData]}
                      onChange={(e) => setFormData({ ...formData, [f.field]: e.target.value })}
                      className="form-input"
                      placeholder={f.label}
                    />
                  </div>
                ))}

                <div className="animate-in delay-3">
                  <label
                    htmlFor="brief"
                    className="block font-mono-tech text-[9px] tracking-[0.28em] text-white/35 uppercase mb-3"
                  >
                    Project Brief
                  </label>
                  <textarea
                    id="brief"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="form-input resize-none"
                    placeholder="Describe your project and location"
                  />
                </div>

                <div className="animate-in delay-4">
                  <button
                    type="submit"
                    className="w-full py-4 bg-white text-black font-mono-tech text-[10px] tracking-[0.28em] uppercase hover:bg-white/85 transition-colors duration-200 cursor-pointer flex items-center justify-center gap-3 mt-2 font-bold"
                  >
                    <span>Send Inquiry</span>
                    <span>↗</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
