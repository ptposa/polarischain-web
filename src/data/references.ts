/**
 * Bibliography of the overview. Every entry comes from the single bibliography
 * of the thesis report (99-bibliografia.tex), rewritten in English and in the
 * style of the references section of an RFC.
 */
export interface Reference {
  key: string;
  text: string;
  url?: string;
}

const rfc = (n: number) => `https://www.rfc-editor.org/info/rfc${n}`;
const doi = (d: string) => `https://doi.org/${d}`;

export const normative: Reference[] = [
  { key: "RFC4158", text: 'Cooper, M., Dzambasow, Y., Hesse, P., Joseph, S. and R. Nicholas, "Internet X.509 Public Key Infrastructure: Certification Path Building", RFC 4158, September 2005.', url: rfc(4158) },
  { key: "RFC5280", text: 'Cooper, D., Santesson, S., Farrell, S., Boeyen, S., Housley, R. and W. Polk, "Internet X.509 Public Key Infrastructure Certificate and Certificate Revocation List (CRL) Profile", RFC 5280, May 2008.', url: rfc(5280) },
  { key: "RFC5652", text: 'Housley, R., "Cryptographic Message Syntax (CMS)", RFC 5652, September 2009.', url: rfc(5652) },
  { key: "RFC5914", text: 'Housley, R., Ashmore, S. and C. Wallace, "Trust Anchor Format", RFC 5914, June 2010.', url: rfc(5914) },
  { key: "RFC5937", text: 'Ashmore, S. and C. Wallace, "Using Trust Anchor Constraints during Certification Path Processing", RFC 5937, August 2010.', url: rfc(5937) },
  { key: "RFC6962", text: 'Laurie, B., Langley, A. and E. Kasper, "Certificate Transparency", RFC 6962, June 2013.', url: rfc(6962) },
  { key: "RFC9162", text: 'Laurie, B., Messeri, E. and R. Stradling, "Certificate Transparency Version 2.0", RFC 9162, December 2021.', url: rfc(9162) },
  { key: "RFC9549", text: 'Housley, R., "Internationalization Updates to RFC 5280", RFC 9549, March 2024.', url: rfc(9549) },
  { key: "RFC9618", text: 'Benjamin, D., "Updates to X.509 Policy Validation", RFC 9618, August 2024.', url: rfc(9618) },
  { key: "RFC9846", text: 'Rescorla, E., "The Transport Layer Security (TLS) Protocol Version 1.3", RFC 9846, July 2026.', url: rfc(9846) },
  { key: "FIPS204", text: 'National Institute of Standards and Technology, "Module-Lattice-Based Digital Signature Standard", FIPS PUB 204, August 2024.', url: doi("10.6028/NIST.FIPS.204") },
  { key: "SP800-57", text: 'Barker, E., "Recommendation for Key Management: Part 1 - General", NIST Special Publication 800-57 Part 1 Revision 5, May 2020.', url: doi("10.6028/NIST.SP.800-57pt1r5") },
];

