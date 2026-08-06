import { z } from 'zod';

/**
 * Cost-function coefficient cards (§ 02). `name` carries literal <em>/<sub>
 * markup from the source (e.g. "c<sub>crypto</sub>(e)") - rendered with
 * `set:html`.
 */
const coefficientSchema = z.object({
  name: z.string(),
  range: z.string(),
  desc: z.string(),
  scale: z.string(),
});

export type Coefficient = z.infer<typeof coefficientSchema>;

const coefficientsSchema = z.array(coefficientSchema);

const sub = (label: string) =>
  `<sub style="font-size:0.65em;vertical-align:-0.3em;">${label}</sub>`;

export const coefficients: Coefficient[] = coefficientsSchema.parse([
  {
    name: `<em>c</em>${sub('crypto')}(<em>e</em>)`,
    range: '[0.0 - 1.0]',
    desc: 'Cryptographic posture of the relation according to the originating domain scheme.',
    scale: 'PQC = 0.0 · Hybrid = 0.3 · Classical = 1.0',
  },
  {
    name: `<em>c</em>${sub('alg')}(<em>e</em>)`,
    range: '[0.0 - 1.0]',
    desc: 'Penalty for the algorithm family and its interoperability implications.',
    scale: 'ML-DSA = 0.0 · ECDSA = 0.4 · RSA = 0.8',
  },
  {
    name: `<em>c</em>${sub('key')}(<em>e</em>)`,
    range: '[0.0 - 1.0]',
    desc: 'Equivalent security level of the key. Greater strength yields lower cost.',
    scale: '256-bit = 0.0 · 128-bit = 0.5 · 112-bit = 1.0',
  },
  {
    name: `<em>c</em>${sub('dist')}(<em>e</em>)`,
    range: '[0.0 - 1.0]',
    desc: 'Structural distance: chain depth, inter-domain hops, and policy boundary crossings.',
    scale: 'same domain = 0.0 · bridge = 0.5 · indirect = 1.0',
  },
]);
