import Image from "next/image";
import Link from "next/link";

import { CircleCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <Badge className="mb-4 rounded-full border border-[#EC5B13]/30 bg-[#EC5B13]/10 text-[10px] font-bold tracking-[0.2em] text-[#EC5B13] uppercase hover:bg-[#EC5B13]/15">
              Official Fantasy Partner
            </Badge>
            <h1 className="max-w-lg text-4xl leading-tight font-black tracking-tight text-slate-900 sm:text-5xl">
              About Our <span className="text-[#EC5B13]">Fantasy</span> Fight League
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
              Build your ultimate team with real UFC fighters and compete against fans worldwide
              based on live octagon results. The cage is yours.
            </p>
          </div>

          <Card className="overflow-hidden rounded-2xl border-slate-200 p-0 shadow-lg">
            <CardContent className="m-0 p-0">
              <Image
                src="/animated.png"
                alt="Animated MMA Fight"
                width={600}
                height={400}
                className="object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-slate-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 lg:grid-cols-[1.1fr_1.3fr]">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-3xl font-black text-[#EC5B13]">50k+</p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                  Active Managers
                </p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardContent className="p-6">
                <p className="text-3xl font-black text-[#EC5B13]">100%</p>
                <p className="mt-1 text-[11px] font-bold tracking-[0.18em] text-slate-500 uppercase">
                  Live Stats
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              The Platform For True MMA Fans
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Our platform brings the raw excitement of MMA to fantasy sports. Whether you&apos;re a
              casual fan or a hardcore analyst, we provide the tools to prove your knowledge of the
              fight game.
            </p>
            <div className="mt-5 inline-flex items-start gap-2 rounded-lg border border-[#EC5B13]/30 bg-[#EC5B13]/10 px-3 py-2">
              <CircleCheck className="mt-0.5 h-4 w-4 text-[#EC5B13]" />
              <div>
                <p className="text-sm font-bold text-slate-900">Create Private Leagues</p>
                <p className="text-xs text-slate-600">
                  Challenge friends, family, or coworkers in custom leagues.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-none bg-slate-950 text-white lg:grid-cols-3 lg:rounded-none">
          <div className="p-8 sm:p-10 lg:col-span-2 lg:p-12">
            <h3 className="max-w-lg text-4xl leading-tight font-black sm:text-5xl">
              THINK YOU CAN DRAFT LIKE <span className="text-[#EC5B13] underline">JON JONES</span>{" "}
              FIGHTS?
            </h3>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Join thousands of MMA fans who analyze the game at the highest level. Compete with
              fellow fight enthusiasts and track your scores against verified athletes through our
              fantasy teams.
            </p>

            <div className="mt-7 flex items-center gap-3">
              <div className="flex -space-x-2">
                <Avatar className="h-8 w-8 border-2 border-slate-950">
                  <AvatarImage src="https://i.pravatar.cc/100?img=11" alt="Manager avatar" />
                  <AvatarFallback>M1</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-slate-950">
                  <AvatarImage src="https://i.pravatar.cc/100?img=12" alt="Manager avatar" />
                  <AvatarFallback>M2</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 border-2 border-slate-950">
                  <AvatarImage src="https://i.pravatar.cc/100?img=13" alt="Manager avatar" />
                  <AvatarFallback>M3</AvatarFallback>
                </Avatar>
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-950 bg-[#EC5B13] text-xs font-bold text-white">
                  4k+
                </div>
              </div>
              <p className="text-xs text-slate-400">Managers joined today</p>
            </div>
          </div>

          <div className="relative hidden items-center justify-center bg-[radial-gradient(circle_at_20%_30%,#1e3a8a_0%,#0b1430_40%,#071026_100%)] lg:flex">
            <Image
              src="/Container.png"
              alt="Fantasy MMA Container"
              width={300}
              height={300}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <Card className="mx-auto w-full max-w-6xl rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center sm:flex-row sm:justify-center sm:gap-5">
            <h4 className="text-2xl font-black tracking-tight text-slate-900">
              Ready to dominate the octagon?
            </h4>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="bg-slate-950 font-bold hover:bg-slate-800">
                <Link href="/sign-up">Create a League</Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                className="bg-white font-bold text-slate-900 hover:bg-slate-200"
              >
                <Link href="/leagues-directory">Join a League</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
