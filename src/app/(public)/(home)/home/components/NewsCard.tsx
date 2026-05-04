import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { getImageUrl } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  title: string;
  description: string;
  image?: string;
  createdAt: string;
  compact?: boolean;
  priority?: boolean;
}

export function NewsCard({ id, title, description, image, createdAt, compact, priority }: NewsCardProps) {
  const imageSrc = image || "/demo.jpeg";
  const formattedDate = formatDistanceToNow(new Date(createdAt), { addSuffix: true });

  if (compact) {
    return (
      <Link href={`/blog/${id}`} className="block">
        <Card className="overflow-hidden rounded-xl border border-dashed border-sky-300 bg-white py-0 shadow-sm transition-colors hover:bg-slate-50">
          <CardContent className="grid grid-cols-[120px_1fr] gap-4 p-3">
            <div className="relative h-28 w-full overflow-hidden rounded-sm">
              <Image
                src={getImageUrl(imageSrc)}
                alt={title}
                unoptimized
                fill
                sizes="120px"
                loading={priority ? "eager" : "lazy"}
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="line-clamp-2 text-lg leading-tight font-black text-slate-900">{title}</h3>
              <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{description}</p>
              <p className="mt-3 text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
                {formattedDate}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/blog/${id}`} className="block">
      <Card className="overflow-hidden rounded-xl border border-dashed border-sky-300 bg-white py-0 shadow-sm transition-colors hover:bg-slate-50">
        <div className="relative h-44 w-full">
          <Image
            src={getImageUrl(imageSrc)}
            alt={title}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading={priority ? "eager" : "lazy"}
            className="object-cover"
          />
        </div>
        <CardContent className="p-5">
          <h3 className="line-clamp-2 text-3xl leading-tight font-black text-slate-900">{title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">{description}</p>
          <p className="mt-3 text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
            {formattedDate}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
