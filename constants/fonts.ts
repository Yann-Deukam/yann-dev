import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";

/**
 * Satoshi: the typeface for the whole hero, headline included. It isn't on
 * Google Fonts, so it's loaded from the project. Download the variable WOFF2
 * from Fontshare and place it at src/fonts/Satoshi-Variable.woff2.
 *
 * `variable` exposes it as --font-satoshi, which the theme maps to font-sans.
 */
export const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  display: "swap",
  variable: "--font-satoshi",
});

/** The build view. Only used inside the lens, where the text is meant to look like code. */
export const heroMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
});