export const informative: Reference[] = [
  { key: "Adukia2010", text: 'Adukia, S., "Certificate Path Validation in Bridge CA and Cross-Certification Environments", Microsoft Windows PKI team blog, 12 May 2010.', url: "https://learn.microsoft.com/en-us/archive/blogs/pki/certificate-path-validation-in-bridge-ca-and-cross-certification-environments" },
  { key: "Desrochers1988", text: 'Desrochers, M. and F. Soumis, "A generalized permanent labelling algorithm for the shortest path problem with time windows", INFOR, vol. 26, no. 3, pp. 191-212, 1988.', url: doi("10.1080/03155986.1988.11732063") },
  { key: "Dijkstra1959", text: 'Dijkstra, E. W., "A note on two problems in connexion with graphs", Numerische Mathematik, vol. 1, pp. 269-271, 1959.', url: doi("10.1007/BF01386390") },
  { key: "draft-composite", text: 'Ounsworth, M., Gray, J., Pala, M., Klaußner, J. and S. Fluhrer, "Composite Module-Lattice-Based Digital Signature Algorithm (ML-DSA) for use in X.509 Public Key Infrastructure", Internet-Draft draft-ietf-lamps-pq-composite-sigs-19, April 2026, work in progress.', url: "https://datatracker.ietf.org/doc/draft-ietf-lamps-pq-composite-sigs/" },
  { key: "ETSI119612", text: 'ETSI, "Electronic Signatures and Trust Infrastructures (ESI); Trusted Lists", ETSI TS 119 612 V2.4.1, August 2025.' },
  { key: "F-PKI", text: 'Chuat, L., Krähenbühl, C., Mittal, P. and A. Perrig, "F-PKI: Enabling innovation and trust flexibility in the HTTPS public-key infrastructure", NDSS 2022.', url: doi("10.14722/ndss.2022.24241") },
  { key: "FIPS205", text: 'National Institute of Standards and Technology, "Stateless Hash-Based Digital Signature Standard", FIPS PUB 205, August 2024.', url: doi("10.6028/NIST.FIPS.205") },
  { key: "FPKI-PDVAL", text: 'General Services Administration, "Path Discovery and Validation", Federal PKI Playbooks, IDManagement.gov.', url: "https://playbooks.idmanagement.gov/fpki/pdval/" },
  { key: "Irnich2005", text: 'Irnich, S. and G. Desaulniers, "Shortest path problems with resource constraints", in Column Generation, Springer, pp. 33-65, 2005.', url: doi("10.1007/0-387-25486-2_2") },
  { key: "Joksch1966", text: 'Joksch, H. C., "The shortest route problem with constraints", Journal of Mathematical Analysis and Applications, vol. 14, no. 2, pp. 191-197, 1966.', url: doi("10.1016/0022-247X(66)90020-5") },
  { key: "Kakei2021", text: 'Kakei, S., Shiraishi, Y. and S. Saito, "Simplifying Dynamic Public Key Certificate Graph for Certification Path Building in Distributed Public Key Infrastructure", ICTC 2021, pp. 545-550.', url: doi("10.1109/ICTC52510.2021.9620853") },
  { key: "KuboSato2010", text: 'Kubo, A. and H. Sato, "Design of graded trusts by using dynamic path validation", Trust Management IV (IFIPTM 2010), IFIP AICT vol. 321, Springer, pp. 172-183.', url: doi("10.1007/978-3-642-13446-3_12") },
  { key: "Lloyd2002", text: 'Lloyd, S., "Understanding Certification Path Construction", white paper, PKI Forum, September 2002.' },
  { key: "LopezMillan", text: 'López Millán, G., Gil Pérez, M., Martínez Pérez, G. and A. F. Gómez Skarmeta, "PKI-based trust management in inter-domain scenarios", Computers & Security, vol. 29, no. 2, pp. 278-290, March 2010.', url: doi("10.1016/j.cose.2009.08.004") },
  { key: "NISTIR8547", text: 'Moody, D., Perlner, R., Regenscheid, A., Robinson, A. and D. Cooper, "Transition to Post-Quantum Cryptography Standards", NIST IR 8547, initial public draft, November 2024.', url: doi("10.6028/NIST.IR.8547.ipd") },
  { key: "RFC3647", text: 'Chokhani, S., Ford, W., Sabett, R., Merrill, C. and S. Wu, "Internet X.509 Public Key Infrastructure Certificate Policy and Certification Practices Framework", RFC 3647, November 2003.', url: rfc(3647) },
  { key: "RFC5055", text: 'Freeman, T., Housley, R., Malpani, A., Cooper, D. and W. Polk, "Server-Based Certificate Validation Protocol (SCVP)", RFC 5055, December 2007.', url: rfc(5055) },
  { key: "RFC6960", text: 'Santesson, S., Myers, M., Ankney, R., Malpani, A., Galperin, S. and C. Adams, "X.509 Internet Public Key Infrastructure Online Certificate Status Protocol - OCSP", RFC 6960, June 2013.', url: rfc(6960) },
  { key: "RFC7426", text: 'Haleplidis, E., Pentikousis, K., Denazis, S., Hadi Salim, J., Meyer, D. and O. Koufopavlou, "Software-Defined Networking (SDN): Layers and Architecture Terminology", RFC 7426, January 2015.', url: rfc(7426) },
  { key: "RFC8933", text: 'Housley, R., "Update to the Cryptographic Message Syntax (CMS) for Algorithm Identifier Protection", RFC 8933, October 2020.', url: rfc(8933) },
  { key: "RFC9794", text: 'Driscoll, F., Parsons, M. and B. Hale, "Terminology for Post-Quantum Traditional Hybrid Schemes", RFC 9794, June 2025.', url: rfc(9794) },
  { key: "RFC9810", text: 'Brockhaus, H., von Oheimb, D., Ounsworth, M. and J. Gray, "Internet X.509 Public Key Infrastructure -- Certificate Management Protocol (CMP)", RFC 9810, July 2025.', url: rfc(9810) },
  { key: "RFC9881", text: 'Massimo, J., Kampanakis, P., Turner, S. and B. E. Westerbaan, "Internet X.509 Public Key Infrastructure -- Algorithm Identifiers for the Module-Lattice-Based Digital Signature Algorithm (ML-DSA)", RFC 9881, October 2025.', url: rfc(9881) },
  { key: "RFC9882", text: 'Salter, B., Raine, A. and D. Van Geest, "Use of the ML-DSA Signature Algorithm in the Cryptographic Message Syntax (CMS)", RFC 9882, October 2025.', url: rfc(9882) },
  { key: "RifaPous2007", text: 'Rifà-Pous, H. and J. Herrera-Joancomartí, "An interdomain PKI model based on trust lists", Public Key Infrastructure (EuroPKI 2007), LNCS vol. 4582, Springer, pp. 49-64.', url: doi("10.1007/978-3-540-73408-6_4") },
  { key: "SP800-207", text: 'Rose, S., Borchert, O., Mitchell, S. and S. Connelly, "Zero Trust Architecture", NIST Special Publication 800-207, August 2020.', url: doi("10.6028/NIST.SP.800-207") },
  { key: "StaticCT", text: 'C2SP, "The Static Certificate Transparency API", version v1.1.0, 20 March 2026.', url: "https://c2sp.org/static-ct-api" },
  { key: "WorldBank", text: 'Tullis, C. and D. Black, "Public Key Infrastructure: Implementing High-Trust Electronic Signatures", Digital Public Infrastructure Policy Note Series, World Bank, December 2024.' },
];
