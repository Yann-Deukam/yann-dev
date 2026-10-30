"use client";

import { ContactForm } from "@/components/ContactForm";
import { ContactInfo } from "@/components/ContactInfo";
import { WorldMap } from "@/components/Worldmap";
import { useState } from "react";


/* Fades the map out at the top and bottom so it melts into the neighbouring sections. */
const mapFade =
  "[-webkit-mask-image:linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)] mask-[linear-gradient(to_bottom,transparent,#000_18%,#000_82%,transparent)]";

export function Contact() {
  const [celebrate, setCelebrate] = useState(false);

  return (
    // Same background recipe as <Footer />, so the two read as one surface.
    <section
      id="contact"
      className="relative isolate overflow-hidden bg-background text-foreground dark:bg-surface-dark"
    >
      {/* Soft light behind the glass (same blobs as the footer) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/4 -left-24 -z-10 size-112 rounded-full bg-accent/15 blur-[120px] dark:bg-accent/25"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-[6%] -z-10 size-128 rounded-full bg-primary/15 blur-[140px] dark:bg-primary/30"
      />

      {/* Map: banner on mobile, full background from lg */}
      <div className={`relative h-44 sm:h-72 lg:absolute lg:inset-0 lg:h-auto md:pr-24 ${mapFade}`}>
        <WorldMap celebrate={celebrate} onCelebrateChange={setCelebrate} />
      </div>

      {/* Mobile order: heading → form → contact. Desktop: text left, form right. */}
      <div className="pointer-events-none relative mx-auto grid max-w-300 gap-8 px-6 pb-16 sm:pb-20 lg:grid-cols-[1fr_minmax(0,34rem)] lg:grid-rows-[auto_1fr] lg:gap-x-14 lg:py-24">
        <div className="max-w-xl lg:col-start-1 lg:row-start-1">
          <h1 className="text-3xl font-medium leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            You have questions, come get answers
          </h1>
          <p className="mt-4 text-foreground/70">
            Wherever you are in the world, your message finds its way to me.
          </p>
        </div>

        <div className="pointer-events-auto lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <ContactForm />
        </div>

        <ContactInfo className="lg:col-start-1 lg:row-start-2 lg:self-end" />
      </div>
    </section>
  );
}