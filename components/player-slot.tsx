'use client'

import { Info, X, Star, Shield } from 'lucide-react'
import type { PlacedPlayer, SlotDef } from '@/lib/types'
import { flagEmoji } from '@/lib/flags'
import { clubAbbrev } from '@/lib/visual'
import { ROLE_LABELS } from '@/lib/formations'
import { translations } from '@/lib/languages' // Dil sözlüğünü içeri aktarıyoruz

interface Props {
  slot: SlotDef
  player: PlacedPlayer | null
  isCaptain: boolean
  isMvp: boolean
  onRemove: () => void
  onInfo: () => void
  currentLang?: 'tr' | 'en' // pitch.tsx'ten gelecek dil parametresi
}

export function PlayerSlot({ slot, player, isCaptain, isMvp, onRemove, onInfo, currentLang = 'tr' }: Props) {
  const t = translations[currentLang]

  if (!player) {
    return (
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
      >
        <div
          className="animate-slot-pulse flex h-14 w-14 flex-col items-center justify-center rounded-full border-2 border-dashed border-gold/70 bg-carbon/40 text-gold backdrop-blur-sm md:h-16 md:w-16"
          aria-label={`Empty ${ROLE_LABELS[slot.role]} slot`}
        >
          {/* Boş sahadaki mevki ismini (Örn: LW) FC Mobile karşılığına (Örn: SLK) çeviriyoruz */}
          <span className="font-heading text-sm font-bold leading-none">
            {t[slot.role as keyof typeof t] || slot.role}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className="animate-rise absolute z-10 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
    >
      <div className="relative w-[72px] md:w-[86px]">
        {/* badges */}
        {isCaptain && (
          <div
            className="absolute -left-1.5 -top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[9px] font-black text-carbon ring-glow-gold"
            title={t.captain}
            aria-label={t.captain}
          >
            C
          </div>
        )}
        {isMvp && (
          <div
            className="animate-star-pulse absolute -right-1.5 -top-1.5 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground"
            title="MVP"
            aria-label="MVP"
          >
            <Star className="h-3 w-3" fill="currentColor" />
          </div>
        )}

        <button
          onClick={onRemove}
          className="group block w-full overflow-hidden rounded-lg border border-gold/50 bg-gradient-to-b from-carbon-2 to-carbon text-left shadow-lg transition hover:border-destructive/80 hover:ring-glow-emerald focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-neon"
          aria-label={`${player.name}, rating ${player.rating}. Press to remove from squad.`}
        >
          <div className="flex items-center justify-between bg-gold/90 px-1.5 py-0.5">
            <span className="font-heading text-[11px] font-black leading-none text-carbon">
              {player.rating}
            </span>
            <span className="text-[11px] leading-none">{flagEmoji(player.nationality)}</span>
          </div>
          <div className="px-1.5 py-1.5">
            <p className="truncate text-[10px] font-semibold leading-tight text-foreground">
              {player.name}
            </p>
            <div className="mt-0.5 flex items-center justify-between">
              {/* Kartın sol altındaki mevki etiketini FC Mobile stiline çeviriyoruz */}
              <span className="rounded bg-emerald-neon/15 px-1 text-[8px] font-bold text-emerald-neon">
                {t[slot.role as keyof typeof t] || slot.role}
              </span>
              <span className="text-[8px] font-medium text-muted-foreground">
                {clubAbbrev(player.club)}
              </span>
            </div>
          </div>
          <span className="pointer-events-none absolute inset-0 hidden items-center justify-center bg-destructive/20 group-hover:flex">
            <X className="h-5 w-5 text-destructive" />
          </span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onInfo()
          }}
          className="absolute -bottom-2 left-1/2 z-20 flex h-5 w-5 -translate-x-1/2 items-center justify-center rounded-full border border-gold/60 bg-carbon text-gold transition hover:bg-gold hover:text-carbon focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-neon"
          aria-label={`View ${player.name} details`}
        >
          <Info className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}

export function PitchLegendIcon() {
  return <Shield className="h-3 w-3" />
}
