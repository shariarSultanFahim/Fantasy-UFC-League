import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
}

export function AdminPageHeader({ title, subtitle, actionLabel, actionHref }: AdminPageHeaderProps) {
  const hasAction = Boolean(actionLabel && actionHref);

  return (
    <section className="flex flex-wrap items-start justify-between gap-4  ">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
        <p className="text-sm text-slate-600">{subtitle}</p>
      </div>
      {hasAction ? (
        <Button asChild size="lg">
          <Link href={actionHref as string}>
            <Plus className="size-4" />
            {actionLabel}
          </Link>
        </Button>
      ) : null}
    </section>
  );
}