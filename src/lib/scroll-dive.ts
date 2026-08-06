import { register } from './raf-loop';
import { constellationNodes, constellationEdges } from '../data/constellation';

/**
 * Hero scroll-dive: a tall track + sticky stage that dollies the camera
 * through a 7-node CA constellation as the user scrolls. Ported from the
 * second inline <script> of the source design. The constellation markup
 * itself is now rendered statically by `DiveGraph.astro` (iterating
 * `data/constellation.ts`) instead of being built with `innerHTML` at
 * runtime — this module only ever reads the already-rendered `.gnode`
 * elements and `<line>`s to write their per-frame transform/opacity.
 */

export interface ScrollDiveOptions {
  /** Force reduced-motion behaviour regardless of matchMedia — mainly for tests. */
  reducedMotion?: boolean;
}

interface DiveStar {
  x: number;
  y: number;
  z: number;
  r: number;
  op: number;
  tw: number;
}

const LAYERS = [
  { n: 410, zMin: 0.02, zMax: 0.12, op: [0.05, 0.16], r: [0.3, 0.7] },
  { n: 180, zMin: 0.18, zMax: 0.45, op: [0.1, 0.26], r: [0.5, 1.1] },
  { n: 60, zMin: 0.55, zMax: 1.0, op: [0.18, 0.4], r: [0.8, 1.8] },
] as const;

