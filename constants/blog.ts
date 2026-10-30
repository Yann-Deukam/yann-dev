
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  /** ISO date, so the output is identical on server and client. */
  date: string;
  readTime: number;
  /** Image path from the public directory. */
  cover: string;
  /** Featured posts appear on the home page. */
  featured: boolean;
  body: string[];
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "ai-in-front-end-workflows",
    title: "AI Is Changing How Front-End Work Gets Done",
    excerpt:
      "AI tools shorten the write, check, fix loop. The real skill is deciding what good looks like once the first draft arrives.",
    category: "Engineering",
    date: "2024-03-18",
    readTime: 5,
    cover: "/blogs/blog-1.jpg",
    featured: true,
    body: [
      "For most of the last decade, front-end work followed the same loop: write a component, check it in the browser, fix the layout, and repeat. AI tools have started to shorten that loop. A developer can now describe a component in plain language and get a working first draft in seconds.",
      "The useful part is not the draft itself but what happens after it. The draft still needs reading, testing, and judgement about accessibility, state, and performance. The developers getting the most value treat the output as a starting point, not a finished answer, and they keep control of how the code is structured.",
      "A practical habit helps. Ask for one small piece at a time, read every line before it goes in, and write the tests you would have written anyway. The tools are fastest when they handle the repetitive parts, while the engineer still decides what good looks like.",
    ],
  },
  {
    slug: "react-server-components",
    title: "React Server Components, Without the Hype",
    excerpt:
      "Server components keep code and data loading on the server. The hard part is marking the boundary where interactivity begins.",
    category: "React",
    date: "2022-11-09",
    readTime: 6,
    cover: "/blogs/blog-2.jpg",
    featured: true,
    body: [
      "React Server Components let a component run on the server and send only its result to the browser. The component's code never ships to the client, which can mean smaller bundles and data fetching that happens close to the database.",
      "The model is easy to state and harder to live with. Anything with state, effects, or event handlers must run in the browser, so those parts need a clear client boundary. Getting that boundary right is the main skill, and mixing the two without thought is the most common source of confusion.",
      "Start by keeping interactive pieces small and moving data loading up into server components. Most pages get lighter, and the parts that need interactivity stay easy to reason about.",
    ],
  },
  {
    slug: "glassmorphism-with-restraint",
    title: "Glassmorphism With Restraint",
    excerpt:
      "Frosted glass adds depth, but blur costs contrast. Use it for surfaces that float above the content, not for the content itself.",
    category: "Design",
    date: "2023-08-02",
    readTime: 4,
    cover: "/blogs/blog-3.jpg",
    featured: false,
    body: [
      "Frosted glass, with its blurred background and thin light edge, has been everywhere since the late 2010s. Used well, it gives an interface depth and lets background colour and motion show through.",
      "The risk is legibility. Blur reduces contrast, and text on a busy background can become hard to read. A glass panel also needs a solid enough tint behind it, or the effect turns into grey mud.",
      "Use glass for surfaces that sit above content, such as cards, navigation, and dialogs. Keep body text on a solid or strongly tinted surface, and test in both light and dark modes before you ship.",
    ],
  },
  {
    slug: "motion-that-explains",
    title: "Motion That Explains Instead of Decorating",
    excerpt:
      "Good motion shows cause and effect. Decorative motion that loops forever competes with the content for attention.",
    category: "Motion",
    date: "2025-02-14",
    readTime: 5,
    cover: "/blogs/blog-4.jpg",
    featured: false,
    body: [
      "Motion on the web can make an interface feel alive, or it can make it tiring. The difference is whether the movement tells the visitor something.",
      "Good motion shows cause and effect. A menu opening from the button that triggered it, or a card lifting when hovered, helps people understand what happened. Decorative motion that loops forever competes with the content for attention.",
      "Respect people who ask for less movement. A reduced-motion setting should remove the flourish but keep the interface fully usable, because the page should work without the animation.",
    ],
  },
];

export const getPost = (slug: string) =>
  BLOG_POSTS.find((post) => post.slug === slug);

export const getFeaturedPosts = () =>
  BLOG_POSTS.filter((post) => post.featured);

export const formatPostDate = (date: string) =>
  new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
