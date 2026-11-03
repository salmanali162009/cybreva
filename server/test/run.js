// ─────────────────────────────────────────────
//  Cybreva — Test runner (no external test framework)
//  Run with: node test/run.js
// ─────────────────────────────────────────────
import 'dotenv/config';
import http from 'http';

const BASE = `http://localhost:${process.env.PORT || 8000}`;

let passed = 0;
let failed = 0;
let token = null;
let testUserId = null;
let testScanId = null;
let testSessionId = null;

// ── HTTP helper ───────────────────────────────
const request = (method, path, body = null, cookieHeader = '') => {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const options = {
      method,
      hostname: 'localhost',
      port: process.env.PORT || 8000,
      path,
      headers: {
        'Content-Type': 'application/json',
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const body = JSON.parse(data);
          resolve({ status: res.statusCode, body, headers: res.headers });
        } catch {
          resolve({ status: res.statusCode, body: data, headers: res.headers });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
};

// ── Assertion ─────────────────────────────────
const assert = (label, condition, detail = '') => {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${label}${detail ? ' — ' + detail : ''}`);
    failed++;
  }
};

// ── Extract auth cookie ───────────────────────
const extractCookie = (headers) => {
  const setCookie = headers['set-cookie'];
  if (!setCookie) return '';
  return setCookie.map((c) => c.split(';')[0]).join('; ');
};

// ── Test suites ───────────────────────────────

const TEST_EMAIL = `cybreva_test_${Date.now()}@example.com`;
const TEST_PASS = 'TestPass123';

async function testHealth() {
  console.log('\n📡 Health Check');
  const r = await request('GET', '/api/health');
  assert('Returns 200', r.status === 200);
  assert('success: true', r.body.success === true);
}

async function testRegister() {
  console.log('\n📝 Registration');

  // Valid registration
  const r = await request('POST', '/api/auth/register', {
    name: 'Test User',
    email: TEST_EMAIL,
    password: TEST_PASS,
  });
  assert('Returns 201', r.status === 201);
  assert('success: true', r.body.success === true);
  assert('Sets auth cookie', !!extractCookie(r.headers));
  token = extractCookie(r.headers);
  testUserId = r.body.data?.user?._id;

  // Duplicate email
  const r2 = await request('POST', '/api/auth/register', {
    name: 'Another User',
    email: TEST_EMAIL,
    password: TEST_PASS,
  });
  assert('Duplicate email returns 409', r2.status === 409);
  assert('Duplicate email error message', r2.body.success === false);

  // Missing fields
  const r3 = await request('POST', '/api/auth/register', { email: 'bad' });
  assert('Invalid input returns 400', r3.status === 400);
}

async function testLogin() {
  console.log('\n🔐 Login');

  const r = await request('POST', '/api/auth/login', {
    email: TEST_EMAIL,
    password: TEST_PASS,
  });
  assert('Returns 200', r.status === 200);
  assert('success: true', r.body.success === true);
  assert('Sets cookie', !!extractCookie(r.headers));
  token = extractCookie(r.headers); // refresh token

  // Wrong password
  const r2 = await request('POST', '/api/auth/login', {
    email: TEST_EMAIL,
    password: 'WrongPass999',
  });
  assert('Wrong password returns 401', r2.status === 401);

  // Non-existent email
  const r3 = await request('POST', '/api/auth/login', {
    email: 'notexist@example.com',
    password: TEST_PASS,
  });
  assert('Non-existent email returns 401', r3.status === 401);
}

async function testProtectedRoutes() {
  console.log('\n🛡️  Protected Routes');

  // GET /me with cookie
  const r = await request('GET', '/api/auth/me', null, token);
  assert('GET /me returns 200 with cookie', r.status === 200);
  assert('Returns user object', !!r.body.data?.user);
  assert('No password in response', !r.body.data?.user?.password);

  // GET /me without cookie
  const r2 = await request('GET', '/api/auth/me');
  assert('GET /me without auth returns 401', r2.status === 401);
}

async function testMessageScan() {
  console.log('\n💬 Message Scan');

  // High-risk scam message
  const r = await request(
    'POST',
    '/api/scans/message',
    { message: 'Urgent! Your account will be suspended. Verify your password now. Click here immediately!' },
    token,
  );
  assert('Message scan returns 200', r.status === 200);
  assert('Has riskLevel', !!r.body.data?.riskLevel);
  assert('Has riskScore', typeof r.body.data?.riskScore === 'number');
  assert('Has detectedIndicators array', Array.isArray(r.body.data?.detectedIndicators));
  assert('Has disclaimer', !!r.body.data?.disclaimer);
  testScanId = r.body.data?.scanId;

  // Too short
  const r2 = await request('POST', '/api/scans/message', { message: 'Hi' }, token);
  assert('Short message returns 400', r2.status === 400);

  // Empty body
  const r3 = await request('POST', '/api/scans/message', {}, token);
  assert('Missing message returns 400', r3.status === 400);
}

async function testEmailScan() {
  console.log('\n📧 Email Scan');

  const r = await request(
    'POST',
    '/api/scans/email',
    {
      subject: 'You have won $1,000,000!',
      sender: 'noreply@paypal-secure-alert.xyz',
      body: 'Congratulations! You have been selected to receive a lottery prize. Send us your bank account details to claim your reward.',
    },
    token,
  );
  assert('Email scan returns 200', r.status === 200);
  assert('Has riskLevel', !!r.body.data?.riskLevel);
  assert('Has detectedIndicators', Array.isArray(r.body.data?.detectedIndicators));

  // Missing body
  const r2 = await request('POST', '/api/scans/email', { subject: 'Test' }, token);
  assert('Missing body returns 400', r2.status === 400);
}

async function testWebsiteScan() {
  console.log('\n🌐 Website Scan');

  const r = await request('POST', '/api/scans/website', { url: 'https://www.google.com' }, token);
  assert('Website scan returns 200', r.status === 200);
  assert('Has riskLevel', !!r.body.data?.riskLevel);
  assert('Has domain', !!r.body.data?.domain);
  assert('Has providerResults', !!r.body.data?.providerResults);
  assert('Has disclaimer', !!r.body.data?.disclaimer);

  // Invalid URL
  const r2 = await request('POST', '/api/scans/website', { url: 'not-a-url' }, token);
  assert('Invalid URL returns 400', r2.status === 400);

  // Private IP
  const r3 = await request('POST', '/api/scans/website', { url: 'http://192.168.1.1' }, token);
  assert('Private IP returns 400', r3.status === 400);

  // Localhost
  const r4 = await request('POST', '/api/scans/website', { url: 'http://localhost:8080' }, token);
  assert('Localhost returns 400', r4.status === 400);

  // FTP scheme
  const r5 = await request('POST', '/api/scans/website', { url: 'ftp://files.example.com' }, token);
  assert('Non-HTTP scheme returns 400', r5.status === 400);
}

async function testScanHistory() {
  console.log('\n📋 Scan History');

  const r = await request('GET', '/api/scans/history', null, token);
  assert('History returns 200', r.status === 200);
  assert('Has scans array', Array.isArray(r.body.data?.scans));
  assert('Has pagination', !!r.body.data?.pagination);

  // Unauthenticated
  const r2 = await request('GET', '/api/scans/history');
  assert('Unauthenticated history returns 401', r2.status === 401);

  // Get specific scan
  if (testScanId) {
    const r3 = await request('GET', `/api/scans/${testScanId}`, null, token);
    assert('Get scan by ID returns 200', r3.status === 200);
    assert('Scan belongs to user', !!r3.body.data?.scan);
  }
}

async function testAIChat() {
  console.log('\n🤖 AI Assistant');

  const r = await request(
    'POST',
    '/api/ai/chat',
    { message: 'What are common signs of a phishing email?' },
    token,
  );
  assert('AI chat returns 200', r.status === 200);
  assert('Has reply', !!r.body.data?.reply);
  assert('Has sessionId', !!r.body.data?.sessionId);
  assert('Has disclaimer', !!r.body.data?.disclaimer);
  testSessionId = r.body.data?.sessionId;

  // Continue conversation
  if (testSessionId) {
    const r2 = await request(
      'POST',
      '/api/ai/chat',
      { message: 'How can I protect myself?', sessionId: testSessionId },
      token,
    );
    assert('Continuing session returns 200', r2.status === 200);
  }

  // Empty message
  const r3 = await request('POST', '/api/ai/chat', { message: '' }, token);
  assert('Empty message returns 400', r3.status === 400);

  // Unauthenticated
  const r4 = await request('POST', '/api/ai/chat', { message: 'Hello' });
  assert('Unauthenticated AI chat returns 401', r4.status === 401);
}

async function testDashboard() {
  console.log('\n📊 Dashboard');

  const r = await request('GET', '/api/dashboard/stats', null, token);
  assert('Dashboard returns 200', r.status === 200);
  assert('Has totalScans', typeof r.body.data?.totalScans === 'number');
  assert('Has byType', !!r.body.data?.byType);
  assert('Has byRiskLevel', !!r.body.data?.byRiskLevel);
  assert('Has recentScans', Array.isArray(r.body.data?.recentScans));

  // Unauthenticated
  const r2 = await request('GET', '/api/dashboard/stats');
  assert('Unauthenticated dashboard returns 401', r2.status === 401);
}

async function testInvalidInputs() {
  console.log('\n🚫 Invalid Inputs & Edge Cases');

  // Invalid ObjectId
  const r1 = await request('GET', '/api/scans/not-a-valid-id', null, token);
  assert('Invalid ObjectId returns 400', r1.status === 400);

  // 404 route
  const r2 = await request('GET', '/api/nonexistent');
  assert('Unknown route returns 404', r2.status === 404);
}

async function testCleanup() {
  console.log('\n🧹 Cleanup');

  // Delete test scan
  if (testScanId) {
    const r = await request('DELETE', `/api/scans/${testScanId}`, null, token);
    assert('Delete scan returns 200', r.status === 200);
  }

  // Delete test chat session
  if (testSessionId) {
    const r = await request('DELETE', `/api/ai/sessions/${testSessionId}`, null, token);
    assert('Delete session returns 200', r.status === 200);
  }

  // Logout
  const r2 = await request('POST', '/api/auth/logout', null, token);
  assert('Logout returns 200', r2.status === 200);
}

// ── Main ──────────────────────────────────────
(async () => {
  console.log('═══════════════════════════════════════');
  console.log('   CYBREVA BACKEND TEST SUITE');
  console.log(`   Target: ${BASE}`);
  console.log('═══════════════════════════════════════');

  try {
    await testHealth();
    await testRegister();
    await testLogin();
    await testProtectedRoutes();
    await testMessageScan();
    await testEmailScan();
    await testWebsiteScan();
    await testScanHistory();
    await testAIChat();
    await testDashboard();
    await testInvalidInputs();
    await testCleanup();
  } catch (err) {
    console.error('\n💥 Test runner error:', err.message);
    failed++;
  }

  console.log('\n═══════════════════════════════════════');
  console.log(`   Results: ${passed} passed, ${failed} failed`);
  console.log('═══════════════════════════════════════\n');

  process.exit(failed > 0 ? 1 : 0);
})();
