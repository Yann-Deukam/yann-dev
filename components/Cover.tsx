import Image from "next/image";
import type { BlogPost } from "@/constants/blog";

type CoverProps = {
  post: Pick<BlogPost, "cover" | "category">;
  /** Sizing only, for example aspect ratio and rounding. */
  className?: string;
};

export default function Cover({ post, className = "" }: CoverProps) {
  return (
    <div className={`group relative w-full overflow-hidden ${className}`}>
      <Image
        src={post.cover}
        alt={`${post.category} article cover`}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover grayscale transition-[filter,transform] duration-700 ease-out group-hover:grayscale-0 group-hover:scale-[1.03]"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[url(/grain.svg)] opacity-[0.12]"
      />

      <span className="absolute bottom-4 left-4 rounded-full border border-white/20 bg-background/50 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-md">
        {post.category}
      </span>
    </div>
  );
}