import { CONTACT_INFO } from "@/constants/contactData";
import type { ReactNode } from "react";


function Block({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <h3 className="mb-2 text-lg font-medium">{title}</h3>
      <div className="space-y-1 text-sm leading-relaxed text-foreground/70">{children}</div>
    </div>
  );
}

/** On mobile only email + phone are shown; location and socials appear from `sm` up. */
export function ContactInfo({ className = "" }: { className?: string }) {
  const { address, hours, email, phone, socials } = CONTACT_INFO;
  const link = "pointer-events-auto inline-block transition hover:translate-x-1 hover:text-accent";

  return (
    <div className={`grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 ${className}`}>
      <Block title="Location" className="max-sm:hidden">
        {address.map((line) => (
          <p key={line}>{line}</p>
        ))}
        <p className="pt-2">{hours}</p>
      </Block>

      <Block title="Social media" className="max-sm:hidden">
        <ul className="space-y-1">
          {socials.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className={link}>
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </Block>

      <Block title="Email">
        <a href={`mailto:${email}`} className={link}>{email}</a>
      </Block>

      <Block title="Phone">
        <a href={`tel:${phone.replace(/\s/g, "")}`} className={link}>{phone}</a>
      </Block>
    </div>
  );
}