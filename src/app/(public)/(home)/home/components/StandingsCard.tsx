import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { standings } from "./data";

export function StandingsCard() {
  return (
    <Card className="rounded-xl border-slate-200 bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-slate-900">Fantasy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {standings.map((team, index) => (
          <div
            key={team.name}
            className="flex items-center justify-between rounded-md border border-slate-100 px-3 py-2"
          >
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                  index === 0 ? "bg-[#EC5B13]" : index === 1 ? "bg-blue-500" : "bg-emerald-500"
                }`}
              >
                {index + 1}
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">{team.name}</p>
                <p className="text-[11px] text-slate-500">{team.points}</p>
              </div>
            </div>
            <p className="text-xs font-bold text-slate-700">{team.position}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
