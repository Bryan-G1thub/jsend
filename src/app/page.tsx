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
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Rainbow gradient orbs - Led Zeppelin style */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-r from-red-500/30 via-orange-500/30 via-yellow-500/30 via-green-500/30 via-blue-500/30 via-indigo-500/30 to-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-500/30 via-pink-500/30 via-red-500/30 via-orange-500/30 via-yellow-500/30 via-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-blue-500/30 via-indigo-500/30 via-purple-500/30 via-pink-500/30 via-red-500/30 via-orange-500/30 to-yellow-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-green-500/30 via-cyan-500/30 via-blue-500/30 via-indigo-500/30 via-purple-500/30 via-pink-500/30 to-red-500/30 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Subtle rainbow grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]"></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-block mb-8">
              <div className="w-24 h-24 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-blue-500 via-indigo-500 to-purple-500 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-2xl animate-pulse">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                </svg>
              </div>
            </div>
            <h1 className="text-8xl font-bold bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-8 leading-tight">
              Domain Checker
          </h1>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Verify your domain's email deliverability and security settings
          </p>
        </div>
        
          {/* Main Card */}
          <div className="bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-16 border border-gray-800">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-10">
                <div>
                  <label className="block text-2xl font-semibold text-white mb-6">
                    Enter your domain name
                  </label>
                  <div className="relative">
            <input
              type="text"
              placeholder="example.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleCheckDomain()}
                      className="w-full px-8 py-6 text-2xl bg-gray-900/50 border-2 border-gray-700 rounded-2xl 
                        text-white placeholder:text-gray-500 focus:outline-none focus:ring-4 
                        focus:ring-rainbow-500/50 focus:border-rainbow-400 transition-all duration-300
                        backdrop-blur-sm shadow-xl hover:shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500/10 via-orange-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 via-indigo-500/10 to-purple-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                <button 
                  onClick={handleCheckDomain}
                  disabled={loading || !domain.trim()}
                  className="w-full py-6 px-10 bg-gradient-to-r from-red-500 via-orange-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-indigo-500 via-purple-500 to-pink-500 
                    text-white text-2xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl 
                    transition-all duration-300 transform hover:scale-105 hover:-translate-y-1
                    relative overflow-hidden group border-2 border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  <span className="relative z-10 flex items-center justify-center">
                    {loading ? (
                      <svg className="w-8 h-8 mr-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                    {loading ? 'Checking...' : 'Check Domain'}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-red-500 via-orange-500 via-yellow-500 via-green-500 via-cyan-500 via-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
          
          {/* Results Section */}
          {results && (
            <div className="mt-12 bg-black/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-800">
              <h2 className="text-3xl font-bold text-white mb-8 text-center">Domain Analysis Results</h2>
              
              {'error' in results ? (
                <div className="text-center text-red-400 text-xl">
                  {results.error}
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-semibold text-white mb-2">Domain: {results.domain}</h3>
                    <p className="text-gray-400">Checked at: {new Date(results.timestamp).toLocaleString()}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* SPF Record */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center mb-4">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          results.checks.spf?.status === 'found' ? 'bg-green-500' : 
                          results.checks.spf?.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <h4 className="text-xl font-semibold text-white">SPF Record</h4>
                      </div>
                      <p className="text-gray-300 mb-2">{results.checks.spf?.message}</p>
                      {results.checks.spf?.record && (
                        <div className="bg-black/50 rounded p-3 text-sm text-gray-400 font-mono break-all">
                          {results.checks.spf.record}
                        </div>
                      )}
                    </div>

                    {/* DKIM Record */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center mb-4">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          results.checks.dkim?.status === 'found' ? 'bg-green-500' : 
                          results.checks.dkim?.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <h4 className="text-xl font-semibold text-white">DKIM Record</h4>
                      </div>
                      <p className="text-gray-300 mb-2">{results.checks.dkim?.message}</p>
                      {results.checks.dkim?.record && (
                        <div className="bg-black/50 rounded p-3 text-sm text-gray-400 font-mono break-all">
                          {results.checks.dkim.record}
                        </div>
                      )}
                    </div>

                    {/* DMARC Record */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center mb-4">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          results.checks.dmarc?.status === 'found' ? 'bg-green-500' : 
                          results.checks.dmarc?.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <h4 className="text-xl font-semibold text-white">DMARC Record</h4>
                      </div>
                      <p className="text-gray-300 mb-2">{results.checks.dmarc?.message}</p>
                      {results.checks.dmarc?.record && (
                        <div className="bg-black/50 rounded p-3 text-sm text-gray-400 font-mono break-all">
                          {results.checks.dmarc.record}
                        </div>
                      )}
                    </div>

                    {/* MX Records */}
                    <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                      <div className="flex items-center mb-4">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          results.checks.mx?.status === 'found' ? 'bg-green-500' : 
                          results.checks.mx?.status === 'missing' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                        <h4 className="text-xl font-semibold text-white">MX Records</h4>
                      </div>
                      <p className="text-gray-300 mb-2">{results.checks.mx?.message}</p>
                      {results.checks.mx?.records && (
                        <div className="space-y-2">
                          {(results.checks.mx.records as MxRecord[]).map((record, index) => (
                            <div key={index} className="bg-black/50 rounded p-2 text-sm text-gray-400 font-mono">
                              Priority: {record.priority} - {record.exchange}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Domain Resolution */}
                  <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className={`w-4 h-4 rounded-full mr-3 ${
                        results.checks.domainResolution?.status === 'valid' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <h4 className="text-xl font-semibold text-white">Domain Resolution</h4>
                    </div>
                    <p className="text-gray-300">{results.checks.domainResolution?.message}</p>
                  </div>

                  {/* Summary */}
                  {results.errors.length > 0 && (
                    <div className="bg-red-900/20 border border-red-500/50 rounded-2xl p-6">
                      <h4 className="text-xl font-semibold text-red-400 mb-4">Issues Found:</h4>
                      <ul className="space-y-2">
                        {results.errors.map((error, index) => (
                          <li key={index} className="text-red-300 flex items-center">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
