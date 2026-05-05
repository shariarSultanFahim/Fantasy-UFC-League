import { Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui";

interface AdminPageHeaderProps {
  title: string;
  subtitle: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

export function AdminPageHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  children
}: AdminPageHeaderProps) {
  const hasAction = Boolean(actionLabel && actionHref);

  return (
    <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{title}</h1>
        <p className="text-sm font-medium text-slate-500 sm:text-base">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        {hasAction && (
          <Button asChild size="lg">
            <Link href={actionHref as string}>
              <Plus className="mr-2 size-4" />
              {actionLabel}
            </Link>
          </Button>
        )}
        {children}
      </div>
    </section>
  );
}