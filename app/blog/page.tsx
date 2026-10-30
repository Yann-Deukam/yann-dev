import type { Metadata } from "next";
import Button from "@/components/Button";
import { BLOG_POSTS } from "@/constants/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on front-end tools, React, design and motion, from 2022 to today.",
};

export default function BlogIndexPage() {
  return (
    <main className="min-h-svh bg-background px-6 pt-32 pb-24 font-sans text-foreground md:px-14">
      <header className="mx-auto flex max-w-300 flex-col gap-4">
        <Button href="/" className="self-start">
          ← Back to home
        </Button>

        <p className="mt-6 text-xs font-semibold tracking-[0.3em] text-accent uppercase">Blog</p>
        <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
          Notes from the build
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Short write-ups on the tools, patterns, and design decisions behind the work.
        </p>
      </header>

      <div className="mx-auto mt-14 grid max-w-300 gap-6 md:grid-cols-2">
        {BLOG_POSTS.map((post) => (
          <BlogCard key={post.slug} post={post} variant="featured" />
        ))}
      </div>
    </main>
  );
}