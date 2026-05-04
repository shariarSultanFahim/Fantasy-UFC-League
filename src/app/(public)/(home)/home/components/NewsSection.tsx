"use client";

import { useNewsletters } from "@/lib/actions/newsletter";
import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

export function NewsSection() {
  const { data, isLoading } = useNewsletters({ limit: 4, sortOrder: "desc" });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-44 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  const newsletters = data?.data?.data || [];

  return (
    <div className="space-y-4">
      {newsletters.map((article, index) => (
        <NewsCard 
          key={article.id} 
          {...article} 
          compact={index === 3} 
          priority={index === 0} 
        />
      ))}
      {newsletters.length === 0 && (
        <div className="flex h-44 items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">
          <p className="text-slate-500">No news articles found.</p>
        </div>
      )}
    </div>
  );
}
