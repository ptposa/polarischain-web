import { z } from 'zod';

/**
 * "where:" definition rows for the math model (§ 01 Formal definition and
 * § 03 Governance constraints per edge). All rich fields carry literal
 * <em>/<sub>/<sup> markup from the source and are rendered with `set:html`.
 */
const formalRowSchema = z.object({
  term: z.string(),
  desc: z.string(),
});

export type FormalDefinitionRow = z.infer<typeof formalRowSchema>;

const formalRowsSchema = z.array(formalRowSchema);

export const formalDefinitionRows: FormalDefinitionRow[] = formalRowsSchema.parse([
  {
    term: '<em>V</em>',
    desc: 'Set of certification authorities participating in the federated ecosystem. Each node v ∈ V represents an individual CA within an administrative domain.',
  },
  {
    term: '<em>E</em> ⊆ <em>V</em> × <em>V</em>',
    desc: 'Set of admissible federation relations between CAs belonging to distinct administrative domains. An edge e = (u,v) ∈ E represents a cross-certificate issued by u towards v.',
  },
  {
    term: '<em>w</em> : <em>E</em> → ℝ≥0',
    desc: 'Technical edge cost function. Quantifies cryptographic robustness, compatibility, and structural complexity. A lower value indicates a preferred relation.',
  },
  {
    term: 'Φ : <em>E</em> → <em>C</em>',
    desc: 'Governance constraint function. Assigns to each edge a set of hard constraints derived directly from the X.509 extensions of the cross-certificate per RFC 5280.',
  },
]);

const phiRowSchema = z.object({
  term: z.string(),
  domSpec: z.string().optional(),
  x509: z.string(),
  isNew: z.boolean().optional(),
  desc: z.string(),
});

export type PhiConstraintRow = z.infer<typeof phiRowSchema>;

const phiRowsSchema = z.array(phiRowSchema);

export const phiConstraintRows: PhiConstraintRow[] = phiRowsSchema.parse([
  {
    term: '<em>prop</em>(<em>e</em>)',
    domSpec: 'prop(<em>e</em>) ∈ {none, limited, full}',
    x509: 'X.509: basicConstraints.pathLen',
    desc: 'Determines whether trust may stop at the current relation, propagate in a bounded way, or be fully reusable across further federation steps.',
  },
  {
    term: '<em>depth</em>(<em>e</em>)',
    domSpec: 'depth(<em>e</em>) ∈ ℕ',
    x509: 'X.509: pathLenConstraint (RFC 5280 §4.2.1.9)',
    desc: 'Bounds how many additional federation steps may be traversed after this relation is used. Decremented by one at each edge; if depth(<em>e</em>) = 0 no further edges may be appended.',
  },
  {
    term: '<em>scope</em>(<em>e</em>)',
    x509: 'X.509: extendedKeyUsage',
    desc: 'Specifies the operational context in which the relation may be reused: TLS, authentication, code signing, or document signing.',
  },
  {
    term: '<em>pol</em><sup style="font-size:0.65em;">+</sup>(<em>e</em>)',
    x509: 'X.509: policyMappings (RFC 5280 §4.2.1.5)',
    desc: 'Identifies certification policies that must be present for the edge to be valid in the path.',
  },
  {
    term: '<em>pol</em><sup style="font-size:0.65em;">−</sup>(<em>e</em>)',
    x509: 'X.509: inhibitAnyPolicy, policyConstraints',
    desc: 'Identifies certification policies that must exclude the relation from candidate paths.',
  },
  {
    term: '<em>name</em>(<em>e</em>)',
    x509: 'X.509: nameConstraints (RFC 5280 §4.2.1.10)',
    desc: 'Restricts the naming space over which trust may apply: DNS domains, email namespaces, X.500 subtrees, or specific organisations. Accumulated by intersection along the path.',
  },
  {
    term: '<em>ku</em>(<em>e</em>)',
    x509: 'X.509: keyUsage',
    desc: 'Restricts which key usage semantics remain valid when traversing the relation (keyCertSign, cRLSign, digitalSignature).',
  },
  {
    term: '<em>eku</em>(<em>e</em>)',
    x509: 'X.509: extendedKeyUsage',
    desc: 'Restricts which application-level purposes remain admissible, such as server authentication or code signing.',
  },
  {
    term: '<em>time</em>(<em>e</em>)',
    domSpec:
      'time(<em>e</em>) = [<em>t</em><sub style="font-size:0.65em;">from</sub>(<em>e</em>), <em>t</em><sub style="font-size:0.65em;">to</sub>(<em>e</em>)]',
    x509: 'X.509: certificate validity window',
    desc: 'Governance time interval during which the trust relation is considered admissible, independently of whether underlying certificates remain syntactically valid under PKIX.',
  },
  {
    term: '<em>crypto_floor</em>(<em>e</em>)',
    domSpec: 'crypto_floor(<em>e</em>) ∈ {classical, hybrid, pqc}',
    x509: 'X.509: domain governance policy',
    isNew: true,
    desc: 'Minimum cryptographic level required by the verifying domain policy to admit this edge. Excludes relations whose <em>c</em><sub style="font-size:0.65em;">crypto</sub> exceeds the defined threshold, regardless of their technical cost.',
  },
]);
