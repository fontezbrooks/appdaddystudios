import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, businessName, phone, email, message } = await req.json();

    if (!name || !businessName || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    await resend.emails.send({
      from: "App Daddy Studios <noreply@appdaddystudios.com>",
      to: "hi@appdaddystudios.com",
      replyTo: email,
      subject: `New inquiry from ${name} — ${businessName}`,
      text: `
New contact form submission from appdaddystudios.com

Name: ${name}
Business: ${businessName}
Email: ${email}
Phone: ${phone || "Not provided"}

Message:
${message || "No message provided."}
      `.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}
