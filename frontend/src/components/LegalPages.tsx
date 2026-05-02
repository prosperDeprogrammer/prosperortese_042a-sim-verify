import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
      <div className="glass-card p-8 md:p-12 border-dark-800 animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Privacy Policy</h1>
        <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-10">Last Updated: May 2026</p>

        <div className="space-y-8 text-dark-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introduction</h2>
            <p>
              SimVerify Pro ("we", "our", or "us") is committed to protecting your privacy and ensuring the highest level of security for the personal and telecommunications data processed through our platform. This Privacy Policy outlines how we handle data when you use our services, which are powered by the GSMA Open Gateway and CAMARA API standards.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Data Processing via Telecom APIs</h2>
            <p>
              As an identity verification gateway, our primary function is to route requests to mobile network operators (MNOs) via standardized Network-as-a-Code (NaC) endpoints.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-dark-400">
              <li><strong>Number Verification:</strong> We process MSISDNs (phone numbers) strictly for real-time authentication matching.</li>
              <li><strong>SIM Swap Detection:</strong> We query the network to determine the last SIM change date to prevent Account Takeover (ATO).</li>
              <li><strong>Location Verification:</strong> We process coarse geospatial data exclusively for fraud prevention and geo-fenced commerce validation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Data Retention and Storage</h2>
            <p>
              SimVerify operates on a <strong>zero-knowledge architecture</strong> for end-user PII (Personally Identifiable Information). API responses (such as exact location coordinates or user identities) are transiently processed in memory to generate risk scores (e.g., "Safe", "High Risk") and are immediately discarded. We retain only metadata (e.g., API timestamps, merchant IDs, and obfuscated risk flags) necessary for billing and audit trails.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Information Sharing</h2>
            <p>
              We do not sell, rent, or trade your data. Information is strictly shared with authorized mobile network partners via secure, encrypted channels (TLS 1.3) solely for the purpose of executing the requested verification check on behalf of the registered SME or merchant.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Contact Information</h2>
            <p>
              If you have any questions regarding this Privacy Policy or our security practices, please contact our Data Protection Officer at <span className="text-brand-400 font-mono">privacy@simverify.pro</span>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export const TermsOfService: React.FC = () => {
  return (
    <div className="pt-24 md:pt-32 pb-20 px-4 md:px-6 max-w-4xl mx-auto min-h-screen">
      <div className="glass-card p-8 md:p-12 border-dark-800 animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 tracking-tight">Terms of Service</h1>
        <p className="text-brand-400 text-sm font-bold uppercase tracking-widest mb-10">Effective Date: October 2026</p>

        <div className="space-y-8 text-dark-300 text-sm md:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the SimVerify Pro API and associated services, you agree to comply with and be bound by these Terms of Service. If you are acting on behalf of a business (SME or Enterprise), you represent that you have the authority to bind that entity to these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Acceptable Use Policy</h2>
            <p>
              The SimVerify API is provided exclusively for fraud prevention, identity verification, and security enhancement. You explicitly agree <strong>NOT</strong> to use the API for:
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2 text-dark-400">
              <li>Surveillance, stalking, or unauthorized tracking of individuals.</li>
              <li>Marketing, lead generation, or unsolicited communications.</li>
              <li>Any activity that violates the telecommunication regulations of the operating jurisdiction (e.g., NCC in Nigeria).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Compliance with CAMARA Standards</h2>
            <p>
              Our infrastructure utilizes the GSMA Open Gateway and CAMARA project standards. Merchants must ensure that explicit end-user consent is obtained prior to triggering Network API calls, in accordance with local data protection laws (e.g., NDPA).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Service Level Agreement (SLA) & Beta Provision</h2>
            <p>
              During the hackathon and early beta phases, services are provided "AS-IS" without explicit uptime guarantees. Upon transitioning to a commercial production environment, Enterprise tier users will be subject to a 99.9% uptime SLA backed by our carrier partners.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Limitation of Liability</h2>
            <p>
              SimVerify Pro shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, resulting from API downtime, network provider outages, or inaccurate carrier data.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
