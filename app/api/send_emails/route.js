export const POST = async (req) => {
    const {to,subject,text} = await req.json()
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
            tls: {
              rejectUnauthorized: false,
              minVersion: "TLSv1.2",
            }, //remove from production
          })
    
          const mailOptions = {
            from:`FIRST ESTATES ${process.env.ZOHO_EMAIL}`,
            to: Array.isArray(to) ? to.join(',') : to,
            subject,
            html: `
    <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif; line-height: 1.5; color: #333; text-align: center;">
       ${text}
    </div>
    `,
          }
    
          await transporter.sendMail(mailOptions)
        
        return new Response(JSON.stringify({i:'lolo'}), {status:201})
     } catch(err) {
        return new Response({error: err.message},{status:500})
     }
    }
    