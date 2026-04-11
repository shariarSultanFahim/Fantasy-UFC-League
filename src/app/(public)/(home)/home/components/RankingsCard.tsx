import Link from "next/link";

import { TrendingUp } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function RankingsCard() {
  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold text-slate-900">
          Fantasy MMA Fighter Rankings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex -space-x-2">
            <Avatar className="h-7 w-7 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/100?img=19" alt="Ranked player" />
              <AvatarFallback>R1</AvatarFallback>
            </Avatar>
            <Avatar className="h-7 w-7 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/100?img=20" alt="Ranked player" />
              <AvatarFallback>R2</AvatarFallback>
            </Avatar>
            <Avatar className="h-7 w-7 border-2 border-white">
              <AvatarImage src="https://i.pravatar.cc/100?img=21" alt="Ranked player" />
              <AvatarFallback>R3</AvatarFallback>
            </Avatar>
            <Badge className="ml-2 rounded-full bg-[#EC5B13] px-2 text-[10px]">TODAY</Badge>
          </div>
          <TrendingUp className="h-4 w-4 text-emerald-500" />
        </div>
        <p className="mt-3 text-xs text-slate-500">2026 Projections</p>
        <Button asChild variant="outline" className="mt-4 w-full font-bold">
          <Link href="/rankings">View All Rankings</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
