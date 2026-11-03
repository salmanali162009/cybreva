// ─────────────────────────────────────────────
//  Cybreva — Google Web Risk / Safe Browsing integration
//
//  Supports BOTH:
//  - Google Web Risk API (GOOGLE_WEB_RISK_API_KEY)
//  - Google Safe Browsing API (GOOGLE_SAFE_BROWSING_API_KEY)
//    (the .env uses the Safe Browsing key name)
// ─────────────────────────────────────────────
import axios from 'axios';

const THREAT_TYPES = [
  'MALWARE',
  'SOCIAL_ENGINEERING',
  'UNWANTED_SOFTWARE',
  'POTENTIALLY_HARMFUL_APPLICATION',
];

const PLATFORM_TYPES = ['ANY_PLATFORM'];

/**
 * Query the Google Safe Browsing Lookup API v4.
 * Returns an array of matched threat entries (empty = no known threat).
 */
const checkWithSafeBrowsing = async (url, apiKey) => {
  const endpoint = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`;

  const requestBody = {
    client: { clientId: 'cybreva', clientVersion: '1.0.0' },
    threatInfo: {
      threatTypes: THREAT_TYPES,
      platformTypes: PLATFORM_TYPES,
      threatEntryTypes: ['URL'],
      threatEntries: [{ url }],
    },
  };

  const response = await axios.post(endpoint, requestBody, {
    timeout: 8000,
    headers: { 'Content-Type': 'application/json' },
  });

  return response.data?.matches || [];
};

/**
 * Query the Google Web Risk Lookup API v1.
 * Returns an array of matched threat types (empty = no known threat).
 */
const checkWithWebRisk = async (url, apiKey) => {
  const params = new URLSearchParams({
    uri: url,
    key: apiKey,
  });

  for (const t of THREAT_TYPES) {
    params.append('threatTypes', t);
  }

  const endpoint = `https://webrisk.googleapis.com/v1/uris:search?${params.toString()}`;

  const response = await axios.get(endpoint, { timeout: 8000 });

  const threat = response.data?.threat;
  if (!threat) return [];

  return threat.threatTypes || [];
};

/**
 * Main entry point: checks a URL against Google's threat intelligence.
 * Auto-selects Web Risk or Safe Browsing based on available API keys.
 *
 * Returns:
 *   { available: boolean, provider: string, threats: string[], raw: any }
 */
export const checkGoogleThreatIntelligence = async (url) => {
  // Prefer Web Risk key; fall back to Safe Browsing key
  const webRiskKey = process.env.GOOGLE_WEB_RISK_API_KEY;
  const safeBrowsingKey = process.env.GOOGLE_SAFE_BROWSING_API_KEY;

  const apiKey = webRiskKey || safeBrowsingKey;
  const provider = webRiskKey ? 'Google Web Risk' : 'Google Safe Browsing';

  if (!apiKey) {
    return {
      available: false,
      provider: 'Google Threat Intelligence',
      threats: [],
      raw: null,
      note: 'Google API key not configured.',
    };
  }

  try {
    let threats = [];
    let raw = null;

    if (webRiskKey) {
      threats = await checkWithWebRisk(url, webRiskKey);
      raw = { source: 'Google Web Risk', threatTypes: threats };
    } else {
      const matches = await checkWithSafeBrowsing(url, safeBrowsingKey);
      threats = matches.map((m) => m.threatType);
      raw = { source: 'Google Safe Browsing', matches };
    }

    return { available: true, provider, threats, raw };
  } catch (err) {
    const status = err?.response?.status;
    let note = 'Google threat intelligence check failed.';

    if (status === 400) note = 'Google API rejected the request (bad URL or invalid key).';
    else if (status === 403) note = 'Google API key unauthorised or quota exceeded.';
    else if (status === 429) note = 'Google API rate limit exceeded.';
    else if (err.code === 'ECONNABORTED') note = 'Google API request timed out.';

    console.error('[Google Threat Intel]', err.message);
    return { available: false, provider, threats: [], raw: null, note };
  }
};
