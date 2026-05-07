// Cloudflare Pages Function: handles POST /api/contact via Gmail API
// Environment variables needed (set in Cloudflare Pages dashboard):
//   GMAIL_CLIENT_ID       — OAuth client id for the Gmail account
//   GMAIL_CLIENT_SECRET   — OAuth client secret for the Gmail account
//   GMAIL_REFRESH_TOKEN   — refresh token with gmail.send access
//   GMAIL_FROM_EMAIL      — authenticated Gmail address used as sender
//   CONTACT_EMAIL         — where to deliver form submissions (e.g. millery212@gmail.com)

const JSON_HEADERS = { 'Content-Type': 'application/json' };

function badRequest(message, status = 400) {
  return new Response(JSON.stringify({ error: message }), { status, headers: JSON_HEADERS });
}

function sanitizeHeaderValue(value) {
  return String(value || '').replace(/[\r\n]+/g, ' ').trim();
}

function encodeBase64Url(bytes) {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

async function getGmailAccessToken(env) {
  const params = new URLSearchParams({
    client_id: env.GMAIL_CLIENT_ID,
    client_secret: env.GMAIL_CLIENT_SECRET,
    refresh_token: env.GMAIL_REFRESH_TOKEN,
    grant_type: 'refresh_token',
  });

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params.toString(),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Failed to refresh Gmail token: ${err}`);
  }

  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) {
    throw new Error('No access token returned from Google OAuth token endpoint');
  }

  return tokenJson.access_token;
}

async function sendViaGmail(env, payload) {
  const accessToken = await getGmailAccessToken(env);

  const subject = sanitizeHeaderValue(`Contact form: ${payload.name}`);
  const replyTo = sanitizeHeaderValue(payload.email);
  const fromEmail = sanitizeHeaderValue(env.GMAIL_FROM_EMAIL || env.CONTACT_EMAIL);
  const toEmail = sanitizeHeaderValue(env.CONTACT_EMAIL || env.GMAIL_FROM_EMAIL);

  const textBody = [
    'New contact form submission from yuliamiller.com',
    '',
    `Name: ${payload.name}`,
    `Email: ${payload.email}`,
    '',
    'Message:',
    payload.message || '(no message)',
  ].join('\n');

  const mime = [
    `From: ${fromEmail}`,
    `To: ${toEmail}`,
    `Reply-To: ${replyTo}`,
    'Content-Type: text/plain; charset=UTF-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    textBody,
  ].join('\r\n');

  const raw = encodeBase64Url(new TextEncoder().encode(mime));

  const gmailRes = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ raw }),
  });

  if (!gmailRes.ok) {
    const err = await gmailRes.text();
    throw new Error(`Gmail API send failed: ${err}`);
  }

  return gmailRes.json();
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const name = sanitizeHeaderValue(body?.name);
    const email = sanitizeHeaderValue(body?.email).toLowerCase();
    const message = String(body?.message || '').trim();

    if (!name || !email) {
      return badRequest('Name and email are required.');
    }

    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      return badRequest('Please provide a valid email address.');
    }

    const requiredEnv = ['GMAIL_CLIENT_ID', 'GMAIL_CLIENT_SECRET', 'GMAIL_REFRESH_TOKEN'];
    for (const key of requiredEnv) {
      if (!env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
      }
    }

    await sendViaGmail(env, {
      name,
      email,
      message,
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: JSON_HEADERS,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to send.' }), {
      status: 500,
      headers: JSON_HEADERS,
    });
  }
}
