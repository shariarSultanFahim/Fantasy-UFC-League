import Link from "next/link";

import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BottomCallToAction() {
  return (
    <section className="bg-slate-950 px-4 py-14 text-white sm:px-6 lg:px-8 lg:py-16">
      <div className="relative overflow-hidden">
        <p className="pointer-events-none absolute inset-x-0 top-3 text-center text-[80px] leading-none font-black tracking-tight text-white/6 sm:text-[120px] lg:text-[160px]">
          OCTAGON
        </p>
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
          <h2 className="text-5xl font-black tracking-tight sm:text-6xl">
            READY TO DOMINATE THE OCTAGON?
          </h2>
          <p className="mt-4 max-w-2xl text-base text-slate-300 sm:text-lg">
            Join over 50,000 managers competing for championship glory. Put your fight IQ to the
            test.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <Button
              asChild
              className="h-11 bg-[#EC5B13] px-6 text-[13px] font-bold tracking-[0.14em] text-white uppercase hover:bg-[#d34d0f]"
            >
              <Link href="/sign-up" className="inline-flex items-center gap-2">
                Start your league now
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
            <p className="text-xs text-slate-400">No credit card required to play.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
