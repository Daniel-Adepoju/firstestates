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
      html:`
      <html lang="en">

<body style="
      margin:0;
      padding:0;
      background:#f6f8fb;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
    ">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f8fb; padding:48px 16px;">
        <tr>
            <td align="center">
                <table width="460" cellpadding="0" cellspacing="0" border="0" style="
              background:#ffffff;
              border-radius:28px;
              overflow:hidden;
              box-shadow:0 12px 40px rgba(15,23,42,0.08);
            ">
                    <!-- Brand -->
                    <tr>
                        <td style="
                  padding:40px 36px 24px;
                  text-align:center;
                ">
                            <img src="https://res-console.cloudinary.com/dbepfuktm/thumbnails/v1/image/upload/v1777511083/bG9nb1dpdGhvdXRUZXh0X2tzYXg2Yw==/drilldown" alt="First Estates" width="60" height="60" style="
                    display:block;
                    margin:0 auto 2px;
                  " />

                            <h2 style="
                    margin:0;
                    color:#0874c7;
                    font-size:20px;
                    font-weight:800;
                    letter-spacing:-0.03em;
                    line-height:1.2;
                  ">
                                First Estates
                            </h2>
                        </td>
                    </tr>

                    <!-- Subject -->
                    <tr>
                        <td style="
                  padding:0 36px;
                  text-align:center;
                ">
                            <h1 style="
                    margin:0;
                    color:#111827;
                    font-size:20px;
                    font-weight:700;
                    line-height:1.3;
                    letter-spacing:-0.03em;
                  ">
                                ${subject}
                            </h1>
                        </td>
                    </tr>

                    <!-- Message -->
                    <tr>
                        <td style="
                  padding:28px 36px 12px;
                ">
                            <div style="
                    text-align:center;
                  ">
                                <div style="
                      display:inline-block;
                      max-width:100%;
                      text-align:left;
                      color:#4b5563;
                      font-size:14px;
                      line-height:1.8;
                      overflow-wrap:anywhere;
                      word-break:break-word;
                    ">
                                    ${message}
                                </div>
                            </div>
                        </td>
                    </tr>

                    <!-- CTA -->
                    <tr>
                        <td style="
                  padding:24px 36px 16px;
                  text-align:center;
                ">
                            <a href="${process.env.BASE_URL}" style="
                    display:inline-block;
                    background:#0874c7;
                    color:#ffffff;
                    text-decoration:none;
                    padding:15px 30px;
                    border-radius:9999px;
                    font-size:14px;
                    font-weight:700;
                    letter-spacing:-0.01em;
                  ">
                                Visit First Estates →
                            </a>
                        </td>
                    </tr>

                    <!-- Help -->
                    <tr>
                        <td style="
                  padding:0 36px 36px;
                  text-align:center;
                ">
                            <p style="
                    margin:0;
                    font-size:13px;
                    color:#6b7280;
                    line-height:1.7;
                  ">
                                Need assistance?

                                <a href="${process.env.BASE_URL}/help" style="
                      color:#0874c7;
                      text-decoration:none;
                      font-weight:600;
                    ">
                                    Visit our Help Center →
                                </a>
                            </p>
                        </td>
                    </tr>

                    <!-- Divider -->
                    <tr>
                        <td style="
                  border-top:1px solid #eef2f7;
                "></td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                  padding:20px 24px;
                  text-align:center;
                ">
                            <p style="
                    margin:0;
                    color:#94a3b8;
                    font-size:11px;
                    line-height:1.6;
                  ">
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
      `
    }

    return transporter.sendMail(mailOptions)
  } catch (err) {
    console.log(err, "sendEmail error")
  }
}
