/**
 * Scene of the "Federated path discovery" artefact.
 *
 * A server in the origin domain D0 presents its certificate to a relying
 * party in Dn, a hybrid domain with threshold tau = 0.3. The discovery climbs
 * from the end-entity certificate to the relying party's own anchor. Crossings
 * between domains are always between intermediate CAs, never from a root, so
 * the origin root stays off the path: the relying party never has to trust it.
 * A candidate through a classical intermediate in D2 is pruned by tau.
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
    y: 140,
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
    y: 92,
    zone: 'origin',
    side: 'right',
    kind: 'ca',
    title: 'Issuing CA',
    domain: 'D₀',
    role: 'End-entity issuance',
    alg: 'ML-DSA-65',
    status: '✓ c_crypto 0 ≤ τ',
  },
  {
    id: 'intD0',
    x: 300,
    y: 188,
    zone: 'origin',
    side: 'left',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₀',
    role: 'Subordinate CA',
    alg: 'ML-DSA-65',
    status: '✓ c_crypto 0 ≤ τ',
  },
  {
    id: 'rootD0',
    x: 470,
    y: 188,
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
    y: 384,
    zone: 'transit',
    side: 'left',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₁',
    role: 'Federated transit',
    alg: 'P-384 + ML-DSA-65',
    status: '✓ c_crypto 0.3 ≤ τ',
  },
  {
    id: 'intD2',
    x: 500,
    y: 404,
    zone: 'transit',
    side: 'right',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'D₂',
    role: 'Federated transit',
    alg: 'RSA-2048',
    status: '✕ c_crypto 1 > τ = 0.3',
    rejected: true,
  },
  {
    id: 'intDn',
    x: 452,
    y: 612,
    zone: 'rp',
    side: 'right',
    kind: 'ca',
    title: 'Intermediate CA',
    domain: 'Dₙ',
    role: 'Subordinate CA',
    alg: 'P-384 + ML-DSA-65',
    status: '✓ c_crypto 0.3 ≤ τ',
  },
  {
    id: 'rootDn',
    x: 230,
    y: 652,
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

/** The candidate that tau prunes. */
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
    y: 20,
    h: 244,
    title: 'ORIGIN DOMAIN · D₀',
    sub: 'Post-quantum · issuer of the certificate',
  },
  {
    id: 'transit',
    y: 280,
    h: 216,
    title: 'FEDERATION TRANSIT · D₁ ‥ Dₙ₋₁',
    sub: 'Intermediate domains',
  },
  {
    id: 'rp',
    y: 512,
    h: 224,
    title: 'RELYING-PARTY DOMAIN · Dₙ',
    sub: 'Hybrid · threshold τ = 0.3 · validator',
  },
];

/* ── Narrow scene, for phones ──────────────────────────────────────────
   Same nodes and edges, laid out in 360 units. Labels keep the title, the
   algorithm and the status; the zones already say the domain. */

export type Place = 'left' | 'right' | 'below' | 'above';

export const narrowLayout: Record<string, { x: number; y: number; place: Place; status?: string }> = {
  ee: { x: 44, y: 124, place: 'below' },
  issuing: { x: 150, y: 86, place: 'right' },
  intD0: { x: 150, y: 196, place: 'left' },
  rootD0: { x: 290, y: 196, place: 'below' },
  intD1: { x: 150, y: 400, place: 'left' },
  intD2: { x: 286, y: 380, place: 'below' },
  intDn: { x: 150, y: 604, place: 'left' },
  rootDn: { x: 270, y: 700, place: 'below', status: '✓ relying-party anchor' },
};

/** Latent edges left out of the narrow scene, where they would cross labels. */
export const narrowSkip: [string, string][] = [['intD2', 'intDn']];

export const narrowZones: { id: Zone; y: number; h: number; title: string; sub: string }[] = [
  { id: 'origin', y: 8, h: 262, title: 'ORIGIN · D₀', sub: 'post-quantum · issuer' },
  { id: 'transit', y: 280, h: 230, title: 'TRANSIT · D₁ ‥ Dₙ₋₁', sub: 'intermediate domains' },
  { id: 'rp', y: 520, h: 272, title: 'RELYING PARTY · Dₙ', sub: 'hybrid · τ = 0.3 · validator' },
];
