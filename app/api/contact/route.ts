import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_FROM = "Portfolio <onboarding@resend.dev>";

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[char]!
  );
}

export async function POST(request: Request) {
  try {
    // Read the configuration first, so a missing variable is reported before any work is done.
    const apiKey = process.env.RESEND_API_KEY;
    const to = process.env.CONTACT_TO_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL ?? DEFAULT_FROM;

    if (!apiKey || !to) {
      console.error(
        "Missing email environment variables: RESEND_API_KEY and CONTACT_TO_EMAIL are required."
      );

      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const body = await request.json();

    const {
      firstName,
      lastName,
      country,
      phone,
      email,
      inquiry,
      message,
      offers,
    } = body;

    // Basic validation
    if (
      !firstName?.trim() ||
      !lastName?.trim() ||
      !email?.trim() ||
      !message?.trim()
    ) {
      return NextResponse.json(
        { error: "Please complete all required fields." },
        { status: 400 }
      );
    }

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      firstName.length > 100 ||
      lastName.length > 100 ||
      email.length > 254 ||
      message.length > 5000
    ) {
      return NextResponse.json(
        { error: "Please provide valid information." },
        { status: 400 }
      );
    }

    const safe = {
      firstName: escapeHtml(firstName.trim()),
      lastName: escapeHtml(lastName.trim()),
      country: escapeHtml((country || "Not provided").trim()),
      phone: escapeHtml((phone || "Not provided").trim()),
      email: escapeHtml(email.trim()),
      inquiry: escapeHtml((inquiry || "General").trim()),
      message: escapeHtml(message.trim()).replace(/\n/g, "<br />"),
      offers: offers ? "Yes" : "No",
    };

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: email.trim(),
      subject: `New portfolio inquiry: ${inquiry || "General"}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #222;">
          <h2>New Portfolio Inquiry</h2>

          <p>You received a new message through your portfolio contact form.</p>

          <hr />

          <h3>Contact details</h3>
          <p><strong>Name:</strong> ${safe.firstName} ${safe.lastName}</p>
          <p><strong>Email:</strong> ${safe.email}</p>
          <p><strong>Country:</strong> ${safe.country}</p>
          <p><strong>Phone:</strong> ${safe.phone}</p>

          <h3>Inquiry</h3>
          <p>${safe.inquiry}</p>

          <h3>Message</h3>
          <p style="line-height: 1.6;">${safe.message}</p>

          <hr />

          <p><strong>Wants updates:</strong> ${safe.offers}</p>
        </div>
      `,
    });

    if (error) {
      // Resend's own reason, such as "You can only send testing emails to your own email address".
      console.error("Resend error:", error);

      return NextResponse.json(
        { error: "Failed to send your message." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Message sent successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}