'use client'

import { useEffect } from 'react'
import { X, Trophy, MapPin, Shirt, Sparkles } from 'lucide-react'
import type { PlacedPlayer, PoolOption } from '@/lib/types'
import { flagEmoji } from '@/lib/flags'
import { tierName } from '@/lib/visual'
import { ROLE_LABELS } from '@/lib/formations'
import { translations } from '@/lib/languages' // Dil sözlüğünü içeri aktarıyoruz

type AnyPlayer = PlacedPlayer | PoolOption

interface Props {
  player: AnyPlayer | null
  onClose: () => void
  currentLang?: 'tr' | 'en' // Ana sayfadan gelen dinamik dil parametresi
}

export function PlayerModal({ player, onClose, currentLang = 'tr' }: Props) {
  const t = translations[currentLang]

  useEffect(() => {
    if (!player) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [player, onClose])

  if (!player) return null

  return (
    <div
      className="animate-fade fixed inset-0 z-50 flex items-center justify-center bg-carbon/70 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`${player.name} details`}
      onClick={onClose}
    >
      <div
        className="animate-rise glass-strong w-full max-w-md rounded-2xl border-gold/50 ring-glow-gold"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-gold/30 p-4">
          <div className="min-w-0">
            <p className="font-heading text-lg font-bold leading-tight text-foreground">
              {player.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {flagEmoji(player.nationality)} {player.nationality} &middot; {player.teamName}{' '}
              {player.teamYear}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-11 w-11 flex-col items-center justify-center rounded-lg bg-gold text-carbon">
              <span className="font-heading text-lg font-black leading-none">{player.rating}</span>
              <span className="text-[7px] font-bold uppercase">{t.rating}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="space-y-4 p-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-neon/15 px-2.5 py-1 text-[11px] font-bold text-emerald-neon">
            <Sparkles className="h-3 w-3" /> {tierName(player.rating)}
          </span>

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold">
              <MapPin className="h-3 w-3" /> 
              {currentLang === 'tr' ? 'Oynayabildiği Mevkiler' : 'Eligible Positions'}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {player.positions.map((pos) => (
                <span
                  key={pos}
                  className="rounded-md border border-gold/40 bg-carbon/60 px-2 py-0.5 text-[11px] font-medium text-foreground"
                >
                  {/* İngilizce gelen mevkileri (Örn: LW) FC Mobile karşılığına (Örn: SLK) çeviriyoruz */}
                  {t[pos as keyof typeof t] || pos} &mdash; {
                    currentLang === 'tr' 
                      ? (pos === 'ST' ? 'Santrafor' : pos === 'LW' ? 'Sol Kanat' : pos === 'RW' ? 'Sağ Kanat' : pos === 'CAM' ? 'Merkez Ofansif Orta Saha' : pos === 'CM' ? 'Merkez Orta Saha' : pos === 'CDM' ? 'Merkez Defansif Orta Saha' : pos === 'CB' ? 'Stoper' : pos === 'LB' ? 'Sol Bek' : pos === 'RB' ? 'Sağ Bek' : pos === 'GK' ? 'Kaleci' : ROLE_LABELS[pos])
                      : ROLE_LABELS[pos]
                  }
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold">
              <Shirt className="h-3 w-3" /> 
              {currentLang === 'tr' ? 'Kulüp / Kadro' : 'Club / Squad'}
            </p>
            <p className="text-sm text-foreground">{player.club}</p>
          </div>

          {player.trophies && player.trophies.length > 0 && (
            <div>
              <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-gold">
                <Trophy className="h-3 w-3" /> 
                {currentLang === 'tr' ? 'Başarılar & Ödüller' : 'Honours & Accolades'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {player.trophies.map((t) => (
                  <span
                    key={t}
                    className="rounded-md bg-gold/15 px-2 py-0.5 text-[11px] font-medium text-gold"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {player.trivia && (
            <div className="rounded-lg border border-gold/30 bg-carbon/50 p-3">
              <p className="text-[13px] leading-relaxed text-muted-foreground">{player.trivia}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
