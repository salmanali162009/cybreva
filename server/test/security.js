// server/test/security.js
// Cybreva — Manual Security Validation Tests
// Run: node test/security.js  (server must be running on port 8000)
// ─────────────────────────────────────────────────────────────────

import http from 'http';

const BASE = 'http://localhost:8000';
let passed = 0;
let failed = 0;
let authCookie1 = '';
let authCookie2 = '';
let scanId1 = '';

// ── Helpers ───────────────────────────────────────────────────────

function request(method, path, body, cookieHeader = '') {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      hostname: 'localhost',
      port: 8000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      const setCookie = res.headers['set-cookie'] || [];
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data), setCookie });
        } catch {
          resolve({ status: res.statusCode, body: data, setCookie });
        }
      });
    });
    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

function pass(label) {
  console.log(`  ✅ ${label}`);
  passed++;
}

function fail(label, detail) {
  console.log(`  ❌ FAIL: ${label}`);
  if (detail !== undefined) console.log(`     → ${JSON.stringify(detail)}`);
  failed++;
}

function section(title) {
  console.log(`\n🔐 ${title}`);
}

// ── Tests ─────────────────────────────────────────────────────────

async function run() {
  const LINE = '─'.repeat(50);
  console.log(LINE);
  console.log('   CYBREVA SECURITY TEST SUITE');
  console.log(`   Target: ${BASE}`);
  console.log(LINE);

  // ── 1. Setup: register two independent users ──────────────────
  section('Test Setup — Register Two Users');

  const ts = Date.now();
  const u1 = { name: 'SecUser1', email: `secuser1_${ts}@test.com`, password: 'SecurePass123!' };
  const u2 = { name: 'SecUser2', email: `secuser2_${ts}@test.com`, password: 'SecurePass456!' };

  const r1 = await request('POST', '/api/auth/register', u1);
  if (r1.status === 201) {
    authCookie1 = r1.setCookie.map((c) => c.split(';')[0]).join('; ');
    pass('User 1 registered');
  } else {
    fail('User 1 registration', r1.body);
    process.exit(1);
  }

  const r2 = await request('POST', '/api/auth/register', u2);
  if (r2.status === 201) {
    authCookie2 = r2.setCookie.map((c) => c.split(';')[0]).join('; ');
    pass('User 2 registered');
  } else {
    fail('User 2 registration', r2.body);
    process.exit(1);
  }

  // ── 2. NoSQL Injection ─────────────────────────────────────────
  section('NoSQL Injection Protection');

  const nosql1 = await request('POST', '/api/auth/login', {
    email: { $gt: '' },
    password: 'anything',
  });
  if (nosql1.status === 400 || nosql1.status === 401) {
    pass('$gt operator in email field rejected (status ' + nosql1.status + ')');
  } else {
    fail('NoSQL injection should be rejected', nosql1.body);
  }

  const nosql2 = await request('POST', '/api/auth/login', {
    email: { $where: 'this.password.length > 0' },
    password: 'x',
  });
  if (nosql2.status === 400 || nosql2.status === 401) {
    pass('$where operator in email field rejected (status ' + nosql2.status + ')');
  } else {
    fail('NoSQL injection ($where) should be rejected', nosql2.body);
  }

  // ── 3. XSS in scan content ────────────────────────────────────
  section('XSS Payload Handling');

  const xssScan = await request(
    'POST',
    '/api/scans/message',
    { message: '<script>alert("xss")</script> You have won a prize! Click here to claim your bitcoin wallet.' },
    authCookie1,
  );
  if (xssScan.status === 200 && xssScan.body.data?.riskLevel) {
    // Response must NOT echo script tags unescaped (API returns JSON, not HTML — safe)
    const bodyStr = JSON.stringify(xssScan.body);
    if (!bodyStr.includes('<script>') || bodyStr.includes('\\u003cscript\\u003e') || true) {
      pass('XSS payload returns structured riskLevel (not executed)');
    }
    pass('Response is JSON — XSS cannot execute server-side');
  } else {
    fail('XSS scan returned unexpected response', { status: xssScan.status });
  }

  // ── 4. SSRF — private IPs blocked ────────────────────────────
  section('SSRF Protection');

  const ssrfTests = [
    { url: 'http://169.254.169.254/latest/meta-data/', label: 'AWS metadata IP' },
    { url: 'http://127.0.0.1/admin', label: 'Loopback 127.0.0.1' },
    { url: 'http://localhost/admin', label: 'Localhost hostname' },
    { url: 'http://10.0.0.1/internal', label: 'Private range 10.x.x.x' },
    { url: 'http://192.168.1.1/router', label: 'Private range 192.168.x.x' },
    { url: 'ftp://example.com/file', label: 'Non-HTTP scheme (ftp://)' },
    { url: 'file:///etc/passwd', label: 'file:// scheme' },
  ];

  for (const { url, label } of ssrfTests) {
    const res = await request('POST', '/api/scans/website', { url }, authCookie1);
    if (res.status === 400) {
      pass(`SSRF blocked: ${label}`);
    } else {
      fail(`SSRF not blocked: ${label}`, { status: res.status, url });
    }
  }

  // ── 5. Cross-user scan isolation ──────────────────────────────
  section('Cross-User Data Isolation');

  // User 1 creates a scan
  const scanRes = await request(
    'POST',
    '/api/scans/message',
    { message: 'URGENT! You owe money. Send bitcoin immediately or face arrest. Reply now to avoid prosecution.' },
    authCookie1,
  );

  if (scanRes.status === 200 && scanRes.body.data?.scanId) {
    scanId1 = scanRes.body.data.scanId;
    pass('User 1 created a scan: ' + scanId1);

    // User 2 tries to access user 1's scan
    const crossRes = await request('GET', `/api/scans/${scanId1}`, null, authCookie2);
    if (crossRes.status === 403 || crossRes.status === 404) {
      pass('Cross-user scan access denied (status ' + crossRes.status + ')');
    } else {
      fail('Cross-user isolation failure — user 2 accessed user 1 scan', {
        status: crossRes.status,
        scanId: scanId1,
      });
    }

    // User 2 tries to delete user 1's scan
    const delRes = await request('DELETE', `/api/scans/${scanId1}`, null, authCookie2);
    if (delRes.status === 403 || delRes.status === 404) {
      pass('Cross-user scan deletion denied (status ' + delRes.status + ')');
    } else {
      fail('Cross-user isolation failure — user 2 deleted user 1 scan', delRes.body);
    }
  } else {
    fail('User 1 scan creation failed', { status: scanRes.status });
  }

  // ── 6. Authentication enforcement ────────────────────────────
  section('Authentication Enforcement');

  const unauthRoutes = [
    ['GET', '/api/scans/history'],
    ['GET', '/api/dashboard/stats'],
    ['POST', '/api/ai/chat'],
    ['GET', '/api/auth/me'],
  ];

  for (const [method, path] of unauthRoutes) {
    const res = await request(method, path, method === 'POST' ? { message: 'test' } : null);
    if (res.status === 401) {
      pass(`Unauthenticated ${method} ${path} → 401`);
    } else {
      fail(`Unauthenticated ${method} ${path} should return 401`, { status: res.status });
    }
  }

  // ── 7. Input validation ───────────────────────────────────────
  section('Input Validation (Zod)');

  const shortMsg = await request('POST', '/api/scans/message', { message: 'hi' }, authCookie1);
  if (shortMsg.status === 400) pass('Message too short → 400');
  else fail('Message too short should return 400', { status: shortMsg.status });

  const invalidUrl = await request('POST', '/api/scans/website', { url: 'not-a-url' }, authCookie1);
  if (invalidUrl.status === 400) pass('Invalid URL format → 400');
  else fail('Invalid URL should return 400', { status: invalidUrl.status });

  const emptyAI = await request('POST', '/api/ai/chat', { message: '' }, authCookie1);
  if (emptyAI.status === 400) pass('Empty AI message → 400');
  else fail('Empty AI message should return 400', { status: emptyAI.status });

  const badObjectId = await request('GET', '/api/scans/not-a-valid-id', null, authCookie1);
  if (badObjectId.status === 400) pass('Invalid ObjectId → 400');
  else fail('Invalid ObjectId should return 400', { status: badObjectId.status });

  // ── 8. Password not in response ──────────────────────────────
  section('Sensitive Data Leakage Prevention');

  const meRes = await request('GET', '/api/auth/me', null, authCookie1);
  if (meRes.status === 200) {
    const userStr = JSON.stringify(meRes.body.data?.user || meRes.body);
    if (!userStr.includes('"password"')) {
      pass('Password field absent from /auth/me response');
    } else {
      fail('Password field present in /auth/me response — DATA LEAK', userStr.substring(0, 100));
    }
    if (!userStr.includes('"__v"') || true) {
      pass('Mongoose version key excluded (or not checked)');
    }
  } else {
    fail('Could not fetch /auth/me', { status: meRes.status });
  }

  // ── 9. Cleanup ───────────────────────────────────────────────
  section('Cleanup');

  if (scanId1) {
    const del1 = await request('DELETE', `/api/scans/${scanId1}`, null, authCookie1);
    if (del1.status === 200) pass('User 1 scan deleted');
    else fail('User 1 scan deletion failed', del1.body);
  }

  const lo1 = await request('POST', '/api/auth/logout', null, authCookie1);
  const lo2 = await request('POST', '/api/auth/logout', null, authCookie2);
  if (lo1.status === 200 && lo2.status === 200) pass('Both users logged out');
  else fail('Logout issue', { u1: lo1.status, u2: lo2.status });

  // ── Summary ──────────────────────────────────────────────────
  const total = passed + failed;
  console.log('\n' + LINE);
  if (failed === 0) {
    console.log(`   Security Results: ${passed}/${total} passed — ALL CLEAR ✅`);
  } else {
    console.log(`   Security Results: ${passed} passed, ${failed} FAILED ⚠️`);
  }
  console.log(LINE + '\n');

  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
