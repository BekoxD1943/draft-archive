'use client'

import { Dices, UserRound } from 'lucide-react'
import type { Manager } from '@/lib/types'
import { flagEmoji } from '@/lib/flags'

interface Props {
  manager: Manager | null
  systemMatch: boolean
  nationMatch: boolean
  onRoll: () => void
  compact?: boolean
  currentLang?: 'tr' | 'en' // Ana sayfadan gelen dinamik dil desteği
}

export function ManagerCard({ manager, systemMatch, nationMatch, onRoll, compact, currentLang = 'tr' }: Props) {
  return (
    <div
      className={`glass-strong rounded-xl border-gold/40 ${compact ? 'p-2.5' : 'p-3'} ${
        manager ? 'ring-glow-gold' : ''
      }`}
    >
      <p className="mb-1.5 flex items-center gap-1 font-heading text-[10px] uppercase tracking-widest text-gold">
        <UserRound className="h-3 w-3" /> {currentLang === 'tr' ? 'Teknik Direktör' : 'Head Coach'}
      </p>
      {manager ? (
        <div>
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-foreground">{manager.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {flagEmoji(manager.nationality)} {manager.nationality} &middot; {manager.team}
              </p>
            </div>
            <button
              onClick={onRoll}
              className="shrink-0 rounded-md border border-gold/50 bg-carbon/60 px-2 py-1 text-[10px] font-semibold text-gold transition hover:bg-gold hover:text-carbon"
              aria-label="Re-roll elite manager"
            >
              {currentLang === 'tr' ? 'Yeniden Seç' : 'Re-roll'}
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span className="rounded bg-secondary px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground">
              {currentLang === 'tr' ? 'Favori Diziliş:' : 'Signature:'} {manager.signatureFormation}
            </span>
            {systemMatch && (
              <span className="rounded bg-emerald-neon/15 px-1.5 py-0.5 text-[9px] font-bold text-emerald-neon">
                +15 {currentLang === 'tr' ? 'Sistem Uyumu' : 'System'}
              </span>
            )}
            {nationMatch && (
              <span className="rounded bg-gold/20 px-1.5 py-0.5 text-[9px] font-bold text-gold">
                +10 {currentLang === 'tr' ? 'Ülke Uyumu' : 'Nation'}
              </span>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={onRoll}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gold/60 bg-carbon/40 py-2.5 text-xs font-semibold text-gold transition hover:bg-gold/10"
        >
          <Dices className="h-4 w-4" /> {currentLang === 'tr' ? 'Elit Teknik Direktör Seç' : 'Roll Elite Manager'}
        </button>
      )}
    </div>
  )
}
