'use client';

import { useState } from 'react';
import { DomainCheckResult, DomainCheckError, MxRecord } from '@/types/domain-check';

export default function Home() {
  const [domain, setDomain] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<DomainCheckResult | DomainCheckError | null>(null);

  const handleCheckDomain = async () => {
    if (!domain.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/check-domain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ domain: domain.trim() }),
      });
      
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Error checking domain:', error);
      setResults({ error: 'Failed to check domain. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <section className="card" style={{ padding: "2rem" }}>
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <h1>Domain Checker</h1>
          <p>Verify your domain&apos;s email deliverability and security settings.</p>
        </div>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            type="text"
            placeholder="example.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCheckDomain()}
            style={{ flex: 1, padding: "0.875rem 1rem" }}
          />
          <button
            onClick={handleCheckDomain}
            disabled={loading || !domain.trim()}
            style={{ padding: "0.875rem 1.25rem", fontWeight: 600 }}
          >
            {loading ? 'Checking…' : 'Check'}
          </button>
        </div>
      </section>

      {results && (
        <section className="card" style={{ marginTop: "1rem", padding: "1.5rem" }}>
          {'error' in results ? (
            <div style={{ color: "#b91c1c" }}>{results.error}</div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1rem" }}>
                <h2>Results</h2>
                <span style={{ color: "var(--muted)", fontSize: "0.875rem" }}>
                  {new Date(results.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="grid md:grid-cols-2" style={{ gap: "0.75rem" }}>
                <div className="card" style={{ padding: "1rem" }}>
                  <h3>SPF</h3>
                  <p>{results.checks.spf?.message}</p>
                  {results.checks.spf?.record && (
                    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.875rem", color: "#6b7280", wordBreak: "break-all" }}>
                      {results.checks.spf.record}
                    </div>
                  )}
                </div>

                <div className="card" style={{ padding: "1rem" }}>
                  <h3>DKIM</h3>
                  <p>{results.checks.dkim?.message}</p>
                  {results.checks.dkim?.record && (
                    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.875rem", color: "#6b7280", wordBreak: "break-all" }}>
                      {results.checks.dkim.record}
                    </div>
                  )}
                </div>

                <div className="card" style={{ padding: "1rem" }}>
                  <h3>DMARC</h3>
                  <p>{results.checks.dmarc?.message}</p>
                  {results.checks.dmarc?.record && (
                    <div style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.875rem", color: "#6b7280", wordBreak: "break-all" }}>
                      {results.checks.dmarc.record}
                    </div>
                  )}
                </div>

                <div className="card" style={{ padding: "1rem" }}>
                  <h3>MX Records</h3>
                  <p>{results.checks.mx?.message}</p>
                  {results.checks.mx?.records && (
                    <div style={{ display: "grid", gap: "0.25rem" }}>
                      {(results.checks.mx.records as MxRecord[]).map((record, index) => (
                        <div key={index} style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.875rem", color: "#6b7280" }}>
                          Priority: {record.priority} - {record.exchange}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="card" style={{ marginTop: "0.75rem", padding: "1rem" }}>
                <h3>Domain Resolution</h3>
                <p>{results.checks.domainResolution?.message}</p>
              </div>

              {results.errors.length > 0 && (
                <div className="card" style={{ marginTop: "0.75rem", padding: "1rem", borderColor: "#fca5a5" }}>
                  <h3 style={{ color: "#b91c1c" }}>Issues Found</h3>
                  <ul style={{ margin: 0, paddingLeft: "1rem" }}>
                    {results.errors.map((error, index) => (
                      <li key={index} style={{ color: "#7f1d1d" }}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
