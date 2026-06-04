import nodemailer from "nodemailer"

export const sendEmail = async ({ to, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "zoho",
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_APP_PASSWORD,
      },
      connectionTimeout: 10000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
      }, // remove in production
    })

    const mailOptions = {
      from: `First Estates ${process.env.ZOHO_EMAIL}`,
      to: Array.isArray(to) ? to.join(",") : to,
      subject,
      html: `
 <html lang="en">
  <body style="margin:0; padding:0; font-family:'Segoe UI', Arial, sans-serif; background-color:#f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">
          <table width="420" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:18px; box-shadow:0 4px 14px rgba(0,0,0,0.08); overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background-color:rgb(8,116,199); padding:22px; text-align:center; color:#fff;">
                <h1 style="margin:0; font-size:20px;
                font-weight:700; 
                letter-spacing:0.3px;">
                  ${subject}
                </h1>
              </td>
            </tr>

            <!-- Body / Brand + Message -->
            <tr>
              <td style="padding:36px 28px; color:#333; text-align:center;">
                
                <!-- Brand Section -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:25px;">
                  <tr>
                    <!-- Logo -->
                    <td style="width:46px; height:46px; border-radius:10px; background-color:rgba(8,116,199,0.1); text-align:center; vertical-align:middle;">
                      <span style="font-size:20px; font-weight:900; color:rgb(8,116,199); line-height:46px; display:block;">FE</span>
                    </td>
                    <!-- Spacing -->
                    <td width="12"></td>
                    <!-- Brand Name -->
                    <td style="vertical-align:middle; text-align:left;">
                      <h2 style="margin:0; font-size:20px;
                          font-family:Arial, Helvetica, sans-serif;
                      font-weight:800; color:rgb(8,116,199); letter-spacing:0.5px; line-height:1.2;">
                        First Estates
                      </h2>
                    </td>
                  </tr>
                </table>

                <!-- Message -->
<div style="width:100%;text-align:center; margin-bottom:28px;">
  <div
    style="
      display:inline-block;
      max-width:100%;
      text-align:left;
      color:#374151;
      font-size:13px;
      line-height:1.6;
      overflow-wrap:anywhere;
      word-break:break-word;
      <!--whitespace:pre-wrap;-->
    "
  >
${message}
  </div>
</div>
                <!-- Button -->
              <div style="text-align:center; margin:32px 0;">
  <a
    href="${process.env.BASE_URL}"
    style="
      display:inline-block;
      background:linear-gradient(135deg, #0874c7, #0a8df0);
      color:#ffffff;
      text-decoration:none;
      padding:15px 36px;
      border-radius:9999px;
      font-size:12px;
      font-weight:700;
      font-family:Arial, Helvetica, sans-serif;
      letter-spacing:0.3px;
      box-shadow:0 2px 4px rgba(8,116,199,0.25);
    "
  >
    Visit First Estates
  </a>
</div>

                <!-- Help Info -->
                <p style="font-size:12px; color:#666; text-align:center; margin:0;">
                  If you have any questions, reply to this email or visit our 
                  <a href="${process.env.BASE_URL}/help" style="color:rgb(8,116,199); text-decoration:none; font-weight:500;">
                    Help Center
                  </a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f9fafb; padding:18px; text-align:center; font-size:10px; color:#999;">
                &copy; 2026 <strong>First Estates</strong>. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`,
    }

    return transporter.sendMail(mailOptions)
  } catch (err) {
    console.log(err, "sendEmail error")
  }
}
