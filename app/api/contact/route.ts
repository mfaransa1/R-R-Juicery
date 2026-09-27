import { NextRequest, NextResponse } from "next/server";

const DESTINATION_EMAIL = "delivered@resend.dev";
const SENDER_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  phone?: unknown;
  subject?: unknown;
  message?: unknown;
  website?: unknown;
};

function clean(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function validEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function sendWithResend(payload: Record<string, unknown>) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    console.error("Resend error:", data);
    throw new Error("Resend rejected the email request.");
  }

  return data;
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured.");
      return NextResponse.json(
        { error: "The enquiry service is not configured yet." },
        { status: 503 },
      );
    }

    const body = (await request.json()) as ContactPayload;

    const name = clean(body.name, 100);
    const email = clean(body.email, 254).toLowerCase();
    const phone = clean(body.phone, 30);
    const subject = clean(body.subject, 100);
    const message = clean(body.message, 5000);
    const website = clean(body.website, 200);

    // Honeypot: silently accept automated submissions without sending email.
    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (!name || !email || !subject || message.length < 10) {
      return NextResponse.json(
        {
          error:
            "Please complete your name, email, subject and message before sending.",
        },
        { status: 400 },
      );
    }

    if (!validEmail(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 },
      );
    }

    const submittedAt = new Intl.DateTimeFormat("en-KE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Africa/Nairobi",
    }).format(new Date());

    const enquiryText = [
      "New Rook & Reed enquiry",
      "",
      `Subject: ${subject}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone || "Not provided"}`,
      `Submitted: ${submittedAt} (EAT)`,
      "",
      "Message:",
      message,
    ].join("\n");

    const enquiryHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111;max-width:680px">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#777;margin:0 0 8px">Rook &amp; Reed Juicery</p>
        <h2 style="margin:0 0 24px;font-size:28px">New enquiry</h2>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Submitted:</strong> ${escapeHtml(submittedAt)} (EAT)</p>
        <hr style="border:0;border-top:1px solid #ddd;margin:28px 0" />
        <p style="font-weight:700;margin-bottom:8px">Message</p>
        <p style="white-space:pre-wrap;margin-top:0">${escapeHtml(message)}</p>
      </div>
    `;

    // Primary email: only the Rook & Reed team receives the enquiry.
    await sendWithResend({
      from: `Rook & Reed Juicery <${SENDER_EMAIL}>`,
      to: [DESTINATION_EMAIL],
      reply_to: email,
      subject: `R&R enquiry — ${subject}`,
      text: enquiryText,
      html: enquiryHtml,
    });

    const confirmationText = [
      `Hi ${name},`,
      "",
      "Thanks for reaching out to Rook & Reed Juicery.",
      "",
      `We received your enquiry about ${subject} and will get back to you using the contact details you provided.`,
      "",
      "Good Juice. Good Music. Good Company.",
      "",
      "Rook & Reed Juicery",
      "Kilimani, Nairobi",
      "+254 758 038 852",
    ].join("\n");

    const confirmationHtml = `
      <div style="font-family:Arial,sans-serif;line-height:1.7;color:#111;max-width:620px">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#777;margin:0 0 8px">Rook &amp; Reed Juicery</p>
        <h2 style="margin:0 0 24px;font-size:28px">We received your enquiry</h2>
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to Rook &amp; Reed Juicery.</p>
        <p>We received your enquiry about <strong>${escapeHtml(subject)}</strong> and will get back to you using the contact details you provided.</p>
        <p style="margin-top:32px;font-weight:700">Good Juice. Good Music. Good Company.</p>
        <p>Rook &amp; Reed Juicery<br />Kilimani, Nairobi<br />+254 758 038 852</p>
      </div>
    `;

    // Confirmation failure should not make a successfully delivered enquiry look failed.
    try {
      await sendWithResend({
        from: `Rook & Reed Juicery <${SENDER_EMAIL}>`,
        to: [email],
        subject: "We received your Rook & Reed enquiry",
        text: confirmationText,
        html: confirmationHtml,
      });
    } catch (confirmationError) {
      console.error("Resend confirmation error:", confirmationError);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact API error:", error);

    const message =
      error instanceof Error ? error.message : "Unknown contact API error.";

    if (message.includes("RESEND_API_KEY")) {
      return NextResponse.json(
        { error: "The enquiry service is not configured yet." },
        { status: 503 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong while sending your enquiry. Please try again." },
      { status: 500 },
    );
  }
}
