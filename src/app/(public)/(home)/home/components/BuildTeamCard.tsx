import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function BuildTeamCard() {
  return (
    <Card className="rounded-xl border-0 bg-linear-to-b from-indigo-700 to-indigo-800 text-white shadow-lg">
      <CardContent className="p-5">
        <h3 className="text-2xl leading-tight font-black">BUILD YOUR ULTIMATE MMA FANTASY TEAM</h3>
        <p className="mt-3 text-sm text-indigo-100">
          The season is starting! Build your team and dominate the league.
        </p>
        <div className="mt-5 space-y-2">
          <Button asChild className="w-full bg-cyan-200 font-bold text-slate-900 hover:bg-cyan-100">
            <Link href="/leagues-directory/create">Create a League</Link>
          </Button>
          <Button asChild className="w-full bg-blue-500 font-bold text-white hover:bg-blue-400">
            <Link href="/leagues-directory">Join a Public League</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
