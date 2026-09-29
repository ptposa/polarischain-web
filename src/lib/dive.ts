/**
 * Hero dive: a single scroll-linked camera move.
 *
 * The page opens on a night sky. As the reader scrolls, one virtual camera
 * travels towards Polaris in the sky chart: the hero copy and the chart,
 * placed at their own depths, slide out of view, and the stars finally thin
 * out as the body gradient behind the stage turns from black to deep blue.
 * The stars are drawn once and stay still: the sky is the one backdrop, and
 * only what sits on it moves, which keeps the move smooth on phones.
 *
 * When the hero is taller than the screen (phones, short windows), the stage
 * is made as tall as the hero and pinned with a negative top: the browser
 * scrolls it natively until its last screen is in view, and only then does
 * it hold still for the dive. No part of the page follows the finger through
 * script, so nothing lags behind it.
 */

interface Star {
  sx: number; // position on the stage, in CSS pixels from its top left
  sy: number;
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
  const floatCues = Array.from(track.querySelectorAll<HTMLElement>('.dive__cue--float'));
  const legend = track.querySelector<HTMLElement>('[data-aperture-legend]');
  const ctx = canvas?.getContext('2d');
  if (!stage || !canvas || !content || !copy || !ctx) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // A finger already scrolls smoothly: follow it closely. A wheel moves in
  // steps: ease them out.
  const EASE = window.matchMedia('(pointer: coarse)').matches ? 0.34 : 0.16;

  let W = 0; // stage width
  let V = 0; // one screen: the height of the stage before it is extended
  let overflow = 0; // hero content taller than one screen
  let fx = 0; // Polaris, in stage coordinates, before any transform
  let fy = 0;
  let sizeKey = '';

  // One field of stars for the whole visit, larger than any screen it may be
  // shown on. A resize (a phone's address bar hiding, a rotation) only
  // reveals more or less of it: no star ever moves or changes.
  const FIELD = Math.max(window.screen.width, window.screen.height, window.innerWidth, window.innerHeight) * 1.6;
  const stars: Star[] = [];
  {
    // The same density as a screen of 260 to 760 stars, whatever its size.
    const area = Math.max(window.innerWidth * window.innerHeight, 1);
    const density = clamp(area / 1900, 260, 760) / area;
    const n = Math.round(FIELD * FIELD * density);
    for (let i = 0; i < n; i++) {
      const bright = Math.random() < 0.07;
      stars.push({
        sx: Math.random() * FIELD,
        sy: Math.random() * FIELD,
        r: bright ? 0.9 + Math.random() * 0.6 : 0.35 + Math.random() * 0.5,
        a: bright ? 0.55 + Math.random() * 0.3 : 0.18 + Math.random() * 0.35,
      });
    }
  }

