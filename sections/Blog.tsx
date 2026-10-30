import BlogCard from "@/components/BlogCard";
import Button from "@/components/Button";
import { getFeaturedPosts } from "@/constants/blog";

/** Home page section: the two featured posts and a link to the full list. */
export default function BlogSection() {
  const featured = getFeaturedPosts();

  return (
    <section
      id="blog"
      className="relative overflow-hidden bg-background px-6 py-24 text-foreground md:px-14 md:py-32"
    >
      <div className="mx-auto flex max-w-300 flex-col gap-12">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-semibold tracking-[0.3em] text-accent uppercase">Blog</p>
          <h2 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            Notes from the build
          </h2>
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Short write-ups on the tools, patterns, and design decisions behind the work.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {featured.map((post) => (
            <BlogCard key={post.slug} post={post} variant="featured" />
          ))}
        </div>

        <div className="flex justify-center">
          <Button href="/blog" arrow>
            See more
          </Button>
        </div>
      </div>
    </section>
  );
}