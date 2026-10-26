import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Navbar } from './components/Navbar';
import { HouseTransformationSection } from './components/HouseTransformationSection';
import { StudioIntro } from './components/StudioIntro';
import { SelectedProjects } from './components/SelectedProjects';
import { ServicesSection } from './components/ServicesSection';
import { ContactCTA } from './components/ContactCTA';
import { Footer } from './components/Footer';

gsap.registerPlugin(ScrollTrigger);

export function App() {
  const [animationDone, setAnimationDone] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  /* ── Lenis smooth scroll ── */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  /* ── Scrub the content panel rising over the video ── */
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    // The hero scroll zone is #hero-experience.
    // We scrub the content panel from translateY(90vh) → translateY(0)
    // while the hero is still in its pinned range — so it slides over the video.
    const st = ScrollTrigger.create({
      trigger: '#hero-experience',
      // Start rising when hero is 70% scrolled, finish when hero scroll ends
      start: 'top+=70% top',
      end: 'bottom top',
      scrub: 0.5,
      onUpdate: (self) => {
        // Map 0→1 to translateY(92vh)→translateY(0)
        const y = (1 - self.progress) * 92;
        gsap.set(content, { y: `${y}vh` });
      },
    });

    return () => st.kill();
  }, []);

  const handleProgress = (p: number) => {
    if (p >= 0.95) {
      setAnimationDone(true);
    } else if (p < 0.85) {
      setAnimationDone(false);
    }
  };

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    /* Dark void behind the canvas */
    <div style={{ background: '#080808', color: '#f5f5f5' }}>
      <Navbar onNavigate={handleNavigate} visible={animationDone} />

      <main style={{ position: 'relative' }}>

        {/* ── Hero: pinned canvas, full scroll area ── */}
        <HouseTransformationSection onProgress={handleProgress} />

        {/* ── Content card: overlaps the video as you scroll ── */}
        <div
          ref={contentRef}
          style={{
            /* Pull it up so it starts inside the hero scroll zone */
            marginTop: '-100vh',
            /* Rise over the canvas */
            position: 'relative',
            zIndex: 20,
            /* Initial translate applied by GSAP (starts at 92vh below) */
            transform: 'translateY(92vh)',
            /* Highly transparent dark smoked glass — clear view of house in background */
            background: 'rgba(8, 8, 8, 0.40)',
            backdropFilter: 'blur(6px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(6px) saturate(1.2)',
            borderRadius: '24px 24px 0 0',
            borderTop: '1px solid rgba(255, 255, 255, 0.15)',
            boxShadow: '0 -24px 80px rgba(0,0,0,0.8), 0 -1px 0 rgba(255,255,255,0.08) inset',
            willChange: 'transform',
            overflow: 'hidden',
            color: '#f5f5f5',
          }}
        >
          {/* Inner top handle — visual cue that this is a rising card */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '14px',
              paddingBottom: '2px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '3px',
                borderRadius: '99px',
                background: 'rgba(255, 255, 255, 0.25)',
              }}
            />
          </div>

          {/* Gradient top edge — depth */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '1px',
              background:
                'linear-gradient(90deg, transparent, rgba(255,255,255,0.35) 30%, rgba(255,255,255,0.35) 70%, transparent)',
            }}
          />

          <StudioIntro />
          <SelectedProjects />
          <ServicesSection />
          <ContactCTA />
          <Footer onScrollToTop={handleScrollToTop} />
        </div>
      </main>
    </div>
  );
}

export default App;
