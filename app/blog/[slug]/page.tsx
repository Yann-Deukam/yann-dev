import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import { BLOG_POSTS, formatPostDate, getPost } from "@/constants/blog";
import Cover from "@/components/Cover";
import BlogCard from "@/components/BlogCard";

type PostPageProps = {
  params: Promise<{ slug: string }>;
};

/** Builds every post at deploy time. */
export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) return { title: "Post not found" };

  return { title: post.title, description: post.excerpt };
}

/**
 * The page itself does not touch params. The post is read in PostContent,
 * inside Suspense, so the route can render its shell immediately.
 */
export default function BlogPostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<PostSkeleton />}>
      <PostContent params={params} />
    </Suspense>
  );
}

async function PostContent({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) notFound();

  const others = BLOG_POSTS.filter((item) => item.slug !== post.slug).slice(0, 3);

  return (
    <main className="min-h-svh bg-background px-6 pt-32 pb-24 font-sans text-foreground md:px-14">
      <article className="mx-auto flex max-w-300 flex-col gap-10">
        <Button href="/blog" className="self-start">
          ← All posts
        </Button>

        <Cover
          post={post}
          className="aspect-4/3 rounded-md md:aspect-21/9 md:rounded-3xl"
        />

        <header className="flex max-w-4xl flex-col gap-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-accent uppercase">
            {post.category} · {formatPostDate(post.date)} · {post.readTime} min read
          </p>
          <h1 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] font-semibold tracking-[-0.04em]">
            {post.title}
          </h1>
          <p className="text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
        </header>

        <div className="flex max-w-2xl flex-col gap-6 text-lg leading-relaxed text-foreground/85">
          {post.body.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </article>

      {others.length > 0 && (
        <section className="mx-auto mt-24 flex max-w-300 flex-col gap-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">Keep reading</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {others.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

/** Shown while the post loads. Same layout as the page, so nothing jumps. */
function PostSkeleton() {
  return (
    <main className="min-h-svh bg-background px-6 pt-32 pb-24 font-sans text-foreground md:px-14">
      <div className="mx-auto flex max-w-300 animate-pulse flex-col gap-10">
        <div className="h-11 w-40 rounded-full bg-foreground/10" />
        <div className="aspect-4/3 w-full rounded-4xl bg-foreground/10 md:aspect-21/9 md:rounded-[2.5rem]" />
        <div className="flex max-w-4xl flex-col gap-5">
          <div className="h-3 w-64 rounded-full bg-foreground/10" />
          <div className="h-16 w-full rounded-2xl bg-foreground/10" />
          <div className="h-6 w-3/4 rounded-full bg-foreground/10" />
        </div>
      </div>
    </main>
  );
}