/**
 * The federation under Polaris, drawn in the hero sky chart.
 *
 * Three deployed domains (A classical, B hybrid, C post-quantum) sit around
 * Polaris, each drawn as a small certification tree: the trust anchor above,
 * the intermediate CA on the wheel, and below it the CAs it certifies, one
 * level per step. Cross-certificates exist only between intermediates.
 * Polaris is not a node: no path goes through it. The wheel sways slowly
 * about Polaris, each domain staying upright.
 *
 * The receiver changes in turn. Its trust anchor takes the line of sight to
 * Polaris, its threshold τ prunes the cross-certificates it cannot use, and
 * its selected path crosses into another domain, down to an end-entity
 * certificate.
 */

type Kind = 'root' | 'int' | 'sub' | 'iss' | 'leaf';
type Domain = 'A' | 'B' | 'C';

interface Spec {
  dom: Domain;
  x: number; // position inside the domain's tree, before mirroring
  y: number;
  r: number;
  label: string;
  kind: Kind;
  parent: string | null;
  born: number; // order of appearance, 0 first
}

const NS = 'http://www.w3.org/2000/svg';
const RADIUS = 86; // distance from Polaris to each domain's intermediate
const SWAY = (22 * Math.PI) / 180; // amplitude of the wheel's sway
const SWAY_SECONDS = 36; // one full sway, there and back
const RECEIVER_SECONDS = 7; // time each receiver holds the line of sight
const BIRTH_SECONDS = 3.2;
const HALF_WIDTH = 206; // half the view box width, less a margin

/**
 * Where each domain sits on the wheel, and to which side its tree opens:
 * always outwards, so labels never meet in the middle.
 */
const DOMAINS: Record<Domain, { at: number; side: 1 | -1; cCrypto: number }> = {
  A: { at: -Math.PI / 2, side: 1, cCrypto: 1 },
  C: { at: Math.PI / 6, side: 1, cCrypto: 0 },
  B: { at: (5 * Math.PI) / 6, side: -1, cCrypto: 0.3 },
};

/**
 * Thresholds of the receivers in this illustration. C accepts hybrid nodes
 * here so that its path, like the others, crosses into another domain.
 */
const TAU: Record<Domain, number> = { A: 1, B: 0.3, C: 0.3 };

// Tree geometry: one step to the side and one row down per level.
const STEP = 16;
const ROW = 22;

const SPECS: Record<string, Spec> = {
  TPA: { dom: 'A', x: 0, y: -40, r: 4.2, label: 'TP_A', kind: 'root', parent: null, born: 0.35 },
  IA: { dom: 'A', x: 0, y: 0, r: 5, label: 'Intermediate A', kind: 'int', parent: 'TPA', born: 0 },
  IsA1: { dom: 'A', x: STEP, y: ROW, r: 3.4, label: 'Issuing A1', kind: 'iss', parent: 'IA', born: 0.5 },
  IsA2: { dom: 'A', x: STEP, y: 2 * ROW, r: 3.4, label: 'Issuing A2', kind: 'iss', parent: 'IA', born: 0.55 },

  TPB: { dom: 'B', x: 0, y: -40, r: 4.2, label: 'TP_B', kind: 'root', parent: null, born: 0.35 },
  IB: { dom: 'B', x: 0, y: 0, r: 5, label: 'Intermediate B', kind: 'int', parent: 'TPB', born: 0 },
  IsB1: { dom: 'B', x: STEP, y: ROW, r: 3.4, label: 'Issuing B1', kind: 'iss', parent: 'IB', born: 0.5 },
  EEB: { dom: 'B', x: 2 * STEP, y: 2 * ROW, r: 2.4, label: 'End entity', kind: 'leaf', parent: 'IsB1', born: 0.8 },
  IsB2: { dom: 'B', x: STEP, y: 3 * ROW, r: 3.4, label: 'Issuing B2', kind: 'iss', parent: 'IB', born: 0.55 },

  TPC: { dom: 'C', x: 0, y: -40, r: 4.2, label: 'TP_C', kind: 'root', parent: null, born: 0.35 },
  IC1: { dom: 'C', x: 0, y: 0, r: 5, label: 'Intermediate C1', kind: 'int', parent: 'TPC', born: 0 },
  IsC1: { dom: 'C', x: STEP, y: ROW, r: 3.4, label: 'Issuing C1', kind: 'iss', parent: 'IC1', born: 0.5 },
  IC2: { dom: 'C', x: STEP, y: 2 * ROW, r: 4.2, label: 'Intermediate C2', kind: 'sub', parent: 'IC1', born: 0.45 },
  IsC2: { dom: 'C', x: 2 * STEP, y: 3 * ROW, r: 3.4, label: 'Issuing C2', kind: 'iss', parent: 'IC2', born: 0.65 },
  EEC: { dom: 'C', x: 3 * STEP, y: 4 * ROW, r: 2.4, label: 'End entity', kind: 'leaf', parent: 'IsC2', born: 0.8 },
};

