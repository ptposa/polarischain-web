import { register } from './raf-loop';

/**
 * Global, full-document starfield: a fixed canvas that parallax-scrolls at
 * 0.85x page speed, a fixed Polaris marker, dotted hero-region constellation
 * links, and a scroll-driven "halo" glow orb anchored off-screen right.
 * Ported from the first inline <script> of the source design, unchanged in
 * behaviour: same star counts, same brightness tiers, same fade curve.
 */

interface Star {
  x: number;
  yRatio: number;
  r: number;
  baseOp: number;
  op: number;
  kind: 'approach' | 'depart' | 'static';
  phase: number;
  period: number;
  glow: boolean;
  currentR?: number;
}

export interface StarfieldElements {
  canvas: HTMLCanvasElement;
  glow: HTMLElement | null;
}

export interface StarfieldOptions {
  /** Force reduced-motion behaviour (halo disabled) regardless of matchMedia — mainly for tests. */
  reducedMotion?: boolean;
}

const TOTAL = 1500;
const APPROACH_N = 20;
const DEPART_N = 16;
const POLARIS = { fx: 0.68, fy: 0.12, r: 2.5 };

export function init(root: HTMLElement, opts: StarfieldOptions = {}): () => void {
  const canvasEl = root.querySelector<HTMLCanvasElement>('[data-starfield-canvas]');
  const glow = root.querySelector<HTMLElement>('[data-starfield-glow]');
  if (!canvasEl) return () => {};
  const ctx2d = canvasEl.getContext('2d');
  if (!ctx2d) return () => {};

  // Rebind as fresh non-null consts: TypeScript can't retain narrowing for
  // `querySelector`/`getContext` results across the nested closures below.
  const canvas = canvasEl;
  const ctx = ctx2d;

  let W = 0;
  let H = 0;
  let DOC_H = 0;
  let stars: Star[] = [];
  let constellations: [number, number][] = [];

  function buildChart(): void {
    constellations = [];
    const heroStars: number[] = [];
    stars.forEach((s, idx) => {
      if (s.yRatio < 0.1 && s.baseOp > 0.1) heroStars.push(idx);
    });
    const used = new Set<number>();
    let attempts = 0;
    while (constellations.length < 10 && attempts < 400 && heroStars.length > 3) {
      attempts++;
      const a = heroStars[Math.floor(Math.random() * heroStars.length)]!;
      if (used.has(a)) continue;
      const sa = stars[a]!;
      let best = -1;
      let bestD = 1e9;
      for (const b of heroStars) {
        if (b === a || used.has(b)) continue;
        const sb = stars[b]!;
        const dx = sa.x - sb.x;
        const dy = (sa.yRatio - sb.yRatio) * DOC_H;
        const d = Math.hypot(dx, dy);
        if (d > 40 && d < 190 && d < bestD) {
          bestD = d;
          best = b;
        }
      }
      if (best >= 0) {
        constellations.push([a, best]);
        used.add(a);
        used.add(best);
      }
    }
  }

  function buildStars(): void {
    stars = [];
    DOC_H = document.documentElement.scrollHeight;
    const HERO_FRAC = 0.12;
    for (let i = 0; i < TOTAL; i++) {
      const isApproach = i < APPROACH_N;
      const isDepart = !isApproach && i < APPROACH_N + DEPART_N;

      const topBias = Math.random() < 0.38;
      const yRatio = topBias
        ? Math.random() * HERO_FRAC
        : HERO_FRAC + Math.random() * (1 - HERO_FRAC);
      const inHero = yRatio < HERO_FRAC;

      const tier = Math.random();
      const isBright = tier < 0.06;
      const isMedium = !isBright && tier < 0.26;
      const large = isBright && Math.random() < 0.5;

      const r = large
        ? Math.random() * 0.7 + 1.2
        : isMedium
          ? Math.random() * 0.4 + 0.6
          : Math.random() < 0.42
            ? Math.random() * 0.2 + 0.28
            : Math.random() * 0.32 + 0.5;

      const baseOp = inHero
        ? isBright
          ? Math.random() * 0.08 + 0.22
          : isMedium
            ? Math.random() * 0.08 + 0.14
            : Math.random() * 0.08 + 0.06
        : isBright
          ? Math.random() * 0.2 + 0.28
          : isMedium
            ? Math.random() * 0.15 + 0.14
            : Math.random() * 0.1 + 0.05;

      stars.push({
        x: Math.random() * W,
        yRatio,
        r,
        baseOp,
        op: baseOp,
        kind: isApproach ? 'approach' : isDepart ? 'depart' : 'static',
        phase: Math.random() * Math.PI * 2,
        period: isApproach ? Math.random() * 14000 + 18000 : Math.random() * 16000 + 22000,
        glow: large || (isBright && baseOp > 0.2),
      });
    }
  }

  function resize(): void {
    W = window.innerWidth;
    H = window.innerHeight;
    DOC_H = document.documentElement.scrollHeight;
    canvas.width = W;
    canvas.height = H;
    stars.forEach((s) => {
      s.x = Math.random() * W;
    });
  }

  function draw(ts: number): void {
    ctx.clearRect(0, 0, W, H);
    const scrollY = window.scrollY;

    ctx.lineWidth = 1;

    const px = W * POLARIS.fx;
    const py = H * POLARIS.fy - scrollY * 0.3;
    if (py > -180) {
      const pg = ctx.createRadialGradient(px, py, 0, px, py, POLARIS.r * 6);
      pg.addColorStop(0, 'rgba(232,201,106,0.28)');
      pg.addColorStop(1, 'rgba(232,201,106,0)');
      ctx.beginPath();
      ctx.arc(px, py, POLARIS.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = pg;
      ctx.fill();
      ctx.beginPath();
      ctx.arc(px, py, POLARIS.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240,222,160,0.92)';
      ctx.fill();
    }

    ctx.setLineDash([1.5, 4]);
    ctx.strokeStyle = 'rgba(200,218,240,0.08)';
    constellations.forEach(([ia, ib]) => {
      const sa = stars[ia];
      const sb = stars[ib];
      if (!sa || !sb) return;
      const ya = sa.yRatio * DOC_H - scrollY * 0.85;
      const yb = sb.yRatio * DOC_H - scrollY * 0.85;
      if ((ya < -10 && yb < -10) || (ya > H + 10 && yb > H + 10)) return;
      ctx.beginPath();
      ctx.moveTo(sa.x, ya);
      ctx.lineTo(sb.x, yb);
      ctx.stroke();
    });
    ctx.setLineDash([]);

    stars.forEach((s) => {
      const docY = s.yRatio * DOC_H;
      const screenY = docY - scrollY * 0.85;
      if (screenY < -10 || screenY > H + 10) return;

      let op = s.baseOp;
      if (s.kind === 'approach') {
        const t = (ts % s.period) / s.period;
        op = s.baseOp + Math.sin(t * Math.PI * 2 + s.phase) * s.baseOp * 0.8;
        op = Math.min(0.95, Math.max(0.05, op));
        s.currentR = s.r * (1 + Math.sin(t * Math.PI * 2 + s.phase) * 0.45);
      } else if (s.kind === 'depart') {
        const t = (ts % s.period) / s.period;
        op = s.baseOp * (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(t * Math.PI * 2 + s.phase)));
        s.currentR = s.r;
      } else {
        s.currentR = s.r;
      }

      const r = s.currentR ?? s.r;

      if (s.glow) {
        const grad = ctx.createRadialGradient(s.x, screenY, 0, s.x, screenY, r * 3);
        grad.addColorStop(0, `rgba(255,255,255,${op * 0.22})`);
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.beginPath();
        ctx.arc(s.x, screenY, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(s.x, screenY, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${op})`;
      ctx.fill();
    });
  }

  let ticking = false;
  function onScroll(): void {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const heroEl =
        document.querySelector<HTMLElement>('.dive-track') ??
        document.querySelector<HTMLElement>('.hero');
      const heroH = heroEl ? heroEl.offsetHeight : window.innerHeight;
      const fadeStart = heroH * 0.6;
      const fadeEnd = heroH + 80;
      let starOp = 1;
      if (scrollY > fadeStart) {
        starOp = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
      }
      canvas.style.opacity = String(starOp);
      ticking = false;
    });
  }

  const reducedMotion =
    opts.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const haloOff = reducedMotion || window.matchMedia('(hover: none), (pointer: coarse)').matches;

  let cy = window.innerHeight * 0.35;
  function haloTick(ts: number): void {
    if (!glow) return;
    const H2 = window.innerHeight;
    const target = Math.min(H2 * 0.8, Math.max(H2 * 0.2, H2 * 0.35 + window.scrollY * 0.15));
    cy += (target - cy) * 0.06;
    const hx = window.innerWidth * 1.08;
    const breath = 1 + 0.15 * Math.sin((ts / 8000) * Math.PI * 2);
    glow.style.transform = `translate(${hx}px, ${cy}px)`;
    glow.style.opacity = String(breath);
  }

  function onResize(): void {
    resize();
    DOC_H = document.documentElement.scrollHeight;
    buildStars();
    buildChart();
  }

  window.addEventListener('resize', onResize);
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('load', onResize);

  let resizeObserver: ResizeObserver | null = null;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(() => {
      DOC_H = document.documentElement.scrollHeight;
    });
    resizeObserver.observe(document.documentElement);
  }

  W = window.innerWidth;
  H = window.innerHeight;
  DOC_H = document.documentElement.scrollHeight;
  canvas.width = W;
  canvas.height = H;
  buildStars();
  buildChart();

  const unregisterDraw = register(draw);
  const unregisterHalo = glow && !haloOff ? register(haloTick) : null;

  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onScroll);
    window.removeEventListener('load', onResize);
    resizeObserver?.disconnect();
    unregisterDraw();
    unregisterHalo?.();
  };
}
