export interface DomainCheckResult {
  domain: string;
  timestamp: string;
  checks: {
    spf: CheckResult | null;
    dkim: CheckResult | null;
    dmarc: CheckResult | null;
    mx: CheckResult | null;
    domainResolution: CheckResult | null;
  };
  errors: string[];
}

export interface CheckResult {
  status: 'found' | 'missing' | 'error' | 'valid' | 'invalid';
  message: string;
  record?: string;
  records?: string[];
  selector?: string;
}

export interface DomainCheckError {
  error: string;
  details?: string;
}
