import { ArrowLeftRight, Search } from "lucide-react";

import type { TeamStatRow } from "@/types/team-details";

import { Button, Card, Input, Textarea } from "@/components/ui";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface TradeProposalModalProps {
  isOpen: boolean;
  searchFighter: string;
  ownerMessage: string;
  targetFighter: TeamStatRow | null;
  yourFighters: TeamStatRow[];
  selectedYourFighter: TeamStatRow | null;
  selectedYourFighterId: string;
  isPending?: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onMessageChange: (value: string) => void;
  onYourFighterChange: (id: string) => void;
  onSendTradeOffer: () => void;
}

export function TradeProposalModal({
  isOpen,
  searchFighter,
  ownerMessage,
  targetFighter,
  yourFighters,
  selectedYourFighter,
  selectedYourFighterId,
  isPending,
  onClose,
  onSearchChange,
  onMessageChange,
  onYourFighterChange,
  onSendTradeOffer
}: TradeProposalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-245 rounded-3xl border border-slate-200 bg-white p-0">
        {targetFighter ? (
          <div className="space-y-0">
            <DialogHeader className="border-b border-slate-200 px-6 py-5">
              <DialogTitle className="text-4xl font-black text-slate-900">
                Propose a Trade
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-7 px-6 py-6">
              <div className="flex justify-end">
                <div className="relative w-full max-w-80">
                  <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={searchFighter}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search fighter..."
                    className="h-11 bg-white pl-9"
                    disabled={isPending}
                  />
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-[1fr_auto_1fr]">
                <Card className="gap-4 rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-2xl font-bold text-slate-900">Target Fighter</p>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-4 border-yellow-400 bg-slate-300">
                    <span className="text-3xl font-black text-slate-700">
                      {targetFighter.fighterName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="text-4xl font-black tracking-tight text-slate-900">
                      {targetFighter.fighterName}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">{targetFighter.weightClass}</p>
                  </div>
                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="flex items-center justify-between">
                      <span>Championships:</span>
                      <span className="font-semibold">{targetFighter.championships}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Wins:</span>
                      <span className="font-semibold">{targetFighter.wins}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Losses:</span>
                      <span className="font-semibold">{targetFighter.fiveRw}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Fantasy Points:</span>
                      <span className="font-semibold text-amber-500">
                        {targetFighter.totalPoints}
                      </span>
                    </p>
                  </div>
                </Card>

                <div className="flex items-center justify-center">
                  <div className="inline-flex size-13 items-center justify-center rounded-full bg-[#0E2A57] text-white shadow-lg">
                    <ArrowLeftRight className="size-7" />
                  </div>
                </div>

                <Card className="gap-4 rounded-2xl bg-slate-50 p-5 text-center">
                  <p className="text-2xl font-bold text-slate-900">Your Fighter</p>
                  <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-dotted border-slate-500 bg-slate-200">
                    <span className="text-3xl font-black text-slate-700">
                      {selectedYourFighter?.fighterName.charAt(0) ?? "?"}
                    </span>
                  </div>

                  <Select 
                    value={selectedYourFighterId} 
                    onValueChange={onYourFighterChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-11 bg-white text-left">
                      <SelectValue placeholder="Select your fighter" />
                    </SelectTrigger>
                    <SelectContent>
                      {yourFighters.map((fighter) => (
                        <SelectItem key={fighter.id} value={fighter.id}>
                          {fighter.fighterName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="space-y-1 text-sm text-slate-600">
                    <p className="flex items-center justify-between">
                      <span>Championships:</span>
                      <span className="font-semibold">
                        {selectedYourFighter?.championships ?? "-"}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Wins:</span>
                      <span className="font-semibold">{selectedYourFighter?.wins ?? "-"}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Losses:</span>
                      <span className="font-semibold">{selectedYourFighter?.fiveRw ?? "-"}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Fantasy Points:</span>
                      <span className="font-semibold text-amber-500">
                        {selectedYourFighter?.totalPoints ?? "-"}
                      </span>
                    </p>
                  </div>
                </Card>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-800">
                  Add a Message to the Owner (Optional)
                </p>
                <Textarea
                  value={ownerMessage}
                  onChange={(event) => onMessageChange(event.target.value)}
                  placeholder="Good trade, check stats..."
                  className="min-h-28 bg-white"
                  disabled={isPending}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Button type="button" variant="outline" className="h-12 text-lg" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="h-12 bg-[#0E2A57] text-lg hover:bg-[#12336b]"
                  disabled={!selectedYourFighter || isPending}
                  onClick={onSendTradeOffer}
                >
                  {isPending ? "Sending..." : "Send Trade Offer"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