const clamp = (v: number, a: number, b: number): number => Math.min(Math.max(v, a), b);
const win = (p: number, a: number, b: number): number => {
  const t = clamp((p - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};

export function init(track: HTMLElement, opts: ScrollDiveOptions = {}): () => void {
  const stageEl = track.querySelector<HTMLElement>('[data-dive-stage]');
  const heroSecEl = track.querySelector<HTMLElement>('.hero');
  const heroShellEl = track.querySelector<HTMLElement>('.hero-shell');
  const captionEl = track.querySelector<HTMLElement>('[data-dive-caption]');
  const hintEl = track.querySelector<HTMLElement>('[data-dive-hint]');
  const canvasEl = track.querySelector<HTMLCanvasElement>('[data-dive-sky]');
  const nodeEls = Array.from(track.querySelectorAll<HTMLElement>('.gnode'));
  const edgeEls = Array.from(track.querySelectorAll<SVGLineElement>('[data-dive-edges] line'));
  const header = document.querySelector<HTMLElement>('.site-header');
  const aperture = track.querySelector<HTMLElement>('.aperture-frame');
  const lift = document.getElementById('pageLift');

  if (!stageEl || !heroSecEl || !heroShellEl || !captionEl || !hintEl || !canvasEl) return () => {};
  const ctx2d = canvasEl.getContext('2d');
  if (!ctx2d) return () => {};

  // Rebind as fresh non-null consts: TypeScript can't retain narrowing for
  // `querySelector` results across the nested closures below.
  const stage = stageEl;
  const heroSec = heroSecEl;
  const heroShell = heroShellEl;
  const caption = captionEl;
  const hint = hintEl;
  const canvas = canvasEl;
  const ctx = ctx2d;

  const reduced =
    opts.reducedMotion ?? window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0;
  let H = 0;
  let DPR = 1;
  let overflowH = 0;
  let intro = 0;
  let stars: DiveStar[] = [];

  function buildStars(): void {
    stars = [];
    for (const layer of LAYERS) {
      for (let i = 0; i < layer.n; i++) {
        stars.push({
          x: (Math.random() - 0.5) * 2.6,
          y: (Math.random() - 0.5) * 2.6,
          z: layer.zMin + Math.random() * (layer.zMax - layer.zMin),
          r: layer.r[0] + Math.random() * (layer.r[1] - layer.r[0]),
          op: layer.op[0] + Math.random() * (layer.op[1] - layer.op[0]),
          tw: Math.random() * Math.PI * 2,
        });
      }
    }
  }

  /* ── Dive focal point: the centre of the hero sky chart. The camera enters
     THROUGH the aperture, then eases to screen centre as the model opens up. ── */
  let FX = 0;
  let FY = 0;

  function measureFocal(): void {
    FX = W / 2;
    FY = H / 2;
    if (!aperture) return;
    const a = aperture.getBoundingClientRect();
    if (!a.width) return; // chart not laid out yet — fall back to screen centre
    const s = stage.getBoundingClientRect();
    FX = a.left - s.left + a.width / 2;
    FY = a.top - s.top + a.height / 2;
  }

  function focalAt(q: number): { x: number; y: number } {
    // Recentre EARLY — while the hero is still blurring out and before the
    // starfield/graph dolly begins — so the second phase is a pure centred zoom
    // with no lateral drift.
    const k = win(q, 0.02, 0.15);
    return { x: FX + (W / 2 - FX) * k, y: FY + (H / 2 - FY) * k };
  }

  function projectNode(
    n: (typeof constellationNodes)[number],
    zoom: number,
    f: { x: number; y: number },
  ) {
    const s = 1 + zoom * n.z * 4.2;
    const bx = W * 0.5 + n.x * (W * 0.5);
    const by = H * 0.5 + n.y * (H * 0.5);
    const px = f.x + (bx - f.x) * s;
    const py = f.y + (by - f.y) * s;
    const passed = win(s, 3.4, 5.2);
    const appear = win(zoom, 0.02, 0.1);
    const settle = 1 - win(zoom, 0.88, 0.99);
    const op = appear * (1 - passed) * settle;
    return { px, py, s: Math.min(1 + zoom * n.z * 1.6, 3.2), op };
  }

  let target = 0;
  let current = 0;

  function readScroll(): void {
    const r = track.getBoundingClientRect();
    const total = r.height - window.innerHeight;
    target = total > 0 ? clamp(-r.top / total, 0, 1) : 0;
  }

  function measure(): void {
    W = stage.clientWidth;
    H = stage.clientHeight;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * DPR;
    canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const contentH = heroSec.scrollHeight;
    const hintH = (hint.offsetHeight || 60) + 46;
    overflowH = contentH > stage.clientHeight ? contentH + hintH - stage.clientHeight : 0;
    intro = overflowH > 0 ? 0.26 : 0;
    if (overflowH > 0) {
      hint.style.bottom = 'auto';
      hint.style.top = `${contentH + 18}px`;
    } else {
      hint.style.bottom = '';
      hint.style.top = '';
      hint.style.transform = '';
    }
    measureFocal();
  }

  function remap(p: number): number {
    return intro ? clamp((p - intro) / (1 - intro), 0, 1) : p;
  }

  function drawSky(p: number, t: number): void {
    ctx.clearRect(0, 0, W, H);
    const zoom = win(p, 0.12, 0.85);
    const f = focalAt(p);
    for (const s of stars) {
      const k = 1 + zoom * s.z * 6; // radial expansion from the focal point
      const bx = W / 2 + (s.x * W) / 2;
      const by = H / 2 + (s.y * H) / 2;
      const x = f.x + (bx - f.x) * k;
      const y = f.y + (by - f.y) * k;
      if (x < -20 || x > W + 20 || y < -20 || y > H + 20) continue;
      const tw = 0.85 + 0.15 * Math.sin(t * 0.0012 + s.tw);
      const grow = 1 + zoom * s.z * 1.2;
      ctx.globalAlpha = s.op * tw * (1 - win(k, 5.5, 8));
      ctx.fillStyle = '#dfe8f5';
      ctx.beginPath();
      ctx.arc(x, y, s.r * grow, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function layoutGraph(p: number): void {
    const zoom = win(p, 0.12, 0.85);
    const f = focalAt(p);
    const pts = constellationNodes.map((n) => projectNode(n, zoom, f));
    pts.forEach((pt, i) => {
      const el = nodeEls[i];
      if (!el) return;
      el.style.transform = `translate3d(${pt.px - W / 2}px,${pt.py - H / 2}px,0) scale(${pt.s})`;
      el.style.opacity = pt.op.toFixed(3);
    });
    constellationEdges.forEach((e, i) => {
      const a = pts[e[0]];
      const b = pts[e[1]];
      const line = edgeEls[i];
      if (!a || !b || !line) return;
      line.setAttribute('x1', String(a.px));
      line.setAttribute('y1', String(a.py));
      line.setAttribute('x2', String(b.px));
      line.setAttribute('y2', String(b.py));
      line.style.opacity = String(Math.min(a.op, b.op) * 0.8);
    });
  }

  function layoutCopy(p: number, q: number): void {
    const ty = intro ? -overflowH * win(p, 0, intro) : 0;

    const out = win(q, 0.1, 0.34);
    heroShell.style.opacity = (1 - out).toFixed(3);
    heroShell.style.filter = out > 0.001 ? `blur(${(out * 14).toFixed(1)}px)` : '';
    const sr = heroShell.getBoundingClientRect();
    const st = stage.getBoundingClientRect();
    heroShell.style.transformOrigin =
      `${(FX - (sr.left - st.left)).toFixed(0)}px ` +
      `${(FY - (sr.top - st.top) - ty).toFixed(0)}px`;
    heroShell.style.transform = `translateY(${ty.toFixed(1)}px) scale(${(1 + out * 0.35).toFixed(3)})`;
    heroShell.style.pointerEvents = out > 0.5 ? 'none' : '';
    if (aperture) {
      const thru = win(q, 0.04, 0.34); // camera passes through the chart
      aperture.style.transform = `scale(${(1 + thru * 2.4).toFixed(3)})`;
    }

    const capIn = win(q, 0.38, 0.5);
    const capOut = win(q, 0.84, 1.0);
    caption.style.opacity = (capIn * (1 - capOut)).toFixed(3);
    caption.style.transform = `scale(${(0.92 + capIn * 0.08 + capOut * 0.3).toFixed(3)}) translateY(${((1 - capIn) * 18).toFixed(1)}px)`;

    if (intro) hint.style.transform = `translate(-50%,${ty.toFixed(1)}px)`;
    hint.style.opacity = (1 - win(q, 0.02, 0.1)).toFixed(3);
    if (lift) lift.style.opacity = win(q, 0.7, 0.98).toFixed(3);
    if (header) header.classList.toggle('dimmed', q > 0.12 && q < 0.9);
  }

  function tick(t: number): void {
    current += (target - current) * 0.055; // heavier damping: fast scrolls still read
    if (Math.abs(target - current) < 0.0002) current = target;
    const q = remap(current);
    drawSky(q, t);
    layoutGraph(q);
    layoutCopy(current, q);
  }

  buildStars();
  measure();
  readScroll();

  if (reduced) {
    drawSky(0, 0);
    return () => {};
  }

  window.addEventListener('scroll', readScroll, { passive: true });
  const onResize = () => {
    measure();
    readScroll();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener('load', measure);

  let resizeObserver: ResizeObserver | null = null;
  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(measure);
    resizeObserver.observe(heroSec);
  }

  const unregisterTick = register(tick);

  return () => {
    window.removeEventListener('scroll', readScroll);
    window.removeEventListener('resize', onResize);
    window.removeEventListener('load', measure);
    resizeObserver?.disconnect();
    unregisterTick();
  };
}
