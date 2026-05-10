// ============================================================
// Email Transport — Nodemailer via Resend SMTP
// Resend provides a standard SMTP endpoint we connect to
// using our API key as the password
// ============================================================

const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host:   'smtp.resend.com',
  port:   465,
  secure: true,           // TLS
  auth: {
    user: 'resend',       // always literally "resend"
    pass: process.env.RESEND_API_KEY,
  },
});

// ── Verify connection on startup ───────────────────────────
transporter.verify((err) => {
  if (err) {
    console.error('❌ Email transport error:', err.message);
    console.error('   Check RESEND_API_KEY in your .env file');
  } else {
    console.log('✅ Email transport ready (Resend)');
  }
});

// ── Send password reset email ──────────────────────────────
async function sendPasswordResetEmail(toEmail, resetToken, username) {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from:    `"The Catoolu" <${process.env.EMAIL_FROM}>`,
    to:      toEmail,
    subject: "Reset your The Catoolu password",
    html: `
      <!DOCTYPE html>
      <html>
      <body style="
        font-family: Georgia, serif;
        background: #0f0b07;
        color: #f5f0e8;
        padding: 40px 20px;
        margin: 0;
      ">
        <div style="
          max-width: 480px;
          margin: 0 auto;
          background: #1a1208;
          border: 1px solid #b8860b44;
          border-radius: 8px;
          padding: 40px;
        ">
          <div style="text-align: center; margin-bottom: 32px;">
            <div style="font-size: 48px; margin-bottom: 8px;">🐙</div>
            <h1 style="
              color: #b8860b;
              font-size: 20px;
              letter-spacing: 0.2em;
              text-transform: uppercase;
              margin: 0;
            ">The Catoolu</h1>
          </div>

          <p style="color: #f5f0e8; margin-bottom: 8px;">
            Hello, <strong>${username}</strong>.
          </p>
          <p style="color: #9ca3af; line-height: 1.6; margin-bottom: 32px;">
            A password reset was requested for your account.
            Click the button below to set a new password.
            This link expires in <strong style="color: #f5f0e8;">1 hour</strong>.
          </p>

          <div style="text-align: center; margin-bottom: 32px;">
            <a href="${resetUrl}"
               style="
                 display: inline-block;
                 background: #b8860b;
                 color: #0f0b07;
                 text-decoration: none;
                 padding: 14px 32px;
                 border-radius: 6px;
                 font-weight: bold;
                 font-size: 14px;
                 letter-spacing: 0.05em;
               ">
              Reset My Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 12px; line-height: 1.6;">
            If you did not request this reset, you can safely ignore this email.
            Your password will not change.
          </p>

          <hr style="border: none; border-top: 1px solid #b8860b22; margin: 24px 0;" />

          <p style="color: #3d3530; font-size: 11px; text-align: center;">
            If the button doesn't work, copy this link:<br/>
            <span style="color: #b8860b; word-break: break-all;">${resetUrl}</span>
          </p>
        </div>
      </body>
      </html>
    `,
  });
}

module.exports = { transporter, sendPasswordResetEmail };