"use client";

import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Fighter } from "@/types";

interface FighterDetailsModalProps {
  fighter: Fighter | null;
  isOpen: boolean;
  onClose: () => void;
}

export function FighterDetailsModal({ fighter, isOpen, onClose }: FighterDetailsModalProps) {
  if (!fighter) return null;

  const hasFormerChampionStatus =
    fighter.formerChampionDivisions && fighter.formerChampionDivisions.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto p-0">
        {/* <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 text-slate-400 transition-colors hover:text-slate-900"
        >
          <X className="size-6" />
        </button> */}

        <div className="p-6 sm:p-8">
          {/* Header with Fighter Info */}
          <div className="mb-8 flex gap-4 sm:gap-6">
            <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-200">
              <Image
                src={fighter.avatarUrl}
                alt={fighter.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100px, 128px"
              />
            </div>

            <div className="flex-1">
              <h2 className="mb-2 text-3xl font-bold text-slate-900">{fighter.name}</h2>

              <div className="mb-4 flex flex-wrap gap-3">
                <Badge variant="secondary">{fighter.division}</Badge>
                <Badge variant="outline">{fighter.nationality}</Badge>
                <Badge variant="outline">Age {fighter.age}</Badge>
              </div>

              {/* Professional Record */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="mb-2 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Professional Record
                </p>
                <p className="text-2xl font-bold tracking-[0.5rem] text-slate-900">
                  <span className="text-green-500">{fighter.wins}</span>-
                  <span className="text-red-500">{fighter.losses}</span>-{fighter.draws}
                </p>
                <p className="mt-1 text-xs text-slate-600">Wins - Losses - Draws</p>
              </div>
            </div>
          </div>

          {/* Physical Stats & Upcoming Fight */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Physical Stats */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Physical Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <span className="text-sm text-slate-600">Height</span>
                  <span className="text-lg font-semibold text-slate-900">{fighter.height}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Reach</span>
                  <span className="text-lg font-semibold text-slate-900">{fighter.reach}</span>
                </div>
              </div>
            </div>

            {/* Upcoming Fight */}
            <div>
              <h3 className="mb-4 text-lg font-semibold text-slate-900">Upcoming Fight</h3>
              <div className="space-y-4">
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Next Opponent
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {fighter.upcomingOpponent}
                  </p>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Event
                  </p>
                  <p className="text-base font-semibold text-slate-900">{fighter.upcomingEvent}</p>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <p className="mb-1 text-xs font-semibold tracking-wider text-slate-500 uppercase">
                    Scheduled Date
                  </p>
                  <p className="text-base font-semibold text-slate-900">{fighter.scheduledDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Analytics */}
          <div className="mb-8 rounded-lg bg-blue-50 p-4">
            <h3 className="mb-3 text-sm font-semibold tracking-wider text-slate-900 uppercase">
              Performance Analytics
            </h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-xs text-slate-600">Last 5 Fights Avg. Fantasy Points</p>
                <p className="text-3xl font-bold text-slate-900">
                  {fighter.lastFiveFightsAvgPoints}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-emerald-600">
                  {fighter.pointsChange > 0 ? "+" : ""}
                  {fighter.pointsChange}%
                </span>
              </div>
            </div>
          </div>

          {/* Career Highlights */}
          <div>
            <h3 className="mb-4 text-lg font-semibold text-slate-900">Career Highlights</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-sm text-slate-600">KO/TKO Wins</span>
                <span className="text-lg font-semibold text-slate-900">{fighter.koWins}</span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-sm text-slate-600">Submission Wins</span>
                <span className="text-lg font-semibold text-slate-900">
                  {fighter.submissionWins}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-sm text-slate-600">Decision Wins</span>
                <span className="text-lg font-semibold text-slate-900">{fighter.decisionWins}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Title Defenses</span>
                <span className="text-lg font-semibold text-slate-900">
                  {fighter.titleDefenses}
                </span>
              </div>
            </div>

            {/* Former Champion Badge */}
            {hasFormerChampionStatus && (
              <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <p className="text-sm font-semibold text-yellow-900">Former Champion</p>
                <p className="mt-1 text-sm text-yellow-800">
                  {fighter.formerChampionDivisions?.join(" & ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
