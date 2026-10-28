export const HERO = {
  /**
   * The headline, as two blocks of two rows. The first block sits left and the
   * second sits right, so the sentence reads down the page as a diagonal.
   */
  blocks: [
    ["We design", "the brand,"],
    ["then build", "the site."],
  ],

  support:
    "Branding, packaging, illustration and websites for businesses that want one look, from the label to the landing page.",

  /** Shown on devices with a mouse, to point out the lens. */
  hint: "Move over the headline to see how it’s built.",

  primaryCta: { label: "Start a project", href: "/#contact" },
  secondaryCta: { label: "See the work", href: "/#work" },

  /**
   * What the lens shows over the glass card: the same content, as the build
   * sees it. Mirrors the markup in Hero.tsx, so keep the two in step.
   */
  buildNotes: [
    "// branding, packaging,",
    "// illustration, websites",
    '<a href="/#contact" />',
    '<a href="/#work" />',
  ],
} as const;