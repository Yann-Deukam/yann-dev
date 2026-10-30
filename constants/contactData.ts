export type LonLat = [lon: number, lat: number];

/** Where the packets land. */
export const DESTINATION = { name: "Douala, Cameroun", coords: [9.7, 4.05] as LonLat };

/** Cities the animated routes start from. */
/** Order matters: the first 5 are the only routes shown on mobile. */
export const ORIGINS: { name: string; coords: LonLat }[] = [
  { name: "New York", coords: [-74, 40.7] },
  { name: "London", coords: [-0.1, 51.5] },
  { name: "Dubai", coords: [55.3, 25.2] },
  { name: "Tokyo", coords: [139.7, 35.7] },
  { name: "São Paulo", coords: [-46.6, -23.5] },
  { name: "Los Angeles", coords: [-118.2, 34] },
  { name: "Mumbai", coords: [72.9, 19.1] },
  { name: "Sydney", coords: [151.2, -33.9] },
];
export const MOBILE_ROUTES = 5;

export const GREETINGS = ["Bienvenue", "Welcome"];

export const INQUIRY_TYPES = ["General", "Offer", "Others"] as const;
export type InquiryType = (typeof INQUIRY_TYPES)[number];

// Placeholder content: swap with your real details.
export const CONTACT_INFO = {
  address: ["Douala, Cameroun"],
  hours: "Monday–Saturday",
  email: "yanndeukam@gmail.com",
  phone: "+237 697 443 248",
  socials: [
    { label: "Github", href: "https://github.com/yann-deukam" },
    { label: "Instagram", href: "https://instagram.com/the.real.g_ni" },
    { label: "LinkedIn", href: "https://linkedin.com/in/deukam-yann" },

  ],
};