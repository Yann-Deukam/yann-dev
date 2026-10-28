export type InquiryPayload = Record<string, FormDataEntryValue | boolean>;

/**
 * Single place to wire your backend (route handler, server action, Resend…).
 * Currently simulates a network round-trip.
 */
export async function sendInquiry(payload: InquiryPayload): Promise<void> {
  // await fetch("/api/contact", { method: "POST", body: JSON.stringify(payload) });
  await new Promise((resolve) => setTimeout(resolve, 900));
  console.info("Inquiry sent", payload);
}