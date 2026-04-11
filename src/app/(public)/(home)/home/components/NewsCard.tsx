import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";

interface NewsCardProps {
  title: string;
  description: string;
  imageSrc: string;
  compact?: boolean;
}

export function NewsCard({ title, description, imageSrc, compact }: NewsCardProps) {
  if (compact) {
    return (
      <Card className="overflow-hidden rounded-xl border border-dashed border-sky-300 bg-white py-0 shadow-sm">
        <CardContent className="grid grid-cols-[120px_1fr] gap-4 p-3">
          <div className="relative h-28 w-full overflow-hidden rounded-sm">
            <Image src={imageSrc} alt={title} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-lg leading-tight font-black text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-5 text-slate-600">{description}</p>
            <p className="mt-3 text-xs font-bold tracking-[0.15em] text-slate-500 uppercase">
              2 hours ago
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden rounded-xl border border-dashed border-sky-300 bg-white py-0 shadow-sm">
      <div className="relative h-44 w-full">
        <Image src={imageSrc} alt={title} fill className="object-cover" />
      </div>
      <CardContent className="p-5">
        <h3 className="text-3xl leading-tight font-black text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-600">{description}</p>
      </CardContent>
    </Card>
  );
}
