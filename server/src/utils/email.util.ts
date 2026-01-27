import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config()

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});



export async function sendEmail(
  to: string,
  subject: string,
  message: string,
): Promise<{ success: boolean; messageId?: string; error?: string }> {

  console.log('to',to,'subject',subject,'message',message)
  const mailOptions = {
    from: '"Automation System" <noreply@automation.test>',
    to,
    subject,
    text: message,
    html: `<div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>${subject}</h2>
            <p>${message}</p>
          </div>`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✉️  Email sent:", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("❌ Email error:", error);
    return { success: false, error: error.message };
  }
}
