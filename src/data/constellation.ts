import { z } from 'zod';

/**
 * The 7-node CA constellation projected by the hero scroll-dive.
 * `label`/`sub` are rendered with `set:html` — they carry literal <sub> markup
 * from the source design (e.g. "CA-Root · D<sub>0</sub>").
 */
const nodeSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
  color: z.enum(['c-blue', 'c-gray', 'c-gold']),
  label: z.string(),
  sub: z.string(),
});

export type ConstellationNode = z.infer<typeof nodeSchema>;

const nodesSchema = z.array(nodeSchema);
const edgesSchema = z.array(z.tuple([z.number(), z.number()]));

export const constellationNodes: ConstellationNode[] = nodesSchema.parse([
  {
    x: -0.28,
    y: -0.22,
    z: 0.3,
    color: 'c-blue',
    label: 'CA-Root · D<sub>0</sub>',
    sub: 'origin domain',
  },
  {
    x: 0.3,
    y: -0.3,
    z: 0.42,
    color: 'c-blue',
    label: 'CA-Issuing · D<sub>0</sub>',
    sub: 'end-entity issuer',
  },
  {
    x: 0.38,
    y: 0.1,
    z: 0.55,
    color: 'c-gray',
    label: 'Bridge CA · D<sub>1</sub>',
    sub: 'federation transit',
  },
  {
    x: -0.34,
    y: 0.16,
    z: 0.62,
    color: 'c-gray',
    label: 'CA-X · D<sub>2</sub>',
    sub: 'cross-certified',
  },
  {
    x: 0.08,
    y: 0.34,
    z: 0.78,
    color: 'c-gray',
    label: 'CA-Y · D<sub>2</sub>',
    sub: 'rejected by Φ',
  },
  {
    x: -0.12,
    y: -0.38,
    z: 0.88,
    color: 'c-gold',
    label: 'Anchor · D<sub>n</sub>',
    sub: 'relying-party trust',
  },
  {
    x: 0.2,
    y: -0.06,
    z: 1.0,
    color: 'c-gold',
    label: 'Validator · D<sub>n</sub>',
    sub: 'path target',
  },
]);

/** Edge list as index pairs into `constellationNodes`. */
export const constellationEdges: [number, number][] = edgesSchema.parse([
  [0, 1],
  [1, 2],
  [2, 4],
  [2, 3],
  [3, 5],
  [5, 6],
  [2, 6],
]);
