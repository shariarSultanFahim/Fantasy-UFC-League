import Image from "next/image";

import type { TeamFighterRow } from "@/types/my-team";

import { Button } from "@/components/ui";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface RemoveFighterModalProps {
  fighter: TeamFighterRow | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function RemoveFighterModal({ fighter, onClose, onConfirm }: RemoveFighterModalProps) {
  return (
    <Dialog open={Boolean(fighter)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-140 rounded-3xl border border-slate-200 bg-white p-0 sm:max-w-140">
        {fighter ? (
          <div className="px-8 py-7 text-center sm:px-10 sm:py-8">
            <div className="mx-auto mb-4 flex justify-center">
              <Image
                src={fighter.avatarUrl}
                alt={fighter.fighterName}
                width={124}
                height={124}
                className="h-31 w-31 rounded-full object-cover"
              />
            </div>

            <h3 className="text-4xl font-black tracking-tight text-slate-900">
              {fighter.fighterName}
            </h3>
            <p className="mt-4 text-xl text-slate-500">{fighter.weightClass}</p>

            <p className="mt-8 text-3xl font-semibold text-slate-800">
              Remove this fighter from your roster?
            </p>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Button
                type="button"
                variant="outline"
                className="h-14 rounded-2xl border-slate-300 bg-white text-lg font-semibold text-slate-700 hover:bg-slate-50"
                onClick={onClose}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="h-14 rounded-2xl bg-[#0E2A57] text-lg font-semibold text-white shadow-[0_8px_24px_rgba(14,42,87,0.3)] hover:bg-[#12336b]"
                onClick={onConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
