import Link from "next/link";
import { formatPostDate, type BlogPost } from "@/constants/blog";
import { glass } from "@/constants/styles";
import Cover from "./Cover";

type BlogCardProps = {
  post: BlogPost;
  /** "featured" is the large card. "compact" is the small one for lists. */
  variant?: "featured" | "compact";
};

export default function BlogCard({ post, variant = "compact" }: BlogCardProps) {
  const featured = variant === "featured";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`${glass} group flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-300 motion-safe:hover:-translate-y-1`}
    >
      <Cover post={post} className={featured ? "aspect-16/10" : "aspect-4/3"} />

      <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
        <p className="text-xs tracking-wide text-muted-foreground">
          {formatPostDate(post.date)} · {post.readTime} min read
        </p>

        <h3
          className={`${featured ? "text-2xl md:text-3xl" : "text-lg"} leading-tight font-semibold tracking-[-0.03em] transition-colors duration-300 group-hover:text-accent`}
        >
          {post.title}
        </h3>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}