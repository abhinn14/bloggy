"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

interface BlogCardProps {
  image: string;
  title: string;
  id: string;
  time: string;
}

const BlogCard = ({ image, title, id, time }: BlogCardProps) => {
  return (
    <Link
      href={`/blogs/${id}`}
      className="
        group
        block
        h-80
        rounded-2xl
        border
        bg-background
        overflow-hidden
        transition-all
        hover:-translate-y-1
        hover:shadow-xl
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-orange-500
      "
    >
      {/* IMAGE */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="
            h-full w-full object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />

        {/* HOVER OVERLAY */}
        <div
          className="
            absolute inset-0
            bg-linear-to-t from-black/40 via-black/10 to-transparent
            opacity-0
            transition-opacity
            group-hover:opacity-100
          "
        />
      </div>

      {/* CONTENT */}
      <div className="flex h-[calc(320px-176px)] flex-col px-4 py-4">
        {/* TITLE */}
        <h2
          className="
            line-clamp-2
            text-lg font-semibold
            leading-snug
            tracking-tight
            transition-colors
            group-hover:text-orange-600">
          {title}
        </h2>

        {/* FOOTER */}
        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{new Date(time).toLocaleDateString()}</span>
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
