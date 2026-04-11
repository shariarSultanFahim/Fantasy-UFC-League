import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

const offensiveActions = [
  "Win (Any method)",
  'Win by "Finish"',
  'Win against "Ranked Opponent"',
  'Win in a "5 Round Bout"',
  'Win a "Championship Fight"',
  'Win "Champion vs Champion"'
];

export default function ScoringPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-primary sm:px-6 lg:px-8 lg:py-12">
      <div className="mx-auto w-full max-w-6xl">
        <section className="rounded-sm bg-[#0A192F] px-6 py-14 text-center text-white sm:px-10 lg:py-16">
          <h1 className="text-5xl font-black tracking-tight sm:text-6xl">Scoring &amp; Rules</h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Understand the point system to build your winning team.
          </p>
        </section>

        <section className="mt-12">
          <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-100/80 hover:bg-slate-100/80">
                  <TableHead className="w-[80%] px-6 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Action
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold tracking-[0.14em] text-slate-500 uppercase">
                    Points
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {offensiveActions.map((action, index) => (
                  <TableRow
                    key={action}
                    className={index === offensiveActions.length - 1 ? "bg-slate-50/70" : ""}
                  >
                    <TableCell className="px-6 py-4 text-base font-medium text-slate-800">
                      {action}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-base font-bold text-emerald-500">
                      +1
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </main>
  );
}
