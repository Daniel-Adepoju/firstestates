

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
          <table width="420" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; box-shadow:0 4px 14px rgba(0,0,0,0.08); overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background-color:rgb(8,116,199); padding:24px; text-align:center; color:#fff;">
                <h1 style="margin:0; font-size:22px; font-weight:700; letter-spacing:0.3px;">
                  ${subject}
                </h1>
              </td>
            </tr>

            <!-- Body / Brand + Message -->
            <tr>
              <td style="padding:36px 28px; color:#333; text-align:center;">
                
                <!-- Brand Section -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                  <tr>
                    <!-- Logo -->
                    <td style="width:46px; height:46px; border-radius:10px; background-color:rgba(8,116,199,0.1); text-align:center; vertical-align:middle;">
                      <span style="font-size:22px; font-weight:bold; color:rgb(8,116,199); line-height:46px; display:block;">FE</span>
                    </td>
                    <!-- Spacing -->
                    <td width="12"></td>
                    <!-- Brand Name -->
                    <td style="vertical-align:middle; text-align:left;">
                      <h2 style="margin:0; font-size:24px; font-weight:800; color:rgb(8,116,199); letter-spacing:0.5px; line-height:1.2;">
                        First Estates
                      </h2>
                    </td>
                  </tr>
                </table>

                <!-- Message -->
                <div style="margin-bottom:24px; font-size:15px; line-height:1.6; white-space:pre-wrap; text-align:left;">
                  ${message}
                </div>

                <!-- Button -->
                <div style="text-align:center; margin:32px 0;">
                  <a href="${process.env.BASE_URL}" 
                    style="display:inline-block; background-color:rgb(8,116,199); color:white; padding:14px 32px; 
                    text-decoration:none; border-radius:8px; font-weight:600; font-size:15px; letter-spacing:0.3px; 
                    transition:all 0.25s ease-in-out; transform:scale(1);"
                    onmouseover="this.style.transform='scale(0.96)';"
                    onmouseout="this.style.transform='scale(1)';">
                    Go to Homepage
                  </a>
                </div>

                <!-- Help Info -->
                <p style="font-size:14px; color:#666; text-align:center; margin:0;">
                  If you have any questions, reply to this email or visit our 
                  <a href="${process.env.BASE_URL}/help" style="color:rgb(8,116,199); text-decoration:none; font-weight:500;">
                    Help Center
                  </a>.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background-color:#f9fafb; padding:18px; text-align:center; font-size:12px; color:#999;">
                &copy; ${new Date().getFullYear()} <strong>First Estates</strong>. All rights reserved.
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
} catch(err) {
  console.log(err,'sendEmail error')
}
}