  function measure(): void {
    content!.style.transform = '';
    copy!.style.transform = '';
    if (chart) chart.style.transform = '';
    stage!.style.height = '';
    stage!.style.top = '';
    W = stage!.clientWidth;
    V = stage!.clientHeight;
    overflow = Math.max(0, content!.scrollHeight - V);
    const stageH = V + overflow;
    if (!reduced && overflow) {
      stage!.style.height = `${stageH}px`;
      stage!.style.top = `${-overflow}px`;
    }
    floatCues.forEach((c) => (c.style.bottom = overflow ? `calc(1.6rem + ${overflow}px)` : ''));

    // The canvas is redrawn only when the stage really changes size.
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const key = `${W}x${stageH}@${dpr}`;
    if (key !== sizeKey) {
      sizeKey = key;
      canvas!.width = Math.round(W * dpr);
      canvas!.height = Math.round(stageH * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(W, stageH);
    }

    // The stage scrolls natively through the part of the hero that does not
    // fit, then holds for the dive.
    if (!reduced) {
      track!.style.height = `${Math.round(stageH + V * DIVE_LENGTH)}px`;
      track!.style.marginBottom = `${-Math.round(V * DIVE_LENGTH * DIVE_OVERLAP)}px`;
    }
    const s = stage!.getBoundingClientRect();
    if (focalEl) {
      const f = focalEl.getBoundingClientRect();
      fx = f.left + f.width / 2 - s.left;
      fy = f.top + f.height / 2 - s.top;
    } else {
      fx = W / 2;
      fy = V / 2;
    }
    const c = copy!.getBoundingClientRect();
    copy!.style.transformOrigin = `${(fx - (c.left - s.left)).toFixed(0)}px ${(fy - (c.top - s.top)).toFixed(0)}px`;
    last = -1;
  }

  /** How far the page has scrolled into the track, and the dive's progress:
   * 0 while the stage is still scrolling natively, 1 when it lets go. */
  function read(): { scrolled: number; q: number } {
    const r = track!.getBoundingClientRect();
    const scrolled = Math.max(0, -r.top);
    const hold = r.height - (V + overflow);
    const q = hold > 0 ? clamp((scrolled - overflow) / hold, 0, 1) : 0;
    return { scrolled, q };
  }

  /** The still sky, drawn once per size of the stage. */
  function draw(w: number, h: number): void {
    ctx!.clearRect(0, 0, w, h);
    ctx!.fillStyle = '#e4ecf7';
    for (const s of stars) {
      if (s.sx > w + 8 || s.sy > h + 8) continue;
      ctx!.globalAlpha = s.a;
      ctx!.beginPath();
      ctx!.arc(s.sx, s.sy, s.r, 0, Math.PI * 2);
      ctx!.fill();
    }
    ctx!.globalAlpha = 1;
  }

  function layout(q: number, scrolled: number): void {
    const d = TRAVEL * easeInOut(q);

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
    // The cue's words have done their job as soon as the reader scrolls. Its
    // halo lingers: where the hero scrolls natively (phones, tablets) it
    // fades over a good part of the screen, as the cue rises out of view.
    const cueOp = (1 - smooth(scrolled, 0, 40)).toFixed(3);
    const haloOp = (1 - smooth(scrolled, 0, overflow ? V * 0.45 : 40)).toFixed(3);
    cues.forEach((c) => {
      c.style.setProperty('--cue-op', cueOp);
      c.style.setProperty('--halo-op', haloOp);
    });
  }

  let target = 0;
  let current = 0;
  let scrolledNow = 0;
  let last = -1;
  let raf = 0;

  function frame(): void {
    raf = 0;
    current += (target - current) * EASE;
    if (Math.abs(target - current) < 0.0004) current = target;
    if (current !== last) {
      canvas!.style.opacity = (1 - smooth(current, 0.78, 1)).toFixed(3);
      layout(current, scrolledNow);
      last = current;
    }
    if (current !== target) raf = requestAnimationFrame(frame);
  }

  function onScroll(): void {
    const { scrolled, q } = read();
    target = q;
    scrolledNow = scrolled;
    // The cue fades with the scroll itself, even before the dive begins.
    if (q === 0 && current === 0) layout(0, scrolled);
    const r = track!.getBoundingClientRect();
    if (r.bottom <= window.innerHeight * 0.02) setHeader('solid');
    else if (scrolled > 4) setHeader('hidden');
    else setHeader('top');
    if (!raf) raf = requestAnimationFrame(frame);
  }

  measure();

  if (reduced) {
    const onStaticScroll = (): void => setHeader(window.scrollY > 8 ? 'solid' : 'top');
    window.addEventListener('scroll', onStaticScroll, { passive: true });
    onStaticScroll();
    return;
  }

  // A phone's address bar showing or hiding changes the window height but
  // not the stage (sized in svh): nothing to measure then.
  let resizeTimer = 0;
  let lastW = window.innerWidth;
  let lastV = V;
  window.addEventListener('resize', () => {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      stage!.style.height = '';
      const v = stage!.clientHeight;
      if (window.innerWidth !== lastW || v !== lastV) {
        lastW = window.innerWidth;
        measure();
        lastV = V;
      } else if (overflow) {
        stage!.style.height = `${V + overflow}px`;
      }
      onScroll();
    }, 120);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  document.fonts?.ready.then(() => {
    measure();
    lastV = V;
    onScroll();
  });
  onScroll();
}
