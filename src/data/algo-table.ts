import { z } from 'zod';

/**
 * Algorithm scoring table (Cost function § 02). `algorithm` is a list of
 * name parts rendered as separate `<span class="alg">` so each part stays
 * non-breaking on its own (e.g. "ECDSA P-384 +" / "ML-DSA-65" can wrap
 * between parts but never mid-name).
 */
const rowSchema = z.object({
  algorithm: z.array(z.string()),
  domain: z.enum(['pqc', 'hybrid', 'classical']),
  domainLabel: z.string(),
  cCrypto: z.string(),
  cAlg: z.string(),
  cKey: z.string(),
  weightLabel: z.enum(['low', 'medium', 'high']),
  tier: z.enum(['good', 'mid', 'bad']),
});

export type AlgoTableRow = z.infer<typeof rowSchema>;

const rowsSchema = z.array(rowSchema);

export const algoTableRows: AlgoTableRow[] = rowsSchema.parse([
  {
    algorithm: ['ML-DSA-87'],
    domain: 'pqc',
    domainLabel: 'PQC',
    cCrypto: '0.0',
    cAlg: '0.0',
    cKey: '0.0',
    weightLabel: 'low',
    tier: 'good',
  },
  {
    algorithm: ['ML-DSA-65'],
    domain: 'pqc',
    domainLabel: 'PQC',
    cCrypto: '0.0',
    cAlg: '0.1',
    cKey: '0.1',
    weightLabel: 'low',
    tier: 'good',
  },
  {
    algorithm: ['ECDSA P-384 +', 'ML-DSA-65'],
    domain: 'hybrid',
    domainLabel: 'hybrid',
    cCrypto: '0.3',
    cAlg: '0.3',
    cKey: '0.1',
    weightLabel: 'medium',
    tier: 'mid',
  },
  {
    algorithm: ['ECDSA P-256 +', 'ML-DSA-44'],
    domain: 'hybrid',
    domainLabel: 'hybrid',
    cCrypto: '0.3',
    cAlg: '0.4',
    cKey: '0.3',
    weightLabel: 'medium',
    tier: 'mid',
  },
  {
    algorithm: ['ECDSA P-384'],
    domain: 'classical',
    domainLabel: 'classical',
    cCrypto: '1.0',
    cAlg: '0.4',
    cKey: '0.1',
    weightLabel: 'high',
    tier: 'bad',
  },
  {
    algorithm: ['RSA-4096'],
    domain: 'classical',
    domainLabel: 'classical',
    cCrypto: '1.0',
    cAlg: '0.8',
    cKey: '0.3',
    weightLabel: 'high',
    tier: 'bad',
  },
]);
