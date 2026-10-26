import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 240 frames at 24 fps from the original 10-second master render
const TOTAL_FRAMES = 240;

interface AnnotationData {
  step: string;
  title: string;
  category: string;
  description: string;
  range: [number, number];
  position: 'left' | 'right';
  displacement: string;
}

const ANNOTATIONS: AnnotationData[] = [
  {
    step: '01',
    category: 'STRUCTURE',
    title: 'Post-Tensioned Massing',
    description: 'Post-tensioned concrete superstructure engineered for column-free expanses.',
    range: [0.12, 0.38],
    position: 'left',
    displacement: '+4.2M',
  },
  {
    step: '02',
    category: 'VOLUME',
    title: 'Double-Height Gallery',
    description: 'Double-height central living volume with cantilevered mezzanine circulation.',
    range: [0.36, 0.62],
    position: 'right',
    displacement: '+6.8M',
  },
  {
    step: '03',
    category: 'MATERIALS',
    title: 'Basalt & Smoked Oak',
    description: 'Honed dark basalt stone hearth paired with smoked European oak millwork.',
    range: [0.60, 0.84],
    position: 'left',
    displacement: '+9.4M',
  },
  {
    step: '04',
    category: 'ATMOSPHERE',
    title: 'Concealed Illumination',
    description: 'Perimeter cove grazing and integrated micro-perforated acoustic reveals.',
    range: [0.82, 1.0],
    position: 'right',
    displacement: '+12.4M',
  },
];

interface Props {
  onProgress?: (p: number) => void;
}

