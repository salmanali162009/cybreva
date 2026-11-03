// ─────────────────────────────────────────────
//  Cybreva — VirusTotal integration (optional)
//
//  VirusTotal requires a valid API key and compliance
//  with their Terms of Service and licensing agreement.
//  Only public URLs should be submitted.
// ─────────────────────────────────────────────
import axios from 'axios';

const VT_BASE = 'https://www.virustotal.com/api/v3';

/**
 * Submit a URL to VirusTotal for analysis and retrieve the report.
 *
 * Returns:
 *   { available: boolean, provider: string, malicious: number,
 *     suspicious: number, harmless: number, undetected: number,
 *     total: number, raw: any, note?: string }
 */
export const checkVirusTotal = async (url) => {
  const apiKey = process.env.VIRUSTOTAL_API_KEY;

  if (!apiKey) {
    return {
      available: false,
      provider: 'VirusTotal',
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      total: 0,
      raw: null,
      note: 'VirusTotal API key not configured.',
    };
  }

  const headers = { 'x-apikey': apiKey };

  try {
    // Step 1: Submit the URL for analysis
    const submitRes = await axios.post(
      `${VT_BASE}/urls`,
      new URLSearchParams({ url }),
      { headers: { ...headers, 'Content-Type': 'application/x-www-form-urlencoded' }, timeout: 10000 },
    );

    const analysisId = submitRes.data?.data?.id;
    if (!analysisId) throw new Error('No analysis ID returned from VirusTotal.');

    // Step 2: Poll for results (up to 3 attempts with 2-second intervals)
    let report = null;
    for (let attempt = 0; attempt < 3; attempt++) {
      await new Promise((r) => setTimeout(r, 2000));
      const reportRes = await axios.get(`${VT_BASE}/analyses/${analysisId}`, {
        headers,
        timeout: 10000,
      });

      const status = reportRes.data?.data?.attributes?.status;
      if (status === 'completed') {
        report = reportRes.data;
        break;
      }
    }

    if (!report) {
      return {
        available: true,
        provider: 'VirusTotal',
        malicious: 0,
        suspicious: 0,
        harmless: 0,
        undetected: 0,
        total: 0,
        raw: null,
        note: 'VirusTotal analysis is still pending. Try again later.',
      };
    }

    const stats = report.data?.attributes?.stats || {};
    const total = Object.values(stats).reduce((sum, v) => sum + (v || 0), 0);

    return {
      available: true,
      provider: 'VirusTotal',
      malicious: stats.malicious || 0,
      suspicious: stats.suspicious || 0,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      total,
      raw: { source: 'VirusTotal', stats },
    };
  } catch (err) {
    const status = err?.response?.status;
    let note = 'VirusTotal check failed.';

    if (status === 401) note = 'VirusTotal API key is invalid or unauthorised.';
    else if (status === 429) note = 'VirusTotal API rate limit exceeded.';
    else if (err.code === 'ECONNABORTED') note = 'VirusTotal request timed out.';

    console.error('[VirusTotal]', err.message);
    return {
      available: false,
      provider: 'VirusTotal',
      malicious: 0,
      suspicious: 0,
      harmless: 0,
      undetected: 0,
      total: 0,
      raw: null,
      note,
    };
  }
};
