// Cloudflare Pages Function: handles POST /api/contact
// Environment variables needed (set in Cloudflare Pages dashboard):
//   RESEND_API_KEY  — your Resend API key
//   CONTACT_EMAIL   — where to deliver form submissions (e.g. yulia@yuliamiller.com)

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email) {
      return new Response(JSON.stringify({ error: 'Name and email are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const emailBody = `New contact form submission from yuliamiller.com\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${message || '(no message)'}`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'yuliamiller.com <noreply@yuliamiller.com>',
        to: [env.CONTACT_EMAIL],
        reply_to: email,
        subject: `Contact form: ${name}`,
        text: emailBody,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('Resend error:', err);
      return new Response(JSON.stringify({ error: 'Failed to send.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Server error.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
