import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(to: string, otp: string, name?: string) {
  const fromEmail = process.env.RESEND_FROM_EMAIL || "SmadhanX Portal <onboarding@resend.dev>";

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [to],
      subject: `Your SmadhanX Verification Code: ${otp}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
            .container { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
            .header { background: #002b80; padding: 24px; text-align: center; border-bottom: 4px solid #ff9933; }
            .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 700; letter-spacing: 0.5px; }
            .header p { color: #93c5fd; margin: 6px 0 0; font-size: 12px; }
            .content { padding: 32px 24px; }
            .greeting { font-size: 15px; color: #1e293b; margin-bottom: 12px; }
            .text { font-size: 14px; color: #475569; line-height: 1.6; margin-bottom: 24px; }
            .otp-card { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center; }
            .otp-label { font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 700; letter-spacing: 1px; margin-bottom: 8px; }
            .otp-code { font-size: 32px; font-weight: 800; color: #002b80; letter-spacing: 8px; font-family: monospace; }
            .expiry { font-size: 12px; color: #dc2626; margin-top: 8px; font-weight: 600; }
            .footer { background: #f8fafc; padding: 16px 24px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SmadhanX</h1>
              <p>Smart Public Grievance Redressal & Monitoring Portal</p>
            </div>
            <div class="content">
              <div class="greeting">Dear ${name || "Citizen"},</div>
              <p class="text">
                Thank you for registering on the <strong>SmadhanX Public Grievance Portal</strong>. Please enter the following 6-digit One-Time Password (OTP) to verify your email and activate your account:
              </p>
              <div class="otp-card">
                <div class="otp-label">One-Time Verification Code</div>
                <div class="otp-code">${otp}</div>
                <div class="expiry">⏱ Valid for 10 minutes only</div>
              </div>
              <p class="text" style="font-size: 12px; color: #64748b;">
                If you did not initiate this request, please disregard this email. Never share your verification credentials with anyone.
              </p>
            </div>
            <div class="footer">
              Government of India • Ministry of Personnel, Public Grievances & Pensions<br>
              © SmadhanX Centralized Redressal Engine.
            </div>
          </div>
        </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend delivery error:", error);
      return { success: false, error };
    }

    console.log("Resend email sent successfully! Message ID:", data?.id);
    return { success: true, messageId: data?.id };
  } catch (err) {
    console.error("Failed to send OTP email:", err);
    return { success: false, error: err };
  }
}