const CROSS: [string, string][] = [
  ['IA', 'IB'],
  ['IB', 'IC1'],
  ['IC1', 'IA'],
];

/** Each receiver, the certificate it validates and its selected path. */
const TURNS: { d: Domain; leaf: string; path: string[] }[] = [
  { d: 'B', leaf: 'EEC', path: ['TPB', 'IB', 'IC1', 'IC2', 'IsC2', 'EEC'] },
  { d: 'A', leaf: 'EEB', path: ['TPA', 'IA', 'IB', 'IsB1', 'EEB'] },
  { d: 'C', leaf: 'EEB', path: ['TPC', 'IC1', 'IB', 'IsB1', 'EEB'] },
];

const clamp01 = (v: number): number => Math.min(Math.max(v, 0), 1);
const ease = (u: number): number => 1 - (1 - clamp01(u)) ** 3;
const f1 = (v: number): string => v.toFixed(1);

function make<K extends keyof SVGElementTagNameMap>(
  name: K,
  attrs: Record<string, string | number>,
  parent: Element,
): SVGElementTagNameMap[K] {
  const e = document.createElementNS(NS, name);
  for (const k in attrs) e.setAttribute(k, String(attrs[k]));
  parent.appendChild(e);
  return e;
}

/** "TP_A" becomes TP with a subscript A. */
function setLabel(text: SVGTextElement, label: string): void {
  const [base, sub] = label.split('_');
  text.textContent = base;
  if (sub) make('tspan', { dy: 3, 'font-size': '0.75em' }, text).textContent = sub;
}

interface Node {
  spec: Spec;
  dot: SVGCircleElement;
  text: SVGTextElement;
}

