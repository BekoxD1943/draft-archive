'use client'

import { X, Crown, Star, Shield } from 'lucide-react'
import type { DraftState } from '@/lib/types'
import { FORMATIONS } from '@/lib/formations'
import { computeChemistry, teamRating } from '@/lib/chemistry'
import { flagEmoji } from '@/lib/flags'

interface Props {
  state: DraftState
  onClose: () => void
}

export function ExportCard({ state, onClose }: Props) {
  const slots = FORMATIONS[state.formation]
  const chem = computeChemistry(state)
  const rating = teamRating(state)
  const captain = Object.values(state.placed).find((p) => p && p.id === state.captainId)
  const mvp = Object.values(state.placed).find((p) => p && p.id === state.mvpId)

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-carbon/85 p-4 backdrop-blur-md scrollbar-luxury"
      onClick={onClose}
    >
      <div
        className="animate-rise glass-strong my-auto w-full max-w-lg rounded-2xl border-2 border-gold/60 p-5 ring-glow-gold"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="font-heading text-lg font-bold text-gold text-glow-gold">VIP Draft XI</p>
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">
              The Grand Archive &middot; {state.formation}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:text-foreground"
            aria-label="Close summary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg border border-border bg-carbon/50 p-2">
            <p className="text-[9px] uppercase text-muted-foreground">Rating</p>
            <p className="font-heading text-xl text-foreground">{rating.toFixed(1)}</p>
          </div>
          <div className="rounded-lg border border-border bg-carbon/50 p-2">
            <p className="text-[9px] uppercase text-muted-foreground">Chemistry</p>
            <p className="font-heading text-xl text-emerald-neon">{chem.total}</p>
          </div>
          <div className="rounded-lg border border-border bg-carbon/50 p-2">
            <p className="text-[9px] uppercase text-muted-foreground">Coach</p>
            <p className="truncate font-heading text-sm text-gold">
              {state.manager ? state.manager.name.split(' ').slice(-1)[0] : '—'}
            </p>
          </div>
        </div>

        {(captain || mvp) && (
          <div className="mb-4 flex gap-2">
            {captain && (
              <span className="flex items-center gap-1 rounded-full bg-gold/15 px-2 py-1 text-[11px] font-semibold text-gold">
                <Crown className="h-3 w-3" /> {captain.name}
              </span>
            )}
            {mvp && (
              <span className="flex items-center gap-1 rounded-full bg-emerald-neon/15 px-2 py-1 text-[11px] font-semibold text-emerald-neon">
                <Star className="h-3 w-3" fill="currentColor" /> {mvp.name}
              </span>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          {slots.map((s) => {
            const p = state.placed[s.id]
            return (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-lg border border-border bg-carbon/40 px-2.5 py-1.5"
              >
                <div className="flex items-center gap-2">
                  <span className="w-9 shrink-0 rounded bg-emerald-neon/15 px-1 text-center text-[10px] font-bold text-emerald-neon">
                    {s.role}
                  </span>
                  <span className="text-sm text-foreground">
                    {p ? `${flagEmoji(p.nationality)} ${p.name}` : '—'}
                  </span>
                </div>
                {p && <span className="font-heading text-sm text-gold">{p.rating}</span>}
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-gold/30 bg-carbon/50 p-2 text-[11px] text-muted-foreground">
          <Shield className="h-3.5 w-3.5 text-gold" />
          Screenshot this card to share your VIP Draft XI from the Grand Archive.
        </div>
      </div>
    </div>
  )
}