export const HouseTransformationSection: React.FC<Props> = ({ onProgress }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const loadBarRef = useRef<HTMLDivElement>(null);
  const loadLabelRef = useRef<HTMLDivElement>(null);

  // Hot-path DOM refs — zero React state re-renders on scroll
  const pctLabelRef = useRef<HTMLDivElement>(null);
  const axisLabelRef = useRef<HTMLDivElement>(null);
  const rightUiRef = useRef<HTMLDivElement>(null);
  const annoRef = useRef<HTMLDivElement>(null);
  const annoStepRef = useRef<HTMLDivElement>(null);
  const annoTitleRef = useRef<HTMLHeadingElement>(null);
  const annoDescRef = useRef<HTMLParagraphElement>(null);
  const annoDispRef = useRef<HTMLDivElement>(null);

  // Preloaded frame store
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES).fill(null));
  const targetFrameRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastRenderedIdxRef = useRef(-1);
  const lastAnnoIdx = useRef(-1);
  const rafId = useRef<number | null>(null);

  // Helper: format frame URL (frame_001.webp to frame_240.webp)
  const getFrameUrl = (idx: number) => {
    const num = String(idx + 1).padStart(3, '0');
    return `/frames/frame_${num}.webp`;
  };

  // Helper: get frame or closest loaded frame so there is zero flicker
  const getFrame = (idx: number): HTMLImageElement | null => {
    const direct = imagesRef.current[idx];
    if (direct && direct.complete && direct.naturalWidth > 0) return direct;

    // Search closest loaded frame in either direction
    for (let d = 1; d < TOTAL_FRAMES; d++) {
      const prev = imagesRef.current[idx - d];
      if (prev && prev.complete && prev.naturalWidth > 0) return prev;
      const next = imagesRef.current[idx + d];
      if (next && next.complete && next.naturalWidth > 0) return next;
    }
    return imagesRef.current[0] || null;
  };

  /* ─── 1. Preload 240 WebP frames with instant frame-1 display ─── */
  useEffect(() => {
    let cancelled = false;
    let loadedCount = 0;

    // First: load frame 1 immediately and draw to canvas with zero delay
    const firstImg = new Image();
    firstImg.src = getFrameUrl(0);
    firstImg.onload = () => {
      if (cancelled) return;
      imagesRef.current[0] = firstImg;
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = 1920;
        canvas.height = 1080;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (ctx) {
          ctx.drawImage(firstImg, 0, 0, 1920, 1080);
          lastRenderedIdxRef.current = 0;
        }
      }
    };

    // Load all remaining frames in parallel
    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = getFrameUrl(i);

      const onDone = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        loadedCount++;

        const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
        if (loadBarRef.current) loadBarRef.current.style.width = `${pct}%`;
        if (loadLabelRef.current) loadLabelRef.current.textContent = `${pct}%`;

        // Hide loader once all (or almost all) are cached
        if (loadedCount >= TOTAL_FRAMES && loadingRef.current) {
          loadingRef.current.style.transition = 'opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
          loadingRef.current.style.opacity = '0';
          setTimeout(() => {
            if (loadingRef.current) loadingRef.current.style.display = 'none';
          }, 650);
        }
      };

      img.onload = onDone;
      img.onerror = onDone; // graceful failover
    }

    return () => {
      cancelled = true;
    };
  }, []);

  /* ─── 2. High-performance RAF Render Loop with smooth frame lerp ─── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      // Lerp frame index: 0.28 factor yields 24fps cinema fluidity without sluggishness
      if (Math.abs(diff) > 0.005) {
        currentFrameRef.current += diff * 0.28;
      } else {
        currentFrameRef.current = target;
      }

      const frameIdx = Math.min(
        Math.max(0, Math.round(currentFrameRef.current)),
        TOTAL_FRAMES - 1
      );

      // Only draw when the frame integer actually changes (GPU efficiency)
      if (frameIdx !== lastRenderedIdxRef.current) {
        const img = getFrame(frameIdx);
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.drawImage(img, 0, 0, 1920, 1080);
          lastRenderedIdxRef.current = frameIdx;
        }
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, []);

  /* ─── 3. ScrollTrigger scrub tuned to 24 fps tempo ─── */
  useEffect(() => {
    const container = containerRef.current;
    const pinTarget = pinTargetRef.current;
    if (!container || !pinTarget) return;

    const st = ScrollTrigger.create({
      trigger: container,
      start: 'top top',
      // 850vh scroll range: ~38px of scroll per frame at 24fps -> long, deep, ultra-smooth exploration
      end: '+=850%',
      pin: pinTarget,
      // 0.8s scrub dampener matches mechanical precision dial feel
      scrub: 0.8,
      anticipatePin: 1,
      onUpdate: (self) => {
        const p = self.progress;

        // Target frame in 0 .. 239 range
        targetFrameRef.current = p * (TOTAL_FRAMES - 1);

        // DOM-only label updates (zero React overhead)
        if (pctLabelRef.current) pctLabelRef.current.textContent = `${Math.round(p * 100)}%`;
        if (axisLabelRef.current) axisLabelRef.current.textContent = `+${(p * 12.4).toFixed(1)}M Z-AXIS`;

        // Hero brand lockup fade out
        if (heroContentRef.current) {
          heroContentRef.current.style.opacity =
            p < 0.15 ? String(Math.max(0, 1 - p / 0.12)) : '0';
        }

        // Right UI fade out as content card rises
        if (rightUiRef.current) {
          rightUiRef.current.style.opacity =
            p > 0.68 ? String(Math.max(0, 1 - (p - 0.68) / 0.12)) : '1';
        }

        // Annotation updates (fade out before card rises)
        const annoIdx = p > 0.68 ? -1 : ANNOTATIONS.findIndex((a) => p >= a.range[0] && p <= a.range[1]);
        if (annoIdx !== lastAnnoIdx.current) {
          lastAnnoIdx.current = annoIdx;
          if (annoRef.current) {
            if (annoIdx === -1 || p < 0.12) {
              annoRef.current.style.opacity = '0';
            } else {
              const ann = ANNOTATIONS[annoIdx];
              if (annoStepRef.current) annoStepRef.current.textContent = `${ann.step} / ${ann.category}`;
              if (annoTitleRef.current) annoTitleRef.current.textContent = ann.title;
              if (annoDescRef.current) annoDescRef.current.textContent = ann.description;
              if (annoDispRef.current) annoDispRef.current.textContent = ann.displacement;
              annoRef.current.style.left = ann.position === 'left' ? 'clamp(24px,4vw,48px)' : '';
              annoRef.current.style.right = ann.position === 'right' ? 'clamp(24px,4vw,48px)' : '';
              annoRef.current.style.textAlign = ann.position;
              annoRef.current.style.opacity = '1';
            }
          }
        }

        if (onProgress) onProgress(p);
      },
    });

    // Refresh ScrollTrigger so dependent triggers (like the rising card in App.tsx) recalibrate immediately
    ScrollTrigger.refresh();

    return () => st.kill();
  }, [onProgress]);

  return (
    <div id="hero-experience" ref={containerRef} className="relative w-full">
      {/* Canvas — Fixed in viewport behind all sections */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: 0, display: 'block' }}
      />

      <div
        ref={pinTargetRef}
        className="relative w-screen h-screen overflow-hidden select-none"
        style={{ zIndex: 10 }}
      >
        {/* Loading overlay with calibration bar */}
        <div
          ref={loadingRef}
          className="absolute inset-0 bg-[#080808] flex flex-col items-center justify-center gap-5 z-40 pointer-events-none"
        >
          <div className="font-mono-tech text-[9px] tracking-[0.3em] text-white/40 uppercase mb-1">
            Calibrating Model (24 FPS)
          </div>
          {/* Progress track */}
          <div className="w-56 h-[1.5px] bg-white/10 relative overflow-hidden rounded-full">
            <div
              ref={loadBarRef}
              className="absolute left-0 top-0 h-full bg-white/80 transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
          <div ref={loadLabelRef} className="font-mono-tech text-[10px] tracking-widest text-white/50">
            0%
          </div>
        </div>

        {/* Cinematic gradient overlays */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-[20%] bg-gradient-to-b from-black/30 to-transparent" />
        </div>

        {/* Left brand lockup */}
        <div
          ref={heroContentRef}
          className="absolute left-6 sm:left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col gap-4 max-w-[240px]"
        >
          <div className="font-headline font-black text-[11px] tracking-[0.3em] text-white uppercase drop-shadow-sm">
            VED KAMAT
          </div>
          <div className="border-l border-white/25 pl-3 py-1 space-y-1">
            <div className="font-mono-tech text-[9px] tracking-[0.22em] text-white/75 uppercase">
              SCROLL TO EXPLODE
            </div>
            <div className="font-mono-tech text-[8px] tracking-widest text-white/35 uppercase">
              40.7128°N 74.0060°W
            </div>
          </div>
        </div>

        {/* Right: progress counter + reset */}
        <div
          ref={rightUiRef}
          className="absolute right-6 sm:right-12 top-1/2 -translate-y-1/2 z-30 flex flex-col items-end gap-2 transition-opacity duration-200"
        >
          <div
            ref={pctLabelRef}
            className="font-mono-tech font-bold text-sm text-white tracking-widest drop-shadow-sm pointer-events-none"
          >
            0%
          </div>
          <div
            ref={axisLabelRef}
            className="font-mono-tech text-[9px] tracking-widest text-white/50 pointer-events-none"
          >
            +0.0M Z-AXIS
          </div>
          <button
            onClick={() => {
              targetFrameRef.current = 0;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-2 font-mono-tech text-[8px] tracking-[0.25em] text-white/45 hover:text-white uppercase transition-colors duration-150 cursor-pointer border border-white/15 hover:border-white/50 px-2.5 py-1 rounded-sm backdrop-blur-sm bg-black/15 active:scale-95"
          >
            RESET
          </button>
        </div>

        {/* Side Annotation panel (minimal, no card background) */}
        <div
          ref={annoRef}
          className="absolute top-[62%] -translate-y-1/2 z-30 max-w-[220px] space-y-1 drop-shadow-md"
          style={{ opacity: 0, transition: 'opacity 0.4s', pointerEvents: 'none' }}
        >
          <div
            ref={annoStepRef}
            className="font-mono-tech text-[8px] tracking-[0.25em] text-white/45 uppercase"
          />
          <h3
            ref={annoTitleRef}
            className="font-headline font-black text-base sm:text-lg text-white uppercase tracking-tight"
          />
          <p
            ref={annoDescRef}
            className="font-editorial text-[11px] text-white/65 leading-relaxed font-light"
          />
          <div
            ref={annoDispRef}
            className="font-mono-tech text-[8px] tracking-widest text-white/30 uppercase pt-0.5"
          />
        </div>
      </div>
    </div>
  );
};
