import { Resend } from "resend";

export interface EnquiryEmailData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  budget?: string;
  message: string;
  ip?: string;
}

/**
 * Sends an email notification to the company/admin whenever a new enquiry
 * or "get in touch" form is submitted on the website.
 */
export async function sendEnquiryEmail(data: EnquiryEmailData): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (!apiKey) {
    console.warn("[Email] RESEND_API_KEY is not configured. Email notification skipped.");
    return { success: false, error: "RESEND_API_KEY not configured" };
  }

  if (!toEmail) {
    console.warn("[Email] NOTIFICATION_EMAIL is not configured. Email notification skipped.");
    return { success: false, error: "NOTIFICATION_EMAIL not configured" };
  }

  try {
    const resend = new Resend(apiKey);
    const fromEmail = process.env.FROM_EMAIL || "Solvia Technologies <onboarding@resend.dev>";

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; margin: 0; padding: 24px; color: #f8fafc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #1e293b; border-radius: 12px; overflow: hidden; border: 1px solid #334155;">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb, #3b82f6); padding: 28px 24px; text-align: left;">
      <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: -0.02em;">Solvia Technologies</h1>
      <p style="margin: 6px 0 0; color: #dbeafe; font-size: 14px;">📬 New Query / Get in Touch Submission</p>
    </div>

    <!-- Content -->
    <div style="padding: 24px;">
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; width: 140px; font-weight: 600;">Full Name:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px; font-weight: 600;">${data.name}</td>
        </tr>
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">Email Address:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #38bdf8; font-size: 14px;">
            <a href="mailto:${data.email}" style="color: #38bdf8; text-decoration: none;">${data.email}</a>
          </td>
        </tr>
        ${data.phone ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">Phone / Mobile:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px;">${data.phone}</td>
        </tr>
        ` : ""}
        ${data.company ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">Company / Firm:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px;">${data.company}</td>
        </tr>
        ` : ""}
        ${data.service ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">Interest / Service:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #a5b4fc; font-size: 14px; font-weight: 600;">${data.service}</td>
        </tr>
        ` : ""}
        ${data.budget ? `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #94a3b8; font-size: 13px; font-weight: 600;">Estimated Budget:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #334155; color: #f8fafc; font-size: 14px;">${data.budget}</td>
        </tr>
        ` : ""}
      </table>

      <!-- Client Message Box -->
      <div style="background-color: #0f172a; border-radius: 8px; border: 1px solid #334155; padding: 16px; margin: 20px 0;">
        <div style="color: #94a3b8; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">Message / Query:</div>
        <div style="color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.message}</div>
      </div>

      <!-- Action Button -->
      <div style="text-align: center; margin-top: 28px; margin-bottom: 10px;">
        <a href="mailto:${data.email}?subject=Re:%20Enquiry%20regarding%20${encodeURIComponent(data.service || "Solvia Technologies")}"
           style="background-color: #2563eb; color: #ffffff; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 14px; display: inline-block;">
          Reply to ${data.name}
        </a>
      </div>
    </div>

    <!-- Footer -->
    <div style="background-color: #0f172a; border-top: 1px solid #334155; padding: 14px 24px; text-align: center; font-size: 12px; color: #64748b;">
      Submitted on ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST
      ${data.ip ? ` • IP: ${data.ip}` : ""}
    </div>
  </div>
</body>
</html>
    `.trim();

    const result = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: data.email,
      subject: `🔔 New Query: ${data.name}${data.service ? ` (${data.service})` : ""}`,
      html: htmlContent,
    });

    if (result.error) {
      console.error("[Email] Resend error:", result.error);
      return { success: false, error: result.error.message };
    }

    console.log("[Email] Enquiry email sent successfully:", result.data?.id);
    return { success: true };
  } catch (err: any) {
    console.error("[Email] Failed to send enquiry email:", err);
    return { success: false, error: err?.message || String(err) };
  }
}
