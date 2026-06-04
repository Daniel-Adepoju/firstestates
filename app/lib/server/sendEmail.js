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
  <body
    style="
      margin:0;
      padding:0;
      background:#f6f8fb;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="background:#f6f8fb;padding:32px 12px;"
    >
      <tr>
        <td align="center">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              width:600px;
              max-width:100%;
              background:#ffffff;
              border-radius:24px;
              border:1px solid #edf2f7;
            "
          >
            <!-- Brand -->
            <tr>
              <td
                align="center"
                style="
                  padding:32px 24px 16px;
                "
              >
                <img
                  src="https://res.cloudinary.com/dbepfuktm/image/upload/v1777511083/logoWithoutText_ksax6c.png"
                  alt="First Estates"
                  width="64"
                  height="64"
                  style="
                    display:block;
                    width:64px;
                    height:64px;
                    margin:0 auto 2px;
                    border:0;
                    outline:none;
                    text-decoration:none;
                  "
                />

                <div
                  style="
                    color:#0874c7;
                    font-size:13px;
                    font-weight:800;
                    line-height:1.2;
                    letter-spacing:-0.02em;
                  "
                >
                  First Estates
                </div>
              </td>
            </tr>

            <!-- Subject -->
            <tr>
              <td
                align="center"
                style="
                  padding:0 24px;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#111827;
                    font-size:16px;
                    font-weight:800;
                    line-height:1.35;
                    letter-spacing:-0.03em;
                  "
                >
                  ${subject}
                </h1>
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td
                style="
                  padding:20px 24px 8px;
                "
              >
                <div style="text-align:center;">
                  <div
                    style="
                      display:inline-block;
                      max-width:100%;
                      text-align:left;
                      color:#4b5563;
                      font-size:13px;
                      line-height:1.75;
                      overflow-wrap:break-word;
                      word-break:break-word;
                    "
                  >
                    ${message}
                  </div>
                </div>
              </td>
            </tr>

            <!-- CTA -->
            <tr>
              <td
                align="center"
                style="
                  padding:24px 24px 16px;
                "
              >
                <a
                  href="${process.env.BASE_URL}"
                  style="
                    display:inline-block;
                    background:#0874c7;
                    color:#ffffff;
                    text-decoration:none;
                    padding:14px 28px;
                    border-radius:9999px;
                    font-size:13px;
                    font-weight:700;
                    line-height:1;
                  "
                >
                  Visit First Estates →
                </a>
              </td>
            </tr>

            <!-- Help -->
            <tr>
              <td
                align="center"
                style="
                  padding:0 24px 28px;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#6b7280;
                    font-size:12px;
                    line-height:1.7;
                  "
                >
                  Need assistance?
                  <a
                    href="${process.env.BASE_URL}/help"
                    style="
                      color:#0874c7;
                      text-decoration:none;
                      font-weight:600;
                    "
                  >
                    Visit our Help Center
                  </a>
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td
                style="
                  border-top:1px solid #edf2f7;
                "
              ></td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  padding:16px 24px;
                "
              >
                <p
                  style="
                    margin:0;
                    color:#94a3b8;
                    font-size:11px;
                    line-height:1.6;
                  "
                >
                  © 2026 First Estates. All rights reserved.
                </p>
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
