"use client";

import { useState, type FormEvent } from "react";
import { GlassCard } from "./GlassCard";
import { sendInquiry } from "@/hooks/send-inquiry";
import { INQUIRY_TYPES, InquiryType } from "@/constants/contactData";


type Status = "idle" | "sending" | "sent" | "error";

const inputClass =
  "h-12 w-full rounded-sm border border-foreground/15 bg-foreground/5 px-5 text-sm text-foreground outline-none transition placeholder:text-foreground/50 focus:border-primary focus:ring-2 focus:ring-ring/40";

type FieldProps = {
  name: string;
  placeholder: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  className?: string;
};

function Field({ name, placeholder, type = "text", autoComplete, required, className = "" }: FieldProps) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      aria-label={placeholder}
      autoComplete={autoComplete}
      required={required}
      className={`${inputClass} ${className}`}
    />
  );
}

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [inquiry, setInquiry] = useState<InquiryType>("General");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    setStatus("sending");
    try {
      await sendInquiry({ ...data, inquiry, offers: data.offers === "on" });
      form.reset();
      setInquiry("General");
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <GlassCard className="p-5 sm:p-8">
      <h2 className="text-xl font-medium sm:text-2xl">Tell us what you need</h2>
      <p className="mt-1 text-sm text-foreground/70 sm:mt-2 sm:text-base">
        Our team is ready to help with every detail, big or small.
      </p>

      <form onSubmit={handleSubmit} className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2">
        <Field name="firstName" placeholder="First name" autoComplete="given-name" required />
        <Field name="lastName" placeholder="Last name" autoComplete="family-name" required />
        {/* Optional on every screen, hidden on mobile to keep the form short */}
        <Field name="country" placeholder="Country" autoComplete="country-name" className="max-sm:hidden" />
        <Field name="phone" placeholder="Phone number" type="tel" autoComplete="tel" className="max-sm:hidden" />
        <Field name="email" placeholder="Email address" type="email" autoComplete="email" required className="sm:col-span-2" />

        <fieldset className="mt-1 sm:col-span-2 sm:mt-3">
          <legend className="sr-only">Type of inquiry</legend>
          <div className="flex flex-wrap gap-2">
            {INQUIRY_TYPES.map((type) => (
              <label key={type} className="cursor-pointer">
                <input
                  type="radio"
                  name="inquiry"
                  value={type}
                  checked={inquiry === type}
                  onChange={() => setInquiry(type)}
                  className="peer sr-only"
                />
                <span className="block rounded-full border border-foreground/15 px-4 py-2 text-sm text-foreground/70 transition hover:bg-foreground/5 peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground peer-focus-visible:ring-2 peer-focus-visible:ring-accent">
                  {type}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <textarea
          name="message"
          rows={4}
          required
          placeholder="Message"
          aria-label="Message"
          className={`${inputClass} h-auto resize-none rounded-3xl py-4 sm:col-span-2`}
        />

        <label className="flex items-center gap-3 text-sm text-foreground/70 max-sm:hidden sm:col-span-2">
          <input type="checkbox" name="offers" className="size-4 shrink-0 accent-primary" />
          I&apos;d like to receive exclusive offers and updates
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="h-12 rounded-full bg-primary font-medium text-primary-foreground transition hover:bg-accent hover:text-accent-foreground disabled:opacity-60 sm:col-span-2"
        >
          {status === "sending" ? "Sending…" : "Send message"}
        </button>

        <p role="status" aria-live="polite" className="min-h-5 text-center text-sm sm:col-span-2">
          {status === "sent" && "Message sent. We'll reply within one business day."}
          {status === "error" && "Couldn't send your message. Check your connection and try again."}
        </p>
      </form>
    </GlassCard>
  );
}