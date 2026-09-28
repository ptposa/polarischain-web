/**
 * Hero dive: a single scroll-linked camera move.
 *
 * The page opens on a night sky. As the reader scrolls, one virtual camera
 * travels towards Polaris in the sky chart: the stars stream past with real
 * perspective (nearer stars move faster), the hero copy and the chart, placed
 * at their own depths, slide out of view, and the stars finally thin out as
 * the body gradient behind the stage turns from black to deep blue. Every
 * element reads the same camera position, so the move is one transition, not
 * a sequence of effects.
 */

interface Star {
  sx: number; // screen position at rest
  sy: number;
  z: number; // depth: 1 is the depth of the sky chart
  r: number;
  a: number;
}

const clamp = (v: number, a: number, b: number): number => Math.min(Math.max(v, a), b);
const smooth = (v: number, a: number, b: number): number => {
  const t = clamp((v - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOut = (t: number): number => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** Camera travel at the end of the move, in units of the chart's depth. */
const TRAVEL = 1.35;
const DEPTH_COPY = 0.78;
/** Scroll length of the dive, in screen heights. */
const DIVE_LENGTH = 1.2;
/** Share of the dive, at its end, over which the next section already
 * scrolls in: by then the chart has passed and only the last stars remain,
 * so the reader does not scroll through an empty sky. */
const DIVE_OVERLAP = 0.5;
const DEPTH_CHART = 1.06;

export function initDive(): void {
  const track = document.querySelector<HTMLElement>('[data-dive]');
  const header = document.querySelector<HTMLElement>('[data-site-header]');

  const setHeader = (state: 'top' | 'hidden' | 'solid'): void => {
    if (header && header.dataset.state !== state) header.dataset.state = state;
  };

  if (!track) {
    const onScroll = (): void => setHeader(window.scrollY > 8 ? 'solid' : 'top');
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return;
  }

  const stage = track.querySelector<HTMLElement>('[data-dive-stage]');
  const canvas = track.querySelector<HTMLCanvasElement>('[data-dive-sky]');
  const content = track.querySelector<HTMLElement>('[data-dive-content]');
  const copy = track.querySelector<HTMLElement>('[data-dive-copy]');
  const chart = track.querySelector<HTMLElement>('[data-aperture-frame]');
  const focalEl = track.querySelector<SVGElement>('[data-focal]');
  const cues = Array.from(track.querySelectorAll<HTMLElement>('[data-dive-cue]'));
  const legend = track.querySelector<HTMLElement>('[data-aperture-legend]');
  const ctx = canvas?.getContext('2d');
  if (!stage || !canvas || !content || !copy || !ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0;
  let H = 0;
  let overflow = 0; // hero content taller than the stage (small screens)
  let fx = 0; // Polaris, in stage coordinates, before any transform
  let fy = 0;
  let stars: Star[] = [];

  function buildStars(): void {
    const n = Math.round(clamp((W * H) / 1900, 260, 760));
    stars = [];
    for (let i = 0; i < n; i++) {
      const bright = Math.random() < 0.07;
      stars.push({
        sx: -0.1 * W + Math.random() * 1.2 * W,
        sy: -0.1 * H + Math.random() * 1.2 * H,
        z: 0.35 + Math.random() ** 1.3 * 2.9,
        r: bright ? 0.9 + Math.random() * 0.6 : 0.35 + Math.random() * 0.5,
        a: bright ? 0.55 + Math.random() * 0.3 : 0.18 + Math.random() * 0.35,
      });
    }
  }

  function measure(): void {
    content!.style.transform = '';
    copy!.style.transform = '';
    if (chart) chart.style.transform = '';
    W = stage!.clientWidth;
    H = stage!.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas!.width = Math.round(W * dpr);
    canvas!.height = Math.round(H * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    overflow = Math.max(0, content!.scrollHeight - H);
    // One screen, plus whatever of the hero does not fit on it (read at
    // normal scroll speed), plus the dive itself.
    if (!reduced) {
      track!.style.height = `${Math.round(H + overflow + H * DIVE_LENGTH)}px`;
      track!.style.marginBottom = `${-Math.round(H * DIVE_LENGTH * DIVE_OVERLAP)}px`;
    }
    const s = stage!.getBoundingClientRect();
    if (focalEl) {
      const f = focalEl.getBoundingClientRect();
      fx = f.left + f.width / 2 - s.left;
      fy = f.top + f.height / 2 - s.top;
    } else {
      fx = W / 2;
      fy = H / 2;
    }
    const c = copy!.getBoundingClientRect();
    copy!.style.transformOrigin = `${(fx - (c.left - s.left)).toFixed(0)}px ${(fy - (c.top - s.top)).toFixed(0)}px`;
    buildStars();
    last = -1;
  }

  /** Scroll progress through the track, 0 to 1. */
  function progress(): number {
    const r = track!.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    return total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  function draw(q: number, lift: number): void {
    const d = TRAVEL * easeInOut(q);
    const cy = fy - lift;
    const fade = 1 - smooth(q, 0.78, 1);
    ctx!.clearRect(0, 0, W, H);
    ctx!.fillStyle = '#e4ecf7';
    for (const s of stars) {
      const gap = s.z - d;
      if (gap < 0.04) continue;
      const k = s.z / gap;
      const x = fx + (s.sx - fx) * k;
      const y = cy + (s.sy - lift - cy) * k;
      if (x < -8 || x > W + 8 || y < -8 || y > H + 8) continue;
      const near = clamp(k, 1, 4);
      ctx!.globalAlpha = s.a * fade * clamp(0.6 + 0.4 * near, 0, 1);
      ctx!.beginPath();
      ctx!.arc(x, y, s.r * (0.8 + 0.35 * near), 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  function layout(q: number, lift: number, scrolled: number): void {
    const d = TRAVEL * easeInOut(q);
    content!.style.transform = lift ? `translate3d(0, ${(-lift).toFixed(1)}px, 0)` : '';

    // The copy sits in front of the chart and leaves first.
    const kc = Math.min(DEPTH_COPY / Math.max(DEPTH_COPY - d, 0.05), 1.8);
    copy!.style.transform = q > 0 ? `scale(${kc.toFixed(4)})` : '';
    copy!.style.opacity = (1 - smooth(q, 0.02, 0.3)).toFixed(3);

    // The chart is aimed at Polaris, so it grows around it and passes by.
    if (chart) {
      const ka = Math.min(DEPTH_CHART / Math.max(DEPTH_CHART - d, 0.03), 30);
      chart.style.transform = q > 0 ? `scale(${ka.toFixed(4)})` : '';
      chart.style.opacity = (1 - smooth(ka, 2.2, 7)).toFixed(3);
    }

    if (legend) legend.style.opacity = (1 - smooth(q, 0.02, 0.2)).toFixed(3);
    // The cue has done its job as soon as the reader scrolls.
    const cueOp = (1 - smooth(scrolled, 0, 40)).toFixed(3);
    cues.forEach((c) => (c.style.opacity = cueOp));
  }

  let target = 0;
  let current = 0;
  let last = -1;
  let raf = 0;

  function frame(): void {
    raf = 0;
    current += (target - current) * 0.16;
    if (Math.abs(target - current) < 0.0004) current = target;

    // On short screens the hero first scrolls up to show all of its content;
    // the dive starts once it has been read.
    const total = track!.offsetHeight - window.innerHeight;
    const intro = total > 0 ? clamp(overflow / total, 0, 0.9) : 0;
    const lift = overflow * (intro ? clamp(current / intro, 0, 1) : 0);
    const q = intro ? clamp((current - intro) / (1 - intro), 0, 1) : current;

    if (current !== last) {
      draw(q, lift);
      layout(q, lift, current * total);
      last = current;
    }
    if (current !== target) raf = requestAnimationFrame(frame);
  }

  function onScroll(): void {
    target = progress();
    const r = track!.getBoundingClientRect();
    if (r.bottom <= window.innerHeight * 0.02) setHeader('solid');
    else if (target > 0.004) setHeader('hidden');
    else setHeader('top');
    if (!raf) raf = requestAnimationFrame(frame);
  }

  measure();

  if (reduced) {
    draw(0, 0);
    const onStaticScroll = (): void => setHeader(window.scrollY > 8 ? 'solid' : 'top');
    window.addEventListener('scroll', onStaticScroll, { passive: true });
    onStaticScroll();
    return;
  }

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      measure();
      onScroll();
    }, 120);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.fonts?.ready.then(() => {
    measure();
    onScroll();
  });
  onScroll();
}
