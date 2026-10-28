import { glass, glassHover } from "@/constants/styles";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  /** "glass" matches the footer. "solid" is a filled primary pill. */
  variant?: "glass" | "solid";
  /** Adds a round arrow chip on the right. */
  arrow?: boolean;
  /** Renders an anchor when set, otherwise a button. */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  "aria-label"?: string;
  /** Layout only: width, margins and so on. Colours belong to the variant. */
  className?: string;
};

const base =
  "group inline-flex items-center gap-3 rounded-full py-2 pr-2 pl-6 text-sm font-medium transition-all duration-300 motion-safe:hover:-translate-y-0.5";

const variants = {
  glass: `${glass} ${glassHover} text-foreground`,
  solid:
    "border border-primary bg-primary text-primary-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground",
};

const chips = {
  glass:
    "bg-primary text-primary-foreground dark:bg-foreground dark:text-surface-dark group-hover:bg-accent group-hover:text-accent-foreground dark:group-hover:bg-foreground dark:group-hover:text-surface-dark",
  solid:
    "bg-background text-foreground group-hover:bg-primary-foreground group-hover:text-primary",
};

/**
 * The site's button. Use it everywhere a call to action appears.
 *
 * <Button href="/#contact" arrow>Let&apos;s Talk</Button>
 * <Button variant="solid" onClick={submit}>Send</Button>
 */
export default function Button({
  children,
  variant = "glass",
  arrow = false,
  href,
  target,
  rel,
  onClick,
  type = "button",
  "aria-label": ariaLabel,
  className = "",
}: ButtonProps) {
  const classes = `${base} ${variants[variant]} ${className}`.trim();

  const content = (
    <>
      {children}
      {arrow && (
        <span
          aria-hidden
          className={`grid size-8 place-items-center rounded-full transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${chips[variant]}`}
        >
          ↗
        </span>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} target={target} rel={rel} aria-label={ariaLabel} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} aria-label={ariaLabel} className={classes}>
      {content}
    </button>
  );
}