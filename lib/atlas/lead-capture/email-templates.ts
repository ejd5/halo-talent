/* ─── Email templates for lead capture flows ─── */

export function confirmationEmailHtml(opts: {
  first_name?: string;
  confirm_url: string;
  creator_name?: string;
  page_title?: string;
}) {
  const name = opts.first_name || "there";
  const creator = opts.creator_name || "the creator";
  const title = opts.page_title || "Newsletter";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin: 0; padding: 0; background: #1A1614; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .container { max-width: 480px; margin: 0 auto; padding: 40px 24px; }
  .box { background: #2A2420; border: 1px solid rgba(245,240,235,0.06); padding: 32px 24px; }
  h1 { font-family: 'Syne', system-ui, sans-serif; font-size: 20px; font-weight: 600; color: #F5F0EB; margin: 0 0 8px; }
  p { font-size: 14px; line-height: 1.6; color: rgba(245,240,235,0.6); margin: 0 0 24px; }
  .btn { display: inline-block; background: var(--or, #D8A95B); color: #FFFFFF; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: 600; }
  .footer { font-size: 11px; color: rgba(245,240,235,0.2); margin-top: 24px; text-align: center; }
  .footer a { color: rgba(245,240,235,0.3); }
</style></head><body>
<div class="container">
  <div class="box">
    <h1>Confirm your subscription to ${creator}</h1>
    <p>Hey ${name},<br><br>You just subscribed to <strong>${title}</strong> by ${creator}. Click the button below to confirm your email address.</p>
    <p style="text-align:center"><a href="${opts.confirm_url}" class="btn">Yes, I want to subscribe</a></p>
    <p>If you didn't sign up, you can safely ignore this email.</p>
    <div class="footer">
      <a href="${opts.confirm_url}">${opts.confirm_url}</a>
    </div>
  </div>
</div>
</body></html>`;
}

export function thanksAfterConfirmHtml(opts: {
  first_name?: string;
  creator_name?: string;
}) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { margin: 0; padding: 0; background: #1A1614; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  .container { max-width: 480px; margin: 0 auto; padding: 40px 24px; text-align: center; }
  h1 { font-family: 'Syne', system-ui, sans-serif; font-size: 20px; font-weight: 600; color: #F5F0EB; margin: 0 0 8px; }
  p { font-size: 14px; line-height: 1.6; color: rgba(245,240,235,0.6); margin: 0; }
</style></head><body>
<div class="container">
  <h1>You're confirmed! 🎉</h1>
  <p>Thanks ${opts.first_name || "for subscribing"}, you're now on the list.<br>You'll hear from ${opts.creator_name || "the creator"} soon.</p>
</div>
</body></html>`;
}
