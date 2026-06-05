import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { name, email, organization, phone, hqLocation, services, message, captchaToken, formName } = data;

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({ error: 'Missing RESEND_API_KEY on server' }, { status: 500 });
    }

    // Verify Cloudflare Turnstile token
    if (!process.env.CF_TURNSTILE_SECRET) {
      return NextResponse.json({ error: 'Missing CF_TURNSTILE_SECRET on server' }, { status: 500 });
    }

    if (!captchaToken) {
      return NextResponse.json({ error: 'Missing captcha token' }, { status: 400 });
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret: process.env.CF_TURNSTILE_SECRET!, response: captchaToken }).toString()
    });

    const verifyBody = await verifyRes.json().catch(() => ({}));
    if (!verifyRes.ok || !verifyBody.success) {
      return NextResponse.json({ error: 'Captcha verification failed', details: verifyBody }, { status: 400 });
    }

    const from = process.env.EMAIL_FROM;
    const to = process.env.EMAIL_TO;
    const subjectPrefix = formName ? `[${formName}] ` : '';
    const subject = `${subjectPrefix}New workforce request from ${name || 'Website Visitor'}`;
    const heading = formName ? `${formName} Request` : 'New Workforce Request';

    const text = `New Workforce Request\n\nName: ${name || ''}\nEmail: ${email || ''}\nOrganization: ${organization || ''}\nPhone: ${phone || ''}\nHQ Location: ${hqLocation || ''}\nServices: ${services || ''}\n\nMessage:\n${message || ''}`;

    const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
  </head>
  <body style="margin:0;background-color:#f3f4f6;font-family:Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:28px 16px">
          <table width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(2,6,23,0.08);" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="background:#14C1F4;padding:24px 28px;color:#ffffff">
                <h1 style="margin:0;font-size:20px;line-height:1.2;font-weight:700">${heading}</h1>
                <p style="margin:6px 0 0;font-size:13px;opacity:0.95">A visitor submitted the contact form on your site${formName ? ` for ${formName}` : ''}.</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 28px;color:#000000">
                <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7">
                      <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Name</div>
                      <div style="font-size:14px;color:#0f172a">${name || '—'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7">
                      <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Email</div>
                      <div style="font-size:14px;color:#0f172a">${email || '—'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7">
                      <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Organization</div>
                      <div style="font-size:14px;color:#0f172a">${organization || '—'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7">
                      <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Form</div>
                      <div style="font-size:14px;color:#0f172a">${formName || 'Website Form'}</div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:10px 0;border-bottom:1px solid #eef2f7;display:flex;flex-wrap:wrap;gap:12px">
                      <div style="min-width:120px">
                        <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Phone</div>
                        <div style="font-size:14px;color:#0f172a">${phone || '—'}</div>
                      </div>
                      <div style="min-width:160px">
                        <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">HQ Location</div>
                        <div style="font-size:14px;color:#0f172a">${hqLocation || '—'}</div>
                      </div>
                      <div style="flex:1;text-align:right">
                        <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:6px">Services</div>
                        <div style="display:inline-block;padding:6px 10px;border-radius:999px;background:#eefcff;color:#0b7e9f;font-weight:700;font-size:13px">${services || '—'}</div>
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 0">
                      <div style="font-size:12px;color:#111827;font-weight:700;margin-bottom:8px">Message</div>
                      <div style="background:#f8fafc;border:1px solid #eef2f7;padding:14px;border-radius:8px;color:#0f172a;font-size:14px;line-height:1.45;white-space:pre-wrap">${(message || '—').replace(/\n/g, '<br/>')}</div>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="background:#0b1220;padding:12px 20px;text-align:center;color:#8795a1;font-size:12px">
                <div style="color:#ffffff;font-size:12px">&copy; ${new Date().getFullYear()} Tekwissen — Workforce Solutions</div>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        subject,
        html,
        headers: { 'Reply-To': email }
      })
    });

    const body = await resendRes.json().catch(() => ({}));

    if (!resendRes.ok) {
      return NextResponse.json({ error: body || 'Resend API error' }, { status: resendRes.status });
    }

    return NextResponse.json({ ok: true, id: body.id });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message || 'Unknown error' }, { status: 500 });
  }
}