export function initFederationWheel(): void {
  const svg = document.querySelector<SVGSVGElement>('[data-fed]');
  if (!svg) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const oneColumn = window.matchMedia('(max-width: 960px)');

  const layer = (name: string): SVGGElement => svg.querySelector<SVGGElement>(`[data-fed-${name}]`)!;
  const gGuide = layer('guide');
  const gEdges = layer('edges');
  const gNodes = layer('nodes');
  const gLabels = layer('labels');
  const route = svg.querySelector<SVGPathElement>('[data-fed-route]')!;
  const caption = svg.querySelector<SVGTextElement>('[data-fed-caption]')!;

  const nodes: Record<string, Node> = {};
  for (const id in SPECS) {
    const spec = SPECS[id];
    const dot = make('circle', { class: `fw-node fw-node--${spec.kind === 'leaf' ? 'leaf' : spec.dom}`, r: spec.r }, gNodes);
    const text = make('text', { class: `fw-lbl fw-lbl--${spec.kind}` }, gLabels);
    setLabel(text, spec.label);
    nodes[id] = { spec, dot, text };
  }

  const edges: { a: string; b: string; path: SVGPathElement; cross: boolean }[] = [];
  for (const id in SPECS) {
    const p = SPECS[id].parent;
    if (p) edges.push({ a: p, b: id, path: make('path', { class: SPECS[id].kind === 'leaf' ? 'fw-edge fw-edge--leaf' : 'fw-edge' }, gEdges), cross: false });
  }
  for (const [a, b] of CROSS) edges.push({ a, b, path: make('path', { class: 'fw-edge fw-edge--cross' }, gEdges), cross: true });

  const sight = make('line', { class: 'fw-sight' }, gGuide);
  const anchor = make('circle', { class: 'fw-anchor', r: 9 }, gNodes);
  gNodes.appendChild(svg.querySelector('[data-fed-polaris]')!); // Polaris stays on top

  let clock = 0; // seconds of animation, advancing only while the chart is on screen
  // On one column the chart starts below the fold, so it is drawn complete;
  // on wide screens it is born from Polaris when it first comes into view.
  let birth = reduced || oneColumn.matches ? -99 : Number.NaN;
  let last = 0;
  let raf = 0;
  let visible = false;

  // Width of a label character, from the font size the stylesheet gives
  // labels at this screen size.
  let fontSize = 0;
  const labelSize = (): number => {
    if (!fontSize) fontSize = parseFloat(getComputedStyle(caption).fontSize) || 9.5;
    return fontSize;
  };

  function draw(): void {
    const b = Number.isNaN(birth) ? 0 : clock - birth;
    const since = Math.max(0, b - BIRTH_SECONDS);
    const k = reduced ? 0 : Math.floor(since / RECEIVER_SECONDS) % TURNS.length;
    const phase = since % RECEIVER_SECONDS;
    const on = reduced ? 1 : Math.min(ease((b - 2.6) / 0.8), ease(phase / 0.7), ease((RECEIVER_SECONDS - phase) / 0.7));
    const turn = TURNS[k];
    const angle = reduced ? 0 : SWAY * Math.sin((clock / SWAY_SECONDS) * Math.PI * 2);
    const charW = labelSize() * 0.6;

    const pos: Record<string, [number, number]> = {};
    const grow: Record<string, number> = {};
    for (const id in nodes) {
      const { spec, dot, text } = nodes[id];
      const D = DOMAINS[spec.dom];
      const a = D.at + angle;
      const g = reduced ? 1 : ease((b - spec.born * 2) / 1.6);
      grow[id] = g;
      const x = (RADIUS * Math.cos(a) + D.side * spec.x) * g;
      const y = (RADIUS * Math.sin(a) + spec.y) * g;
      pos[id] = [x, y];

      const leafShown = spec.kind !== 'leaf' ? 1 : id === turn.leaf ? on : 0;
      dot.setAttribute('cx', f1(x));
      dot.setAttribute('cy', f1(y));
      dot.setAttribute('opacity', (g * leafShown).toFixed(2));

      // Labels open to the same side as the tree, the outer side of the
      // wheel; the trust anchor's label sits above it.
      let lx = x + D.side * (spec.r + 5);
      let ly = y + 3.5;
      let anc = D.side > 0 ? 'start' : 'end';
      if (spec.kind === 'root') {
        lx = x;
        ly = y - 11;
        anc = 'middle';
      }
      // Never let a label leave the chart.
      const w = (text.textContent ?? '').length * charW;
      if (anc === 'start') lx = Math.min(lx, HALF_WIDTH - w);
      else if (anc === 'end') lx = Math.max(lx, -HALF_WIDTH + w);
      text.setAttribute('x', f1(lx));
      text.setAttribute('y', f1(ly));
      text.setAttribute('text-anchor', anc);
      const shown = reduced ? 1 : ease((b - spec.born * 2 - 1.2) / 0.8);
      text.setAttribute('opacity', (shown * leafShown).toFixed(2));
    }

    // Inside a domain a certificate is drawn as a tree branch: down from the
    // issuer, then across to the subject. A cross-certificate is a straight
    // line between intermediates.
    const segment = (from: string, to: string, cross: boolean): string =>
      cross ? `L${f1(pos[to][0])},${f1(pos[to][1])}` : `V${f1(pos[to][1])}H${f1(pos[to][0])}`;
    const moveTo = (id: string): string => `M${f1(pos[id][0])},${f1(pos[id][1])}`;
    const isCross = (a: string, to: string): boolean => SPECS[a].dom !== SPECS[to].dom;

    const tau = TAU[turn.d];
    for (const { a, b: to, path, cross } of edges) {
      path.setAttribute('d', moveTo(a) + segment(a, to, cross));
      const leafShown = SPECS[to].kind !== 'leaf' ? 1 : to === turn.leaf ? on : 0;
      path.setAttribute('opacity', (Math.min(grow[a], grow[to]) * leafShown).toFixed(2));
      if (cross) {
        // The receiver's threshold prunes a cross-certificate that reaches a
        // node above it.
        const pruned = DOMAINS[SPECS[a].dom].cCrypto > tau || DOMAINS[SPECS[to].dom].cCrypto > tau;
        path.classList.toggle('is-pruned', pruned && on > 0.5);
      }
    }

    let d = moveTo(turn.path[0]);
    for (let i = 1; i < turn.path.length; i++) d += segment(turn.path[i - 1], turn.path[i], isCross(turn.path[i - 1], turn.path[i]));
    route.setAttribute('d', d);
    route.setAttribute('opacity', on.toFixed(2));

    const [ax, ay] = pos[turn.path[0]];
    anchor.setAttribute('cx', f1(ax));
    anchor.setAttribute('cy', f1(ay));
    anchor.setAttribute('opacity', on.toFixed(2));
    sight.setAttribute('x1', f1(ax));
    sight.setAttribute('y1', f1(ay));
    sight.setAttribute('x2', '0');
    sight.setAttribute('y2', '0');
    sight.setAttribute('opacity', on.toFixed(2));

    caption.textContent = `receiver ${turn.d} · τ`;
    make('tspan', { dy: 3, 'font-size': '0.75em' }, caption).textContent = turn.d;
    make('tspan', { dy: -3 }, caption).textContent = ` = ${tau}`;
    caption.setAttribute('opacity', on.toFixed(2));
  }

  function frame(now: number): void {
    raf = 0;
    const dt = last ? Math.min((now - last) / 1000, 0.1) : 0;
    last = now;
    clock += dt;
    draw();
    if (visible && !reduced) raf = requestAnimationFrame(frame);
  }

  draw();
  if (reduced) return;

  // The graph is born when the chart first comes into view, and the wheel
  // only moves while it is on screen.
  const io = new IntersectionObserver(
    ([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        if (Number.isNaN(birth)) birth = clock;
        last = 0;
        if (!raf) raf = requestAnimationFrame(frame);
      }
    },
    { threshold: 0.35 },
  );
  io.observe(svg);
  window.addEventListener('resize', () => {
    fontSize = 0;
    draw();
  });
}
