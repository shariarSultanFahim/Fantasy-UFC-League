"use client";

import Link from "next/link";

import { ArrowRight, CircleHelp } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const faqs = [
  {
    question: "How are fantasy points calculated?",
    answer: [
      "Fantasy points are awarded based on real UFC performance metrics.",
      "Significant strikes: +0.2 pts",
      "Takedowns: +2 pts",
      "Submissions: +3 pts",
      "Win bonus by KO/TKO: +10 pts",
      "Win bonus by decision: +5 pts"
    ]
  },
  {
    question: "How does the fantasy draft work?",
    answer:
      "League admins open a draft room, invite managers, and each team picks fighters in turn until the roster is complete. Live draft controls help keep every round organized."
  },
  {
    question: "How do I create or join a league?",
    answer:
      "Use the Leagues page to create a new competition or join an existing league with the invite code shared by the commissioner."
  },
  {
    question: "How do I add or drop fighters?",
    answer:
      "Roster changes are made from your team dashboard. Open the fighter pool, choose the fighter you want, and confirm the move when the roster rules allow it."
  },
  {
    question: "Can I trade fighters with other teams?",
    answer:
      "Yes. Trades can be proposed between managers and approved by the league settings or commissioner workflow, depending on how the league is configured."
  },
  {
    question: "What happens if a fighter's match is canceled?",
    answer:
      "Canceled bouts are treated as void for fantasy scoring. If a replacement or rescheduled fight is added, scoring updates follow the league rules and platform settings."
  }
];

export default function FAQPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col items-center">
        <Badge className="mb-5 rounded-full bg-[#D4AF37]/10 px-3 py-1 text-[11px] font-semibold tracking-[0.28em] text-[#D4AF37] uppercase hover:bg-[#D4AF37]/20">
          Support Center
        </Badge>

        <h1 className="max-w-4xl text-center text-4xl font-black text-slate-900 sm:text-5xl lg:text-6xl">
          Frequently Asked <span className="text-[#D4AF37]">Questions</span>
        </h1>

        <p className="mt-4 max-w-2xl text-center text-sm leading-6 text-slate-600 sm:text-base">
          Master your Fantasy Fight League experience. Find answers for leagues, drafts, fighters,
          and real-time scoring.
        </p>

        <Accordion
          type="single"
          collapsible
          defaultValue="faq-0"
          className="mt-12 w-full space-y-3"
        >
          {faqs.map((faq, index) => (
            <Card
              key={faq.question}
              className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <AccordionItem value={`faq-${index}`} className="border-none px-5">
                <AccordionTrigger className="py-4 text-left text-sm font-semibold text-slate-800 hover:no-underline sm:text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="border-t border-slate-100 pt-4 pb-5 text-sm leading-6 text-slate-600">
                  {Array.isArray(faq.answer) ? (
                    <div className="space-y-2">
                      <p>{faq.answer[0]}</p>
                      <ul className="mt-3 space-y-1 pl-4 text-slate-700">
                        {faq.answer.slice(1).map((item) => (
                          <li key={item} className="list-disc">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <p>{faq.answer}</p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>

        <Card className="mt-16 w-full overflow-hidden rounded-3xl border-slate-900/5 bg-slate-900 px-6 py-7 text-white shadow-xl sm:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-[#D4AF37]">
                <CircleHelp className="h-5 w-5" />
                <span className="text-xs font-bold tracking-[0.3em] uppercase">
                  Still have questions?
                </span>
              </div>
              <h2 className="text-2xl font-bold text-white sm:text-3xl">
                Need a hand with your league setup?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-300 sm:text-base">
                If you can&apos;t find the answer you&apos;re looking for, our support team is ready
                to help you get back in the fight.
              </p>
            </div>

            <Button asChild size="lg" className="bg-[#D4AF37] text-slate-950 hover:bg-[#D4AF37]/80">
              <Link href="/contact" className="inline-flex items-center gap-2">
                Go to Contact Page
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}
