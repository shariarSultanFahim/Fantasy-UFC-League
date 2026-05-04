import { Metadata } from "next";
import Image from "next/image";
import { format } from "date-fns";
import { notFound } from "next/navigation";

import { INewsletterResponse } from "@/types/newsletter";
import { getImageUrl } from "@/lib/utils";

import { env } from "@/env";

async function getNewsletter(id: string) {
  try {
    const url = `${env.NEXT_PUBLIC_API_URL}/newsletter/${id}`;
    console.log(`Fetching newsletter from: ${url}`);

    const res = await fetch(url, {
      next: { revalidate: 60 },
    });

    console.log(`Fetch response status: ${res.status}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Fetch failed: ${errorText}`);
      return null;
    }

    const data: INewsletterResponse = await res.json();
    console.log(`Fetch success, data id: ${data.data?.id}`);
    return data.data;
  } catch (error) {
    console.error("Error fetching newsletter:", error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) {
    return {
      title: "Post Not Found | Fantasy UFC League",
    };
  }

  return {
    title: `${newsletter.title} | Fantasy UFC League`,
    description: newsletter.description.substring(0, 160),
    openGraph: {
      title: newsletter.title,
      description: newsletter.description.substring(0, 160),
      images: newsletter.image ? [newsletter.image] : [],
      type: "article",
    },
  };
}

export default async function BlogDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const newsletter = await getNewsletter(id);

  if (!newsletter) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 pt-10 pb-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <article className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-sm">
          {/* Header Image */}
          <div className="relative h-[400px] w-full">
            <Image
              src={getImageUrl(newsletter.image) || "/demo.jpeg"}
              alt={newsletter.title}
              fill
              unoptimized
              priority
              className="object-cover"
            />
          </div>

          <div className="px-6 py-10 sm:px-12">
            <div className="mb-6 flex items-center gap-4">
              <span className="rounded-full bg-sky-100 px-4 py-1 text-xs font-bold text-[#3dbcf9] uppercase tracking-wider">
                Newsletter
              </span>
              <time className="text-sm font-medium text-slate-500">
                {format(new Date(newsletter.createdAt), "MMMM d, yyyy")}
              </time>
            </div>

            <h1 className="mb-8 text-4xl font-black leading-tight text-slate-900 sm:text-5xl">
              {newsletter.title}
            </h1>

            <div className="prose prose-slate max-w-none prose-headings:font-black prose-headings:text-slate-900 prose-p:text-slate-600 prose-p:leading-relaxed prose-strong:text-slate-900">
              {/* If description is rich text, it should be rendered accordingly. 
                  For now, we assume it's text with line breaks. */}
              <div className="whitespace-pre-wrap text-lg leading-relaxed text-slate-600">
                {newsletter.description}
              </div>
            </div>
          </div>
        </article>

        {/* Navigation back */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-[#3dbcf9] transition-colors"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </main>
  );
}
