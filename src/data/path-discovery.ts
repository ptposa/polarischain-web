/**
 * Scene of the "Federated path discovery" artefact.
 *
 * A server in the origin domain D0 presents its certificate to a relying
 * party in Dn, a hybrid domain with floor tau = (hybrid, 0). The discovery climbs
 * from the end-entity certificate to the relying party's own anchor. Crossings
 * between domains are always between intermediate CAs, never from a root, so
 * the origin root stays off the path: the relying party never has to trust it.
 * A candidate through a traditional intermediate in D2 falls below the floor.
 */

export type Zone = 'origin' | 'transit' | 'rp';
export type Side = 'left' | 'right';

export interface SceneNode {
  id: string;
  x: number;
  y: number;
  zone: Zone;
  side: Side;
  title: string;
  domain: string;
  role: string;
  alg: string;
  /** Status line typed once the node is reached. */
  status: string;
  kind: 'ca' | 'root' | 'ee';
  /** Shown but never reached by the discovery. */
  offPath?: boolean;
  rejected?: boolean;
}

export const sceneNodes: SceneNode[] = [
  {
    id: 'ee',
    x: 96,
    y: 120,
    zone: 'origin',
    side: 'right',
    kind: 'ee',
    title: 'End-entity',
    domain: 'D₀',
    role: 'server.c.lab',
    alg: 'ML-DSA-65',
    status: '',
  },
  {
    id: 'issuing',
    x: 318,
    y: 84,
    zone: 'origin',
    side: 'right',
    kind: 'ca',
    title: 'Issuing CA',
    domain: 'D₀',
    role: 'End-entity issuance',
    alg: 'ML-DSA-65',
    status: '✓ (post_quantum, 3) ⪰ τ',
  },
  {
    id: 'intD0',
    x: 300,
    y: 132,
    zone: 'origin',
    side: 'left',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₀',
    role: 'Subordinate CA',
    alg: 'ML-DSA-65',
    status: '✓ (post_quantum, 3) ⪰ τ',
  },
  {
    id: 'rootD0',
    x: 470,
    y: 132,
    zone: 'origin',
    side: 'right',
    kind: 'root',
    title: 'Root CA',
    domain: 'D₀',
    role: 'Internal root',
    alg: 'ML-DSA-87',
    status: 'not on the path',
    offPath: true,
  },
  {
    id: 'intD1',
    x: 300,
    y: 324,
    zone: 'transit',
    side: 'left',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₁',
    role: 'Federated transit',
    alg: 'P-384 + ML-DSA-65',
    status: '✓ (hybrid, 3) ⪰ τ',
  },
  {
    id: 'intD2',
    x: 500,
    y: 334,
    zone: 'transit',
    side: 'right',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₂',
    role: 'Federated transit',
    alg: 'RSA-2048',
    status: '✕ traditional, below τ',
    rejected: true,
  },
  {
    id: 'intDn',
    x: 452,
    y: 498,
    zone: 'rp',
    side: 'right',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'Dₙ',
    role: 'Subordinate CA',
    alg: 'P-384 + ML-DSA-65',
    status: '✓ (hybrid, 3) ⪰ τ',
  },
  {
    id: 'rootDn',
    x: 230,
    y: 538,
    zone: 'rp',
    side: 'left',
    kind: 'root',
    title: 'Root CA',
    domain: 'Dₙ',
    role: 'Trust anchor',
    alg: 'P-384 + ML-DSA-65',
    status: '✓ anchor of the relying party',
  },
];

/** The admissible path, drawn segment by segment from the certificate up. */
export const pathEdges: [string, string][] = [
  ['ee', 'issuing'],
  ['issuing', 'intD0'],
  ['intD0', 'intD1'],
  ['intD1', 'intDn'],
  ['intDn', 'rootDn'],
];

/** Every certificate relation in the scene, drawn faintly from the start. */
export const latentEdges: [string, string][] = [
  ['ee', 'issuing'],
  ['issuing', 'intD0'],
  ['intD0', 'rootD0'],
  ['intD0', 'intD1'],
  ['intD0', 'intD2'],
  ['intD2', 'intDn'],
  ['intD1', 'intDn'],
  ['intDn', 'rootDn'],
];

/** The candidate that the floor drops. */
export const rejectedEdge: [string, string] = ['intD0', 'intD2'];

/** Which edges cross a domain boundary: they are cross-certificates. */
export const crossEdges: [string, string][] = [
  ['intD0', 'intD1'],
  ['intD1', 'intDn'],
  ['intD0', 'intD2'],
  ['intD2', 'intDn'],
];

export const zones: { id: Zone; y: number; h: number; title: string; sub: string }[] = [
  {
    id: 'origin',
    y: 16,
    h: 214,
    title: 'ORIGIN DOMAIN · D₀',
    sub: 'Post-quantum · issuer of the certificate',
  },
  {
    id: 'transit',
    y: 246,
    h: 176,
    title: 'FEDERATION TRANSIT · D₁ ‥ Dₙ₋₁',
    sub: 'Intermediate domains',
  },
  {
    id: 'rp',
    y: 438,
    h: 186,
    title: 'RELYING-PARTY DOMAIN · Dₙ',
    sub: 'Hybrid · floor τ = (hybrid, 0) · validator',
  },
];

/* ── Narrow scene, for phones ──────────────────────────────────────────
   Same nodes and edges, laid out in 360 units. Labels keep the title, the
   algorithm and the status; the zones already say the domain. */

export type Place = 'left' | 'right' | 'below' | 'above';

export const narrowLayout: Record<string, { x: number; y: number; place: Place; status?: string }> = {
  ee: { x: 70, y: 110, place: 'below' },
  issuing: { x: 176, y: 70, place: 'right' },
  intD0: { x: 176, y: 150, place: 'left' },
  rootD0: { x: 316, y: 140, place: 'below' },
  intD1: { x: 176, y: 318, place: 'left' },
  intD2: { x: 292, y: 298, place: 'below' },
  intDn: { x: 176, y: 474, place: 'left' },
  rootDn: { x: 296, y: 544, place: 'below', status: '✓ relying-party anchor' },
};

/** Latent edges left out of the narrow scene, where they would cross labels. */
export const narrowSkip: [string, string][] = [['intD2', 'intDn']];

export const narrowZones: { id: Zone; y: number; h: number; title: string; sub: string }[] = [
  { id: 'origin', y: 8, h: 214, title: 'ORIGIN · D₀', sub: 'post-quantum · issuer' },
  { id: 'transit', y: 230, h: 164, title: 'TRANSIT · D₁ ‥ Dₙ₋₁', sub: 'intermediate domains' },
  { id: 'rp', y: 402, h: 214, title: 'RELYING PARTY · Dₙ', sub: 'hybrid · τ = (hybrid, 0)' },
];
