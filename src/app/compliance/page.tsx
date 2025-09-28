export default function CompliancePage() {
  return (
    <div style={{ padding: 24, display: 'grid', gap: 16 }}>
      <div>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Compliance & Security</h2>
        <p style={{ margin: '6px 0 0 0', color: '#64748b' }}>KYC/KYB, documents, GDPR, and audit trails.</p>
      </div>

      <div style={{ display: 'grid', gap: 12 }}>
        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>KYC/KYB & AML</h3>
          <p style={{ margin: '6px 0 0 0', color: '#4b5563' }}>Identity, business verification, and consent management.</p>
        </section>

        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Documents & Signatures</h3>
          <p style={{ margin: '6px 0 0 0', color: '#4b5563' }}>NDAs, e-signatures, and compliance handling.</p>
        </section>

        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>GDPR & Redaction</h3>
          <p style={{ margin: '6px 0 0 0', color: '#4b5563' }}>Data handling with auto-redaction policies.</p>
        </section>

        <section style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Audit Trails</h3>
          <p style={{ margin: '6px 0 0 0', color: '#4b5563' }}>Full audit trails for tenders and financial transactions.</p>
        </section>
      </div>
    </div>
  );
}



