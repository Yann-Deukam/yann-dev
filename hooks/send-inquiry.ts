export type InquiryPayload = Record<string, FormDataEntryValue | boolean>;

/**
 * Sends the contact form to our own route handler, which emails it through Resend.
 * Throws if the message was not sent, so the form can show an error.
 */
export async function sendInquiry(payload: InquiryPayload): Promise<void> {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "The message could not be sent.");
  }
}