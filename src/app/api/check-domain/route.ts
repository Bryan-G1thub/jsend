import { NextRequest, NextResponse } from 'next/server';
import { promisify } from 'util';
import { resolve } from 'dns';
import { DomainCheckResult, CheckResult } from '@/types/domain-check';

const dnsResolve = promisify(resolve);

export async function POST(request: NextRequest) {
  try {
    const { domain } = await request.json();
    
    if (!domain) {
      return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
    }

    // Clean the domain (remove protocol, www, etc.)
    const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    
    const results: DomainCheckResult = {
      domain: cleanDomain,
      timestamp: new Date().toISOString(),
      checks: {
        spf: null,
        dkim: null,
        dmarc: null,
        mx: null,
        domainResolution: null
      },
      errors: []
    };

    // Check domain resolution
    try {
      await dnsResolve(cleanDomain, 'A');
      results.checks.domainResolution = { status: 'valid', message: 'Domain resolves correctly' };
    } catch (error) {
      results.checks.domainResolution = { status: 'invalid', message: 'Domain does not resolve' };
      results.errors.push('Domain resolution failed');
    }

    // Check SPF record
    try {
      const spfRecords = await dnsResolve(cleanDomain, 'TXT');
      const spfRecord = spfRecords.find(record => record.startsWith('v=spf1'));
      if (spfRecord) {
        results.checks.spf = { 
          status: 'found', 
          record: spfRecord,
          message: 'SPF record found'
        };
      } else {
        results.checks.spf = { 
          status: 'missing', 
          message: 'No SPF record found'
        };
        results.errors.push('SPF record missing');
      }
    } catch (error) {
      results.checks.spf = { status: 'error', message: 'Could not check SPF record' };
      results.errors.push('SPF check failed');
    }

    // Check DMARC record
    try {
      const dmarcRecords = await dnsResolve(`_dmarc.${cleanDomain}`, 'TXT');
      const dmarcRecord = dmarcRecords.find(record => record.startsWith('v=DMARC1'));
      if (dmarcRecord) {
        results.checks.dmarc = { 
          status: 'found', 
          record: dmarcRecord,
          message: 'DMARC record found'
        };
      } else {
        results.checks.dmarc = { 
          status: 'missing', 
          message: 'No DMARC record found'
        };
        results.errors.push('DMARC record missing');
      }
    } catch (error) {
      results.checks.dmarc = { status: 'error', message: 'Could not check DMARC record' };
      results.errors.push('DMARC check failed');
    }

    // Check MX records
    try {
      const mxRecords = await dnsResolve(cleanDomain, 'MX');
      if (mxRecords.length > 0) {
        results.checks.mx = { 
          status: 'found', 
          records: mxRecords,
          message: `${mxRecords.length} MX record(s) found`
        };
      } else {
        results.checks.mx = { 
          status: 'missing', 
          message: 'No MX records found'
        };
        results.errors.push('MX records missing');
      }
    } catch (error) {
      results.checks.mx = { status: 'error', message: 'Could not check MX records' };
      results.errors.push('MX check failed');
    }

    // Check for DKIM (this is more complex, we'll look for common selectors)
    try {
      const commonSelectors = ['default', 'mail', 'google', 'k1', 'selector1', 'selector2'];
      let dkimFound = false;
      
      for (const selector of commonSelectors) {
        try {
          const dkimRecords = await dnsResolve(`${selector}._domainkey.${cleanDomain}`, 'TXT');
          const dkimRecord = dkimRecords.find(record => record.includes('v=DKIM1'));
          if (dkimRecord) {
            results.checks.dkim = { 
              status: 'found', 
              selector: selector,
              record: dkimRecord,
              message: `DKIM record found for selector: ${selector}`
            };
            dkimFound = true;
            break;
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      if (!dkimFound) {
        results.checks.dkim = { 
          status: 'missing', 
          message: 'No DKIM records found for common selectors'
        };
        results.errors.push('DKIM records missing');
      }
    } catch (error) {
      results.checks.dkim = { status: 'error', message: 'Could not check DKIM records' };
      results.errors.push('DKIM check failed');
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Domain check error:', error);
    return NextResponse.json(
      { error: 'Failed to check domain', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
